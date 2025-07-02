export async function createOrder(amount, courseId) {
  const res = await fetch('https://guidopia-v2-backend.vercel.app/api/payment/create-order', {
  // const res = await fetch('http://localhost:3000/api/payment/create-order', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, courseId }),
  });
  return res.json();
}
