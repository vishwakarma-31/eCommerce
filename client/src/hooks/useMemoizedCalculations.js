import { useMemo } from 'react';

/**
 * Custom hook for memoized calculations to optimize performance
 * Prevents expensive calculations from running on every render
 */
export const useMemoizedCalculations = (product) => {
  // Memoize funding progress calculation
  const fundingProgress = useMemo(() => {
    if (!product || product.status !== 'Funding') return 0;
    return Math.min(100, Math.round((product.currentFunding / product.fundingGoal) * 100));
  }, [product?.currentFunding, product?.fundingGoal, product?.status]);

  // Memoize time remaining calculation
  const timeRemaining = useMemo(() => {
    if (!product || !product.deadline) return null;
    
    const deadline = new Date(product.deadline);
    const now = new Date();
    const diff = deadline - now;
    
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  }, [product?.deadline]);

  // Memoize price formatting
  const formattedPrice = useMemo(() => {
    if (!product?.price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(product.price);
  }, [product?.price]);

  // Memoize discount calculation
  const discountPercentage = useMemo(() => {
    if (!product?.originalPrice || !product?.price) return 0;
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    return Math.round(discount);
  }, [product?.originalPrice, product?.price]);

  return {
    fundingProgress,
    timeRemaining,
    formattedPrice,
    discountPercentage
  };
};