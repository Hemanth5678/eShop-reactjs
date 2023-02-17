import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useImmer } from 'use-immer';

import { BreadCrumb } from '../../components';
import { privateRoutes } from '~/routes/routes';

import Validation from '~/utils/validation';
import { toast } from 'react-toastify';
import { postRegisterNewAccount } from '~/services/authApiService';

const Register = () => {
  const initialState = {
    firstName: {
      value: '',
      message: '',
    },
    lastName: {
      value: '',
      message: '',
    },
    phone: {
      value: '',
      message: '',
    },
    email: {
      value: '',
      message: '',
    },
    password: {
      value: '',
      message: '',
    },
  };
  const navigate = useNavigate();
  const [account, setAccount] = useImmer({ ...initialState });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    document.title = 'Register';
  }, []);

  const onBlurHandler = (event) => {
    switch (event.target.name) {
      case 'firstName':
        if (Validation.isEmpty(account.firstName.value)) {
          setAccount((draft) => {
            draft.firstName.message = "Can't be left blank";
          });
        }
        break;
      case 'lastName':
        if (Validation.isEmpty(account.lastName.value)) {
          setAccount((draft) => {
            draft.lastName.message = "Can't be left blank";
          });
        }
        break;
      case 'phone':
        if (!Validation.isValidPhone(account.phone.value)) {
          setAccount((draft) => {
            draft.phone.message = 'Invalid phone number format';
          });
        }
        break;
      case 'email':
        if (!Validation.isValidEmail(account.email.value)) {
          setAccount((draft) => {
            draft.email.message = 'Invalid email format';
          });
        }
        break;
      case 'password':
        if (!Validation.isInRange(account.password.value, 6, 24)) {
          setAccount((draft) => {
            draft.password.message = 'Password must be between 6 and 24 characters';
          });
        }
        break;
      default:
    }
  };

  const onChangeHandler = (event) => {
    setAccount((draft) => {
      draft[event.target.name].value = event.target.value;
      draft[event.target.name].message = '';
    });
  };

  const validationAllForm = () => {
    let isAllValid = true;
    if (Validation.isEmpty(account.firstName.value)) {
      setAccount((draft) => {
        draft.firstName.message = "Can't be left blank";
      });
      isAllValid = false;
    }
    if (Validation.isEmpty(account.lastName.value)) {
      setAccount((draft) => {
        draft.lastName.message = "Can't be left blank";
      });
      isAllValid = false;
    }
    if (!Validation.isValidPhone(account.phone.value)) {
      setAccount((draft) => {
        draft.phone.message = 'Invalid phone number format';
      });
      isAllValid = false;
    }
    if (!Validation.isValidEmail(account.email.value)) {
      setAccount((draft) => {
        draft.email.message = 'Invalid email format';
      });
      isAllValid = false;
    }
    if (!Validation.isInRange(account.password.value, 6, 24)) {
      setAccount((draft) => {
        draft.password.message = 'Password must be between 6 and 24 characters';
      });
      isAllValid = false;
    }
    return isAllValid;
  };

  const submitRegisterHandler = async (event) => {
    event.preventDefault();
    if (!validationAllForm()) {
      toast.error('Please correct all error fields before registering');
    } else {
      const payload = {
        firstName: account.firstName.value,
        lastName: account.lastName.value,
        phone: account.phone.value,
        email: account.email.value,
        password: account.password.value,
      };

      setIsSending(true);
      const response = await postRegisterNewAccount(payload);
      if (response && +response.code === 0) {
        navigate(privateRoutes.login);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      setIsSending(false);
    }
  };

  return (
    <div className="register">
      <BreadCrumb current="Register an account" />
      <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] px-3 mt-8 mb-5">
        <div className="grid grid-cols-12">
          <div className="log-reg-block col-start-1 col-end-12 lg:col-start-4 lg:col-end-10">
            <h1 className="title">Register an account</h1>
            <div className="by-account">
              <form className="form" onSubmit={(event) => submitRegisterHandler(event)}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="first-name">
                      First name <span>*</span>
                    </label>
                    <input
                      id="first-name"
                      className={classNames('form-control', {
                        error: account.firstName.message,
                      })}
                      type="text"
                      placeholder="Enter first name"
                      name="firstName"
                      value={account.firstName.value}
                      onChange={(event) => onChangeHandler(event)}
                      onBlur={(event) => onBlurHandler(event)}
                    />
                    <p className="form-text">{account.firstName.message}</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="last-name">
                      Last name <span>*</span>
                    </label>
                    <input
                      id="last-name"
                      className={classNames('form-control', {
                        error: account.lastName.message,
                      })}
                      type="text"
                      placeholder="Enter last name"
                      name="lastName"
                      value={account.lastName.value}
                      onChange={(event) => onChangeHandler(event)}
                      onBlur={(event) => onBlurHandler(event)}
                    />
                    <p className="form-text">{account.lastName.message}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span>*</span>
                  </label>
                  <input
                    id="email"
                    className={classNames('form-control', {
                      error: account.email.message,
                    })}
                    type="email"
                    placeholder="Enter email address"
                    name="email"
                    value={account.email.value}
                    onChange={(event) => onChangeHandler(event)}
                    onBlur={(event) => onBlurHandler(event)}
                  />
                  <p className="form-text">{account.email.message}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">
                    Phone <span>*</span>
                  </label>
                  <input
                    id="phone"
                    className={classNames('form-control', {
                      error: account.phone.message,
                    })}
                    type="text"
                    placeholder="Enter phone number"
                    name="phone"
                    value={account.phone.value}
                    onChange={(event) => onChangeHandler(event)}
                    onBlur={(event) => onBlurHandler(event)}
                  />
                  <p className="form-text">{account.phone.message}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    Password <span>*</span>
                  </label>
                  <input
                    id="password"
                    className={classNames('form-control', {
                      error: account.password.message,
                    })}
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={account.password.value}
                    onChange={(event) => onChangeHandler(event)}
                    onBlur={(event) => onBlurHandler(event)}
                  />
                  <p className="form-text">{account.password.message}</p>
                </div>
                <div className="form-action">
                  <button disabled={isSending}>Create an account</button>
                </div>
              </form>
            </div>
            <div className="policy">
             We are committed to privacy and will <br /> never post or share information without
              your consent.
            </div>
            <div className="other-action">
              Already have an account? Login <Link to={privateRoutes.login}>here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
