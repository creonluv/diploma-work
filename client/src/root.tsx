import { StrictMode } from "react";
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

export const Root = () => {
  return (
    <Provider store={store}>
      <WindowSizeProvider>
        <AuthProvider>
          <StrictMode>
            <Router>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route index element={<MainPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="gigs" element={<GigPage />} />
                    <Route path="addgig" element={<AddGigPage />} />
                    <Route path="gigs-by-user" element={<GigsByUserPage />} />
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
          </StrictMode>
        </AuthProvider>
      </WindowSizeProvider>
    </Provider>
  );
};
