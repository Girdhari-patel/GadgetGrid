 import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Badge,
  Modal,
  Spinner,
} from 'react-bootstrap';
import { FiTruck, FiShield, FiRefreshCw, FiHeart, FiShare2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [showImg, setShowImg] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const addToCartHandler = () => {
    if (!product) return;
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating: Number(rating), comment }).unwrap();
      setRating('');
      setComment('');
      await refetch();
      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="product-page-shell">
      <Link className="btn btn-light my-3 rounded-pill px-3" to="/">
        ← Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        product && (
          <>
            <Meta title={product.name} description={product.description} />
            <Row className="g-4">
              {/* Left: Image */}
              <Col md={6}>
                <div className="prod-media card-modern p-2">
                  <button className="media-btn" onClick={() => setShowImg(true)} aria-label="Open image">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="prod-img"
                      loading="lazy"
                      fluid
                    />
                  </button>
                </div>
              </Col>

              {/* Middle: Details */}
              <Col md={3}>
                <ListGroup variant="flush" className="card-modern p-2">
                  $1
                  <ListGroup.Item className="border-0 pt-0">
                    <div className="d-flex gap-2">
                      <Button variant="outline-secondary" size="sm" className="rounded-pill" onClick={() => toast.info('Added to wishlist (demo)')}>
                        <FiHeart className="me-1" /> Wishlist
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="rounded-pill" onClick={() => { try { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied'); } catch(e) { /* noop */ } }}>
                        <FiShare2 className="me-1" /> Share
                      </Button>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    <div><a href="#reviews" className="small">Read all reviews</a></div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-5 fw-semibold">${product.price}</span>
                      {product.countInStock > 0 ? (
                        <Badge bg="success" pill>In Stock</Badge>
                      ) : (
                        <Badge bg="secondary" pill>Out of Stock</Badge>
                      )}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    <div className={`text-body-secondary desc ${descExpanded ? 'expanded' : ''}`}>{product.description}</div>
                    {product.description && product.description.length > 160 && (
                      <button type="button" className="btn btn-link p-0 small" onClick={() => setDescExpanded((s) => !s)}>
                        {descExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0 pt-0">
                    <ul className="list-unstyled d-grid gap-2 mb-0">
                      <li className="d-flex align-items-center gap-2 small"><FiTruck /> Free & fast delivery</li>
                      <li className="d-flex align-items-center gap-2 small"><FiShield /> 1‑year warranty</li>
                      <li className="d-flex align-items-center gap-2 small"><FiRefreshCw /> 7‑day easy returns</li>
                    </ul>
                  </ListGroup.Item>
                </ListGroup>
              </Col>

              {/* Right: Purchase */}
              <Col md={3}>
                <Card className="card-modern sticky-card">
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between">
                      <div>Price:</div>
                      <strong>${product.price}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <div>Status:</div>
                      <div>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</div>
                    </ListGroup.Item>
                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row className="align-items-center">
                          <Col xs="auto" className="pe-0"><div className="pt-1">Qty</div></Col>
                          <Col>
                            <Form.Select
                              value={qty}
                              onChange={(e) => setQty(Number(e.target.value))}
                              aria-label="Quantity"
                            >
                              {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                              ))}
                            </Form.Select>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}
                    <ListGroup.Item>
                      <Button
                        className="w-100 rounded-pill py-2 fw-semibold"
                        type="button"
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        Add To Cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>

            <div className="mobile-cta d-md-none">
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div className="fw-semibold">${product.price}</div>
                <Button className="rounded-pill px-4" disabled={product.countInStock === 0} onClick={addToCartHandler}>Add to Cart</Button>
              </div>
            </div>

            {/* Reviews */}
            <Row className="mt-5">
              <Col md={6}>
                <h3 id="reviews" className="fw-bold mb-3">Reviews</h3>
                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant="flush" className="card-modern p-2">
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id} className="border-0">
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <div className="text-body-secondary small">{review.createdAt.substring(0, 10)}</div>
                      <p className="mb-0">{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item className="border-0">
                    <h5 className="mb-3">Write a Customer Review</h5>

                    {loadingProductReview && <div className="mb-2"><Spinner animation="border" size="sm" /></div>}

                    {userInfo ? (
                      <Form onSubmit={submitHandler} noValidate>
                        <Form.Group className="mb-3" controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Select
                            required
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="comment">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </Form.Group>
                        <Button disabled={loadingProductReview || !rating || !comment.trim()} type="submit" variant="primary" className="rounded-pill px-4">
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message>
                        Please <Link to="/login">sign in</Link> to write a review
                      </Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>

            {/* Image Modal */}
            <Modal show={showImg} onHide={() => setShowImg(false)} centered size="lg">
              <Modal.Body className="p-0">
                <Image src={product.image} alt={product.name} className="w-100" />
              </Modal.Body>
            </Modal>

            {/* Inline styles for modern polish */}
            <style>{`
              :root { --surface: #fff; --surface-2: #f6f9fc; --shadow-1: 0 6px 32px rgba(44,83,100,.13); }
              .card-modern { border: 1px solid #e6ecf5; border-radius: 18px; box-shadow: var(--shadow-1); background: linear-gradient(135deg, var(--surface) 78%, #eaf1ff 100%); }
              .prod-media { overflow: hidden; }
              .media-btn { border: 0; padding: 0; background: transparent; width: 100%; display: block; cursor: zoom-in; }
              .prod-img { width: 100%; aspect-ratio: 1 / 1; object-fit: contain; background: linear-gradient(180deg,#f7f9fc,#eaf1ff); }
              @media (min-width: 768px) { .sticky-card { position: sticky; top: 16px; } }
              .desc { max-height: 4.8em; overflow: hidden; }
              .desc.expanded { max-height: none; }
              .mobile-cta { position: sticky; bottom: 8px; background: rgba(255,255,255,.92); backdrop-filter: blur(6px) saturate(120%); border: 1px solid #e6ecf5; border-radius: 16px; box-shadow: var(--shadow-1); padding: 12px; }
            `}</style>
          </>
        )
      )}
    </div>
  );
};

export default ProductScreen;
