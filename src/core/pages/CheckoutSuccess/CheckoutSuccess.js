import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BiCheck } from 'react-icons/bi';

import logo from '~/assets/images/logo.png';
import { publicRoutes } from '~/routes/routes';
import { getOrderByCode } from '~/services/client/orderService';
import { clearAllProductInCart } from '~/redux/slice/cartSlice';
import { formatIndianMoney } from '~/utils/format';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderCode } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [orderInfor, setOrderInfor] = useState({});

  useEffect(() => {
    document.title = 'Checkout - Thank you';
    fetchCheckoutOrderResult();
  }, []);

  const fetchCheckoutOrderResult = async () => {
    const response = await getOrderByCode(orderCode);
    if (response && +response.code === 0) {
      dispatch(clearAllProductInCart());
      setOrderInfor(response.data);
    } else {
      navigate(publicRoutes.home);
    }
  };

  return (
    <div className="checkout-thankyou bg-[#e6e8ea]">
      <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] min-h-screen px-3">
        <div className="logo pt-7 pb-5">
          <img src={logo} alt="Ecommerce" title="Ecommerce" className="h-10" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="primary">
            <section className="status">
              <div className="flex items-center py-4">
                <div className="w-[72px] h-[72px] flex items-center justify-center border-2 border-[#8ec343] rounded-full">
                  <BiCheck className="text-5xl text-[#8ec343]" />
                </div>
                <div className="ml-3 text-lg font-bold">Thank you for your order</div>
              </div>
            </section>
            <section className="content mb-4">
              <div className="border border-slate-300 py-3 px-4">
                <div className="grid grid-cols-2">
                  <section className="purchase-info">
                    <div className="title">
                      <h1 className="text-xl font-medium">Purchase information</h1>
                    </div>
                    <div className="my-2">{orderInfor.fullName}</div>
                    <div className="my-2">{orderInfor.phone}</div>
                  </section>
                  <section className="delivery-address">
                    <div className="title">
                      <h1 className="text-xl font-medium">Delivery address</h1>
                    </div>
                    <div className="my-2">{orderInfor.address}</div>
                  </section>
                  <section className="payment-method">
                    <div className="title">
                      <h1 className="text-xl font-medium">Payment methods</h1>
                    </div>
                    <div className="my-2">
                      {orderInfor.paymentMethod === 'CASH' ? 'Cash on Delivery (COD)' : 'Banking'}
                    </div>
                  </section>
                  <section className="shipping-method">
                    <div className="title">
                      <h1 className="text-xl font-medium">Shipping method</h1>
                    </div>
                    <div className="my-2">{orderInfor?.deliveryMethod?.replaceAll('_', ' ')}</div>
                  </section>
                </div>
              </div>
            </section>
            <section className="update-orer-infor mb-4">
              <div className="border border-slate-300 py-3 px-4">
                <div className="title">
                  <h1 className="text-xl font-medium">Update order information</h1>
                </div>
                <div className="my-2">You can update your order information via Messenger right here</div>
              </div>
            </section>
            <section className="action">
              <div className="flex items-center justify-end">
                <Link
                  to={`${publicRoutes.collection}/all`}
                  className="text-xl px-5 py-4 bg-black text-white rounded-md"
                >
                  Continue shopping
                </Link>
              </div>
            </section>
          </div>
          <div className="secondary">
            <div className="bg-white border border-slate-300">
              <section className="header">
                <div className="px-3 py-2">
                  Order WEB{orderInfor.id} (
                  {orderInfor.orderDetails &&
                    orderInfor.orderDetails.length > 0 &&
                    orderInfor.orderDetails.reduce((prev, current) => prev + current.quantity, 0)}
                  )
                </div>
              </section>
              <section className="list-items">
                <div className="wrapper border-t border-slate-300 px-3 py-2">
                  {orderInfor.orderDetails &&
                    orderInfor.orderDetails.length > 0 &&
                    orderInfor.orderDetails.map((product, index) => (
                      <div key={`checkout-product-${product.slug}`} className="product">
                        <div className="flex items-center text-sm mt-2 mb-4">
                          <div className="image relative w-[50px] h-[50px] border rounded-lg">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              title={product.name}
                              className="border rounded-lg"
                            />
                            <span className="quantity absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black text-white text-center text-xs leading-5">
                              {product.quantity}
                            </span>
                          </div>
                          <div className="description pl-3 flex-1 uppercase">
                            <div className="name">{product.name}</div>
                            <div className="property text-[#717171]">{`${product.size.size} / ${product.color.name}`}</div>
                          </div>
                          <div className="price w-fit pl-3 text-[#717171]">
                            {formatIndianMoney.format(product.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
              <section className="amount-money">
                <div className="border-t border-slate-300 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#717171]">Item price:</span>
                    <span className="text-[#717171]">
                      {formatIndianMoney.format(
                        orderInfor.orderDetails && orderInfor.orderDetails.length > 0
                          ? orderInfor.orderDetails.reduce(
                              (prev, current) => prev + current.quantity * current.price,
                              0,
                            )
                          : 0,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[#717171]">Transporation cost:</span>
                    <span className="text-[#717171]">{formatIndianMoney.format(orderInfor.deliveryFee)}</span>
                  </div>
                  <div className="amount flex items-center justify-between border-t pt-4 mt-4">
                    <span className="text-lg font-medium text-[#717171]">Total:</span>
                    <span className="text-xl font-semibold ">{formatIndianMoney.format(orderInfor.totalPrice)}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="border-t border-slate-300 mt-4 py-4 flex flex-col items-end">
            <div className="privacy flex gap-3">
              <button>Refund Policy</button>
              <button>Privacy Policy</button>
              <button>Terms of use</button>
            </div>
            <div className="copyright my-3 text-[#737373]">&#169; 2022 E-cart</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
