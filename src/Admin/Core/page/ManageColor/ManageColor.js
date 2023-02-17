import { useEffect, useState } from 'react';
import { getListColors } from '~/services/admin/colorService';

import { toast } from 'react-toastify';

import AddNewColorModal from './AddNewColorModal';
import UpdateColorModal from './UpdateColorModal';
import DeleteColorModal from './DeleteColorModal';

const ManageColor = () => {
  const [listColors, setListColors] = useState([]);

  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [showUpdateColorModal, setShowUpdateColorModal] = useState(false);
  const [dataUpdateColorModal, setDataUpdateColorModal] = useState({});
  const [showDeleteColorModal, setShowDeleteColorModal] = useState(false);
  const [dataDeleteColorModal, setDataDeleteColorModal] = useState({});

  useEffect(() => {
    fetchListColors();
  }, []);

  const fetchListColors = async () => {
    const response = await getListColors();
    if (response && response.code === 0) {
      setListColors(response.data.colors);
    } else {
      toast.error(response.message);
    }
  };

  const handleShowUpdateColorModal = (color) => {
    setDataUpdateColorModal(color);
    setShowUpdateColorModal(true);
  };

  const handleShowDeleteColorModal = (color) => {
    setDataDeleteColorModal(color);
    setShowDeleteColorModal(true);
  };

  return (
    <div className="container">
      <div className="px-6 py-4 pt-6 h-[calc(100vh-64px)] overflow-y-auto">
        <div className="body">
          <div className="grid grid-cols-4">
            <div className="col-start-2 col-end-4">
              <div className="flex justify-end">
                <button
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => setShowAddNewModal(!showAddNewModal)}
                >
                  Create new color
                </button>
                <AddNewColorModal show={showAddNewModal} setShow={setShowAddNewModal} fetchList={fetchListColors} />
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
                              Name
                            </th>
                            <th scope="col" className="text-base font-semibold text-gray-900 px-6 py-3">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {listColors &&
                            listColors.length > 0 &&
                            listColors.map((color, index) => (
                              <tr className="border-b" key={`color-${index}-${color.id}`}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                                  {index + 1}
                                </td>
                                <td className="text-sm text-gray-900 font-normal px-6 py-4 whitespace-nowrap border-r">
                                  {color.id}
                                </td>
                                <td className="text-sm text-gray-900 font-normal px-6 py-4 whitespace-nowrap border-r">
                                  {color.name}
                                </td>
                                <td className="text-sm text-gray-900 font-normal px-2 py-4 whitespace-nowrap">
                                  <button
                                    className="px-6 py-2.5 bg-yellow-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-700 hover:shadow-lg focus:bg-yellow-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-800 active:shadow-lg transition duration-150 ease-in-out"
                                    onClick={() => handleShowUpdateColorModal(color)}
                                  >
                                    Update
                                  </button>
                                  <button
                                    className="ml-4 px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                                    onClick={() => handleShowDeleteColorModal(color)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          {listColors && listColors.length === 0 && (
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
              {listColors && listColors.length > 0 && (
                <UpdateColorModal
                  show={showUpdateColorModal}
                  setShow={setShowUpdateColorModal}
                  data={dataUpdateColorModal}
                  setData={setDataUpdateColorModal}
                  fetchList={fetchListColors}
                />
              )}
              {listColors && listColors.length > 0 && (
                <DeleteColorModal
                  show={showDeleteColorModal}
                  setShow={setShowDeleteColorModal}
                  data={dataDeleteColorModal}
                  setData={setDataDeleteColorModal}
                  fetchList={fetchListColors}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageColor;
