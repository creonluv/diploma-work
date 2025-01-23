import { useState, ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";

import { logout } from "../../api/auth";

import { useAuthContext } from "../../context/AuthContext";
import { useWindowSizeContext } from "../../context/WindowSizeContext";

import account from "../../assets/img/icons/account.svg";

import "./AuthModal.scss";
import { getProfile } from "../../api/profile";
import { Profile } from "../../types/Profile";

const DEFAULT_SIZE = 200;
const OFFSET_INLINE = 32;

export const AuthModal = () => {
  const [profile, setProfile] = useState<Profile | undefined>();

  const { isAuth, signout } = useAuthContext();
  const { width } = useWindowSizeContext();

  const storedUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!storedUserId) {
        console.warn("User ID is not available in localStorage.");
        return;
      }

      try {
        const profile: Profile = await getProfile(storedUserId);
        setProfile(profile);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchProfile();
  }, [storedUserId]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  async function handleLogout() {
    try {
      await logout();
      signout();
      closeModal();
      console.log("logout!");
    } catch {
      console.log("error!");
    }
  }

  const ModalOrContent: React.FC<{ children: ReactNode }> = ({ children }) => {
    if (width < 768) {
      return (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
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
        <img src={account} alt="account" />
      </button>
      <ModalOrContent>
        <div className={`list ${isModalOpen ? "" : "_hidden"}`}>
          {isAuth ? (
            <>
              <Link className="list__item" to="/profile" onClick={closeModal}>
                Profile
              </Link>
              {profile?.profileType === "freelancer" && (
                <Link className="list__item" to="/addgig" onClick={closeModal}>
                  Add new gig
                </Link>
              )}
              <button className="list__item" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="list__item" to="/login" onClick={closeModal}>
                Login
              </Link>
              <Link className="list__item" to="/register" onClick={closeModal}>
                Register
              </Link>
            </>
          )}
        </div>
      </ModalOrContent>
    </>
  );
};
