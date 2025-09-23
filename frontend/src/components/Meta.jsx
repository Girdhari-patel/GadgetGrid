import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
  </Helmet>
);

Meta.defaultProps = {
  title: 'GadgetGrid - Shop Latest Products',
  description: 'Buy the best gadgets and electronics online.',
  keywords: 'electronics, buy gadgets, shop online, mobiles, laptops',
};

export default Meta;
