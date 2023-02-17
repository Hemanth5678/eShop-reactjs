import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateInformationSlices } from '~/redux/slice/userSlice';

import { putUpdateUserInformation } from '~/services/client/userService';
import Validation from '~/utils/validation';

const UpdateUserInformationModal = ({ show, setShow, account }) => {
  const dispatch = useDispatch();
  const [updateAccount, setUpdateAccount] = useState({
    firstName: account.firstName ? account.firstName : '',
    lastName: account.lastName ? account.lastName : '',
    phone: account.phone ? account.phone : '',
    address: account.address ? account.address : '',
  });

  const validDate = () => {
    if (Validation.isEmpty(updateAccount.firstName)) {
      toast.error('First name is required');
      return false;
    }
    if (Validation.isEmpty(updateAccount.lastName)) {
      toast.error('Last name is required');
      return false;
    }
    if (Validation.isEmpty(updateAccount.phone)) {
      toast.error('Phone number is required');
      return false;
    }
    if (!Validation.isValidPhone(updateAccount.phone)) {
      toast.error('Invalid format phone number');
      return false;
    }
    if (Validation.isEmpty(updateAccount.address)) {
      toast.error('Address is required');
      return false;
    }
    return true;
  };

  const handleClickUpdate = async () => {
    const isAllValid = validDate();
    if (isAllValid) {
      const response = await putUpdateUserInformation(
        account.id,
        updateAccount.firstName.trim(),
        updateAccount.lastName.trim(),
        updateAccount.phone.trim(),
        updateAccount.address.trim(),
      );
      if (response && +response.code === 0) {
        dispatch(updateInformationSlices(response?.data));
        toast.success('Update information successfully.');
        setShow(false);
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
        'update-user-information-modal',
        'bg-slate-900/[0.5] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 w-full md:inset-0 md:h-full justify-center items-center',
      )}
    >
      <div className="relative p-4 w-full max-w-2xl h-auto">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex justify-between items-start px-4 py-3 rounded-t border-b">
            <h3 className="text-xl font-semibold text-gray-900">Update information</h3>
            <button
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => setShow(false)}
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
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="px-4 py-2 flex flex-col">
            <div className="mb-4">
              <label htmlFor="update-first-name" className="block mb-2 text-base font-medium text-gray-900">
                First name: (*)
              </label>
              <input
                type="text"
                id="update-first-name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter first name"
                required
                name="firstName"
                value={updateAccount.firstName}
                onChange={(event) =>
                  setUpdateAccount({
                    ...updateAccount,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="update-last-name" className="block mb-2 text-base font-medium text-gray-900">
                Last name: (*)
              </label>
              <input
                type="text"
                id="update-last-name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter first name"
                required
                name="lastName"
                value={updateAccount.lastName}
                onChange={(event) =>
                  setUpdateAccount({
                    ...updateAccount,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="update-phone" className="block mb-2 text-base font-medium text-gray-900">
                Phone number: (*)
              </label>
              <input
                type="text"
                id="update-phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter phone number"
                required
                name="phone"
                value={updateAccount.phone}
                onChange={(event) =>
                  setUpdateAccount({
                    ...updateAccount,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="update-address" className="block mb-2 text-base font-medium text-gray-900">
                Address: (*)
              </label>
              <input
                type="text"
                id="update-address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter your address"
                required
                name="address"
                value={updateAccount.address}
                onChange={(event) =>
                  setUpdateAccount({
                    ...updateAccount,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center px-4 py-2 space-x-2 rounded-b border-t border-gray-200">
            <button
              className="w-1/2 my-2 mb-2 font-medium text-white bg-black py-3"
              onClick={() => handleClickUpdate()}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

UpdateUserInformationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default UpdateUserInformationModal;
