// import React, { useEffect, useState } from "react";
// import {
//   PaymentElement,
//   LinkAuthenticationElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { useAppDispatch } from "../../app/hooks";
// import { confirmOrCancelPaymentAsync } from "../../features/orderByContract";
// import "./CheckoutForm.scss";

// interface CheckoutFormProps {
//   clientSecret: string;
// }

// const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const dispatch = useAppDispatch();

//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Використовуємо useEffect для перевірки стану платіжного наміру
//   useEffect(() => {
//     if (!stripe || !clientSecret) return;

//     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//       if (!paymentIntent) {
//         setMessage("Payment intent not found.");
//         return;
//       }

//       switch (paymentIntent.status) {
//         case "succeeded":
//           setMessage("Payment succeeded!");
//           break;
//         case "processing":
//           setMessage("Your payment is processing.");
//           break;
//         case "requires_payment_method":
//           setMessage("Your payment was not successful, please try again.");
//           break;
//         default:
//           setMessage("Something went wrong.");
//           break;
//       }
//     });
//   }, [stripe, clientSecret]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!stripe || !elements) {
//       return;
//     }

//     setIsLoading(true);

//     const { error, paymentIntent } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: "http://localhost:5173/success",
//       },
//     });

//     if (error) {
//       setMessage(error.message || "Unknown error occurred");
//     } else if (paymentIntent?.status === "succeeded") {
//       dispatch(
//         confirmOrCancelPaymentAsync({
//           orderId: paymentIntent.id,
//           action: "confirm",
//         })
//       );
//     } else {
//       setMessage("An unexpected error occurred.");
//     }

//     setIsLoading(false);
//   };

//   const paymentElementOptions = {
//     layout: "accordion",
//   };

//   return (
//     <div className="checkoutForm">
//       <form
//         className="checkoutForm__form"
//         id="payment-form"
//         onSubmit={handleSubmit}
//       >
//         <LinkAuthenticationElement
//           id="link-authentication-element"
//           onChange={(e) => setEmail(e.value.email)}
//         />

//         <PaymentElement id="payment-element" options={paymentElementOptions} />

//         <button
//           className="button button_lg button_default button_full-size"
//           disabled={isLoading || !stripe || !elements}
//           id="submit"
//         >
//           <span id="button-text">
//             {isLoading ? (
//               <div className="spinner" id="spinner"></div>
//             ) : (
//               "Pay now"
//             )}
//           </span>
//         </button>

//         {message && <div id="payment-message">{message}</div>}
//       </form>
//     </div>
//   );
// };

// export default CheckoutForm;
