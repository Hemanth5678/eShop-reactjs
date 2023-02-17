import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';

import './FixedStar.scss';
import styles from './ProductRating.module.scss';

import { AiFillStar } from 'react-icons/ai';
import { HiOutlineUserCircle } from 'react-icons/hi';
import RatingModal from '../RatingModal/RatingModal';

import { getAllRatingsOfProductWithPaginate } from '~/services/client/ratingService';

const cx = classNames.bind(styles);

const ProductRating = ({ product }) => {
  // Todo: Load more rating

  const LIMIT_RATINGS = 10;
  const SORT_TYPE = 'DESC';
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const [listRatings, setListRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [stars, setStars] = useState({
    1: {
      star: 1,
      percent: 0,
    },
    2: {
      star: 2,
      percent: 0,
    },
    3: {
      star: 3,
      percent: 0,
    },
    4: {
      star: 4,
      percent: 0,
    },
    5: {
      star: 5,
      percent: 0,
    },
  });
  const [showModal, setShowModal] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (product?.productId && showModal===false) {
      fetchListRatings(product.productId, currentPage - 1, SORT_TYPE);
    }
  }, [product, showModal]);

  const handleShowModalRating = () => {
    if (!isAuthenticated) {
      toast.error('Please login before performing rating action.');
    } else {
      setShowModal(true);
    }
  };

  const fetchListRatings = async (productId, offset, sortType) => {
    const response = await getAllRatingsOfProductWithPaginate(productId, offset, LIMIT_RATINGS, sortType);
    if (response && +response?.code === 0) {
      setListRatings(response?.data?.ratings);
      setTotalPage(response?.data?.totalPages);
      setTotalRow(response?.data?.totalRows);
      setStars(response?.data?.stars);
      setAverage(response?.data?.average);
    }
  };

  return (
    <div className={cx('product-rating')}>
      <div className={cx('rating')}>
        <p className={cx('title', 'font-semibold text-2xl')}>Ratings {product?.name}</p>
        <div className={cx('grid grid-cols-2 mt-6 mb-5')}>
          <div className={cx('star', 'left max-w-[260px] p-3 border-r')}>
            <div className={cx('top', 'flex gap-2 items-end mb-4')}>
              <p className={cx('point', 'font-bold text-2xl leading-6 text-black')}>{Math.round(average * 10) / 10}</p>
              <Rating
                className={cx('list-stars')}
                fillColor={'#000'}
                initialValue={Math.floor(average * 10)}
                readonly
                size={20}
              />
              <p className={cx('total', 'text-base')}>{totalRow} ratings</p>
            </div>
            <ul className={cx('rating-list')}>
              <li className="flex items-center gap-2 mb-2">
                <div className={cx('number flex items-center gap-1 text-sm')}>
                  5 <AiFillStar />
                </div>
                <div className={cx('timeline flex-1')}>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-300">
                    <div
                      className="bg-black h-1.5 rounded-full"
                      style={{ width: `${Math.round(stars[5].percent)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={cx('percent', 'text-sm w-9')}>{`${Math.round(stars[5].percent)}%`}</div>
              </li>
              <li className="flex items-center gap-2 mb-2">
                <div className={cx('number flex items-center gap-1 text-sm')}>
                  4 <AiFillStar />
                </div>
                <div className={cx('timeline flex-1')}>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-300">
                    <div
                      className="bg-black h-1.5 rounded-full"
                      style={{ width: `${Math.round(stars[4].percent)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={cx('percent', 'text-sm w-9')}> {`${Math.round(stars[4].percent)}%`}</div>
              </li>
              <li className="flex items-center gap-2 mb-2">
                <div className={cx('number flex items-center gap-1 text-sm')}>
                  3 <AiFillStar />
                </div>
                <div className={cx('timeline flex-1')}>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-300">
                    <div
                      className="bg-black h-1.5 rounded-full"
                      style={{ width: `${Math.round(stars[3].percent)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={cx('percent', 'text-sm w-9')}> {`${Math.round(stars[3].percent)}%`}</div>
              </li>
              <li className="flex items-center gap-2 mb-2">
                <div className={cx('number flex items-center gap-1 text-sm')}>
                  2 <AiFillStar />
                </div>
                <div className={cx('timeline flex-1')}>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-300">
                    <div
                      className="bg-black h-1.5 rounded-full"
                      style={{ width: `${Math.round(stars[2].percent)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={cx('percent', 'text-sm w-9')}>{`${Math.round(stars[2].percent)}%`}</div>
              </li>
              <li className="flex items-center gap-2 mb-2">
                <div className={cx('number flex items-center gap-1 text-sm')}>
                  1 <AiFillStar />
                </div>
                <div className={cx('timeline flex-1')}>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-300">
                    <div
                      className="bg-black h-1.5 rounded-full"
                      style={{ width: `${Math.round(stars[1].percent)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={cx('percent', 'text-sm w-9')}> {`${Math.round(stars[1].percent)}%`}</div>
              </li>
            </ul>
          </div>
          <div className={cx('right', 'flex justify-end items-start')}>
            {isAuthenticated && (
              <>
                <button
                  className="text-base uppercase p-2 bg-black text-white hover:bg-slate-700"
                  onClick={() => handleShowModalRating()}
                >
                  Write ratings
                </button>
                <RatingModal show={showModal} setShow={setShowModal} product={product} />
              </>
            )}
          </div>
        </div>
      </div>
      <div className={cx('comments', 'pb-3')}>
        {listRatings &&
          listRatings.length > 0 &&
          listRatings.map((rating, index) => (
            <div key={`rating-${index}`} className={cx('comment', 'border-t pt-3 pb-6')}>
              <div className={cx('top', 'flex items-center gap-2 mb-2')}>
                <div className="text-4xl">
                  <HiOutlineUserCircle />
                </div>
                <div>
                  <div className={cx('title')}>{rating?.user?.firstName + ' ' + rating?.user?.lastName}</div>
                  <div className={cx('rate', 'flex gap-2 items-end')}>
                    <div className={cx('star')}>
                      <Rating fillColor={'#000'} initialValue={rating?.stars} readonly size={20} />
                    </div>
                    <div className={cx('date')}>
                      {rating?.createdDate && new Date(rating?.createdDate).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx('bottom')}>
                <div className={cx('title', 'font-medium')}>{rating?.title}</div>
                <p className={cx('comment')}>{rating?.comment}</p>
              </div>
            </div>
          ))}
        {listRatings && listRatings.length === 0 && <div>No rating yet.</div>}
      </div>
    </div>
  );
};

export default ProductRating;
