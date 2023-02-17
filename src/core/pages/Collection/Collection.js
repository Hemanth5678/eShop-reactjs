import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Collection.module.scss';

import { BreadCrumb, ProductCard } from '../../components';
import {
  getAllProductWithPaginateAndSort,
  getAllProductByCategoryNameWithPaginateAndSort,
} from '~/services/client/productService';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { publicRoutes } from '~/routes/routes';

const cx = classNames.bind(styles);

const Collection = () => {
  const LIMIT_PRODUCT = 20;

  const navigate = useNavigate();
  var { type } = useParams();
  console.log(type);
  if(type==undefined)
    type='all';
  const sortTypes = [
    {
      title: 'Name A-Z',
      sortBase: 'name',
      sortType: 'ASC',
    },
    {
      title: 'Name Z-A',
      sortBase: 'name',
      sortType: 'DESC',
    },
    {
      title: 'New product',
      sortBase: 'createdAt',
      sortType: 'DESC',
    },
    {
      title: 'Low to high price',
      sortBase: 'price',
      sortType: 'ASC',
    },
    {
      title: 'High to low price',
      sortBase: 'price',
      sortType: 'DESC',
    },
  ];
  const [currentSort, setCurrentSort] = useState({
    title: '',
    sortBase: '',
    sortType: '',
  });
  const [listProducts, setListProducts] = useState([]);

  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = 'Collection';
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [currentPage]);

  useEffect(() => {
    if (type.toLowerCase() === 'all') {
      fetchAllProductsWithPaginateAndSort(currentPage, currentSort.sortBase, currentSort.sortType);
    } else {
      fetchListProductByCategoryNameWithPaginateAndSort(
        type.toUpperCase(),
        currentPage,
        currentSort.sortBase,
        currentSort.sortType,
      );
    }
  }, [type, currentSort]);

  const fetchAllProductsWithPaginateAndSort = async (page, sortBase, sortType) => {
    const response = await getAllProductWithPaginateAndSort(page - 1, LIMIT_PRODUCT, sortBase, sortType);
    if (response && +response.code === 0) {
      setListProducts(response?.data?.products);
      setPageCount(response?.data?.totalPages);
    } else {
      toast.error(response.message);
    }
  };

  const fetchListProductByCategoryNameWithPaginateAndSort = async (categoryName, page, sortBase, sortType) => {
    const response = await getAllProductByCategoryNameWithPaginateAndSort(
      categoryName,
      page - 1,
      LIMIT_PRODUCT,
      sortBase,
      sortType,
    );
    if (response && +response.code === 0) {
      setListProducts(response?.data?.products);
      setPageCount(response?.data?.totalPages);
    } else {
      navigate(publicRoutes.home);
      toast.error(response.message);
    }
  };

  const handleSortProduct = (type) => {
    setCurrentSort({
      ...type,
    });
  };

  const handleClickPaginate = (event) => {
    setCurrentPage(+event.selected + 1);
    if (type.toLowerCase() === 'all') {
      fetchAllProductsWithPaginateAndSort(+event.selected + 1, currentSort.sortBase, currentSort.sortType);
    } else {
      fetchListProductByCategoryNameWithPaginateAndSort(
        type.toUpperCase(),
        +event.selected + 1,
        currentSort.sortBase,
        currentSort.sortType,
      );
    }
  };

  return (
    <>
      <BreadCrumb current={type} />
      <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] px-3 pb-16">
        <div className={cx('collection')}>
          <div className={cx('main-cate')}>
            <h1 className={cx('category')}>{type}</h1>
          </div>
          <div className={cx('products')}>
            {listProducts && listProducts.length > 0 && (
              <div className={cx('sort-cate')}>
                <h3>Sort by:</h3>
                <ul>
                  {sortTypes.map((sort, index) => (
                    <li key={`sort-type-${sort.title}-${index}`} onClick={() => handleSortProduct(sort)}>
                      <i className={cx({ active: currentSort.title === sort.title })}></i>
                      <span>{sort.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {listProducts &&
                listProducts.length > 0 &&
                listProducts.map((product, index) => (
                  <ProductCard key={`product-card-${product.productId}-${index}`} product={product} type={type} />
                ))}
            </div>
            <div>
              {pageCount > 1 && (
                <ReactPaginate
                  marginPagesDisplayed={3}
                  onPageChange={handleClickPaginate}
                  pageRangeDisplayed={5}
                  pageCount={pageCount}
                  breakLabel="..."
                  nextLabel="»"
                  previousLabel="«"
                  renderOnZeroPageCount={null}
                  pageLinkClassName="h-9 w-9 flex items-center justify-center leading-tight text-gray-500 bg-white hover:border hover:border-gray-700 hover:rounded-sm hover:text-gray-700 select-none"
                  breakLinkClassName="h-9 w-9 flex items-center justify-center leading-tight text-gray-500 bg-white hover:border hover:border-gray-700 hover:rounded-sm hover:text-gray-700 select-none"
                  previousLinkClassName="h-9 w-9 flex items-center justify-center leading-tight text-gray-500 bg-white hover:border hover:border-gray-700 hover:rounded-sm hover:text-gray-700 select-none"
                  nextLinkClassName="h-9 w-9 flex items-center justify-center leading-tight text-gray-500 bg-white hover:border hover:border-gray-700 hover:rounded-sm hover:text-gray-700 select-none"
                  containerClassName="flex justify-center gap-4 mt-6 mb-4"
                  activeLinkClassName="text-black border border-gray-700 rounded-sm"
                  disabledLinkClassName="cursor-no-drop hover:border-white"
                />
              )}
            </div>
          </div>
          {listProducts && listProducts.length === 0 && (
            <div className="text-2xl pt-6 pb-40">This category don't have any product yet.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Collection;
