import React from 'react';
import { Link } from 'react-router-dom';

const CreatorSpotlight = ({ creators }) => {
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Creator Spotlight</h2>
        <Link to="/creators" className="text-primary-600 hover:text-primary-500">
          View all creators
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <div 
            key={creator._id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                {creator.avatar ? (
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-white bg-opacity-20 rounded-full w-24 h-24 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {creator.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              {creator.isVerified && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{creator.name}</h3>
                  <p className="text-sm text-gray-500">{creator.category}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {creator.successRate}% success
                </span>
              </div>
              
              <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                {creator.bio || "This creator hasn't added a bio yet."}
              </p>
              
              <div className="mt-4 flex justify-between text-sm">
                <div>
                  <p className="text-gray-500">Projects</p>
                  <p className="font-bold text-gray-900">{creator.projectCount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Backers</p>
                  <p className="font-bold text-gray-900">{creator.totalBackers}</p>
                </div>
                <div>
                  <p className="text-gray-500">Funded</p>
                  <p className="font-bold text-gray-900">${creator.totalFunded}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link 
                  to={`/creator/${creator._id}`} 
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-gradient shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CreatorSpotlight;