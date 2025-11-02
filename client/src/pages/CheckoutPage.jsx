import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import MultiStepCheckout from '../components/checkout/MultiStepCheckout';

const CheckoutPage = () => {
  return (
    <MultiStepCheckout />
  );
};

export default CheckoutPage;
