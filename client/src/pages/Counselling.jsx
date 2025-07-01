import { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Pricing_1_1() {
  const [loading, setLoading] = useState(false);

  const counselingService = {
    id: 'counseling',
    name: '1:1 Personalized Counseling',
    price: 500,
    period: 'session',
    description: 'Individual sessions with expert counselors',
    features: [
      '60-minute one-on-one session',
      'Personalized career roadmap',
      'Goal setting and action planning',
      'Industry-specific guidance',
      'Resume and profile review',
      'Interview preparation tips'
    ]
  };
  const handlePayment = async (plan) => {
    try {
      setLoading(true);

      const response = await axios.post('/api/payment/create-order', {
        amount: plan.price,
        courseId: plan.id
      });

      const { orderId, amount, currency, key } = response.data;

      const options = {
        key,
        amount,
        currency,
        name: 'Guidopia',
        description: `${plan.name} Plan`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: plan.id,
              courseName: plan.name,
              amount: plan.price
            });

            if (verificationResponse.data.success) {
              alert('Payment successful! Welcome to Guidopia.');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#0891b2'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/3 via-transparent to-purple-500/3"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/30 rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="font-semibold">Personalized Guidance</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              One-on-one
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              career counseling
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Get personalized guidance from expert counselors who understand your unique journey.
            Book individual sessions tailored to your specific career goals and challenges.
          </p>
        </div>

        {/* Individual Counseling Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Need Personalized <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">Guidance?</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Book individual sessions with our expert counselors for tailored advice and support
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-lg shadow-gray-900/20 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 via-transparent to-pink-500/3 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 text-white">{counselingService.name}</h3>
                  <p className="text-gray-300 mb-6">{counselingService.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ₹{counselingService.price}
                    </span>
                    <span className="text-gray-400 text-lg">/{counselingService.period}</span>
                  </div>

                  <button
                    onClick={() => handlePayment(counselingService)}
                    disabled={loading}
                    className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg rounded-xl hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center">
                      {loading ? 'Processing...' : 'Book Session'}
                      {!loading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {counselingService.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-purple-400" />
                      </div>
                      <span className="text-gray-300 text-sm leading-relaxed text-left">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}