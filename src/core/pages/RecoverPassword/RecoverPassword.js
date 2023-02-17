import { Link, useLocation } from 'react-router-dom';

import { BreadCrumb } from '../../components';

const RecoverPassword = () => {
  const { state } = useLocation();

  return (
    <div className="recover-password">
      <BreadCrumb current="Recover password" />
      <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] px-3 mt-8 mb-5">
        <div className="grid grid-cols-12">
          <div className="log-reg-block col-start-1 col-end-12 lg:col-start-4 lg:col-end-10">
            <h1 className="title">
              <span>Recover password</span>
              <p className="text-sm font-normal lowercase">
                <span className="uppercase">F</span>orgot your password? <span className="uppercase">E</span>nter your
                email address to retrieve your password via email.
              </p>
            </h1>
            <div className="by-account">
              <form className="form">
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span>*</span>
                  </label>
                  <input id="email" className="form-control" type="email" placeholder="Enter email address" />
                  <p className="form-text"></p>
                </div>
                <div className="form-action">
                  <button>Recover password</button>
                </div>
              </form>
            </div>
            <div className="policy">
               we are committed to privacy and will <br /> never post or share information without
              your consent.
            </div>
            <div className="other-action">
              Return <Link to={state?.from?.pathname}>here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
