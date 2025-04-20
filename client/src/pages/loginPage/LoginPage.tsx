import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AuthData, AuthResponse } from "../../types/Auth";
import { useAuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import "../../shared/commonStyles/authorization.scss";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const { isAuth, signin } = useAuthContext();

  const [formData, setFormData] = useState<AuthData>({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    try {
      const userData: AuthResponse = await login(formData);
      signin(userData._id);
      localStorage.setItem("userId", userData._id);
      localStorage.setItem("isSeller", userData.isSeller.toString());
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error!");
    }
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  return (
    <section className="authorization">
      <div className="authorization__container">
        <div className="authorization__body">
          <form className="authorization__form form" onSubmit={handleSubmit}>
            <div className="form__title">
              <h1 className="form__title title-2">Sign in to your account.</h1>
              <p className="text-muted">
                Don't have an account?{" "}
                <Link to="/register" className="form__link">
                  Register here
                </Link>
              </p>
            </div>
            <div className="form__group group">
              <input
                type="text"
                className="form__input input"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <Link to="/request-reset" className="form__link">
                Forgot password?
              </Link>
              <input
                type="password"
                className="form__input input"
                placeholder={"Password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form__button">
              <div className="form__button button-wrapper">
                <button
                  className="button button_lg button_default button_full-size"
                  type="submit"
                >
                  <span>Login</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
