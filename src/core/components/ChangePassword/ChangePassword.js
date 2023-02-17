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

  const handleSubmitChangePassword = async (event) => {
    event.preventDefault();
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
    <div className="change-password">
      <div className="title">
        <h2 className="text-xl uppercase mb-7">Change password</h2>
      </div>
      <div className="content">
        <p>To ensure security please set a password with at least 8 characters</p>
        <form className="form mt-5" onSubmit={(event) => handleSubmitChangePassword(event)}>
          <div className="form-group">
            <label htmlFor="old-password">
              Old password <span>*</span>
            </label>
            <input
              id="old-password"
              type="password"
              className="form-control"
              placeholder="Enter old password"
              name="oldPassword"
              value={password.oldPassword}
              onChange={(event) =>
                setPassword({
                  ...password,
                  [event.target.name]: event.target.value,
                })
              }
            />
            <p className="form-text"></p>
          </div>
          <div className="form-group">
            <label htmlFor="new-password">
              New password <span>*</span>
            </label>
            <input
              id="new-password"
              type="password"
              className="form-control"
              placeholder="Enter new password"
              name="newPassword"
              value={password.newPassword}
              onChange={(event) =>
                setPassword({
                  ...password,
                  [event.target.name]: event.target.value,
                })
              }
            />
            <p className="form-text"></p>
          </div>
          <div className="form-group">
            <label htmlFor="confirm-new-password">
              Confirm new password <span>*</span>
            </label>
            <input
              id="confirm-new-password"
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              name="confirmPassword"
              value={password.confirmPassword}
              onChange={(event) =>
                setPassword({
                  ...password,
                  [event.target.name]: event.target.value,
                })
              }
            />
            <p className="form-text"></p>
          </div>
          <div className="form-action w-14">
            <button disabled={isCallAPI}>Change password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
