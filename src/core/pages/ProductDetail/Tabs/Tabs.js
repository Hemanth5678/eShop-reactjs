import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Tabs.module.scss';

import { ProductRating } from '../../../components';


const cx = classNames.bind(styles);

const Tabs = ({ parentProduct, listImages }) => {
  const [index, setIndex] = useState(1);


  return (
    <>
      <div className={cx('tabs')}>
        <div
          className={cx({ active: +index === 1 })}
          onClick={() => {
            index !== 1 && setIndex(1);
          }}
        >
          Description
        </div>
        {/* <div
          className={cx({ active: +index === 2 })}
          onClick={() => {
            index !== 2 && setIndex(2);
          }}
        >
          Size table
        </div> */}
        <div
          className={cx({ active: +index === 3 })}
          onClick={() => {
            index !== 3 && setIndex(3);
          }}
        >
          Review Product
        </div>
      </div>
      <div className="content mb-6">
        {/* Description */}
        {+index === 1 && (
          <div>
            <div className="mb-10">{parentProduct.description}</div>
            <div className="flex flex-col items-center gap-5">
              {listImages &&
                listImages.length > 0 &&
                listImages.map((image, index) => (
                  <img
                    key={`description-image-${image.imageId}-${index}`}
                    src={image.imageUrl}
                    alt="Product"
                    className="w-96"
                  />
                ))}
            </div>
          </div>
        )}
        {+index === 2 && (
          <div>
            <div className="font-medium uppercase">Note: Size table does not apply to all products</div>
          </div>
        )}
        {/* Rating */}
        {+index === 3 && <ProductRating product={parentProduct} />}
      </div>
    </>
  );
};

export default Tabs;
