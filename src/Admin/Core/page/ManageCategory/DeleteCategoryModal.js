import classNames from 'classnames';
import { toast } from 'react-toastify';

import { IoCloseOutline } from 'react-icons/io5';

import { deleteCategoryById } from '~/services/admin/categoryService';

const DeleteCategoryModal = ({ show, setShow, data, setData, fetchList }) => {
  const handleClearData = () => {
    setData({});
  };

  const handleDeleteCategory = async () => {
    const response = await deleteCategoryById(data.id);
    if (response && response.code === 0) {
      handleClearData();
      toast.success(response.message);
      fetchList();
    } else {
      toast.error(response.message);
    }
    setShow(false);
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
                <h3 className="text-xl font-semibold text-orange-600">Warning</h3>
                <button
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg p-1.5 ml-auto inline-flex items-center"
                  onClick={() => {
                    handleClearData();
                    setShow(false);
                  }}
                >
                  <IoCloseOutline />
                </button>
              </div>
              <div className="p-6 flex flex-col">Are you sure to delete category {data?.name}</div>
              <div className="flex items-center justify-end px-6 py-4 space-x-2 rounded-b border-t border-gray-200">
                <button
                  className="text-white bg-black hover:bg-slate-800 rounded-md border text-sm uppercase font-normal px-6 py-2.5 focus:z-10"
                  onClick={() => {
                    handleClearData();
                    setShow(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="text-white bg-red-700 hover:bg-red-800 rounded-md border text-sm uppercase font-normal px-6 py-2.5 focus:z-10"
                  onClick={() => handleDeleteCategory()}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteCategoryModal;
