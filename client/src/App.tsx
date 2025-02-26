import { Outlet, useLocation } from "react-router-dom";

import "./App.scss";
import { Header } from "./components/header";
import { BreadСrumbs } from "./components/breadCrumbs/BreadCrumbs";
// import { Footer } from "./components/footer/Footer";

function App() {
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
    !location.pathname.startsWith("/message/") &&
    !location.pathname.startsWith("/success");

  return (
    <div className="wrapper">
      <Header />
      <main className="page">
        {isBreadCrumbsVisible && <BreadСrumbs />}

        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
