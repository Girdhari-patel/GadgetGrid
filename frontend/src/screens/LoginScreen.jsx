import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup, FloatingLabel, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const redirect = useMemo(() => new URLSearchParams(search).get('redirect') || '/', [search]);

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  // Basic client-side validation
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim()), [email]);
  const pwdValid = useMemo(() => password.length > 0, [password]);
  const formValid = emailValid && pwdValid;

  const handleBlur = useCallback((field) => setTouched((t) => ({ ...t, [field]: true })), []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formValid) {
      setTouched({ email: true, password: true });
      if (!emailValid) toast.error('Please enter a valid email');
      else if (!pwdValid) toast.error('Please enter your password');
      return;
    }

    try {
      const res = await login({ email: email.trim(), password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="auth-shell">
      <FormContainer>
        <div className="auth-card p-4 p-md-5">
          <h1 className="fw-bold gradient-title mb-2">Welcome back</h1>
          <p className="text-body-secondary mb-4">Sign in to your account to continue.</p>

          <Form noValidate onSubmit={submitHandler} aria-label="Login form">
            <FloatingLabel label="Email address" controlId="email" className="mb-3">
              <Form.Control
                type="email"
                placeholder=" "
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                isInvalid={touched.email && !emailValid}
                required
              />
              <Form.Control.Feedback type="invalid">Enter a valid email address.</Form.Control.Feedback>
            </FloatingLabel>

            <Form.Group className="mb-4" controlId="password">
              <FloatingLabel label="Password">
                <InputGroup>
                  <Form.Control
                    type={showPwd ? 'text' : 'password'}
                    placeholder=" "
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    isInvalid={touched.password && !pwdValid}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPwd((s) => !s)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPwd ? <FiEyeOff /> : <FiEye />}
                  </Button>
                  <Form.Control.Feedback type="invalid">Enter your password.</Form.Control.Feedback>
                </InputGroup>
              </FloatingLabel>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                disabled={isLoading || !formValid}
                type="submit"
                variant="primary"
                className="rounded-pill py-2 fw-semibold shadow-sm"
              >
                {isLoading ? (<><Spinner as="span" animation="border" size="sm" className="me-2" /> Signing in...</>) : 'Sign in'}
              </Button>
            </div>

            {isLoading && <div className="visually-hidden" aria-live="polite"><Loader /></div>}
          </Form>

          <Row className="pt-4">
            <Col className="text-center">
              <small className="text-body-secondary">New customer?{' '}
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Create an account</Link>
              </small>
            </Col>
          </Row>
        </div>
      </FormContainer>

      <style>{`
        :root { --border: #e6ecf5; --surface: #ffffff; --surface-2: #f6f9fc; --shadow-1: 0 6px 32px rgba(44,83,100,.13); --focus: #2a5298; }
        .auth-shell { min-height: 100vh; background: radial-gradient(1200px 400px at 10% -10%, rgba(99,143,255,.08), transparent 60%), radial-gradient(900px 400px at 100% 0%, rgba(44,83,100,.08), transparent 50%), var(--surface-2); display: grid; place-items: center; padding: 24px 0; }
        .auth-card { background: linear-gradient(135deg, var(--surface) 78%, #eaf1ff 100%); border: 1px solid #e3eafc; border-radius: 20px; box-shadow: var(--shadow-1); max-width: 520px; margin: 0 auto; }
        .gradient-title { background: linear-gradient(90deg, #1e3c72, #2a5298 40%, #2c5364 80%); -webkit-background-clip: text; background-clip: text; color: transparent; letter-spacing: .3px; }

        .form-control { border-radius: 14px; border-color: #dbe6f4; background-color: #fff; }
        .form-control:focus { border-color: var(--focus); box-shadow: 0 0 0 .2rem rgba(42,82,152,.15); }
        .input-group .btn { border-radius: 12px; }
        .input-group .btn:focus { box-shadow: 0 0 0 .2rem rgba(42,82,152,.15); }
        .input-group .btn svg { width: 18px; height: 18px; }
      `}</style>
    </div>
  );
};

export default LoginScreen;
