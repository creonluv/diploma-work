import "./PayPage.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { createOrderGig } from "../../api/orderGig";
import { CheckoutForm } from "../../components/checkoutForm/CheckoutForm";
import { createOrder } from "../../api/orderByContact";

export const PayPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [_, setIsLoading] = useState<boolean>(false);

  const { gigId, contractId } = useParams();

  const stripePromise = useMemo(
    () =>
      loadStripe(
        "pk_test_51Qne3fBHuhS2Mrw2j4J06MkHYYdqprhPbYSdgVayqhSWqSeWezSh8SxWJ2BVPvtGkGymHL7zHyqevlm9St79SBD700SbfjnqiT"
      ),
    []
  );

  useEffect(() => {
    if (clientSecret) return;

    const makeRequest = async () => {
      setIsLoading(true);

      try {
        let res;

        if (gigId) {
          res = await createOrderGig(gigId);
        } else if (contractId) {
          res = await createOrder(contractId);
        }

        if (res?.clientSecret) {
          setClientSecret(res.clientSecret);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    makeRequest();
  }, [gigId, contractId, clientSecret]);

  const appearance = {
    theme: "stripe" as "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <section className="paypage">
      <div className="paypage__container">
        <div className="paypage__background">
          <div className="paypage__top">
            <h2 className="paypage__title">Secure Payment</h2>
            <p className="paypager__info">
              Complete your payment securely using your preferred method.
              <br />
              Your transaction is protected, and we ensure a smooth checkout
              experience.
            </p>
          </div>
        </div>
        <div className="paypage__background">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </div>
    </section>
  );
};
