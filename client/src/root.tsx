import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import { GigPage } from "./pages/gigCatalogPage";
import { AddGigPage } from "./pages/addGigPage";
import { GigsByUserPage } from "./pages/gigsByUserPage";
import { GigOnePage } from "./pages/gigOnePage";
import { Success } from "./pages/success/Success";
import { PayPage } from "./pages/payPage";
import { OrdersPage } from "./pages/ordersPage/OrdersPage";
import { MessagesPage } from "./pages/messagesPage/MessagesPage";
import { ChatPage } from "./pages/chatPage/ChatPage";
import { AddJobPage } from "./pages/addJobPage/AddJobPage";
import { JobOnePage } from "./pages/jobOnePage/JobOnePage";
import { JobsCatalogPage } from "./pages/jobsCatalogPage/JobsCatalogPage";
import { ContractDetailsPage } from "./pages/сontractDetailsPage/ContractDetailsPage";
import { PayPageContract } from "./pages/сontractPaymentPage/ContractPaymentsPage";
import { ContractWorkPage } from "./pages/contractWorkPage/ContractWorkPage";
import { ContractReviewsPage } from "./pages/contractReviewsPage/ContractReviewsPage";
import { SuccessContactPage } from "./pages/successContractPage/SuccessContractPage";
import { JobsByUserPage } from "./pages/jobsByUserPage/JobsByUserPage";
import { CurrentJobsPage } from "./pages/currentJobsPage/CurrentJobsPage";

import App from "./App";
import ContractLayout from "./pages/contractLayout/ContractLayout";

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

const contractRoutes = [
  { path: ":contractId/details", element: <ContractDetailsPage /> },
  { path: ":contractId/payments", element: <PayPageContract /> },
  { path: ":contractId/work", element: <ContractWorkPage /> },
  { path: ":contractId/reviews", element: <ContractReviewsPage /> },
];

const protectedRoutes = [
  { path: "profile", element: <ProfilePage /> },
  { path: "pay/:gigId", element: <PayPage /> },
  { path: "pay/contract/:contractId", element: <PayPage /> },
  { path: "success", element: <Success /> },
  { path: "contract-success", element: <SuccessContactPage /> },
  { path: "orders", element: <OrdersPage /> },
  { path: "current-jobs", element: <CurrentJobsPage /> },
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
                    <Route index element={<JobsCatalogPage />} />
                    <Route path="add" element={<AddJobPage />} />
                    <Route path=":jobId" element={<ContractLayout />}>
                      <Route index element={<JobOnePage />} />
                    </Route>
                    <Route path="by-user" element={<JobsByUserPage />} />
                  </Route>

                  <Route path="contracts" element={<ContractLayout />}>
                    {contractRoutes.map((route) => (
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
