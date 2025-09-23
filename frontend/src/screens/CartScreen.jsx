import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card, Badge } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const itemsCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.qty, 0), [cartItems]);
  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.qty * item.price, 0), [cartItems]);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="cart-shell">
      <Row className="g-4">
        <Col md={8}>
          <div className="d-flex align-items-end justify-content-between mb-2">
            <h1 className="fw-bold gradient-title mb-0">Shopping Cart</h1>
            {itemsCount > 0 && <Badge bg="secondary" pill>{itemsCount} item{itemsCount > 1 ? 's' : ''}</Badge>}
          </div>

          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty. <Link to="/">Continue shopping</Link>
            </Message>
          ) : (
            <ListGroup variant="flush" className="card-modern p-2">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id} className="border-0 py-3">
                  <Row className="align-items-center g-3">
                    <Col xs={3} md={2}>
                      <div className="cart-img-wrap">
                        <Image src={item.image} alt={item.name} loading="lazy" />
                      </div>
                    </Col>
                    <Col xs={9} md={3}>
                      <Link to={`/product/${item._id}`} className="cart-title-link">{item.name}</Link>
                      <div className="text-body-secondary small">${item.price.toFixed(2)}</div>
                    </Col>
                    <Col xs={6} md={3} className="mt-2 mt-md-0">
                      <Form.Select
                        value={item.qty}
                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                        aria-label={`Quantity for ${item.name}`}
                      >
                        {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col xs={6} md={2} className="fw-semibold mt-2 mt-md-0">
                      ${(item.qty * item.price).toFixed(2)}
                    </Col>
                    <Col xs={12} md={2} className="text-md-end mt-2 mt-md-0">
                      <Button
                        type="button"
                        variant="outline-danger"
                        onClick={() => removeFromCartHandler(item._id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <Card className="card-modern sticky-card">
            <ListGroup variant="flush">
              <ListGroup.Item className="border-0">
                <h2 className="h5 mb-1">Subtotal ({itemsCount}) item{itemsCount !== 1 ? 's' : ''}</h2>
                <div className="fs-4 fw-bold">${subtotal.toFixed(2)}</div>
              </ListGroup.Item>
              <ListGroup.Item className="border-0 text-body-secondary small">
                Taxes and shipping calculated at checkout.
              </ListGroup.Item>
              <ListGroup.Item className="border-0">
                <div className="d-grid gap-2">
                  <Button
                    type="button"
                    className="rounded-pill py-2 fw-semibold"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    className="rounded-pill"
                    as={Link}
                    to="/"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <style>{`
        :root { --surface: #fff; --surface-2: #f6f9fc; --shadow-1: 0 6px 32px rgba(44,83,100,.13); }
        .cart-shell { min-height: 70vh; }
        .card-modern { border: 1px solid #e6ecf5; border-radius: 18px; box-shadow: var(--shadow-1); background: linear-gradient(135deg, var(--surface) 78%, #eaf1ff 100%); }
        .gradient-title { background: linear-gradient(90deg, #1e3c72, #2a5298 40%, #2c5364 80%); -webkit-background-clip: text; background-clip: text; color: transparent; letter-spacing: .3px; }
        .cart-img-wrap { width: 100%; aspect-ratio: 1 / 1; border-radius: 12px; overflow: hidden; background: linear-gradient(180deg,#f7f9fc,#eaf1ff); display: grid; place-items: center; }
        .cart-img-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .cart-title-link { font-weight: 600; text-decoration: none; }
        .cart-title-link:hover { text-decoration: underline; }
        @media (min-width: 768px) { .sticky-card { position: sticky; top: 16px; } }
      `}</style>
    </div>
  );
};

export default CartScreen;
