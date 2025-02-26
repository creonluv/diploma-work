import { useEffect, useState } from "react";
import "./OrdersPage.scss";
import { getOrders } from "../../api/orderGig";
import { Order } from "../../types/Order";

import message from "../../assets/img/icons/message.png";
import { Loader } from "../../components/loader";
import { Link } from "react-router-dom";
import { createConversation, getMessages } from "../../api/messages";
import { Conversation } from "../../types/Messages";

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[] | undefined>();
  const [messages, setMessages] = useState<Conversation[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const isSeller = localStorage.getItem("isSeller");
  const userId = localStorage.getItem("userId");
  let isChatExist = false;

  if (!userId) {
    return 0;
  }

  let isSellerBool = false;

  if (isSeller !== null) {
    isSellerBool = isSeller === "true";
  }

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
  }, [loading]);

  const createNewConversation = async (userId1: string, userId2: string) => {
    try {
      setLoading(true);

      const to = userId1 === userId ? userId2 : userId1;

      console.log("to: " + to);

      await createConversation({ to });
    } catch (error) {
      console.log("Error!");
    } finally {
      setLoading(false);
    }
  };

  const findIdOfChat = (userId1: string, userId2: string) => {
    if (!messages) {
      return null;
    }

    const res = messages.find(
      (message) =>
        (message.sellerId?._id === userId1 &&
          message.buyerId?._id === userId2) ||
        (message.sellerId?._id === userId2 && message.buyerId?._id === userId1)
    );

    isChatExist = res !== undefined;

    return res;
  };

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
                  <th>{isSellerBool ? "SellerBuyer" : "Buyer"}</th>
                  <th>Price</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const chatId = findIdOfChat(
                    order.sellerId,
                    order.buyerId
                  )?._id;

                  return (
                    <tr key={order._id}>
                      <td>
                        <img
                          className="image"
                          src={`http://localhost:8800/api/${order.img}`}
                          alt=""
                        />
                      </td>
                      <td>{order.title}</td>
                      <td>
                        {isSellerBool ? order.sellerName : order.buyerName}
                      </td>
                      <td>{order.price}</td>

                      <td>
                        {!isChatExist ? (
                          <button
                            onClick={() =>
                              createNewConversation(
                                order.buyerId,
                                order.sellerId
                              )
                            }
                          >
                            Create Conversation
                          </button>
                        ) : (
                          <Link to={`http://localhost:5173/message/${chatId}`}>
                            <img className="message" src={message} alt="" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
