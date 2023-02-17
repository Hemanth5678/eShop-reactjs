import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { fetchUserLoginSuccess } from '~/redux/slice/userSlice';

import { BreadCrumb } from '../../components';
import { adminRoutes, privateRoutes, publicRoutes } from '~/routes/routes';
import { postLogin } from '~/services/authApiService';
import Validation from '~/utils/validation';

import { toast } from 'react-toastify';
// import { AiOutlineGoogle } from 'react-icons/ai';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [account, setAccount] = useState({
    email: '',
    password: '',
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const handleChangeInput = (event) => {
    setAccount({
      ...account,
      [event.target.name]: event.target.value,
    });
  };

  const handleClearInput = () => {
    setAccount({
      email: '',
      password: '',
    });
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();

    if (!Validation.isValidEmail(account.email)) {
      toast.error('Invalid email');
      return;
    } else if (!Validation.isMinLength(account.password, 6)) {
      toast.error('Password must be at least 6 characters');
      return;
    } else if (!Validation.isMaxLength(account.password, 24)) {
      toast.error('Password must be at most 24 characters');
      return;
    }

    setIsSending(true);
    const response = await postLogin(account.email, account.password);
    if (response && response.code === 0) {
      handleClearInput();
      dispatch(fetchUserLoginSuccess(response.data));
      if (response.data.role === 'ADMIN') {
        navigate(adminRoutes.dashboard);
      } else {
        navigate(publicRoutes.home);
      }
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setIsSending(false);
  };

  return (
    <div className="login">
      <BreadCrumb current="Login an account" />
      <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] px-3 mt-8 mb-5">
        <div className="grid grid-cols-12">
          <div className="log-reg-block col-start-1 col-end-12 lg:col-start-4 lg:col-end-10">
            <h1 className="title">Login account</h1>
            {/* <div className="by-oauth2">
              <button className="google">
                <span className="image">
                  <AiOutlineGoogle />
                </span>
                <span className="name">Google</span>
              </button>
            </div>
            <div className="devider">
              <span>Or</span>
            </div> */}
            <div className="by-account">
              <form className="form" onSubmit={(event) => handleSubmitLogin(event)}>
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    className="form-control"
                    type="email"
                    placeholder="Enter email address"
                    value={account.email}
                    onChange={(event) => handleChangeInput(event)}
                  />
                  <p className="form-text"></p>
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    Password <span>*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    className="form-control"
                    type="password"
                    placeholder="Enter password"
                    value={account.password}
                    onChange={(event) => handleChangeInput(event)}
                  />
                  <p className="form-text"></p>
                </div>
                <div>
                  <Link
                    to={privateRoutes.recoverPassword}
                    state={{ from: location }}
                    replace
                    className="text-sm font-medium text-[#06b2eb] hover:text-black"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="form-action">
                  <button disabled={isSending}>Login</button>
                </div>
              </form>
            </div>
            <div className="policy">
              Our website is committed to privacy and will <br /> never post or share information without
              your consent.
            </div>
            <div className="other-action">
              Don't have an account? Register{' '}
              <Link to={privateRoutes.register} state={{ from: location }}>
                here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
