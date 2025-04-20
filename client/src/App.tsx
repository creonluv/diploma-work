import { Outlet, useLocation } from "react-router-dom";

import "./App.scss";
import { Header } from "./components/header";
import { BreadСrumbs } from "./components/breadCrumbs/BreadCrumbs";
import { useEffect, useState } from "react";
// import { Footer } from "./components/footer/Footer";
import { io } from "socket.io-client";
import { Footer } from "./components/footer/Footer";

const socket = io("http://localhost:8800");

function App() {
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const isBreadCrumbsVisible =
    location.pathname !== "/" &&
    location.pathname !== "/profile" &&
    location.pathname !== "/404" &&
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/request-reset" &&
    location.pathname !== "/reset-password" &&
    !location.pathname.startsWith("/pay/") &&
    !location.pathname.startsWith("/messages/") &&
    !location.pathname.startsWith("/success");

  const [notificationsSocket, setNotificationsSocket] = useState<any[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");

      const roomId = "global_chat";
      socket.emit("joinRoom", roomId);
    });

    socket.on("notification", (data) => {
      setNotificationsSocket((prev) => [data, ...prev]);
      console.log("New notification received:", data);
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  return (
    <div className="wrapper">
      <Header notificationsSocket={notificationsSocket} />
      <main className="page">
        {isBreadCrumbsVisible && <BreadСrumbs />}

        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
