import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { publicRoutes } from './routes';

const LoginRegisterProtectRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const currentPath = location.pathname
    .slice(location.pathname.lastIndexOf('/') + 1, location.pathname.length)
    .toLocaleLowerCase();

  if (isAuthenticated === true && (currentPath === 'login' || currentPath === 'register')) {
    return <Navigate to={publicRoutes.home} />;
  }

  return <>{children}</>;
};

export default LoginRegisterProtectRoute;
