import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  StripeLinkAuthenticationElementChangeEvent,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";

import "./CheckoutForm.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { fetchOrderByPaymentIntentAsync } from "../../features/orderByContract";
import { updateJobStepAsync } from "../../features/job";
import { RootState } from "../../app/store";

interface CheckoutFormProps {
  contractPaid?: boolean;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ contractPaid }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [_, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { order } = useAppSelector((state: RootState) => state.orderByContract);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    const updateJobStepAndNavigateAsync = async () => {
      try {
        const order = await dispatch(
          fetchOrderByPaymentIntentAsync(clientSecret)
        ).unwrap();

        await dispatch(
          updateJobStepAsync({ id: order.jobId, step: 4 })
        ).unwrap();
      } catch (err) {
        console.log(err);
      }
    };

    const checkPaymentStatus = async () => {
      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(
          clientSecret
        );

        if (!paymentIntent) {
          setMessage("Payment intent not found.");
          return;
        }

        console.log(paymentIntent.status);

        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      } catch (err) {
        console.error("Error retrieving payment intent:", err);
      }
    };

    updateJobStepAndNavigateAsync();
    checkPaymentStatus();
  }, [stripe, dispatch, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          contractPaid === true
            ? `http://localhost:5173/contract-success?contractId=${order?.contractId}&jobId=${order?.jobId}`
            : "http://localhost:5173/success",
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Unknown error occurred");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "accordion",
  };

  return (
    <div className="checkoutForm">
      <form
        className="checkoutForm__form"
        id="payment-form"
        onSubmit={handleSubmit}
      >
        <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e: StripeLinkAuthenticationElementChangeEvent) =>
            setEmail(e.value.email)
          }
        />

        <PaymentElement id="payment-element" options={paymentElementOptions} />

        <button
          className="button button_lg button_default button_full-size"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>

        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
  );
};
