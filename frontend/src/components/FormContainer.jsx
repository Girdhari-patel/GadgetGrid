import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6} lg={5} className="bg-white p-4 rounded-4 shadow-sm my-4">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
