


import React, { Component } from "react";
import { AlertTriangle } from "../../lib/icons";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-hospital-purple/20 via-white to-teal-500/20 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-glass p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg border border-gray-200 text-center sm:text-left">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-3 bg-error-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-error-600" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Something went wrong
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">
              We encountered an unexpected error. Please refresh the page or
              contact support if the problem persists.
            </p>

            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-hospital-purple text-white rounded-lg hover:bg-hospital-purple-dark transition-colors text-sm sm:text-base font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
