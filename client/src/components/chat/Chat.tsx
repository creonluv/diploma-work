import React, { useEffect, useState } from "react";
import { User } from "../../types/User";
import { getUser } from "../../api/user";
import { MessageChat, NewMessage } from "../../types/Messages";
import {
  createMessage,
  getMessagesChat,
  markAsReadMessage,
} from "../../api/messages";

import "./Chat.scss";

interface ChatProps {
  chatId: string | null;
}

export const Chat: React.FC<ChatProps> = ({ chatId }) => {
  console.log(chatId);

  const [user, setUser] = useState<User | undefined>();
  const [messages, setMessages] = useState<MessageChat[] | undefined>();
  const [message, setMessage] = useState("");

  const storedUserId = localStorage.getItem("userId");

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
    if (chatId) {
      fetchMessages();
      markAsRead();
    }
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const messages = await getMessagesChat(chatId);
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markAsRead = async () => {
    try {
      await markAsReadMessage(chatId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const lastReadMessageId = messages
    ?.filter((m) => m.userId._id === user?._id && m.isRead)
    .pop()?._id;

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
    <div className="chatComponent">
      <div className="chatComponent__body">
        <div className="chatComponent__wrapper">
          <div className="chatComponent__messages">
            {messages?.map((m) => (
              <div
                className={
                  m.userId._id === user?._id
                    ? "owner messageChat"
                    : "messageChat"
                }
                key={m._id}
              >
                <div className="messageChat__info">
                  <span className="messageChat__time">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {m.userId._id === user?._id &&
                    m._id === lastReadMessageId && (
                      <span className="messageChat__read">✔✔</span>
                    )}
                </div>

                <div className="messageChat__content">
                  <img
                    src={`http://localhost:8800/api${m?.userId.profileImage}`}
                    alt=""
                  />
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="chatComponent__line" />

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
  );
};
