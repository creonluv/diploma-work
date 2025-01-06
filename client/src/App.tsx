import { Outlet } from "react-router-dom";

import "./App.scss";
import { Header } from "./components/header";

function App() {
  return (
    <div className="wrapper">
      <Header />
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
