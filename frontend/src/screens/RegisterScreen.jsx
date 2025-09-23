import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup, FloatingLabel, ProgressBar, Spinner } from 'react-bootstrap';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const passwordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score += 25;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 25;
  if (/\d/.test(pwd)) score += 25;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
  return Math.min(score, 100);
};

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const redirect = useMemo(() => new URLSearchParams(search).get('redirect') || '/', [search]);

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  // Basic client-side validation
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim()), [email]);
  const nameValid = useMemo(() => name.trim().length >= 2, [name]);
  const pwdValid = useMemo(() => password.length >= 8, [password]);
  const matchValid = useMemo(() => password === confirmPassword && confirmPassword.length > 0, [password, confirmPassword]);
  const formValid = nameValid && emailValid && pwdValid && matchValid;

  const handleBlur = useCallback((field) => setTouched((t) => ({ ...t, [field]: true })), []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formValid) {
      setTouched({ name: true, email: true, password: true, confirm: true });
      if (!nameValid) toast.error('Please enter your full name');
      else if (!emailValid) toast.error('Please enter a valid email');
      else if (!pwdValid) toast.error('Password must be at least 8 characters');
      else if (!matchValid) toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await register({ name: name.trim(), email: email.trim(), password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const strength = passwordStrength(password);

  return (
    <div className="auth-shell">
      <FormContainer>
        <div className="auth-card p-4 p-md-5">
          <h1 className="fw-bold gradient-title mb-3">Create your account</h1>
          <p className="text-body-secondary mb-4">Join us to explore the latest products and offers.</p>

          <Form noValidate onSubmit={submitHandler} aria-label="Register form">
            <FloatingLabel label="Name" controlId="name" className="mb-3">
              <Form.Control
                type="text"
                placeholder=" "
                value={name}
                autoComplete="name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                isInvalid={touched.name && !nameValid}
                required
              />
              <Form.Control.Feedback type="invalid">Please enter your full name.</Form.Control.Feedback>
            </FloatingLabel>

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

            <Form.Group className="mb-3" controlId="password">
              <FloatingLabel label="Password">
                <InputGroup>
                  <Form.Control placeholder=" "
                    value={password}
                    autoComplete="new-password"
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
                  <Form.Control.Feedback type="invalid">Use at least 8 characters.</Form.Control.Feedback>
                </InputGroup>
              </FloatingLabel>
              <div className="mt-2" aria-live="polite">
                <ProgressBar now={strength} visuallyHidden={!password} />
                {password && (
                  <small className="text-body-secondary">
                    Strength: {strength < 50 ? 'Weak' : strength < 75 ? 'Medium' : 'Strong'}
                  </small>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
              <FloatingLabel label="Confirm password">
                <InputGroup>
                  <Form.Control placeholder=" "
                    value={confirmPassword}
                    autoComplete="new-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur('confirm')}
                    isInvalid={touched.confirm && !matchValid}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowConfirmPwd((s) => !s)}
                    aria-label={showConfirmPwd ? 'Hide confirm password' : 'Show confirm password'}
                    tabIndex={-1}
                  >
                    {showConfirmPwd ? <FiEyeOff /> : <FiEye />}
                  </Button>
                  <Form.Control.Feedback type="invalid">Passwords must match.</Form.Control.Feedback>
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
                {isLoading ? (<><Spinner as="span" animation="border" size="sm" className="me-2" /> Creating...</>) : 'Create account'}
              </Button>
            </div>

            {isLoading && (
              <div className="visually-hidden" aria-live="polite"><Loader /></div>
            )}
          </Form>

          <Row className="pt-4">
            <Col className="text-center">
              <small className="text-body-secondary">Already have an account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Log in</Link>
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

        .progress { height: 6px; border-radius: 999px; background-color: #e7eef8; }
        .progress-bar { border-radius: 999px; }

        @media (prefers-reduced-motion: no-preference) {
          .auth-card { transition: transform .25s ease, box-shadow .25s ease; }
          .auth-card:hover { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
};

export default RegisterScreen;
