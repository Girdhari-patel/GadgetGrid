 import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

// Lightweight skeletons (no extra deps)
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="sk-img" />
    <div className="sk-content">
      <div className="sk-line w-80" />
      <div className="sk-line w-60" />
      <div className="sk-line w-40" />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 8 }) => (
  <Row className="g-4" role="list" aria-label="Loading products">
    {Array.from({ length: count }).map((_, i) => (
      <Col key={i} sm={12} md={6} lg={4} xl={3} role="listitem">
        <SkeletonCard />
      </Col>
    ))}
  </Row>
);

const EmptyState = ({ keyword }) => (
  <div className="empty-state text-center py-5">
    <div className="emoji">🧐</div>
    <h2 className="fw-bold mb-2">No results found</h2>
    {keyword ? (
      <p className="text-body-secondary mb-4">
        We couldn\'t find any products for <strong>"{keyword}"</strong>.
      </p>
    ) : (
      <p className="text-body-secondary mb-4">There are no products to show right now.</p>
    )}
    <Link to="/" className="btn btn-primary rounded-pill px-4 py-2 shadow-sm">
      Browse all products
    </Link>
  </div>
);

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });

  const products = data?.products ?? [];
  const showCarousel = !keyword;
  const hasResults = products.length > 0;

  return (
    <div className="home-shell">
      <Meta title={keyword ? `Search: ${keyword}` : 'Latest Products'} />

      <div className="hero-wrap">
        <Container fluid="xl" className="py-3 py-md-4">
          {showCarousel ? (
            <ProductCarousel />
          ) : (
            <div className="mb-3">
              <Link to="/" className="btn btn-light mb-2 shadow-sm rounded-pill px-4 py-2">
                ← Go Back
              </Link>
            </div>
          )}

          <header className="d-flex align-items-end justify-content-between gap-3 mb-3 mb-md-4">
            <div>
              <h1 className="display-6 fw-bold gradient-title mb-1">Latest Products</h1>
              {keyword && (
                <p className="text-body-secondary small mb-0">
                  Showing results for <strong>"{keyword}"</strong>
                </p>
              )}
            </div>
          </header>
        </Container>
      </div>

      <Container fluid="xl" className="pb-5">
        {isLoading ? (
          // Keep fallback spinner accessible while skeletons render
          <>
            <div className="visually-hidden" aria-live="polite">
              <Loader />
            </div>
            <SkeletonGrid count={8} />
          </>
        ) : error ? (
          <Message variant="danger" className="mb-4 shadow-sm rounded">
            {error?.data?.message || error.error}
          </Message>
        ) : !hasResults ? (
          <EmptyState keyword={keyword} />
        ) : (
          <>
            <Row className="g-4" role="list" aria-label="Products">
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3} role="listitem">
                  <div className="card-modern h-100">
                    <Product product={product} />
                  </div>
                </Col>
              ))}
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <Paginate pages={data.pages} page={data.page} keyword={keyword ?? ''} />
            </div>
          </>
        )}
      </Container>

      {/* Modern polish styles */}
      <style>{`
        :root {
          --surface: #ffffff;
          --surface-2: #f6f9fc;
          --border: #e6ecf5;
          --primary-600: #2c5364;
          --shadow-1: 0 6px 32px rgba(44,83,100,0.13);
          --shadow-2: 0 16px 40px rgba(44,83,100,0.22);
        }

        .home-shell {
          min-height: 100vh;
          background:
            radial-gradient(1200px 400px at 10% -10%, rgba(99,143,255,0.08), transparent 60%),
            radial-gradient(900px 400px at 100% 0%, rgba(44,83,100,0.08), transparent 50%),
            var(--surface-2);
        }

        .hero-wrap {
          background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2));
          backdrop-filter: saturate(140%) blur(2px);
          border-bottom: 1px solid var(--border);
        }

        .gradient-title {
          background: linear-gradient(90deg, #1e3c72, #2a5298 40%, #2c5364 80%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: 0.5px;
        }

        .card-modern {
          transition: box-shadow .3s, transform .3s, border-color .3s;
          border-radius: 20px;
          box-shadow: var(--shadow-1);
          background: linear-gradient(135deg, var(--surface) 78%, #eaf1ff 100%);
          border: 1px solid #e3eafc;
          padding-bottom: 12px;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .card-modern:hover {
          box-shadow: var(--shadow-2);
          transform: translateY(-8px) scale(1.045);
          border-color: #b6c6e3;
        }

        /* Subtle image zoom on Product component images */
        .card-modern img {
          border-radius: 20px 20px 0 0;
          transition: transform .35s ease;
        }
        .card-modern:hover img { transform: scale(1.06); }

        /* Grid tweaks */
        .g-4 { row-gap: 2.2rem; column-gap: 0; }

        /* Skeletons */
        .skeleton-card {
          border-radius: 20px;
          background: linear-gradient(135deg, var(--surface) 78%, #eef3ff 100%);
          border: 1px solid #e8eef8;
          box-shadow: var(--shadow-1);
          overflow: hidden;
        }
        .sk-img {
          aspect-ratio: 4 / 3;
          background: #eef2f7;
          position: relative;
        }
        .sk-content { padding: 14px 14px 18px; }
        .sk-line {
          height: 12px;
          border-radius: 8px;
          background: #e9eef5;
          position: relative;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .sk-line::after, .sk-img::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          animation: shimmer 1.2s infinite;
        }
        .w-80 { width: 80%; }
        .w-60 { width: 60%; }
        .w-40 { width: 40%; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }

        /* Empty state */
        .empty-state .emoji { font-size: 44px; }

        /* Prefer our primary hue */
        .text-primary { color: var(--primary-600) !important; }
      `}</style>
    </div>
  );
};

export default HomeScreen;
