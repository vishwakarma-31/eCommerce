import React from 'react';
import { SearchIcon } from '@heroicons/react/outline';

const MobileSearchButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 text-gray-400 hover:text-gray-500"
      aria-label="Search"
    >
      <SearchIcon className="h-6 w-6" />
    </button>
  );
};

export default MobileSearchButton;