import { useEffect, useState } from "react";
import "./OrdersPage.scss";
import { getOrders } from "../../api/orderGig";
import { Order } from "../../types/Order";

import message from "../../assets/img/icons/message.png";

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[] | undefined>();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const orders = await getOrders();

        setOrders(orders);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, []);

  console.log(orders);

  return (
    <section className="orders">
      <div className="orders__container">
        <div className="orders__top">
          <h2 className="orders__title">Orders</h2>
        </div>

        <div className="orders__body">
          <table>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Contact</th>
            </tr>

            {orders?.map((order) => (
              <tr key={order._id}>
                <td>
                  <img
                    className="image"
                    src={`http://localhost:8800/api/${order.img}`}
                    alt=""
                  />
                </td>
                <td>{order.title}</td>
                <td>{order.price}</td>
                <td>
                  <img
                    className="message"
                    src={message}
                    alt=""
                    // onClick={() => handleContact(order)}
                  />
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
};
