import { Link } from 'react-router-dom';

const CustomProduct = ({ value }) => {
  const product = value
    ? value
    : {
        image: '',
        name: '',
        size: '',
        color: '',
        code: '',
        slug: '',
        category: '',
      };

  return (
    <div className="product block">
      <div className="image w-20 h-20">
        <Link to={`/collection/${product.category}/${product.slug}`}>
          <img src={product.image} alt="Product" />
        </Link>
      </div>
      <div className="detail">
        <div className="title text-xs">
          <Link to={`/collection/type/${product.name}`}>{product.name}</Link>
        </div>
        <div className="size-color text-xs text-slate-400">
          {product.size} / {product.color}
        </div>
        <div className="product-id text-xs">Product code: {product.code}</div>
      </div>
    </div>
  );
};

export default CustomProduct;
