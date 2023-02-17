import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { publicRoutes } from '~/routes/routes';
import { getOrderWithDetailOfUser } from '~/services/client/orderService';
import { formatIndianMoney } from '~/utils/format';
import CustomProduct from './CustomProduct';
import Table from './Table';

const OrderDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderIdFromPath = location.pathname.slice(
    location.pathname.toLowerCase().indexOf('web') + 3,
    location.pathname.length,
  );
  const columns = [
    {
      Header: 'Product',
      accessor: 'product',
      Cell: CustomProduct,
    },
    {
      Header: 'Price',
      accessor: 'price',
    },
    {
      Header: 'Quantity',
      accessor: 'quantity',
    },
    {
      Header: 'Total',
      accessor: 'total',
    },
  ];
  const [order, setOrder] = useState({});
  const [listProducts, setListProducts] = useState([]);

  const data = [
    {
      product: {
        image:
          'https://bizweb.dktcdn.net/thumb/1024x1024/100/331/067/products/z2300839217494-fdcfe88d8971ac5d8bc50eb7c4788784.jpg?v=1613495212347',
        name: 'VGS LOGO FUTURISTIC TEE',
        size: 'XL',
        color: 'Black',
        code: 'VGS-#123456',
      },
      price: '740.000₫',
      quantity: '1',
      total: '740.000₫',
    },
  ];

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    const response = await getOrderWithDetailOfUser(orderIdFromPath);
    if (response && +response.code === 0) {
      setOrder({
        ...response.data,
      });
      setListProducts(
        response.data.orderDetails.length > 0 &&
          response.data.orderDetails.map((product) => {
            return {
              product: {
                image: product.imageUrl,
                name: product.name,
                size: product.size.size,
                color: product.color.name,
                code: 'none',
                slug: product.slug,
                category: product.category.name.toLowerCase(),
              },
              price: formatIndianMoney.format(product.price),
              quantity: product.quantity,
              total: formatIndianMoney.format(product.price * product.quantity),
            };
          }),
      );
    } else {
      navigate(publicRoutes.home);
      toast.error(response.message);
    }
  };

  return (
    <div className="order-detail">
      <div className="title">
        <div className="block lg:flex justify-between">
          <h2 className="text-xl uppercase mb-5 lg:mb-7">Order details #WEB{orderIdFromPath}</h2>
          <p className="order-date mb-4 lg:mb-0">
            Order date: {order.orderDate && /\d{4}-\d{2}-\d{2}/.exec(order.orderDate)[0]}
          </p>
        </div>
      </div>
      <div className="content">
        <div className="status">
          <div className="flex gap-6">
            <p>
              Payment status:{' '}
              <span
                className={classNames(
                  'font-bold italic',
                  {
                    'text-blue-700': order.paymentStatus === 'PAID',
                  },
                  {
                    'text-yellow-700': order.paymentStatus === 'UNPAID',
                  },

                  {
                    'text-red-700': order.paymentStatus === 'CANCELLED',
                  },
                )}
              >
                {order.paymentStatus}
              </span>
            </p>
            <p>
              Shipping status:{' '}
              <span
                className={classNames(
                  'font-bold italic',
                  {
                    'text-blue-700': order.deliveryStatus === 'DELIVERED',
                  },
                  {
                    'text-yellow-700': order.deliveryStatus === 'UNDELIVERED',
                  },

                  {
                    'text-red-700': order.deliveryStatus === 'CANCELLED',
                  },
                )}
              >
                {order.deliveryStatus}
              </span>
            </p>
          </div>
        </div>
        <div className="infor">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6">
              <div className="address">
                <div className="title">
                  <h3 className="mt-5 mb-2 uppercase">Delivery address</h3>
                </div>
                <div className="border border-slate-300 rounded-md pt-3 px-6 pb-3">
                  <h3 className="name text-base font-bold">{order.fullName}</h3>
                  <p className="text-sm">{order.address}</p>
                  <p className="text-sm">Phone number: {order.phone}</p>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3">
              <div className="payment">
                <div className="title">
                  <h3 className="mt-5 mb-2 uppercase">Payment</h3>
                </div>
                <div className="border border-slate-300 rounded-md pt-3 px-6 pb-3">
                  <p className="text-sm">{order.paymentMethod === 'CASH' ? 'Cash on delivery (COD)' : 'Banking'}</p>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3">
              <div className="note">
                <div className="title">
                  <h3 className="mt-5 mb-2 uppercase">Note</h3>
                </div>
                <div className="border border-slate-300 rounded-md pt-3 px-6 pb-3">
                  <p className="text-sm">{order.note}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-products">
          <div className="mt-4">
            <Table columns={columns} data={listProducts} />
          </div>
        </div>
        <div className="total-order">
          <table className="w-full mt-4 table-fixed">
            <tbody>
              <tr>
                <td className="border border-slate-300 px-2 py-2">Transportation cost</td>
                <td className="border border-slate-300 px-2 py-2">
                  {order.deliveryFee ? formatIndianMoney.format(order.deliveryFee) : 'Loading...'}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-2 py-2">Total money</td>
                <td className="border border-slate-300 px-2 py-2">
                  {order.orderDetails &&
                    order.orderDetails.length > 0 &&
                    formatIndianMoney.format(
                      order.orderDetails.reduce(
                        (prev, current) => prev + current.quantity * current.price,
                        order.deliveryFee,
                      ),
                    )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
