import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { FaCheck, FaArrowRight } from 'react-icons/fa';
import { MdArrowRight } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { publicRoutes } from '~/routes/routes';
import { formatIndianMoney } from '~/utils/format';

const AddToCartModal = ({ product, show, setShow }) => {
  const cart = useSelector((state) => state.cart.cart);

  const totalItems = cart?.items?.reduce((previous, current) => previous + current.quantity, 0);

  return (
    <div
      className={classNames(
        { flex: show },
        { hidden: !show },
        'add-to-cart-modal',
        'bg-slate-900/[0.5] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 w-full md:inset-0 md:h-full justify-center items-center',
      )}
    >
      <div className="relative p-4 w-full max-w-2xl h-auto">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex justify-between items-start px-4 py-3 rounded-t border-b">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FaCheck />
              <span>The product has just been added to the cart</span>
            </h3>
            <button
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => setShow(false)}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="px-4 py-2 flex flex-col space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-[100px] w-[100px] border p-1">
                <img
                  src={product?.images && product?.images[0]?.imageUrl}
                  alt={product?.product?.name}
                  title={product?.product?.name}
                  className="h-full w-auto mx-auto my-auto object-contain"
                />
              </div>
              <div>
                <div className="font-medium uppercase">{`${product?.product?.name} - ${product?.size?.size} / ${product?.color?.name}`}</div>
                <div className="my-1 text-lg">
                  {product?.product?.promotion
                    ? formatIndianMoney.format(product?.product?.discountPrice)
                    : formatIndianMoney.format(product?.product?.price)}
                </div>
                <div className="text-gray-400">{`${product?.size?.size} / ${product?.color?.name}`}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center px-4 py-2 space-x-2 rounded-b border-t border-gray-200">
            <Link to={publicRoutes.cart} className="flex items-center justify-start w-full my-2 mb-2 font-medium">
              <MdArrowRight className="text-xl" />
              <span>Cart currently has ({totalItems}) products.</span>
            </Link>
            <Link
              to={publicRoutes.checkout}
              className="flex items-center justify-center gap-2 w-full text-white bg-black hover:bg-slate-900 rounded-md border text-base uppercase font-normal px-6 py-3 focus:z-10"
            >
              <span>Check out</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

AddToCartModal.propTypes = {
  product: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default AddToCartModal;
