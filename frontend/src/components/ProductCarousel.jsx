import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const SkeletonSlide = () => (
  <div className="pc-skel">
    <div className="pc-skel-img" />
    <div className="pc-skel-badge" />
  </div>
);

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return (
      <div className="product-carousel-modern mb-4" aria-hidden>
        <SkeletonSlide />
      </div>
    );
  }

  if (error) {
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="product-carousel-modern mb-4">
      <Carousel
        fade
        pause="hover"
        interval={1000}
        touch
        keyboard
        className="rounded-4 overflow-hidden shadow-sm"
      >
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <div className="pc-slide position-relative">
              <div className="pc-media">
              <Image
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="pc-img pc-contain"
              />
            </div>
              <span className="pc-overlay" />

              <div className="pc-caption">
                <h2 className="pc-title mb-1">{product.name}</h2>
                <div className="pc-sub">${product.price}</div>
              </div>

              {/* Make the whole slide clickable while keeping accessibility & context menu */}
              <Link
                to={`/product/${product._id}`}
                className="stretched-link"
                aria-label={`View ${product.name}`}
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <style>{`
        .product-carousel-modern { position: relative; }
        .pc-slide { position: relative; }
       /* wrapper: fixed height, full width */
.pc-media { width: 100%; height: clamp(220px, 42vh, 520px); }
        @media (max-width: 576px) { .pc-media { aspect-ratio: 16 / 9; } }
       .pc-img {
  width: 100%;
  height: 100%;
  object-fit: contain;         /* <-- key change */
  object-position: center;
  display: block;
  background: linear-gradient(180deg, #f7f9fc, #eaf1ff);
}

      
/* overlay हल्का रखें; ये image fit पर असर नहीं डालेगा */
.pc-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.00) 25%, rgba(0,0,0,0.45) 90%);
  pointer-events: none;
}
        .pc-caption {
          position: absolute;
          left: clamp(12px, 4vw, 32px);
          bottom: clamp(12px, 4vw, 28px);
          color: #0b2239;
          background: rgba(255,255,255,0.92);
          -webkit-backdrop-filter: blur(4px) saturate(120%);
          backdrop-filter: blur(4px) saturate(120%);
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 16px;
          padding: 10px 14px;
          box-shadow: 0 8px 24px rgba(16,24,40,0.12);
          max-width: min(92%, 680px);
        }
        .pc-title { font-size: clamp(1.1rem, 1.5vw + .6rem, 1.6rem); font-weight: 700; margin: 0; }
        .pc-sub { font-size: .95rem; opacity: .85; }

        /* Skeleton */
        .pc-skel {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 6px 32px rgba(44,83,100,.13);
        }
        .pc-skel-img {
          height: clamp(220px, 42vh, 460px);
          background: #eef2f7;
          position: relative;
        }
        .pc-skel-badge {
          position: absolute; left: 16px; bottom: 16px; width: 220px; height: 52px; border-radius: 14px; background: rgba(255,255,255,.8);
        }
        .pc-skel-img::after, .pc-skel-badge::after {
          content: '';
          position: absolute; inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
          animation: pc-shimmer 1.2s infinite;
        }
        @keyframes pc-shimmer { 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
};

export default ProductCarousel;
