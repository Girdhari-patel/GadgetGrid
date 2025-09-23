 import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded position-relative product-card">
      {/* Image and title से Link हटा दिया; नीचे एक ही stretched link use होगी */}
      <Card.Img
        src={product.image}
        variant="top"
        alt={product.name}
        loading="lazy"
      />

      <Card.Body>
        <Card.Title as="div" className="product-title">
          <strong>{product.name}</strong>
        </Card.Title>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as="h3">${product.price}</Card.Text>

        {/* Whole card click target */}
        <Link
          to={`/product/${product._id}`}
          className="stretched-link"
          aria-label={`View ${product.name}`}
        />
      </Card.Body>
    </Card>
  );
};

export default Product;
