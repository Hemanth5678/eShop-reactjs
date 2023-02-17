import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { putChangePassword } from '~/services/client/userService';
import Validation from '~/utils/validation';

const ChangePassword = () => {
  const account = useSelector((state) => state.user.account);

  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isCallAPI, setIsCallAPI] = useState(false);

  const resetState = () => {
    setPassword({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const formValidation = () => {
    if (Validation.isEmpty(password.oldPassword)) {
      toast.error('Old password is required');
      return false;
    }
    if (Validation.isEmpty(password.newPassword)) {
      toast.error('New password is required');
      return false;
    }
    if (!Validation.isInRange(password.newPassword, 6, 24)) {
      toast.error('New password must be between 6 and 24 characters');
      return false;
    }
    if (Validation.isEmpty(password.confirmPassword)) {
      toast.error('Confirm password is required');
      return false;
    }
    if (!Validation.isTheSame(password.newPassword, password.confirmPassword)) {
      toast.error('Confirm password must match new password');
      return false;
    }
    return true;
  };

  const handleSubmitChangePassword = async () => {
    const isValid = formValidation();
    if (isValid) {
      setIsCallAPI(true);
      const response = await putChangePassword(
        account.id,
        password.oldPassword,
        password.newPassword,
        password.confirmPassword,
      );
      if (response && +response.code === 0) {
        resetState();
        toast.success('Change password successfully.');
      } else {
        toast.error(response.message);
      }
      setIsCallAPI(false);
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
                    <label htmlFor="change-old-password" className="block mb-2 text-base font-medium text-gray-900">
                      Old password: (*)
                    </label>
                    <input
                      type="password"
                      id="change-old-password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter old password"
                      required
                      name="oldPassword"
                      value={password.oldPassword}
                      onChange={(event) =>
                        setPassword({
                          ...password,
                          [event.target.name]: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="change-new-password" className="block mb-2 text-base font-medium text-gray-900">
                      New password: (*)
                    </label>
                    <input
                      type="password"
                      id="change-new-password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter new password"
                      required
                      name="newPassword"
                      value={password.newPassword}
                      onChange={(event) =>
                        setPassword({
                          ...password,
                          [event.target.name]: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="change-confirm-new-password"
                      className="block mb-2 text-base font-medium text-gray-900"
                    >
                      Confirm new password: (*)
                    </label>
                    <input
                      type="password"
                      id="change-confirm-new-password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter confirm new password"
                      required
                      name="confirmPassword"
                      value={password.confirmPassword}
                      onChange={(event) =>
                        setPassword({
                          ...password,
                          [event.target.name]: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center mx-4 px-4 py-2 space-x-2 rounded-b border-t border-gray-200">
                  <button
                    className="w-1/2 my-2 mb-2 font-medium text-white bg-black py-3"
                    onClick={() => handleSubmitChangePassword()}
                    disabled={isCallAPI}
                  >
                    Change password
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

export default ChangePassword;
