import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";

export default function CounselingButton({ student, className = "", children = "Book Counseling" }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  // If student info is not provided, show a form to collect it
  const handleClick = () => {
    if (student && student.name && student.email && student.phone) {
      handleSubmit(student);
    } else {
      setShowForm(true);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (data) => {
    try {
      await fetch("/api/counseling-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: "pending",
          message: `${data.name} (${data.email}, ${data.phone}) requested counselling.`,
        }),
      });
      setShowForm(false); // Hide the form
      setShowNotification(true); // Show the notification
      setTimeout(() => setShowNotification(false), 5000); // Hide after 5 seconds
    } catch (err) {
      alert("Failed to submit request. Please try again.");
    }
  };

  if (showForm) {
    return (
      <form
        className={`space-y-2 ${className}`}
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(form);
        }}
      >
        <input name="name" required placeholder="Name" className="w-full p-2 rounded" onChange={handleChange} />
        <input name="email" required type="email" placeholder="Email" className="w-full p-2 rounded" onChange={handleChange} />
        <input name="phone" required placeholder="Phone" className="w-full p-2 rounded" onChange={handleChange} />
        <button type="submit" className="w-full py-2 bg-cyan-500 text-white rounded">Proceed</button>
      </form>
    );
  }

  return (
    <>
      <button className={className} onClick={handleClick}>
        {children}
      </button>

      {/* Popup Notification */}
      {showNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-cyan-400/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20 max-w-sm w-full mx-4 transform transition-all duration-300 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Booking Confirmed!</h3>
              <p className="text-cyan-300 mb-4">Your mentor will connect shortly.</p>
              <p className="text-gray-400 text-sm mb-6">We'll send you an email with the session details.</p>
              <button
                onClick={() => setShowNotification(false)}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
