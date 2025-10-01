import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page not found
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => navigate(-1)}
            >
              Go back
            </Button>
            <Link to="/">
              <Button variant="outline">
                Go home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;