import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateOrderGig } from "../../api/orderGig";

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

        setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, [payment_intent]);

  return (
    <div className="success">
      <div className="success__container">
        Payment successful. You are being redirected to the orders page. Please
        do not close the page
      </div>
    </div>
  );
};
