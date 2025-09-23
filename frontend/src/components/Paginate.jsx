import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, keyword = '' }) => {
  if (pages <= 1) return null;
  return (
    <Pagination className="justify-content-center my-3 paginate-modern">
      {[...Array(pages).keys()].map((x) => (
        <Pagination.Item
          key={x + 1}
          active={x + 1 === page}
          className="rounded-pill fw-bold shadow-sm"
          as={Link}
          to={keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`}
        >
          {x + 1}
        </Pagination.Item>
      ))}
      <style>{`
        .paginate-modern .page-link {
          border-radius: 50px !important;
          margin: 0 2px;
        }
      `}</style>
    </Pagination>
  );
};

export default Paginate;
