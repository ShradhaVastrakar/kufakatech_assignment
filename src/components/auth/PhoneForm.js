import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneSchema } from '../../utils/validation';
import { fetchCountries, sendOTP } from '../../utils/api';
import { ChevronDown, Phone } from 'lucide-react';
import { cn } from '../../utils/cn';

const PhoneForm = ({ onOTPSent }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(phoneSchema),
  });

  const phoneNumber = watch('phoneNumber');

  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
      setSelectedCountry(countriesData[0]);
      setValue('countryCode', countriesData[0]?.code || '+1');
    };
    loadCountries();
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;
      const result = await sendOTP(fullPhoneNumber);
      
      if (result.success) {
        onOTPSent(fullPhoneNumber);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setValue('countryCode', country.code);
    setShowCountryDropdown(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Gemini Chat
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your phone number to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <div className="flex">
            {/* Country Code Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <span className="mr-2">{selectedCountry?.flag || '🏳️'}</span>
                <span className="text-sm">{selectedCountry?.code || '+1'}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {showCountryDropdown && (
                <div className="absolute z-10 w-64 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      <span className="mr-3">{country.flag}</span>
                      <span className="text-sm text-gray-900 dark:text-white">{country.name}</span>
                      <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">{country.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Number Input */}
            <input
              type="tel"
              {...register('phoneNumber')}
              className={cn(
                "flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                errors.phoneNumber && "border-red-500 focus:ring-red-500"
              )}
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !phoneNumber}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We'll send you a 6-digit code to verify your number
        </p>
      </div>
    </div>
  );
};

export default PhoneForm; 