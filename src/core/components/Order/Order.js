import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { getAllOrderOfUser } from '~/services/client/orderService';
import { formatIndianMoney } from '~/utils/format';
import CustomStatus from '../OrderTable/CustomStatus';
import OrderTable from '../OrderTable/OrderTable';

const Order = () => {
  const account = useSelector((state) => state.user.account);

  const columns = [
    {
      Header: 'Order',
      accessor: 'order',
    },
    {
      Header: 'Date',
      accessor: 'date',
    },
    {
      Header: 'Address',
      accessor: 'address',
    },
    {
      Header: 'Order value',
      accessor: 'orderValue',
    },
    {
      Header: 'Payment status',
      accessor: 'paymentStatus',
      Cell: CustomStatus,
    },
    {
      Header: 'Transport status',
      accessor: 'transportStatus',
      Cell: CustomStatus,
    },
  ];
  const [listOrder, setListOrders] = useState([]);

  useEffect(() => {
    fetchListOrdersOfUser();
  }, []);

  const fetchListOrdersOfUser = async () => {
    const response = await getAllOrderOfUser(account.id);
    if (response && +response.code === 0) {
      if (response?.data.orders && response.data.orders.length > 0) {
        setListOrders(
          response.data.orders.map((order) => {
            return {
              order: `WEB${order.id}`,
              date: /\d{4}-\d{2}-\d{2}/.exec(order.orderDate)[0],
              address: order.address,
              orderValue: formatIndianMoney.format(order.totalPrice),
              paymentStatus: order.paymentStatus,
              transportStatus: order.deliveryStatus,
            };
          }),
        );
      }
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="order-detail">
      <div className="title">
        <h2 className="text-xl uppercase mb-7">Your order</h2>
      </div>
      <div className="content">
        {listOrder && listOrder.length > 0 && <OrderTable columns={columns} data={listOrder} />}
        {listOrder && listOrder.length === 0 && <div>You don't have any order yet!</div>}
      </div>
    </div>
  );
};

export default Order;
