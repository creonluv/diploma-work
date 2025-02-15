import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateOrderGig } from "../../api/orderGig";

import "./Success.scss";

export const Success: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  console.log(payment_intent);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        if (!payment_intent) return;

        await updateOrderGig({ payment_intent });

        console.log("ff");

        navigate("/orders");

        console.log("ffff");
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, [payment_intent]);

  return (
    <div className="success">
      <div className="success__container">
        <div className="success__body">
          <div className="success__top">
            <h2 className="success__title">Success!</h2>

            <p>
              Payment successful. You are being redirected to the orders page.
              Please do not close the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
