import { Spinner } from 'react-bootstrap';

const Loader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '120px' }}>
    <Spinner
      animation="border"
      role="status"
      variant="primary"
      style={{ width: '48px', height: '48px', borderWidth: '5px' }}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default Loader;
