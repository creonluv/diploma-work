import { useEffect, useState } from "react";
import "./OrdersPage.scss";
import { getOrders } from "../../api/orderGig";
import { Order } from "../../types/Order";

import message from "../../assets/img/icons/message.png";
import { Loader } from "../../components/loader";
import { Link } from "react-router-dom";
import { getMessages } from "../../api/messages";
import { Conversation } from "../../types/Messages";

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[] | undefined>();
  const [messages, setMessages] = useState<Conversation[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        setLoading(true);
        const orders = await getOrders();
        setOrders(orders);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    makeRequest();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await getMessages();

        setMessages(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const findIdOfChat = (id: string) => {
    return messages?.find((message) => message.buyerId._id === id);
  };

  console.log(messages);
  console.log(orders);

  return (
    <section className="orders">
      <div className="orders__container">
        <div className="orders__top">
          <h2 className="orders__title">Orders</h2>
        </div>

        <div className="orders__body">
          {loading ? (
            <Loader />
          ) : orders && orders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
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
                      <Link
                        to={`http://localhost:5173/message/${
                          findIdOfChat(order.sellerId)?._id
                        }`}
                      >
                        <img className="message" src={message} alt="" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-orders">No orders found</p>
          )}
        </div>
      </div>
    </section>
  );
};
