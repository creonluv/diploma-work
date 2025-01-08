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

export const Root = () => {
  return (
    <WindowSizeProvider>
      <AuthProvider>
        <StrictMode>
          <Router>
            <Routes>
              <Route path="/" element={<App />}>
                <Route element={<ProtectedRoute />}>
                  <Route index element={<MainPage />} />
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
  );
};
