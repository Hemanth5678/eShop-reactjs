import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useFetcher, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import styles from './Checkout.module.scss';

import { toast } from 'react-toastify';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
// import { BiUserCircle, BiLogOut } from 'react-icons/bi';

import { publicRoutes } from '~/routes/routes';

import logo from '~/assets/images/logo.png';

import { formatIndianMoney } from '~/utils/format';
import Validation from '~/utils/validation';
import { postCreateNewOrder } from '~/services/client/orderService';

import axios from '~/utils/httpRequest';

const cx = classNames.bind(styles);

var paymentId3 = "";
const Checkout = () => {
  var [amount, setAmount] = useState("");
  const paymentId1 = React.useRef(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const account = useSelector((state) => state.user.account);
  const cart = useSelector((state) => state.cart.cart);
  const [purchaseInfo, setPurchaseInfo] = useState({
    email: account.email ?? '',
    fullName: account.firstName ? `${account.firstName} ${account.lastName}` : '',
    phone: account.phone ?? '',
    address: account.address ?? '',
    note: '',
  });
  const [transportMethod, setTransportMethod] = useState({});
  const [listTransportMethod, setListTransportMethod] = useState([
    {
      id: 1,
      name: 'YB Fast same price',
      value: 'YB_FAST_SAME_PRICE',
      price: 30,
    },
    {
      id: 2,
      name: 'Normal',
      value: 'NORMAL',
      price: 0,
    }
  ]);
  const [paymentMethod, setPaymentMethod] = useState({});
  const [listPaymentMethod, setListPaymentMethod] = useState([

    {
      id: 1,
      name: 'Pay via Razorpay',
      value: 'BANKING',
      content: `<div>scan QR code</div>
                <ul>
                  <li>Upi</b></li>
                  <li>Credit/ debit card<b></b></li>
                </ul>`,
    },
  ]);

  useEffect(() => {
    document.title = 'Checkout';
  }, []);


  useEffect((meow) => {
    paymentId1.current=meow;
    console.log(paymentId1.current)
    }, [])

  if (cart?.items.length === 0) {
    toast.error("You don't have any item in cart.");
    return <Navigate to={publicRoutes.cart} />;
  }

  const totalMoney =
    cart?.items &&
    cart?.items.length > 0 &&
    cart.items.reduce((previous, current) => {
      if (current.product.product.promotion) {
        return previous + current.quantity * current.product.product.discountPrice;
      }
      return previous + current.quantity * current.product.product.price;
    }, 0);
  const totalItems = cart?.items?.reduce((previous, current) => previous + current.quantity, 0);

  const handleChangeInput = (event) => {
    setPurchaseInfo({
      ...purchaseInfo,
      [event.target.name]: event.target.value,
    });
  };

  const handleChooseTransportMethod = (method) => {
    setTransportMethod({
      ...method,
    });
  };

  const handleChangePaymentMethod = (method) => {
    setPaymentMethod({
      ...method,
    });
  };

  const validateDataSubmit = () => {
    if (!purchaseInfo.email) {
      toast.error('Please enter your email address.');
      return false;
    }
    if (!purchaseInfo.fullName) {
      toast.error('Please enter your full name.');
      return false;
    }
    if (!purchaseInfo.phone) {
      toast.error('Please enter your phone number.');
      return false;
    }
    if (!Validation.isValidPhone(purchaseInfo.phone)) {
      toast.error('Invalid phone number.');
      return false;
    }
    if (!purchaseInfo.address) {
      toast.error('Please enter your address.');
      return false;
    }
    if (_.isEmpty(transportMethod)) {
      toast.error('Please chooose transport method.');
      return false;
    }
    if (_.isEmpty(paymentMethod)) {
      toast.error('Please chooose payment method.');
      return false;
    }
    return true;
  };



  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const savePaymentToDb = async (razorpayRes, amount, orderId, status, purchaseInfo) => {

    const payment = {
      // orderId: orderId,
      amount: amount,
      razorpayPaymentId: razorpayRes ? razorpayRes.razorpay_payment_id : null,
      razorpayOrderId:razorpayRes ? razorpayRes.razorpay_order_id : null,
      razorpaySignature:razorpayRes ? razorpayRes.razorpay_signature : null,
      paymentDateTime: "",
      status:status,
      // mobileNumber: purchaseInfo.phone,
      emailId: purchaseInfo.email,
    }

    await axios.post("http://localhost:8080/api/v1/payments/create_payment", payment).then ( response =>
    orderAfterPaymentIsDone(response.data.razorpayOrderId)
    )

  }

  const orderAfterPaymentIsDone= async(razorpayOrderId)=>{
    const payload = {
      code: uuidv4(),
      fullName: purchaseInfo.fullName,
      phone: purchaseInfo.phone,
      address: purchaseInfo.address,
      note: purchaseInfo.note ? purchaseInfo.note : 'none',
      totalPrice: totalMoney,
      deliveryFee: transportMethod.price,
      deliveryMethod: transportMethod.value,
      paymentMethod: paymentMethod.value,
      products:
        cart?.items &&
        cart?.items.length > 0 &&
        cart.items.map((item) => {
          return {
            variantSizeId: item.product.variantSizeId,
            quantity: item.quantity,
            price: item.product.product.promotion ? item.product.product.discountPrice : item.product.product.price,
          };
        }),
        paymentId: razorpayOrderId
    };
    const response =  await postCreateNewOrder(payload);
    if (response && +response.code === 0) {
      navigate(`${publicRoutes.checkoutSuccess}/${response.data.code}`);
      toast.success('Order successfully.');
    } else {
      toast.error(response.message);
    }

  }
  const getOptionsObject = (order) => {
    const options = {
      key: process.env.RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "Paying to Hemanth A V",
      image: "https://www.svgrepo.com/show/261072/rupee.svg",
      description: "For Testing purpose",
      order_id: order.id,
      handler: async (res) => {

        // console.log("razorpay_payment_id = ", res.razorpay_payment_id);
        // console.log("razorpay_order_id = ", res.razorpay_order_id);
        // console.log("razorpay_signature = ", res.razorpay_signature);
        
        savePaymentToDb(res, amount, order.id, "Paid", purchaseInfo);


      },
      prefill: {
        name: name,
        email: purchaseInfo.email,
        contact: purchaseInfo.phone,
      },
      notes: {
        address: "This is test note",
      },
      theme: {
        color: "#3399cc",
      },
    };
    return options;
  };

  const handleCheckoutOrder = async () => {
    if (validateDataSubmit()) {
      console.log(totalMoney);
      amount = transportMethod.price ? transportMethod.price + totalMoney : 0 + totalMoney;
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }
  
      const order = await axios.post("http://localhost:8080/api/v1/payments/create_order", {
        amount: amount,
      });
      const {status} = order;
      console.log(status);
      if (order.status === "created") {
        console.log("Order Created ", order);
        const options = getOptionsObject(order);
  
        const rzp = new window.Razorpay(options);
  
        await rzp.open();
  
        rzp.on("payment.failed", function (response) {
          
          console.log("******* Error Details Start *******");
          console.log(response.error.code);
          console.log(response.error.description);
          console.log(response.error.source);
          console.log(response.error.step);
          console.log(response.error.reason);
          console.log(response.error.metadata.order_id);
          console.log(response.error.metadata.payment_id);
          console.log("******* Error Details End *******");
  
          savePaymentToDb(res, amount, order.id, "Failed", purchaseInfo);

        });

      } else {
        toast.error('Unable to checkout. Please try again later');
      }

    }
  };

  return (
    <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] min-h-screen px-3">
      <div className="h-screen grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div className="main">
            <div className="my-6">
              <Link to={publicRoutes.home}>
                <img className="h-10" src={logo} alt="Ecommerce" title="Ecommerce" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="purchase-information">
                <div className="header flex items-center justify-between mb-3">
                  <span className="text-lg font-bold">Purchase information</span>
                  {/* <Link to={privateRoutes.login} state={{ from: location }} className="flex items-center gap-1">
                    <BiUserCircle />
                    Login
                  </Link>
                  <button className="flex items-center gap-1">
                    <BiLogOut />
                    Logout
                  </button> */}
                </div>
                <div className="relative mb-4">
                  <input
                    disabled
                    type="email"
                    id="floating_email"
                    className={cx(
                      'border border-gray-300 block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white appearance-none focus:ring-0 peer disabled:bg-slate-200',
                    )}
                    placeholder={' '}
                    value={purchaseInfo.email}
                  />
                  <label
                    htmlFor="floating_email"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Email
                  </label>
                  <p className="mt-2 text-xs text-[#ff0000]"></p>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    id="floating_full-name"
                    className={cx(
                      { border: purchaseInfo.fullName },
                      { 'border-gray-300': purchaseInfo.fullName },
                      { 'border-2': !purchaseInfo.fullName },
                      { 'border-[#ff0000]': !purchaseInfo.fullName },
                      'block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white appearance-none focus:ring-0 peer',
                    )}
                    placeholder={' '}
                    name="fullName"
                    value={purchaseInfo.fullName}
                    onChange={(event) => handleChangeInput(event)}
                  />
                  <label
                    htmlFor="floating_full-name"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Full name
                  </label>
                  <p className="mt-2 text-xs text-[#ff0000]"></p>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    id="floating_phone-number"
                    className={cx(
                      { border: purchaseInfo.phone },
                      { 'border-gray-300': purchaseInfo.phone },
                      { 'border-2': !purchaseInfo.phone },
                      { 'border-[#ff0000]': !purchaseInfo.phone },
                      'block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white appearance-none focus:ring-0 peer',
                    )}
                    placeholder={' '}
                    name="phone"
                    value={purchaseInfo.phone}
                    onChange={(event) => handleChangeInput(event)}
                  />
                  <label
                    htmlFor="floating_phone-number"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Phone number
                  </label>
                  <p className="mt-2 text-xs text-[#ff0000]"></p>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    id="floating_address"
                    className={cx(
                      { border: purchaseInfo.address },
                      { 'border-gray-300': purchaseInfo.address },
                      { 'border-2': !purchaseInfo.address },
                      { 'border-[#ff0000]': !purchaseInfo.address },
                      'block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white appearance-none focus:ring-0 peer',
                    )}
                    placeholder={' '}
                    name="address"
                    value={purchaseInfo.address}
                    onChange={(event) => handleChangeInput(event)}
                  />
                  <label
                    htmlFor="floating_address"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Address
                  </label>
                  <p className="mt-2 text-xs text-[#ff0000]"></p>
                </div>
                <div className="relative mb-4">
                  <textarea
                    type="text"
                    id="floating_note"
                    className="block border border-gray-300 rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white appearance-none focus:ring-0 peer"
                    placeholder={' '}
                  ></textarea>
                  <label
                    htmlFor="floating_note"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Note (optional)
                  </label>
                </div>
              </div>
              <div className="transportation-payment">
                <div className="transportation">
                  <div className="header flex items-center justify-between mb-3">
                    <span className="text-lg font-bold">Transportation</span>
                  </div>
                  {listTransportMethod &&
                    listTransportMethod.length > 0 &&
                    listTransportMethod.map((method, index) => (
                      <div
                        key={`transport-method-${method.id}-${index}`}
                        className="flex items-center justify-between border border-gray-300 rounded-md px-2.5 py-4 w-full text-sm text-gray-900 bg-white appearance-none focus:ring-0 peer cursor-pointer"
                        onClick={() => handleChooseTransportMethod(method)}
                      >
                        <div className="wrapper flex items-center gap-2">
                          <div
                            className={cx(
                              { 'bg-black': transportMethod.id === method.id },
                              'relative w-4 h-4 border border-gray-300 rounded-full cursor-pointer',
                            )}
                          >
                            {transportMethod.id === method.id && (
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="cursor-pointer">{method.name}</div>
                        </div>
                        <div className="price">{formatIndianMoney.format(method.price)}</div>
                      </div>
                    ))}
                </div>
                <div className={cx('payment', 'mt-5')}>
                  <div className="header flex items-center justify-between mb-3">
                    <span className="text-lg font-bold">Payment</span>
                  </div>
                  <div className={cx('list-options')}>
                    {listPaymentMethod &&
                      listPaymentMethod.length > 0 &&
                      listPaymentMethod.map((method, index) => (
                        <div
                          key={`payment-method-${method.id}-${index}`}
                          className={cx('option', { active: paymentMethod.id === method.id })}
                          onClick={() => handleChangePaymentMethod(method)}
                        >
                          <div className={cx('top')}>
                            <div className={cx('wrapper')}>
                              <div className={cx('point')}></div>
                              <div className={cx('title')}>{method.name}</div>
                            </div>
                            <div className={cx('image')}>
                              <img src={method.image} alt="Cash" />
                            </div>
                          </div>
                          <div className={cx('bottom')} dangerouslySetInnerHTML={{ __html: method.content }} />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer border-t py-4 flex flex-col items-end">
            <div className="privacy flex gap-3">
              <button>Refund Policy</button>
              <button>Privacy Policy</button>
              <button>Terms of use</button>
            </div>
            <div className="copyright my-3 text-[#737373]">&#169; 2022 E-shop</div>
          </div>
        </div>
        <div className="lg:col-span-1 bg-[#fafafa] border-l">
          <div className="sidebar">
            <div className="header pt-5 pb-5 px-7 border-b">
              <h2 className="title text-lg font-bold">Order ({totalItems} products)</h2>
            </div>
            <div className="content pt-5 pb-16 px-7">
              <div className="list-items mb-4 min-h-[90px] max-h-[calc(100vh-480px)] overflow-y-auto">
                {cart?.items &&
                  cart?.items.length > 0 &&
                  cart?.items.map((item, index) => (
                    <div key={`checkout-product-${index}`} className="product">
                      <div className="flex items-center text-sm mt-2 mb-4">
                        <div className="image relative w-[50px] h-[50px] border rounded-lg">
                          <img
                            src={item?.product?.product.primaryImageUrl}
                            alt={item?.product?.product.name}
                            title={item?.product?.product.name}
                            className="border rounded-lg"
                          />
                          <span className="quantity absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black text-white text-center text-xs leading-5">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="description pl-3 flex-1 uppercase">
                          <div className="name">{item?.product?.product?.name}</div>
                          <div className="property text-[#717171]">{`${item?.product?.size?.size} / ${item?.product?.color?.name}`}</div>
                        </div>
                        <div className="price w-fit pl-3 text-[#717171]">
                          {item?.product?.product?.promotion
                            ? formatIndianMoney.format(item?.product?.product?.discountPrice)
                            : formatIndianMoney.format(item?.product?.product?.price)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="order-summary py-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-[#717171]">Item price:</span>
                  <span className="text-[#717171]">{formatIndianMoney.format(totalMoney)}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#717171]">Transporation cost:</span>
                  <span className="text-[#717171]">
                    {transportMethod.price ? formatIndianMoney.format(transportMethod.price) : '-'}
                  </span>
                </div>
                <div className="amount flex items-center justify-between border-t pt-4 mt-4">
                  <span className="text-lg font-medium text-[#717171]">Total:</span>
                  <span className="text-xl font-semibold ">
                    {formatIndianMoney.format(
                      transportMethod.price ? transportMethod.price + totalMoney : 0 + totalMoney,
                    )
                    }
                    
                  </span>
                </div>
              </div>
              <div className="action flex items-center justify-between">
                <Link to={publicRoutes.cart} className="flex items-center hover:underline">
                  <MdOutlineKeyboardArrowLeft className="text-2xl" /> Back to cart
                </Link>
                <button
                  className="py-3 px-6 rounded-md bg-black text-white uppercase"
                  onClick={() => handleCheckoutOrder()}
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
