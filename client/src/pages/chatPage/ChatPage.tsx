import { useParams } from "react-router-dom";
import { Chat } from "../../components/chat/Chat";

import "./ChatPage.scss";

export const ChatPage: React.FC = () => {
  const { chatId } = useParams();

  const chatIdOrNull = chatId ?? null;

  return (
    <section className="chat">
      <div className="chat__container">
        <Chat chatId={chatIdOrNull} />
      </div>
    </section>
  );
};
