import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerServiceWorker, showAddToHomeScreen, addToHomeScreen, isRunningAsPWA } from '../utils/pwa';

const PWAContext = createContext();

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

export const PWAProvider = ({ children }) => {
  const [isPWA, setIsPWA] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Register service worker and check PWA status
  useEffect(() => {
    registerServiceWorker();
    setIsPWA(isRunningAsPWA());
    showAddToHomeScreen();
  }, []);

  // Listen for install prompt event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Install PWA
  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };

  // Subscribe to push notifications
  const subscribeToPush = async () => {
    // Implementation would go here
    console.log('Subscribing to push notifications');
  };

  // Background sync
  const requestBackgroundSync = (tag) => {
    // Implementation would go here
    console.log('Requesting background sync for:', tag);
  };

  const value = {
    isPWA,
    isInstallable,
    installPWA,
    subscribeToPush,
    requestBackgroundSync
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};

export default PWAContext;