import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { adminRoutes } from './routes';

const ClientPrivateRoute = ({ children }) => {
  const account = useSelector((state) => state.user.account);

  if (account.role.toLocaleLowerCase() === 'admin') {
    return <Navigate to={adminRoutes.dashboard} />;
  }

  return <>{children}</>;
};

export default ClientPrivateRoute;
