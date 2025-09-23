import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.name]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Row className="gy-4">
      <Col md={4}>
        <div className="profile-card shadow-sm rounded-4 p-4 bg-white">
          <h2 className="fw-bold mb-4 text-primary">User Profile</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='name'>
              <Form.Label className="fw-semibold">Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-pill shadow-sm"
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Label className="fw-semibold">Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-pill shadow-sm"
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='password'>
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-pill shadow-sm"
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='confirmPassword'>
              <Form.Label className="fw-semibold">Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-pill shadow-sm"
              />
            </Form.Group>
            <Button type='submit' variant='primary' className="rounded-pill px-4 fw-bold shadow-sm">
              Update
            </Button>
            {loadingUpdateProfile && <Loader />}
          </Form>
        </div>
      </Col>
      <Col md={8}>
        <div className="orders-card shadow-sm rounded-4 p-4 bg-white">
          <h2 className="fw-bold mb-4 text-primary">My Orders</h2>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Table hover responsive className='table-modern align-middle'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>
                      <span className="badge bg-success-subtle text-success fw-semibold px-3 py-2 rounded-pill">
                        ₹{order.totalPrice}
                      </span>
                    </td>
                    <td>
                      {order.isPaid ? (
                        <span className="text-success fw-bold">{order.paidAt.substring(0, 10)}</span>
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <span className="text-success fw-bold">{order.deliveredAt.substring(0, 10)}</span>
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      <Button
                        as={Link}
                        to={`/order/${order._id}`}
                        className='btn-sm rounded-pill px-3'
                        variant='outline-primary'
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Col>
      <style>{`
        .profile-card, .orders-card {
          min-height: 340px;
        }
        .table-modern thead tr {
          background: #f6f9fc;
        }
        .table-modern tbody tr {
          border-bottom: 1px solid #e3eafc;
        }
        .table-modern tbody tr:hover {
          background: #f0f6ff;
          transition: background 0.2s;
        }
        .text-primary {
          color: #2c5364 !important;
        }
      `}</style>
    </Row>
  );
};

export default ProfileScreen;
