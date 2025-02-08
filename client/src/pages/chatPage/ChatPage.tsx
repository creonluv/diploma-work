import { useEffect, useState } from "react";
import "./ChatPage.scss";
import { createMessage, getMessagesChat } from "../../api/messages";
import { MessageChat, NewMessage } from "../../types/Messages";
import { useParams } from "react-router-dom";
import { User } from "../../types/User";
import { getUser } from "../../api/user";

export const ChatPage: React.FC = () => {
  const [user, setUser] = useState<User | undefined>();
  const [messages, setMessages] = useState<MessageChat[] | undefined>();
  const [message, setMessage] = useState("");
  const { chatId } = useParams();

  const storedUserId = localStorage.getItem("userId");

  const fetchMessages = async () => {
    try {
      const messages = await getMessagesChat(chatId);
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

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
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: NewMessage = {
      conversationId: chatId,
      desc: message,
    };

    try {
      await createMessage(data);
      await fetchMessages();

      setMessage("");
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <section className="chat">
      <div className="chat__container">
        <div className="chat__body">
          <div className="chat__wrapper">
            <div className="chat__messages">
              {messages?.map((m) => (
                <div
                  className={
                    m.userId._id === user?._id
                      ? "owner messageChat"
                      : "messageChat"
                  }
                  key={m._id}
                >
                  <img
                    src={`http://localhost:8800/api${m?.userId.profileImage}`}
                    alt=""
                  />
                  <p>{m.desc}</p>
                </div>
              ))}
            </div>

            <hr className="chat__line" />

            <form className="write" onSubmit={handleSubmit}>
              <textarea
                placeholder="Write a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="button button_lg button_default" type="submit">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
