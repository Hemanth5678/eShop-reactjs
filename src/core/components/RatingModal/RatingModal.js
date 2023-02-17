import PropTypes from 'prop-types';
import { Rating } from 'react-simple-star-rating';
import classNames from 'classnames';
import { useState } from 'react';
import Validation from '~/utils/validation';
import { toast } from 'react-toastify';
import { postRatingProduct } from '~/services/client/ratingService';

const RatingModal = ({ show, setShow, product }) => {
  const [comment, setComment] = useState({
    star: 0,
    title: '',
    content: '',
  });

  const resetComment = () => {
    setComment({
      star: 0,
      title: '',
      content: '',
    });
  };

  const handleRating = (rate) => {
    setComment({
      ...comment,
      star: rate,
    });
  };

  const validateData = () => {
    if (comment.star === 0) {
      toast.error('Please select number of stars.');
      return false;
    }
    if (Validation.isEmpty(comment.title)) {
      toast.error('Please write title of rating.');
      return false;
    }
    if (Validation.isEmpty(comment.content)) {
      toast.error('Please write comment.');
      return false;
    }
    return true;
  };

  const handleSubmitRating = async () => {
    if (validateData()) {
      const response = await postRatingProduct(product?.productId, comment?.star, comment?.title, comment?.content);
      if (response && +response?.code === 0) {
        resetComment();
        setShow(false);
        toast.success('Rating product successfully.');
      } else {
        toast.error(response?.message);
      }
    }
  };

  return (
    <div
      className={classNames(
        { flex: show },
        { hidden: !show },
        'flex bg-slate-900/[0.5] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 w-full md:inset-0 md:h-full justify-center items-center',
      )}
    >
      <div className="relative p-4 w-full max-w-2xl h-auto">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex justify-between items-start p-4 rounded-t border-b">
            <h3 className="text-xl font-semibold text-gray-900 ">Ratings product</h3>
            <button
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => {
                resetComment();
                setShow(false);
              }}
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
            </button>
          </div>
          <div className="p-6 flex flex-col space-y-6">
            <div className="text-center">
              <Rating initialValue={comment.star} onClick={handleRating} />
            </div>
            <div className="mb-6">
              <label htmlFor="title" className="block mb-2 text-base font-medium text-gray-900 ">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter title"
                required
                name="title"
                value={comment.title}
                onChange={(event) =>
                  setComment({
                    ...comment,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
            <div className="mb-6">
              <label htmlFor="content" className="block mb-2 text-base font-medium text-gray-900">
                Content
              </label>
              <textarea
                id="content"
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Leave a comment..."
                name="content"
                value={comment.content}
                onChange={(event) =>
                  setComment({
                    ...comment,
                    [event.target.name]: event.target.value,
                  })
                }
              ></textarea>
            </div>
          </div>
          <div className="flex items-center justify-center p-6 space-x-2 rounded-b border-t border-gray-200">
            <button
              className="text-white bg-black rounded-md border text-sm uppercase font-normal px-6 py-2.5 focus:z-10"
              onClick={() => handleSubmitRating()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

RatingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default RatingModal;
