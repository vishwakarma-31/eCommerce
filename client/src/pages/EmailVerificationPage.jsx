import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../services/api';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await API.post('/auth/verify-email', { token: verificationToken });
      setVerificationStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
      toast.success('Email verified successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setVerificationStatus('error');
      const errorMessage = error.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.';
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      // We would need to know the user's email to resend verification
      // This would typically be stored in localStorage or passed as a parameter
      const email = localStorage.getItem('pendingVerificationEmail');
      
      if (!email) {
        toast.error('No email found. Please register again.');
        return;
      }
      
      await API.post('/auth/resend-verification', { email });
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend verification email.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {verificationStatus === 'verifying' && (
              <div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
                <p className="mt-4 text-gray-600">Verifying your email address...</p>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Email Verified Successfully!</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {message}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Redirecting to login page...
                </p>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Verification Failed</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {message}
                </p>
                <div className="mt-6">
                  <button
                    onClick={resendVerificationEmail}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Resend Verification Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember to check your spam or junk folder if you don't see the email.
          </p>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default EmailVerificationPage;