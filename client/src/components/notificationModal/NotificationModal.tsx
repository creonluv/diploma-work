import { useState, ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import notification from "../../assets/img/icons/Notification.svg";
import { formatDistanceToNow } from "date-fns";
import { useWindowSizeContext } from "../../context/WindowSizeContext";

import "../authModal/AuthModal.scss";
import "./NotificationModal.scss";
import { getNotifications } from "../../api/notification";
import { INotification } from "../../types/Notifications";

const DEFAULT_SIZE = 320;
const OFFSET_INLINE = 32;

interface NotificationsListProps {
  notificationsSocket: any;
}

export const NotificationModal: React.FC<NotificationsListProps> = ({
  notificationsSocket,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { width } = useWindowSizeContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();

        if (!response) {
          throw new Error("Failed to fetch notifications");
        }

        setNotifications(response);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [notificationsSocket]);

  const closeModal = () => setIsModalOpen(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const ModalOrContent: React.FC<{ children: ReactNode }> = ({ children }) => {
    if (width < 768) {
      return (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          shouldCloseOnOverlayClick={true}
          style={{
            overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 },
            content: {
              color: "black",
              margin: "auto",
              padding: "16px",
              height: "min-content",
              width: Math.min(width - OFFSET_INLINE, DEFAULT_SIZE),
              maxHeight: "min-content",
              inset: "16px",
            },
          }}
        >
          {children}
        </Modal>
      );
    }

    if (isModalOpen) {
      return <>{children}</>;
    }

    return null;
  };

  return (
    <>
      <button className="header__icon" onClick={toggleModal}>
        <img src={notification} alt="account" />
      </button>
      <ModalOrContent>
        <div className={`list ${isModalOpen ? "" : "_hidden"}`}>
          {/* {profile?.profileType === "freelancer" && (
            <>
              <Link className="list__item" to="gigs/add" onClick={closeModal}>
                Add new gig
              </Link>
              <Link
                to="/gigs/by-user"
                className="list__item"
                onClick={closeModal}
              >
                All my gigs
              </Link>
              <Link className="list__item" to="/orders" onClick={closeModal}>
                My gig orders
              </Link>
            </>
          )} */}

          {notifications.map((notification) => (
            <div className="notification" key={notification._id}>
              <div className="notification__info">
                <img
                  className="notification__avatar"
                  src={`http://localhost:8800/api${notification.sellerId.profileImage}`}
                  alt=""
                />
                <h5 className="notification__message">
                  {notification.message}
                </h5>
              </div>

              <Link
                to={`jobs/${notification.jobId?._id}`}
                className="notification__desc"
                onClick={closeModal}
              >
                {notification.jobId?.title}
              </Link>

              <span className="notification__date text-muted">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          ))}
        </div>
      </ModalOrContent>
    </>
  );
};
