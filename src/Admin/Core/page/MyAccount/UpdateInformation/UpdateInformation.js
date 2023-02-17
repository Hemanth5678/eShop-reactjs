import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import { updateInformationSlices } from '~/redux/slice/userSlice';
import { putUpdateUserInformation } from '~/services/client/userService';

import Validation from '~/utils/validation';

const UpdateInformation = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.user.account);

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
      } else {
        toast.error(response.message);
      }
    }
  };
  return (
    <div className="container">
      <div className="px-6 pt-6 h-[calc(100vh-129px)] overflow-y-auto">
        <div className="body">
          <div className="grid grid-cols-4">
            <div className="col-start-2 col-end-4">
              <div className="border p-6 rounded-md">
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
                <div className="flex flex-col items-center justify-center mx-4 px-4 py-2 space-x-2 rounded-b border-t border-gray-200">
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
        </div>
      </div>
    </div>
  );
};

export default UpdateInformation;
