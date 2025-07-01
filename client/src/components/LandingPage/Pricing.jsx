import React, { useState, useEffect } from 'react';
import { Check, Star, Sparkles, Crown, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Pricing() {
  // State variables at the top
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Get user data on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get('/api/user/me', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('User not logged in');
        setUser(null);
      }
    };
    getUserData();
  }, []);

  // Check if user already has active subscription
  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/payment/check-subscription/${user._id}`);
          if (response.data.hasActiveSubscription) {
            // User already has access, redirect to dashboard
            if (window.confirm('You already have an active subscription! Go to dashboard?')) {
              window.location.href = '/dashboard';
            }
          }
        } catch (error) {
          console.error('Failed to check subscription:', error);
        }
      }
    };

    checkSubscription();
  }, [user]);

  // Static data
  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: billingCycle === 'yearly' ? 1500 : 150,
      period: billingCycle === 'yearly' ? 'year' : 'month',
      description: 'Perfect for students starting their journey',
      features: [
        'Access to all career guidance tools',
        'Skill assessment and recommendations',
        'Study materials and resources',
        'Community access and peer support',
        'Basic progress tracking',
        'Email support'
      ],
      popular: false,
      cta: 'Get Started',
      icon: Star
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingCycle === 'yearly' ? 2000 : 200,
      period: billingCycle === 'yearly' ? 'year' : 'month',
      description: 'Best value with personalized guidance',
      features: [
        'Everything in Standard plan',
        'One-on-one personalized counseling session',
        'Priority support and faster response',
        'Advanced analytics and insights',
        'Custom learning path creation',
        'Direct mentor connections',
        'Exclusive workshops and webinars'
      ],
      popular: true,
      cta: 'Start Premium',
      icon: Crown
    }
  ];

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

  // Enhanced handlePayment function with full functionality
  const handlePayment = async (plan) => {
    try {
      // Check if user is logged in
      if (!user) {
        alert('Please login to continue with payment');
        window.location.href = '/login';
        return;
      }

      setLoading(true);
      
      // Create order
      const response = await axios.post('/api/payment/create-order', {
        amount: plan.price,
        courseId: plan.id
      });

      const { orderId, amount, currency, key } = response.data;

      // Initialize Razorpay
      const options = {
        key,
        amount,
        currency,
        name: 'Guidopia',
        description: `${plan.name} Plan`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment with all required fields
            const verificationResponse = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: plan.id,
              courseName: plan.name,
              amount: plan.price,
              userId: user._id,
              phone: user.phone || user.contact || '9999999999'
            });

            if (verificationResponse.data.success) {
              alert('🎉 Payment successful! Welcome to Guidopia. You now have access to all modules for 1 year!');
              window.location.href = '/dashboard';
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('❌ Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || user?.fullName || 'User Name',
          email: user?.email || 'user@example.com',
          contact: user?.phone || user?.contact || '9999999999'
        },
        theme: {
          color: '#ffffff'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert('❌ Payment failed. Please try again.');
        setLoading(false);
      });
      
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('❌ Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-white/[0.06] via-gray-500/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-white/[0.05] via-gray-400/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="font-medium">Choose Your Plan</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
            <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Choose your
            </span>
            <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              learning journey
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed font-light">
            Unlock your potential with our comprehensive career guidance platform.
            Choose the plan that fits your goals and start building your future today.
          </p>

          {/* User Status Display */}
          {user && (
            <div className="mb-8 p-4 bg-white/[0.05] border border-white/[0.12] rounded-2xl backdrop-blur-sm max-w-md mx-auto">
              <p className="text-gray-400 font-light">
                Welcome back, <span className="text-white font-semibold">{user.name || user.fullName}</span>!
                Choose a plan to unlock all features.
              </p>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg font-semibold transition-colors duration-300 ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'yearly' ? 'monthly' : 'yearly')}
              className="relative w-16 h-8 bg-white/[0.10] rounded-full transition-all duration-300 focus:outline-none border border-white/[0.15]"
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'}`}></div>
            </button>
            <span className={`text-lg font-semibold transition-colors duration-300 ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="ml-2 px-3 py-1 text-xs font-semibold bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full">
                Save 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/[0.05] backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] overflow-hidden ${plan.popular
                ? 'border-white/[0.20] ring-2 ring-white/[0.15] hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/10'
                : 'border-white/[0.12] hover:border-white/[0.18] hover:bg-white/[0.08]'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center px-6 py-2 text-sm font-semibold bg-white text-black rounded-full shadow-2xl shadow-white/20">
                    <Crown className="w-4 h-4 mr-2" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan.popular ? 'bg-white/[0.15] border border-white/[0.20]' : 'bg-white/[0.10] border border-white/[0.15]'}`}>
                      <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-gray-300'}`} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">{plan.name}</h3>
                  <p className="text-gray-400 mb-6 font-light">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                      ₹{plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-lg">/{plan.period}</span>
                  </div>

                  <button 
                    onClick={() => handlePayment(plan)}
                    disabled={loading}
                    className={`w-full py-4 px-6 font-semibold text-lg rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? 'bg-white text-black hover:shadow-lg hover:shadow-white/30 hover:scale-105'
                        : 'bg-white/[0.08] backdrop-blur-sm text-white border border-white/[0.15] hover:border-white/[0.25] hover:bg-white/[0.12] hover:scale-105'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : plan.cta}
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-4">What's included:</h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/[0.10] border border-white/[0.15] flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-gray-300" />
                      </div>
                      <span className="text-gray-400 text-sm leading-relaxed font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Individual Counseling Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Need Personalized <span className="bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent">Guidance?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Book individual sessions with our expert counselors for tailored advice and support
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-8 text-center overflow-hidden hover:bg-white/[0.08] transition-all duration-300">
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-white/[0.10] border border-white/[0.15] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">{counselingService.name}</h3>
                  <p className="text-gray-400 mb-6 font-light">{counselingService.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                      ₹{counselingService.price}
                    </span>
                    <span className="text-gray-500 text-lg">/{counselingService.period}</span>
                  </div>

                  <button
                    onClick={() => handlePayment(counselingService)}
                    disabled={loading}
                    className="group relative px-12 py-4 bg-white text-black text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-white/20 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center">
                      {loading ? 'Processing...' : 'Book Session'}
                      {!loading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {counselingService.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/[0.10] border border-white/[0.15] flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-gray-300" />
                      </div>
                      <span className="text-gray-400 text-sm leading-relaxed text-left font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Frequently Asked <span className="bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I switch between plans?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                question: "Is there a free trial available?",
                answer: "We offer a 7-day free trial for new users to explore our platform and find the plan that works best for them."
              },
              {
                question: "What's included in the counseling sessions?",
                answer: "Each 60-minute session includes personalized career guidance, goal setting, resume review, and a custom action plan tailored to your needs."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service. No questions asked."
              }
            ].map((faq, index) => (
              <div key={index} className="relative bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-6 overflow-hidden hover:bg-white/[0.08] transition-all duration-300">
                <div className="relative z-10">
                  <h4 className="font-semibold text-lg bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-3">{faq.question}</h4>
                  <p className="text-gray-400 leading-relaxed font-light">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="relative bg-white/[0.05] backdrop-blur-sm border border-white/[0.15] rounded-2xl p-12 max-w-4xl mx-auto overflow-hidden hover:bg-white/[0.08] transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white/[0.10] border border-white/[0.15] rounded-2xl flex items-center justify-center mr-4">
                  <Sparkles className="w-8 h-8 text-gray-300" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                  Ready to start your journey?
                </h2>
              </div>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                Join thousands of students who have already transformed their careers with Guidopia.
                Your future self will thank you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <button className="group relative w-full sm:w-auto px-12 py-4 bg-white text-black text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-white/20">
                  <span className="relative z-10 flex items-center justify-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                </button>
                <span className="text-gray-500 hover:text-gray-400 transition-colors duration-300 font-light">
                  Have questions? Contact us →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-20 right-20 w-4 h-4 bg-white/[0.15] rounded-full blur-sm" />
      <div className="absolute top-32 left-20 w-2 h-2 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-1/2 right-32 w-3 h-3 bg-white/[0.10] rounded-full blur-sm" />
      <div className="absolute bottom-1/3 left-32 w-2 h-2 bg-white/[0.08] rounded-full blur-sm" />
    </div>
  );
}