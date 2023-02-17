import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import styles from './MiniAccount.module.scss';

import { AiOutlineUser } from 'react-icons/ai';
import { privateRoutes, publicRoutes } from '~/routes/routes';
import { removeDataUserLogout } from '~/redux/slice/userSlice';
import { toast } from 'react-toastify';
import { clearAllProductInCart } from '~/redux/slice/cartSlice';

const cx = classNames.bind(styles);

const MiniAccount = () => {
  const { isAuthenticated, account } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(removeDataUserLogout());
    dispatch(clearAllProductInCart());
    navigate(publicRoutes.home);
    toast.success('Logout successfully');
  };

  return (
    <div className={cx('mini-account', 'ml-6 hidden lg:block')}>
      <AiOutlineUser className="text-3xl cursor-pointer" />
      {isAuthenticated === false && (
        <ul>
          <li>
            <Link to={privateRoutes.login}>Login</Link>
          </li>
          <li>
            <Link to={privateRoutes.register}>Register</Link>
          </li>
        </ul>
      )}
      {isAuthenticated === true && (
        <ul>
          {/* <li>
            <Link to={privateRoutes.account}>Welcome, {account.firstName + ' ' + account.lastName}</Link>
          </li> */}
          <li >
            <Link to={privateRoutes.order}>Your orders</Link>
          </li>
          <li>
            <button onClick={() => handleLogout()}>Logout</button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MiniAccount;
