import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import useStore from './store/useStore';
import PhoneForm from './components/auth/PhoneForm';
import OTPForm from './components/auth/OTPForm';
import Dashboard from './components/dashboard/Dashboard';
import './index.css';

function App() {
  const { isAuthenticated, setUser } = useStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);

  const handleOTPSent = (phone) => {
    setPhoneNumber(phone);
    setShowOTP(true);
  };

  const handleVerificationSuccess = (userData) => {
    setUser(userData);
    setShowOTP(false);
  };

  const handleBackToPhone = () => {
    setShowOTP(false);
    setPhoneNumber('');
  };

  if (isAuthenticated) {
    return (
      <>
        <Dashboard />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {showOTP ? (
          <OTPForm
            phoneNumber={phoneNumber}
            onVerificationSuccess={handleVerificationSuccess}
            onBack={handleBackToPhone}
          />
        ) : (
          <PhoneForm onOTPSent={handleOTPSent} />
        )}
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App; 