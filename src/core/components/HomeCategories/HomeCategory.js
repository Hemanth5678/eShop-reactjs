import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './HomeCategory.module.scss';

import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

import { publicRoutes } from '~/routes/routes';
import { useEffect, useState } from 'react';
import { getListCategories } from '~/services/client/categoryService';
import gradient1 from '~/assets/images/category/gradient3.jpg';

const cx = classNames.bind(styles);

const HomeCategory = () => {
    const navigate = useNavigate();

  const navCollections = {
    title: 'Products',
    path: `${publicRoutes.collection}/all`,
  };

  const [listCategories, setListCategories] = useState([]);

  useEffect(() => {
    fetchListCategories();
  }, []);

  const fetchListCategories = async () => {
    const response = await getListCategories();
    if (response && +response.code === 0) {
      setListCategories(response?.data?.categories);
    }
  };

  return (
        
        <div className="grid grid-cols-1 md:grid-cols-4 grid-flow-row gap-3">


                <Link className={cx('head-text')} to={navCollections.path}>
                    <img  className="h-[200px] md:h-[200px] lg:h-[184px]"   src={gradient1}  alt="All"/>
                    <div className={cx('center__text')}>
                    <h3> ALL PRODUCTS</h3>
                </div>
                </Link>

            {listCategories &&
              listCategories.length > 0 &&
              listCategories.map((category, index) => (
               
                  <Link
                    className={cx('head-text')}
                    to={`${publicRoutes.collection}/${String(category.name).replace(/ /g, '-').toLowerCase()}`}
                  >
                    <img  className="h-[200px] md:h-[200px] lg:h-[184px]"   src={gradient1}  alt="All"/>
                    <div className={cx('center__text')}>
                    {String(category.name).toUpperCase()}
                    </div>
                    
                  </Link>
              ))}


        </div>


  );
};

export default HomeCategory;
