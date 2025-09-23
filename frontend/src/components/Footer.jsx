import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(90deg, #0f2027, #2c5364)',
      color: '#fff',
      marginTop: '40px'
    }}>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <p style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '1px' }}>
              GadgetGrid &copy; {currentYear}
            </p>
            <div>
              <a href="https://facebook.com" style={{ color: '#fff', margin: '0 10px' }}>
                <FaFacebookF size={22} />
              </a>
              <a href="https://twitter.com" style={{ color: '#fff', margin: '0 10px' }}>
                <FaTwitter size={22} />
              </a>
              <a href="https://instagram.com" style={{ color: '#fff', margin: '0 10px' }}>
                <FaInstagram size={22} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
