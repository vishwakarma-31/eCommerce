import React, { useState } from 'react';

const ProjectUpdates = ({ updates, canPostUpdates }) => {
  const [showForm, setShowForm] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    content: ''
  });

  const handlePostUpdate = (e) => {
    e.preventDefault();
    // In a real implementation, this would call an API to post the update
    console.log('Posting update:', newUpdate);
    setNewUpdate({ title: '', content: '' });
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Project Updates</h3>
        {canPostUpdates && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-gradient shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {showForm ? 'Cancel' : 'Post Update'}
          </button>
        )}
      </div>
      
      {showForm && (
        <form onSubmit={handlePostUpdate} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="mb-3">
            <label htmlFor="updateTitle" className="block text-sm font-medium text-gray-700">
              Update Title
            </label>
            <input
              type="text"
              id="updateTitle"
              value={newUpdate.title}
              onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="What's the update about?"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="updateContent" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="updateContent"
              rows={3}
              value={newUpdate.content}
              onChange={(e) => setNewUpdate({...newUpdate, content: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Share the details of your progress..."
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-gradient hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Post Update
            </button>
          </div>
        </form>
      )}
      
      <div className="space-y-6">
        {updates && updates.length > 0 ? (
          updates.map((update) => (
            <div key={update.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">{update.title}</h4>
                  <p className="text-sm text-gray-500">
                    {update.creatorName} • {new Date(update.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 ml-13">
                <p className="text-gray-600">{update.content}</p>
              </div>
              {update.likes > 0 && (
                <div className="mt-3 ml-13 flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {update.likes} likes
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No updates yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              {canPostUpdates 
                ? "Post your first update to keep backers informed about your progress." 
                : "Check back later for updates from the creator."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectUpdates;