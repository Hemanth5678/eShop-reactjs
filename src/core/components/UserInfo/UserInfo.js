import { useState } from 'react';
import { useSelector } from 'react-redux';
import UpdateUserInformationModal from '../UpdateUserInformationModal/UpdateUserInformationModal';

const UserInfo = () => {
  const account = useSelector((state) => state.user.account);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  return (
    <div className="user-infor">
      <div className="title">
        <h2 className="text-xl uppercase mb-7">Account information</h2>
      </div>
      <div className="content">
        <div className="mb-4 font-bold">
          First name: <span className="font-normal">{account.firstName}</span>
        </div>
        <div className="mb-4 font-bold">
          Last name: <span className="font-normal">{account.lastName}</span>
        </div>
        <div className="mb-4 font-bold">
          Email: <span className="font-normal">{account.email}</span>
        </div>
        <div className="mb-4 font-bold">
          Phone number: <span className="font-normal">{account.phone}</span>
        </div>
        <div className="mb-4 font-bold">
          Address: <span className="font-normal">{account.address ? account.address : 'N/a'}</span>
        </div>
        <div className="form mt-6 mb-4">
          <div className="form-action max-w-[300px]">
            <button onClick={() => setShowModalUpdate(true)}>Update account</button>
          </div>
        </div>
      </div>
      <UpdateUserInformationModal show={showModalUpdate} setShow={setShowModalUpdate} account={account} />
    </div>
  );
};

export default UserInfo;
