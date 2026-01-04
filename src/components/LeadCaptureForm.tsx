import { useState } from 'react';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { useAppStore } from '@/stores/appStore';
import { Lead } from '@/types';

interface LeadCaptureFormProps {
  onSubmit: (lead: Lead) => void;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSubmit }) => {
  const { selectedTheme } = useAppStore();

  const [formData, setFormData] = useState({
    fullName: '',
    instagramHandle1: '',
    instagramHandle2: '',
    phoneNumber: '',
    countryCode: '+1',
    consentGiven: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryCodes = [
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'IN' },
    { code: '+65', country: 'SG' },
    { code: '+60', country: 'MY' },
    { code: '+61', country: 'AU' },
    { code: '+64', country: 'NZ' },
    { code: '+86', country: 'CN' },
    { code: '+81', country: 'JP' },
    { code: '+82', country: 'KR' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      newErrors.fullName = 'Please enter a valid name (minimum 2 characters)';
    }

    // Validate phone number
    const fullPhoneNumber = formData.countryCode + formData.phoneNumber;
    try {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!isValidPhoneNumber(fullPhoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    } catch {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Validate consent
    if (!formData.consentGiven) {
      newErrors.consent = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatInstagramHandle = (handle: string): string => {
    const cleaned = handle.trim().replace(/^@/, '');
    return cleaned;
  };

  const handleInstagramInputChange = (field: 'instagramHandle1' | 'instagramHandle2', value: string) => {
    // Auto-add @ if not present
    let formatted = value.trim();
    if (formatted && !formatted.startsWith('@')) {
      formatted = '@' + formatted;
    }
    setFormData({ ...formData, [field]: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const lead: Lead = {
        fullName: formData.fullName.trim(),
        instagramHandle1: formData.instagramHandle1.trim()
          ? formatInstagramHandle(formData.instagramHandle1)
          : undefined,
        instagramHandle2: formData.instagramHandle2.trim()
          ? formatInstagramHandle(formData.instagramHandle2)
          : undefined,
        phoneNumber: formData.phoneNumber.trim(),
        countryCode: formData.countryCode,
        consentGiven: formData.consentGiven,
        themeSelected: selectedTheme?.name || 'Unknown',
        eventId: import.meta.env.VITE_EVENT_ID || 'default',
      };

      onSubmit(lead);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="card max-w-2xl w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-primary-600 to-pink-600 p-4 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
            Almost There!
          </h2>
          <p className="text-gray-600 text-lg">
            Share your details to receive your photo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name(s) *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g., Sarah & James"
              className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Instagram Handles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Instagram Handle 1
                <span className="text-gray-500 text-xs ml-1">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.instagramHandle1}
                onChange={(e) => handleInstagramInputChange('instagramHandle1', e.target.value)}
                placeholder="@username"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Instagram Handle 2
                <span className="text-gray-500 text-xs ml-1">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.instagramHandle2}
                onChange={(e) => handleInstagramInputChange('instagramHandle2', e.target.value)}
                placeholder="@username"
                className="input-field"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="flex gap-2">
              <select
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                className="input-field w-32"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} ({country.country})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value.replace(/[^0-9]/g, '') })
                }
                placeholder="1234567890"
                className={`input-field flex-1 ${errors.phoneNumber ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Consent */}
          <div className="bg-gradient-to-r from-primary-50 to-pink-50 p-5 rounded-xl border-2 border-primary-200">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentGiven}
                onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                className="mt-1 mr-3 w-6 h-6 text-primary-600 border-gray-300 rounded-md focus:ring-primary-500 focus:ring-2"
              />
              <span className="text-sm text-gray-800 font-medium">
                I allow DreamSnap and the event organizer to use this photo for promotional purposes. *
              </span>
            </label>
            {errors.consent && (
              <p className="text-red-500 text-sm mt-2 ml-9 font-semibold">{errors.consent}</p>
            )}
          </div>

          {/* Privacy note */}
          <div className="text-sm text-gray-600 text-center bg-gray-50 p-4 rounded-lg">
            <svg className="w-5 h-5 inline-block mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Your information will be used solely for delivering your photo and marketing purposes. We respect your privacy.
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full text-lg py-4 shadow-xl hover:shadow-2xl transition-all"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Submit & Download Photo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
