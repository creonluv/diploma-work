import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AuthData } from "../../types/Auth";
import { registration } from "../../api/auth";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const { isAuth, signin } = useAuthContext();

  const [formData, setFormData] = useState<AuthData>({
    username: "",
    email: "",
    password: "",
    phone: "",
    isSeller: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await registration(formData);
      signin();
    } catch {
      alert("Error reg!");
    }
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  return (
    <section className="authorization">
      <div className="authorization__container">
        <div className="authorization__body">
          <form className="authorization__form form" onSubmit={handleSubmit}>
            <div className="form__title">
              <h1 className="form__title title-2">Sign in to your account.</h1>
              <p className="text-muted">
                Already have an account?{" "}
                <Link to="/login" className="form__link">
                  Login
                </Link>
              </p>
            </div>
            <div className="form__group group">
              <input
                type="text"
                className="form__input input"
                placeholder={"Username"}
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                className="form__input input"
                placeholder={"E-mail"}
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="phone"
                className="form__input input"
                placeholder={"Phone number"}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
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
            <div className="form__checkbox checkbox">
              <input
                type="checkbox"
                className="checkbox__index"
                id="agree"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleChange}
              />
              <label className="checkbox__label" htmlFor="agree">
                I am a seller.
              </label>
            </div>
            <div className="form__button button-wrapper">
              <button
                className="button button_lg button_default button_full-size"
                type="submit"
              >
                <span>Register</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
