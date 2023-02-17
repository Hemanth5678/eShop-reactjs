import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { FaBars } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { publicRoutes } from '~/routes/routes';
import { removeDataUserLogout } from '~/redux/slice/userSlice';

const Navbar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  useEffect(() => {
    const currentLocation = location.pathname.slice(location.pathname.lastIndexOf('/') + 1, location.pathname.length);
    if (currentLocation === 'admin' || currentLocation === 'dashboard') {
      setTitle('Dashboard');
    }
    if (currentLocation === 'manage-order') {
      setTitle('Manage Order');
    }
    if (currentLocation === 'manage-product') {
      setTitle('Manage Product');
    }
    if (currentLocation === 'manage-category') {
      setTitle('Manage Category');
    }
    if (currentLocation === 'manage-size') {
      setTitle('Manage Size');
    }
    if (currentLocation === 'manage-color') {
      setTitle('Manage Color');
    }
    if (currentLocation === 'manage-user') {
      setTitle('Manage User');
    }
    if (currentLocation === 'my-account') {
      setTitle('My Account');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(removeDataUserLogout());
    navigate(publicRoutes.home);
    toast.success('Logout successfully');
  };

  return (
    <nav className="relative w-full flex flex-wrap items-center justify-between bg-gray-100 text-gray-500 shadow h-[72px]">
      <div className="w-full flex flex-wrap items-center justify-between px-6">
        <div className="flex flex-grow items-center">
          <ul className="flex items-center list-style-none">
            <li className="flex items-center">
              <button
                className="text-xl p-2 text-gray-500 hover:text-gray-700"
                onClick={() => setCollapsed(!collapsed)}
              >
                <FaBars />
              </button>
            </li>
          </ul>
          <div className="title cursor-default ml-6 text-xl text-black font-bold tracking-wider">{title}</div>
        </div>
        <div className="flex items-center relative">
          <button className="text-gray-500 hover:text-gray-700" onClick={() => handleLogout()}>
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
