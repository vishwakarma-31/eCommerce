import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import Button from '../common/Button';
import Loader from '../common/Loader';

const ProductQA = ({ product, onQuestionAdded, onAnswerAdded, onUpvote }) => {
  const { user, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState(product.questions || []);
  const [newQuestion, setNewQuestion] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to add a new question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please log in to ask a question');
      return;
    }
    
    if (!newQuestion.trim()) {
      setError('Please enter a question');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const updatedProduct = await productService.addQuestion(product._id, newQuestion);
      setQuestions(updatedProduct.questions);
      setNewQuestion('');
      setShowQuestionForm(false);
      
      if (onQuestionAdded) {
        onQuestionAdded(updatedProduct);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  // Function to add an answer to a question
  const handleAddAnswer = async (questionId, answerText) => {
    if (!isAuthenticated) {
      setError('Please log in to answer a question');
      return;
    }
    
    if (!answerText.trim()) {
      setError('Please enter an answer');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const updatedProduct = await productService.addAnswer(product._id, questionId, answerText);
      setQuestions(updatedProduct.questions);
      
      if (onAnswerAdded) {
        onAnswerAdded(updatedProduct);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add answer');
    } finally {
      setLoading(false);
    }
  };

  // Function to upvote a question
  const handleUpvoteQuestion = async (questionId) => {
    if (!isAuthenticated) {
      setError('Please log in to upvote');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const updatedProduct = await productService.upvoteQuestion(product._id, questionId);
      setQuestions(updatedProduct.questions);
      
      if (onUpvote) {
        onUpvote(updatedProduct);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upvote question');
    } finally {
      setLoading(false);
    }
  };

  // Function to upvote an answer
  const handleUpvoteAnswer = async (questionId, answerId) => {
    if (!isAuthenticated) {
      setError('Please log in to upvote');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const updatedProduct = await productService.upvoteAnswer(product._id, questionId, answerId);
      setQuestions(updatedProduct.questions);
      
      if (onUpvote) {
        onUpvote(updatedProduct);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upvote answer');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if user has upvoted a question
  const hasUpvotedQuestion = (question) => {
    if (!user) return false;
    return question.upvotedBy.some(id => id === user._id);
  };

  // Check if user has upvoted an answer
  const hasUpvotedAnswer = (answer) => {
    if (!user) return false;
    return answer.upvotedBy.some(id => id === user._id);
  };

  return (
    <div className="mt-12">
      <div className="border-t border-gray-200 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Questions & Answers</h2>
          {isAuthenticated && (
            <Button
              variant="primary"
              onClick={() => setShowQuestionForm(!showQuestionForm)}
            >
              {showQuestionForm ? 'Cancel' : 'Ask a Question'}
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Question Form */}
        {showQuestionForm && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ask a Question</h3>
            <form onSubmit={handleAddQuestion}>
              <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Question
                </label>
                <textarea
                  id="question"
                  rows={3}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ask your question about this product..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowQuestionForm(false);
                    setNewQuestion('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Question'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No questions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Be the first to ask a question about this product.
              </p>
            </div>
          ) : (
            questions
              .sort((a, b) => b.upvotes - a.upvotes) // Sort by upvotes
              .map((question) => (
                <div key={question._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-900">{question.question}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>{question.user?.name || 'Anonymous'}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(question.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleUpvoteQuestion(question._id)}
                        disabled={!isAuthenticated || loading}
                        className={`flex items-center text-sm font-medium ${
                          hasUpvotedQuestion(question)
                            ? 'text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <svg
                          className={`h-5 w-5 ${hasUpvotedQuestion(question) ? 'text-indigo-600' : 'text-gray-400'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-1">{question.upvotes}</span>
                      </button>
                    </div>
                  </div>

                  {/* Answers */}
                  <div className="mt-6 space-y-4">
                    {question.answers.map((answer) => (
                      <div key={answer._id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-gray-700">{answer.answer}</p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <span>{answer.user?.name || 'Anonymous'}</span>
                              {answer.isAdmin && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  Admin
                                </span>
                              )}
                              <span className="mx-2">•</span>
                              <span>{formatDate(answer.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleUpvoteAnswer(question._id, answer._id)}
                              disabled={!isAuthenticated || loading}
                              className={`flex items-center text-sm font-medium ${
                                hasUpvotedAnswer(answer)
                                  ? 'text-indigo-600'
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              <svg
                                className={`h-4 w-4 ${hasUpvotedAnswer(answer) ? 'text-indigo-600' : 'text-gray-400'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="ml-1">{answer.upvotes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Answer Form for Admin/Creator */}
                    {isAuthenticated && (user.role === 'Admin' || user.role === 'Creator') && (
                      <div className="mt-4">
                        <AnswerForm
                          questionId={question._id}
                          onSubmit={handleAddAnswer}
                          loading={loading}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

// Answer Form Component
const AnswerForm = ({ questionId, onSubmit, loading }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(questionId, answer);
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Add an answer..."
        />
        <Button
          type="submit"
          disabled={loading || !answer.trim()}
        >
          {loading ? 'Submitting...' : 'Answer'}
        </Button>
      </div>
    </form>
  );
};

export default ProductQA;