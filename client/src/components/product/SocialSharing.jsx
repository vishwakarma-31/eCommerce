import React from 'react';

const SocialSharing = ({ product, fundingProgress }) => {
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=Check out this amazing project: ${product.title}`,
    twitter: `https://twitter.com/intent/tweet?text=Check out this amazing project: ${product.title}&url=${encodeURIComponent(window.location.href)}&hashtags=innovation,funding,${product.category.replace(/\s+/g, '')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=Check out this amazing project: ${product.title}`,
    whatsapp: `https://api.whatsapp.com/send?text=Check out this amazing project: ${product.title} ${encodeURIComponent(window.location.href)}`
  };

  const handleShare = (platform) => {
    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const shareText = `Check out "${product.title}" - it's ${fundingProgress}% funded!`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Share This Project</h3>
      
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="w-16 h-16 object-cover rounded-md"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            )}
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900 truncate">{product.title}</h4>
            <div className="mt-1 flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-gradient h-2 rounded-full" 
                  style={{ width: `${fundingProgress}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs font-medium text-gray-500">{fundingProgress}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={() => handleShare('facebook')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Share on Facebook"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.129 22 16.99 22 12z" />
            </svg>
          </div>
          <span className="mt-1 text-xs text-gray-500">Facebook</span>
        </button>
        
        <button
          onClick={() => handleShare('twitter')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Share on Twitter"
        >
          <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </div>
          <span className="mt-1 text-xs text-gray-500">Twitter</span>
        </button>
        
        <button
          onClick={() => handleShare('linkedin')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Share on LinkedIn"
        >
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </div>
          <span className="mt-1 text-xs text-gray-500">LinkedIn</span>
        </button>
        
        <button
          onClick={() => handleShare('reddit')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Share on Reddit"
        >
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
            </svg>
          </div>
          <span className="mt-1 text-xs text-gray-500">Reddit</span>
        </button>
        
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Share on WhatsApp"
        >
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <span className="mt-1 text-xs text-gray-500">WhatsApp</span>
        </button>
      </div>
      
      <div className="mt-4">
        <label htmlFor="shareText" className="block text-sm font-medium text-gray-700 mb-1">
          Share text
        </label>
        <textarea
          id="shareText"
          rows={2}
          value={shareText}
          readOnly
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
        />
        <button
          onClick={() => navigator.clipboard.writeText(shareText)}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Text
        </button>
      </div>
    </div>
  );
};

export default SocialSharing;