import axios from 'axios';

export const completeOnboarding = async (formData) => {
  // Add authentication headers as needed
  return axios.post('/api/onboarding/complete', formData, {
    headers: {
      // 'Authorization': `Bearer ${token}`,
    }
  });
};
