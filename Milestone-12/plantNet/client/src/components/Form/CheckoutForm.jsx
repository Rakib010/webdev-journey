import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CheckoutForm.css";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // Prevent native form submission
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Disable form submission until it is ready.
      return;
    }

    // Get a reference to the CardElement
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.error("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
