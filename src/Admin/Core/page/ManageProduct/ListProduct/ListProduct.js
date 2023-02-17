import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

import DeleteProductModal from './DeleteProductModal/DeleteProductModal';
import UpdateProductModal from './UpdateProductModal/UpdateProductModal';

import { getListProductsWithPaginate } from '~/services/admin/productService';
import { formatIndianMoney } from '~/utils/format';

const ListProduct = () => {
  const LIMIT_PRODUCT = 10;

  const [listProduct, setListProduct] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [showUpdateWarningModal, setShowUpdateWarningModal] = useState(false);
  const [dataUpdateWarningModal, setDataUpdateWarningModal] = useState({});

  const [showDeleteWarningModal, setShowDeleteWarningModal] = useState(false);
  const [dataDeleteWarningModal, setDataDeleteWarningModal] = useState({});

  useEffect(() => {
    fetchListProductWithPaginate(currentPage - 1);
  }, []);

  const fetchListProductWithPaginate = async (page) => {
    const response = await getListProductsWithPaginate(LIMIT_PRODUCT, page);
    if (response && +response.code === 0) {
      setListProduct(response.data.products);
      setPageCount(response.data.totalPages);
    } else {
      toast.error(response.message);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
    fetchListProductWithPaginate(+event.selected);
  };

  const handleClickShowDeleteModal = (data) => {
    setDataDeleteWarningModal(data);
    setShowDeleteWarningModal(true);
  };

  const handleClickShowUpdateModal = (data) => {
    setDataUpdateWarningModal(data);
    setShowUpdateWarningModal(true);
  };

  return (
    <div className="h-[calc(100vh-129px)] overflow-y-auto">
      <div className="content">
        <div className="border rounded-md p-3 mb-6">
          <div className="table w-full">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-slate-300">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 pt-4 pb-2 border border-gray-200 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Id
                    </th>
                    <th
                      scope="col"
                      className="px-4 pt-4 pb-2 border border-gray-200 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-4 pt-4 pb-2 border border-gray-200 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 pt-4 pb-2 border border-gray-200 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-4 pt-4 pb-2 border border-gray-200 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Visible
                    </th>
                    <th
                      scope="col"
                      className="px-4 pt-4 pb-2 border border-gray-200 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Is Promotion
                    </th>
                    <th
                      scope="col"
                      className="px-4 pt-4 pb-2 border border-gray-200 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {listProduct &&
                    listProduct.length > 0 &&
                    listProduct.map((product, index) => (
                      <tr key={`product-${product.productId}-${index}`}>
                        <td className="px-4 py-2 text-sm border border-gray-200">{product.productId}</td>
                        <td className="px-4 py-2 text-sm border border-gray-200">
                          <img
                            className="h-32 mx-auto"
                            src={product.primaryImageUrl}
                            alt="Product"
                            title={product.name}
                          />
                        </td>
                        <td className="px-4 py-2 text-sm border border-gray-200">{product.name}</td>
                        <td className="px-4 py-2 text-sm border border-gray-200">
                          {formatIndianMoney.format(product.price)}
                        </td>
                        <td
                          className={`px-4 py-2 text-sm border border-gray-200 font-bold ${
                            product.visible ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {product.visible ? 'Yes' : 'No'}
                        </td>
                        <td
                          className={`px-4 py-2 text-sm border border-gray-200 font-bold ${
                            product.promotion ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {product.promotion ? 'Yes' : 'No'}
                        </td>
                        <td className="px-4 py-2 text-sm border border-gray-200">
                          <div className="flex flex-col gap-2">
                            <button
                              className="py-2 text-white bg-blue-600 hover:bg-blue-800"
                              onClick={() => handleClickShowUpdateModal(product)}
                            >
                              Update
                            </button>
                            <button
                              className="py-2 text-white bg-red-600 hover:bg-red-800"
                              onClick={() => handleClickShowDeleteModal(product)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="paginate">
            <ReactPaginate
              marginPagesDisplayed={3}
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              breakLabel="..."
              nextLabel="Next"
              previousLabel="Previous"
              renderOnZeroPageCount={null}
              pageLinkClassName="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 select-none"
              pageClassName="py-2"
              breakLinkClassName="py-2 px-3"
              previousLinkClassName="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 select-none"
              previousClassName="py-2"
              nextLinkClassName="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 select-none"
              nextClassName="py-2"
              containerClassName="flex justify-center mt-6 mb-4"
              activeLinkClassName="text-blue-600 bg-blue-50"
            />
          </div>
        </div>
      </div>
      <UpdateProductModal
        show={showUpdateWarningModal}
        setShow={setShowUpdateWarningModal}
        data={dataUpdateWarningModal}
        setData={setDataUpdateWarningModal}
        fetchListProduct={fetchListProductWithPaginate}
      />
      <DeleteProductModal
        show={showDeleteWarningModal}
        setShow={setShowDeleteWarningModal}
        data={dataDeleteWarningModal}
        setData={setDataDeleteWarningModal}
        fetchListProduct={fetchListProductWithPaginate}
      />
    </div>
  );
};

export default ListProduct;
