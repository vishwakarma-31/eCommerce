import React from 'react';
import Input from '../common/Input';

const AddressForm = ({ formData, onFieldChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="First Name"
        type="text"
        value={formData.firstName}
        onChange={(e) => onFieldChange('firstName', e.target.value)}
        required
      />
      <Input
        label="Last Name"
        type="text"
        value={formData.lastName}
        onChange={(e) => onFieldChange('lastName', e.target.value)}
        required
      />
      <div className="md:col-span-2">
        <Input
          label="Address"
          type="text"
          value={formData.address}
          onChange={(e) => onFieldChange('address', e.target.value)}
          required
        />
      </div>
      <Input
        label="City"
        type="text"
        value={formData.city}
        onChange={(e) => onFieldChange('city', e.target.value)}
        required
      />
      <Input
        label="State"
        type="text"
        value={formData.state}
        onChange={(e) => onFieldChange('state', e.target.value)}
        required
      />
      <Input
        label="ZIP Code"
        type="text"
        value={formData.zipCode}
        onChange={(e) => onFieldChange('zipCode', e.target.value)}
        required
      />
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          value={formData.country}
          onChange={(e) => onFieldChange('country', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Australia">Australia</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default AddressForm;