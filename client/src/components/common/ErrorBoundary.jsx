import React from 'react';
import Button from './Button';
import { showErrorMessage } from '../../utils/errorHandler';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * Static method to catch errors in child components
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  /**
   * Method called when an error is caught
   */
  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Show error message to user
    showErrorMessage('An unexpected error occurred. Please try refreshing the page.');
  }

  /**
   * Method to reset the error boundary state
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-red-700">
                  {this.state.error && this.state.error.toString()}
                </p>
              </div>
              <div className="mt-6">
                <Button 
                  variant="primary" 
                  onClick={this.handleReset}
                  className="mr-4"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                  <summary className="font-medium cursor-pointer">Error Details</summary>
                  <pre className="mt-2 text-sm text-gray-600 overflow-auto">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;