import { ChangeEvent, FormEvent, useState } from "react";
import { requestReset } from "../../../api/auth";
import { useNavigate } from "react-router-dom";

export const RequestPasswordReset: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState({
    email: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail({
      ...email,
      email: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await requestReset(email);
      navigate("/reset-password");
    } catch {
      alert("Error send email!");
    }
  };

  return (
    <section className="authorization">
      <div className="authorization__container">
        <div className="authorization__body">
          <form className="authorization__form form" onSubmit={handleSubmit}>
            <div className="form__title">
              <h1 className="form__title title-2">Reset your password.</h1>
              <p className="text-muted">
                Enter the email address associated with your account.
                <br /> We will send you an OTP code to reset your password.
              </p>
            </div>

            <div className="form__group group">
              <input
                type="email"
                className="form__input input"
                placeholder={"E-mail"}
                value={email.email}
                onChange={handleChange}
                name="email"
                required
              />
            </div>

            <div className="form__button button-wrapper">
              <button
                className="button button_lg button_default button_full-size"
                type="submit"
              >
                <span>Next</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
