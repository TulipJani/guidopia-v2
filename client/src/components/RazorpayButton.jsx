import { createOrder } from '../api/payment';

export default function RazorpayButton({ amount, courseId, courseName }) {
  const handlePayment = async () => {
    const data = await createOrder(amount, courseId);
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "Guidopia Courses",
      description: courseName,
      order_id: data.orderId,
      handler: async function (response) {
        // Call backend to verify payment and store purchase
        const verifyRes = await fetch('http://localhost:3000/api/payment/verify', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId,
            courseName,
            amount
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert('Payment successful and purchase recorded!');
        } else {
          alert('Payment verification failed!');
        }
      },
      prefill: {
        name: "",
        email: "",
      },
      theme: {
        color: "#3399cc"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handlePayment}>
      Buy for ₹{amount}
    </button>
  );
}
