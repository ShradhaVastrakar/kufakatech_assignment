// Simulated API functions
export const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd');
    const countries = await response.json();
    
    return countries
      .filter(country => country.idd.root && country.idd.suffixes)
      .map(country => ({
        name: country.name.common,
        code: country.idd.root + (country.idd.suffixes[0] || ''),
        flag: `https://flagcdn.com/w20/${country.cca2.toLowerCase()}.png`
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching countries:', error);
    // Fallback data
    return [
      { name: 'United States', code: '+1', flag: '🇺🇸' },
      { name: 'India', code: '+91', flag: '🇮🇳' },
      { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
      { name: 'Canada', code: '+1', flag: '🇨🇦' },
      { name: 'Australia', code: '+61', flag: '🇦🇺' },
    ];
  }
};

export const sendOTP = async (phoneNumber) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'OTP sent successfully' });
    }, 1000);
  });
};

export const verifyOTP = async (phoneNumber, otp) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (otp === '123456') {
        resolve({ success: true, user: { id: '1', phone: phoneNumber } });
      } else {
        resolve({ success: false, message: 'Invalid OTP' });
      }
    }, 1000);
  });
};

export const generateAIResponse = async (message) => {
  // Simulate AI response with throttling
  const responses = [
    "That's an interesting question! Let me think about that...",
    "I understand what you're asking. Here's what I think...",
    "Great question! Based on my knowledge, I would say...",
    "I'm processing your request. Here's my response...",
    "Thanks for sharing that with me. My thoughts are...",
    "I appreciate your question. Let me provide some insights...",
    "That's a fascinating topic! Here's my perspective...",
    "I'm glad you asked that. Here's what I can tell you...",
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(randomResponse);
    }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
  });
}; 