import { useRef } from 'react';
import classNames from 'classnames';

import { IoCloseOutline } from 'react-icons/io5';

import Validation from '~/utils/validation';
import { toast } from 'react-toastify';
import { postCreateNewColor } from '~/services/admin/colorService';

const AddNewColorModal = ({ show, setShow, fetchList }) => {
  const inputRef = useRef();

  const handleClearData = () => {
    inputRef.current.value = '';
  };

  const handleCreateNewColor = async () => {
    if (Validation.isEmpty(inputRef.current.value)) {
      toast.error('Name of color is required.');
    } else {
      const response = await postCreateNewColor(String(inputRef.current.value).trim().toUpperCase());
      if (response && response.code === 0) {
        handleClearData();
        setShow(false);
        toast.success(response.message);
        fetchList();
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <>
      {show && (
        <div
          className={classNames(
            'flex bg-slate-900/[0.5] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-[999] w-full md:inset-0 md:h-full justify-center items-center',
          )}
        >
          <div className="relative p-4 w-full max-w-2xl h-auto">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex justify-between items-start p-4 rounded-t border-b">
                <h3 className="text-xl font-semibold text-gray-900">Create new color</h3>
                <button
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg p-1.5 ml-auto inline-flex items-center"
                  onClick={() => setShow(false)}
                >
                  <IoCloseOutline />
                </button>
              </div>
              <div className="p-6 flex flex-col">
                <div className="mb-6">
                  <label htmlFor="color-name" className="block mb-2 text-base font-medium text-gray-900 ">
                    Name:
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    id="color-name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter color name"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                <button
                  className="text-white bg-black hover:bg-slate-800 rounded-md border text-sm uppercase font-normal px-6 py-2.5 focus:z-10"
                  onClick={() => handleCreateNewColor()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNewColorModal;
