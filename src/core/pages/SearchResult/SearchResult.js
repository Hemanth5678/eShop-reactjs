import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { BiSearch } from 'react-icons/bi';
import { toast } from 'react-toastify';

import { BreadCrumb, ProductCard } from '../../components';
import { publicRoutes } from '~/routes/routes';
import { getSearchAllProductsByProductNameWithPaginate } from '~/services/client/searchService';
import ReactPaginate from 'react-paginate';

const Search = () => {
  const LIMIT_PRODUCTS = 20;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [keyWord, setKeyWord] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [listProducts, setListProducts] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);

  useEffect(() => {
    document.title = 'Search';
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentPage]);

  useEffect(() => {
    fetchSearchResults(searchParams.get('query'), currentPage - 1);
  }, [searchParams]);

  const handleSubmitSearch = (event) => {
    event.preventDefault();
    if (keyWord.trim().length === 0) {
      toast.error('Please enter a keyword');
    } else {
      navigate(`${publicRoutes.search}?query=${keyWord}`);
    }
  };

  const fetchSearchResults = async (query, page) => {
    const response = await getSearchAllProductsByProductNameWithPaginate(query, page, LIMIT_PRODUCTS);
    if (response && +response?.code === 0) {
      setListProducts(response?.data?.products);
      setPageCount(response?.data?.totalPages);
      setTotalProduct(response?.data?.totalRows);
    }
  };

  const handleClickPaginate = (event) => {
    setCurrentPage(+event.selected + 1);
    fetchSearchResults(searchParams.get('query'), +event.selected);
  };

  return (
    <div className="search-result">
      <BreadCrumb current="Search result" />
      <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] px-3 mt-8 mb-5 pb-16">
        <h3 className="title text-2xl uppercase text-center mb-5">
          {totalProduct === 0 && 'There is no result with this keyword'}
          {totalProduct > 0 && `Have ${totalProduct} right search results.`}
        </h3>
        {/* No result */}
        {totalProduct === 0 && (
          <div className="grid grid-cols-12">
            <form className="form-search col-start-4 col-end-10" onSubmit={(event) => handleSubmitSearch(event)}>
              <label className="block text-[#333f48] mb-[10px] text-center" htmlFor="search-result-input">
                Please enter another keyword
              </label>
              <div className="flex items-center justify-center">
                <input
                  id="search-result-input"
                  className="flex-1 h-10 px-5 focus:outline-none border"
                  type="text"
                  placeholder="What do you want to search today?"
                  value={keyWord}
                  onChange={(event) => {
                    setKeyWord(event.target.value);
                  }}
                />
                <button className="h-10 px-5 bg-black text-white">
                  <BiSearch />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Have result */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {totalProduct > 0 &&
            listProducts.length > 0 &&
            listProducts.map((product, index) => (
              <ProductCard
                key={`product-${product?.productId}-${index}`}
                product={product}
                type={String(product?.category?.name).toLowerCase()}
              />
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
    </div>
  );
};

export default Search;
