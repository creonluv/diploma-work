import { useEffect, useState } from "react";
import { User } from "../../types/User";
import "./MessagesPage.scss";
import { getUser } from "../../api/user";
import { Conversation } from "../../types/Messages";
import { getMessages, updateMessages } from "../../api/messages";
import { Link } from "react-router-dom";
import moment from "moment";

export const MessagesPage: React.FC = () => {
  const [user, setUser] = useState<User | undefined>();
  const [messages, setMessages] = useState<Conversation[] | undefined>();

  const storedUserId = localStorage.getItem("userId");

  console.log(messages);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(storedUserId);

        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [storedUserId]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const messages = await getMessages();

      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleRead = async (id: string) => {
    const data = {
      id,
    };

    try {
      await updateMessages(id, data);
      await fetchMessages();
    } catch (error) {
      console.error("Error update messages:", error);
    }
  };

  return (
    <section className="messages">
      <div className="messages__container">
        <div className="messages__top">
          <h2 className="messages__title">Messages</h2>
        </div>
        <div className="messages__body">
          <table>
            <thead>
              <tr>
                <th>Interlocutor</th>
                <th>Last Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {messages?.map((c) => (
                <tr
                  className={
                    (user?.isSeller && !c.readBySeller) ||
                    (!user?.isSeller && !c.readByBuyer)
                      ? "active"
                      : undefined
                  }
                  key={c._id}
                >
                  <td>{user?.isSeller ? c.buyerId.email : c.sellerId.email}</td>
                  <td>
                    <Link to={`/messages/${c._id}`} className="link">
                      {c?.lastMessage?.desc.substring(0, 100)}...
                    </Link>
                  </td>
                  <td>{moment(c.updatedAt).fromNow()}</td>
                  <td>
                    {((user?.isSeller && !c.readByBuyer) ||
                      (!user?.isSeller && !c.readBySeller)) && (
                      <button onClick={() => handleRead(c._id)}>
                        Mark as Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
