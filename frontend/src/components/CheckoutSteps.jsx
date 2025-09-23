import React from 'react';
import { Nav } from 'react-bootstrap';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4 checkout-steps">
      <Nav.Item>
        <Nav.Link disabled={!step1} className={step1 ? 'active-step' : ''}>Sign In</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link disabled={!step2} className={step2 ? 'active-step' : ''}>Shipping</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link disabled={!step3} className={step3 ? 'active-step' : ''}>Payment</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link disabled={!step4} className={step4 ? 'active-step' : ''}>Place Order</Nav.Link>
      </Nav.Item>
      <style>{`
        .checkout-steps .nav-link {
          border-radius: 50px;
          margin: 0 8px;
          background: #f6f9fc;
          color: #2c5364;
          font-weight: 500;
        }
        .checkout-steps .active-step {
          background: #2c5364;
          color: #fff !important;
          box-shadow: 0 2px 8px rgba(44,83,100,0.10);
        }
      `}</style>
    </Nav>
  );
};

export default CheckoutSteps;
