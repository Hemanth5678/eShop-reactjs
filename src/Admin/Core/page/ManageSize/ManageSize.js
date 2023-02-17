import { useEffect, useState } from 'react';
import { getListSizes } from '~/services/admin/sizeService';

import { toast } from 'react-toastify';

import AddNewSizeModal from './AddNewSizeModal';
import UpdateSizeModal from './UpdateSizeModal';
import DeleteSizeModal from './DeleteSizeModal';

const ManageSize = () => {
  const [listSizes, setListSizes] = useState([]);

  const [showAddNewSizeModal, setShowAddNewSizeModal] = useState(false);
  const [showUpdateSizeModal, setShowUpdateSizeModal] = useState(false);
  const [dataUpdateSizeModal, setDataUpdateSizeModal] = useState({});
  const [showDeleteSizeModal, setShowDeleteSizeModal] = useState(false);
  const [dataDeleteSizeModal, setDataDeleteSizeModal] = useState({});

  useEffect(() => {
    fetchListSizes();
  }, []);

  const fetchListSizes = async () => {
    const response = await getListSizes();
    if (response && response.code === 0) {
      setListSizes(response.data.sizes);
    } else {
      toast.error(response.message);
    }
  };

  const handleShowUpdateSizeModal = (size) => {
    setDataUpdateSizeModal(size);
    setShowUpdateSizeModal(true);
  };

  const handleShowDeleteSizeModal = (size) => {
    setDataDeleteSizeModal(size);
    setShowDeleteSizeModal(true);
  };

  return (
    <div className="container">
      <div className="px-6 pt-6 h-[calc(100vh-64px)] overflow-y-auto">
        <div className="body">
          <div className="grid grid-cols-4">
            <div className="col-start-2 col-end-4">
              <div className="flex justify-end">
                <button
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => setShowAddNewSizeModal(true)}
                >
                  Create new size
                </button>
                <AddNewSizeModal
                  show={showAddNewSizeModal}
                  setShow={setShowAddNewSizeModal}
                  fetchList={fetchListSizes}
                />
              </div>
              <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-6 inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full border text-center">
                        <thead className="border-b bg-blue-100 ">
                          <tr>
                            <th scope="col" className="text-base font-semibold text-gray-900 px-6 py-3 border-r">
                              #
                            </th>
                            <th scope="col" className="text-base font-semibold text-gray-900 px-6 py-3 border-r">
                              Id
                            </th>
                            <th scope="col" className="text-base font-semibold text-gray-900 px-6 py-3 border-r">
                              Size
                            </th>
                            <th scope="col" className="text-base font-semibold text-gray-900 px-6 py-3">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {listSizes &&
                            listSizes.length > 0 &&
                            listSizes.map((size, index) => (
                              <tr className="border-b" key={`size-${index}-${size.id}`}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                                  {index + 1}
                                </td>
                                <td className="text-sm text-gray-900 font-normal px-6 py-4 whitespace-nowrap border-r">
                                  {size.id}
                                </td>
                                <td className="text-sm text-gray-900 font-normal px-6 py-4 whitespace-nowrap border-r">
                                  {size.size}
                                </td>
                                <td className="text-sm text-gray-900 font-normal px-2 py-4 whitespace-nowrap">
                                  <button
                                    className="px-6 py-2.5 bg-yellow-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-700 hover:shadow-lg focus:bg-yellow-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-800 active:shadow-lg transition duration-150 ease-in-out"
                                    onClick={() => handleShowUpdateSizeModal(size)}
                                  >
                                    Update
                                  </button>
                                  <button
                                    className="ml-4 px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                                    onClick={() => handleShowDeleteSizeModal(size)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          {listSizes && listSizes.length === 0 && (
                            <tr className="border-b">
                              <td
                                className="text-sm text-gray-900 font-normal px-6 py-4 whitespace-nowrap border-r"
                                colSpan={4}
                              >
                                No data
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {listSizes && listSizes.length > 0 && (
                <UpdateSizeModal
                  show={showUpdateSizeModal}
                  setShow={setShowUpdateSizeModal}
                  data={dataUpdateSizeModal}
                  setData={setDataUpdateSizeModal}
                  fetchList={fetchListSizes}
                />
              )}
              {listSizes && listSizes.length > 0 && (
                <DeleteSizeModal
                  show={showDeleteSizeModal}
                  setShow={setShowDeleteSizeModal}
                  data={dataDeleteSizeModal}
                  setData={setDataDeleteSizeModal}
                  fetchList={fetchListSizes}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSize;
