 import React, { useMemo, useState } from 'react';
import { Form, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formValid = useMemo(
    () => Boolean(address.trim() && city.trim() && postalCode.trim() && country.trim()),
    [address, city, postalCode, country]
  );

  const submitHandler = (e) => {
    e.preventDefault();
    if (!formValid) return;
    dispatch(
      saveShippingAddress({
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      })
    );
    navigate('/payment');
  };

  return (
    <div className="ship-shell">
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <div className="ship-card p-4 p-md-5">
          <h1 className="fw-bold gradient-title mb-3">Shipping address</h1>
          <p className="text-body-secondary mb-4">We’ll use this to calculate delivery and taxes.</p>

          <Form noValidate onSubmit={submitHandler}>
            <FloatingLabel label="Address" controlId="address" className="mb-3">
              <Form.Control
                type="text"
                placeholder=" "
                value={address}
                autoComplete="street-address"
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">Enter your address.</Form.Control.Feedback>
            </FloatingLabel>

            <Row>
              <Col md={6}>
                <FloatingLabel label="City" controlId="city" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder=" "
                    value={city}
                    autoComplete="address-level2"
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">Enter your city.</Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel label="Postal code" controlId="postalCode" className="mb-3">
                  <Form.Control
                    type="text"
                    inputMode="text"
                    placeholder=" "
                    value={postalCode}
                    autoComplete="postal-code"
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">Enter a postal code.</Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            </Row>

            <FloatingLabel label="Country" controlId="country" className="mb-4">
              <Form.Control
                type="text"
                placeholder=" "
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                autoComplete="country-name"
                list="country-list"
                required
              />
              <datalist id="country-list">
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Germany</option>
                <option>France</option>
              </datalist>
              <Form.Control.Feedback type="invalid">Enter your country.</Form.Control.Feedback>
            </FloatingLabel>

            <div className="d-flex gap-3">
              <Button type="submit" variant="primary" className="rounded-pill px-4" disabled={!formValid}>
                Continue
              </Button>
              <Button type="button" variant="outline-secondary" className="rounded-pill" onClick={() => navigate('/cart')}>
                Back to cart
              </Button>
            </div>
          </Form>
        </div>
      </FormContainer>

      <style>{`
        :root { --border: #e6ecf5; --surface: #ffffff; --surface-2: #f6f9fc; --shadow-1: 0 6px 32px rgba(44,83,100,.13); --focus: #2a5298; }
        .ship-shell { min-height: 100vh; background: radial-gradient(1200px 400px at 10% -10%, rgba(99,143,255,.08), transparent 60%), radial-gradient(900px 400px at 100% 0%, rgba(44,83,100,.08), transparent 50%), var(--surface-2); display: grid; place-items: start center; padding: 24px 0; }
        .ship-card { background: linear-gradient(135deg, var(--surface) 78%, #eaf1ff 100%); border: 1px solid #e3eafc; border-radius: 20px; box-shadow: var(--shadow-1); max-width: 720px; margin: 0 auto; }
        .gradient-title { background: linear-gradient(90deg, #1e3c72, #2a5298 40%, #2c5364 80%); -webkit-background-clip: text; background-clip: text; color: transparent; letter-spacing: .3px; }

        .form-control { border-radius: 14px; border-color: #dbe6f4; background-color: #fff; }
        .form-control:focus { border-color: var(--focus); box-shadow: 0 0 0 .2rem rgba(42,82,152,.15); }
      `}</style>
    </div>
  );
};

export default ShippingScreen;
