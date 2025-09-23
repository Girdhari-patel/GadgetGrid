import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex searchbox-form">
      <InputGroup>
        <Form.Control
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder="Search Products..."
          className="rounded-pill shadow-sm"
        />
        <Button type="submit" variant="success" className="rounded-pill px-4 ms-2 fw-bold shadow-sm">
          Search
        </Button>
      </InputGroup>
      <style>{`
        .searchbox-form {
          min-width: 260px;
        }
      `}</style>
    </Form>
  );
};

export default SearchBox;
