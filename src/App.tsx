import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { Lead } from '@/types';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Components
import { PhotoCapture } from '@/components/PhotoCapture';
import { PhotoSelection } from '@/components/PhotoSelection';
import { ThemeSelection } from '@/components/ThemeSelection';
import { AIGeneration } from '@/components/AIGeneration';
import { ImagePreview } from '@/components/ImagePreview';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';

// Pages
import { SuccessPage } from '@/pages/SuccessPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { LoginPage } from '@/pages/LoginPage';

type Step =
  | 'capture'
  | 'select'
  | 'theme'
  | 'generate'
  | 'preview'
  | 'form'
  | 'success';

function MainFlow() {
  const [currentStep, setCurrentStep] = useState<Step>('capture');
  const [leadData, setLeadData] = useState<Lead | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resetCapture } = useAppStore();

  const handleStartOver = () => {
    resetCapture();
    setLeadData(null);
    setError(null);
    setCurrentStep('capture');
  };

  const handleFormSubmit = (data: Lead) => {
    setLeadData(data);
    setCurrentStep('success');
  };

  const handleGenerationError = (errorMessage: string) => {
    setError(errorMessage);
    // Optionally show error UI or return to theme selection
    alert(`Error: ${errorMessage}\n\nPlease try selecting a different theme.`);
    setCurrentStep('theme');
  };

  return (
    <div className="min-h-screen">
      {/* Error display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step components */}
      {currentStep === 'capture' && (
        <PhotoCapture onComplete={() => setCurrentStep('select')} />
      )}

      {currentStep === 'select' && (
        <PhotoSelection
          onNext={() => setCurrentStep('theme')}
          onBack={() => setCurrentStep('capture')}
        />
      )}

      {currentStep === 'theme' && (
        <ThemeSelection
          onNext={() => setCurrentStep('generate')}
          onBack={() => setCurrentStep('select')}
        />
      )}

      {currentStep === 'generate' && (
        <AIGeneration
          onComplete={() => setCurrentStep('preview')}
          onError={handleGenerationError}
        />
      )}

      {currentStep === 'preview' && (
        <ImagePreview
          onApprove={() => setCurrentStep('form')}
          onRetry={() => setCurrentStep('theme')}
        />
      )}

      {currentStep === 'form' && (
        <LeadCaptureForm onSubmit={handleFormSubmit} />
      )}

      {currentStep === 'success' && leadData && (
        <SuccessPage
          leadData={leadData}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const { resetCapture } = useAppStore();

  const handleStartNew = () => {
    resetCapture();
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainFlow />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <GalleryPage onStartNew={handleStartNew} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
