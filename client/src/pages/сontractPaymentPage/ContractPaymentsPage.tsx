import "./ContractPaymentsPage.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckoutForm } from "../../components/checkoutForm/CheckoutForm";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";

import { createOrderAsync } from "../../features/orderByContract";
import { updateJobStepAsync } from "../../features/job";

export const PayPageContract: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState<string>("");

  const { order } = useAppSelector((state: RootState) => state.orderByContract);

  const [_, setIsLoading] = useState<boolean>(false);
  const { contractId } = useParams();

  const stripePromise = useMemo(
    () =>
      loadStripe(
        "pk_test_51Qne3fBHuhS2Mrw2j4J06MkHYYdqprhPbYSdgVayqhSWqSeWezSh8SxWJ2BVPvtGkGymHL7zHyqevlm9St79SBD700SbfjnqiT"
      ),
    []
  );

  useEffect(() => {
    if (clientSecret) {
      return;
    }

    const checkPaymentStatus = async () => {
      setIsLoading(true);

      try {
        if (contractId && !order) {
          const res = await dispatch(createOrderAsync(contractId)).unwrap();

          if (res.clientSecret) {
            setClientSecret(res.clientSecret);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [contractId, clientSecret, order]);

  const appearance = {
    theme: "stripe" as "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <section className="paypagecontract">
      <div className="paypagecontract__background">
        <h2 className="paypagecontract__title">Secure Payment for Contract</h2>
        {order?.paymentStatus === "paid" ? (
          "Payment already completed"
        ) : (
          <p className="paypagecontract__info">
            Complete your payment securely for the contract.
            <br />
            Your transaction is protected, and we ensure a smooth checkout
            experience.
          </p>
        )}
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm contractPaid={true} />
          </Elements>
        )}
      </div>
    </section>
  );
};
