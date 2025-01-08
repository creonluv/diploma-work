import { ChangeEvent, FormEvent, useState } from "react";
import { UserDataForReset } from "../../../types/Auth";
import { resetPassword } from "../../../api/auth";

export const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState<UserDataForReset>({
    email: "",
    otp: "",
    newPassword: "",
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

    try {
      await resetPassword(formData);
    } catch (error) {
      alert("Error!");
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
                Enter the OTP code we sent you and your new password with email
                to update your account.
              </p>
            </div>

            <div className="form__group group">
              <input
                type="email"
                className="form__input input"
                placeholder={"E-mail"}
                value={formData.email}
                onChange={handleChange}
                name="email"
                required
              />
              <input
                type="text"
                className="form__input input"
                placeholder="Code from e-mail"
                value={formData.otp}
                onChange={handleChange}
                name="otp"
                required
              />
              <input
                type="password"
                className="form__input input"
                placeholder={"New password"}
                value={formData.newPassword}
                onChange={handleChange}
                name="newPassword"
                required
              />
            </div>

            <div className="form__button button-wrapper">
              <button
                className="button button_lg button_default button_full-size"
                type="submit"
              >
                <span>Update password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
