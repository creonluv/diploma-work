import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/protectedRoute";
import { MainPage } from "./pages/mainPage";
import { LoginPage } from "./pages/loginPage";
import { RegisterPage } from "./pages/registerPage";
import { WindowSizeProvider } from "./context/WindowSizeContext";
import { RequestPasswordReset } from "./pages/resetPassword/requestPasswordReset";
import { ResetPassword } from "./pages/resetPassword/resetPassword";
import { ProfilePage } from "./pages/profilePage";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { GigPage } from "./pages/gigPage";
import { AddGigPage } from "./pages/addGigPage";
import { GigsByUserPage } from "./pages/gigsByUserPage";
import { GigOnePage } from "./pages/gigOnePage";
import { Success } from "./pages/success/Success";
import { PayPage } from "./pages/payPage";
import { OrdersPage } from "./pages/ordersPage/OrdersPage";
import { MessagesPage } from "./pages/messagesPage/MessagesPage";
import { ChatPage } from "./pages/chatPage/ChatPage";
import { SignContact } from "./pages/signContract/SignContact";
import { AddJobPage } from "./pages/addJobPage/AddJobPage";
import { JobOnePage } from "./pages/JobOnePage/JobOnePage";
import { JobsCatalogPage } from "./pages/jobsCatalogPage/JobsCatalogPage";

const gigRoutes = [
  { path: "", element: <GigPage /> },
  { path: "add", element: <AddGigPage /> },
  { path: "by-user", element: <GigsByUserPage /> },
  { path: ":gigId", element: <GigOnePage /> },
];

const messageRoutes = [
  { path: "", element: <MessagesPage /> },
  { path: ":chatId", element: <ChatPage /> },
];

const jobRoutes = [
  { path: "add", element: <AddJobPage /> },
  { path: ":jobId", element: <JobOnePage /> },
  { path: "", element: <JobsCatalogPage /> },
];

const protectedRoutes = [
  { path: "profile", element: <ProfilePage /> },
  { path: "pay/:gigId", element: <PayPage /> },
  { path: "pay/contract/:contractId", element: <PayPage /> },
  { path: "success", element: <Success /> },
  { path: "orders", element: <OrdersPage /> },
  { path: "contract", element: <SignContact /> },
];

export const Root = () => {
  return (
    <Provider store={store}>
      <WindowSizeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<MainPage />} />

                <Route element={<ProtectedRoute />}>
                  {protectedRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}

                  <Route path="gigs">
                    {gigRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    ))}
                  </Route>

                  <Route path="messages">
                    {messageRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    ))}
                  </Route>

                  <Route path="jobs">
                    {jobRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    ))}
                  </Route>
                </Route>

                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route
                  path="request-reset"
                  element={<RequestPasswordReset />}
                />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </WindowSizeProvider>
    </Provider>
  );
};
