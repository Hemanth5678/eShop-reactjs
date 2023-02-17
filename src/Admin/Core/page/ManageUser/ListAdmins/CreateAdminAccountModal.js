import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { postCreateNewAdminUser } from '~/services/admin/userService';
import Validation from '~/utils/validation';

const CreateAdminAccountModal = ({ show, setShow, fetchListUser }) => {
  const [account, setAccount] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const resetAccount = () => {
    setAccount({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
  };

  const validDate = () => {
    if (Validation.isEmpty(account.firstName)) {
      toast.error('First name is required');
      return false;
    }
    if (Validation.isEmpty(account.lastName)) {
      toast.error('Last name is required');
      return false;
    }
    if (Validation.isEmpty(account.email)) {
      toast.error('Email is required');
      return false;
    }
    if (!Validation.isValidEmail(account.email)) {
      toast.error('Invalid email address');
      return false;
    }
    if (Validation.isEmpty(account.phone)) {
      toast.error('Phone number is required');
      return false;
    }
    if (!Validation.isValidPhone(account.phone)) {
      toast.error('Invalid format phone number');
      return false;
    }
    if (Validation.isEmpty(account.password)) {
      toast.error('Password is required');
      return false;
    }
    if (!Validation.isInRange(account.password, 6, 24)) {
      toast.error('Password must be between 6 and 24 characters');
      return false;
    }
    if (Validation.isEmpty(account.confirmPassword)) {
      toast.error('Confirm password is required');
      return false;
    }
    if (!Validation.isTheSame(account.password, account.confirmPassword)) {
      toast.error('Confirm password must match password');
      return false;
    }
    return true;
  };

  const handleClickCreateAccount = async () => {
    const isAllValid = validDate();
    if (isAllValid) {
      const response = await postCreateNewAdminUser(
        account.firstName.trim(),
        account.lastName.trim(),
        account.email.trim(),
        account.phone.trim(),
        account.password.trim(),
        account.confirmPassword.trim(),
      );
      if (response && +response.code === 0) {
        resetAccount();
        setShow(false);
        fetchListUser(0);
        toast.success('Create admin account successfully.');
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <div
      className={classNames(
        { flex: show },
        { hidden: !show },
        'create-admin-account-modal',
        'bg-slate-900/[0.5] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 w-full md:inset-0 md:h-full justify-center items-center',
      )}
    >
      <div className="relative p-4 w-full max-w-2xl h-auto">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex justify-between items-start px-4 py-3 rounded-t border-b">
            <h3 className="text-xl font-semibold text-gray-900">Create an admin account</h3>
            <button
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => {
                resetAccount();
                setShow(false);
              }}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="px-4 py-2 flex flex-col">
            <div className="mb-4">
              <label htmlFor="create-first-name" className="block mb-2 text-base font-medium text-gray-900">
                First name: (*)
              </label>
              <input
                type="text"
                id="create-first-name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter first name"
                required
                name="firstName"
                value={account.firstName}
                onChange={(event) =>
                  setAccount({
                    ...account,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="create-last-name" className="block mb-2 text-base font-medium text-gray-900">
                Last name: (*)
              </label>
              <input
                type="text"
                id="create-last-name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter first name"
                required
                name="lastName"
                value={account.lastName}
                onChange={(event) =>
                  setAccount({
                    ...account,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="create-email" className="block mb-2 text-base font-medium text-gray-900">
                Email address: (*)
              </label>
              <input
                type="text"
                id="create-email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter email address"
                required
                name="email"
                value={account.email}
                onChange={(event) =>
                  setAccount({
                    ...account,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="create-phone" className="block mb-2 text-base font-medium text-gray-900">
                Phone number: (*)
              </label>
              <input
                type="text"
                id="create-phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter phone number"
                required
                name="phone"
                value={account.phone}
                onChange={(event) =>
                  setAccount({
                    ...account,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="create-password" className="block mb-2 text-base font-medium text-gray-900">
                Password: (*)
              </label>
              <input
                type="password"
                id="create-password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter password"
                required
                name="password"
                value={account.password}
                onChange={(event) =>
                  setAccount({
                    ...account,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="create-confirm-password" className="block mb-2 text-base font-medium text-gray-900">
                Confirm password: (*)
              </label>
              <input
                type="password"
                id="create-confirm-password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter confirm-password"
                required
                name="confirmPassword"
                value={account.confirmPassword}
                onChange={(event) =>
                  setAccount({
                    ...account,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center px-4 py-2 space-x-2 rounded-b border-t border-gray-200">
            <button
              className="w-1/2 my-2 mb-2 font-medium text-white bg-black py-3"
              onClick={() => handleClickCreateAccount()}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CreateAdminAccountModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default CreateAdminAccountModal;
