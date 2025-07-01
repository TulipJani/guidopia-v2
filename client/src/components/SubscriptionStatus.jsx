import React, { useState, useEffect } from 'react';

const SubscriptionStatus = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await fetch(`/api/purchases/active-subscriptions/${userId}`);
        const data = await response.json();
        setSubscriptions(data.subscriptions);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Your Subscriptions</h3>
      {subscriptions.length > 0 ? (
        <div className="space-y-2">
          {subscriptions.map((sub, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-300">{sub.module}</span>
              <span className="text-cyan-400">
                {sub.daysRemaining} days remaining
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No active subscriptions</p>
      )}
    </div>
  );
};

export default SubscriptionStatus;