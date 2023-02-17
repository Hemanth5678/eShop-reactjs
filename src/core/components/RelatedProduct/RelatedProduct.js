import { useEffect, useState } from 'react';
import { getNRelatedProductByCategoryId } from '~/services/client/productService';
import ProductCard from '../ProductCard/ProductCard';

const RelatedProduct = ({ parentProduct }) => {
  const NUMBER_OF_ELEMENTS = 5;
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (parentProduct?.category !== undefined) {
      fetchListRelatedProducts(parentProduct?.category?.id);
    }
  }, [parentProduct]);

  const fetchListRelatedProducts = async (categoryId) => {
    const response = await getNRelatedProductByCategoryId(categoryId, NUMBER_OF_ELEMENTS);
    if (response && +response.code === 0) {
      setRelatedProducts(response?.data?.products);
    }
  };

  return (
    <div className="related-product mt-10 mb-3">
      <h2 className="text-2xl font-bold text-center mt-3 mb-5">Related Product</h2>
      <div className="grid grid-cols-5">
        {relatedProducts &&
          relatedProducts.length > 0 &&
          relatedProducts.map((product) => (
            <ProductCard
              key={`related-product-${product.productId}`}
              product={product}
              type={String(product?.category?.name).toLowerCase()}
            />
          ))}
      </div>
      {relatedProducts && relatedProducts.length === 0 && <div className="pt-5 pb-10">No data</div>}
    </div>
  );
};

export default RelatedProduct;
