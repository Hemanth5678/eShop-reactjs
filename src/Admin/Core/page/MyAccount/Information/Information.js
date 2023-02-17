import { useSelector } from 'react-redux';

const Information = () => {
  const account = useSelector((state) => state.user.account);

  return (
    <div className="container">
      <div className="px-6 pt-6 h-[calc(100vh-129px)] overflow-y-auto">
        <div className="body">
          <div className="grid grid-cols-4">
            <div className="col-start-2 col-end-4">
              <div className="border p-6 rounded-md">
                <div className="mb-4 font-medium">
                  Full name: <span className="font-normal">{`${account?.firstName} ${account?.lastName}`}</span>
                </div>
                <div className="mb-4 font-medium">
                  Email: <span className="font-normal">{account?.email}</span>
                </div>
                <div className="mb-4 font-medium">
                  Phone number: <span className="font-normal">{account?.phone}</span>
                </div>
                <div className="font-medium">
                  Address: <span className="font-normal">{account?.address ? account.address : 'N/a'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
