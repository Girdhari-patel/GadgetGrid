import { Alert } from 'react-bootstrap';

const Message = ({ variant, children, className }) => {
  return (
    <Alert variant={variant} className={`shadow-sm rounded-3 fw-semibold ${className}`}>
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
