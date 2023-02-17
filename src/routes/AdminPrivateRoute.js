import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { publicRoutes } from './routes';

const AdminPrivateRoute = ({ children }) => {
  const account = useSelector((state) => state.user.account);

  if (account.role.toLocaleLowerCase() === 'admin') {
    return <>{children}</>;
  } else {
    return <Navigate to={publicRoutes.home} />;
  }
};

export default AdminPrivateRoute;
