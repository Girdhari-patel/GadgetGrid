import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color }) => {
  return (
    <div className='rating d-flex align-items-center gap-1'>
      {[1,2,3,4,5].map((i) => (
        <span key={i} style={{ color, fontSize: '1.3rem', filter: 'drop-shadow(0 1px 2px #e3eafc)' }}>
          {value >= i ? <FaStar /> : value >= i - 0.5 ? <FaStarHalfAlt /> : <FaRegStar />}
        </span>
      ))}
      <span className='rating-text ms-2 text-secondary fw-semibold'>{text && text}</span>
      <style>{`
        .rating .rating-text {
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

Rating.defaultProps = {
  color: '#f8e825',
};

export default Rating;
