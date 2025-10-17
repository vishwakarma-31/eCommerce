import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from '../common/Loader';
import Button from '../common/Button';

const PerformanceMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetchPerformanceMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchPerformanceMetrics, 30000);
    
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchPerformanceMetrics = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from the backend API
      // For now, we'll simulate the data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate performance metrics data
      const simulatedMetrics = {
        apiCalls: Math.floor(Math.random() * 10000) + 5000,
        cacheHits: Math.floor(Math.random() * 8000) + 2000,
        cacheMisses: Math.floor(Math.random() * 2000) + 500,
        databaseQueries: Math.floor(Math.random() * 15000) + 5000,
        averageResponseTime: Math.floor(Math.random() * 200) + 50,
        totalResponseTime: Math.floor(Math.random() * 50000) + 10000,
        slowRequests: Math.floor(Math.random() * 100) + 10,
        bytesTransferred: Math.floor(Math.random() * 10000000) + 5000000,
        cacheHitRatio: function() {
          const total = this.cacheHits + this.cacheMisses;
          return total > 0 ? Math.round((this.cacheHits / total) * 100) : 0;
        },
        requestsPerMinute: Math.floor(Math.random() * 500) + 100,
        errorRate: Math.floor(Math.random() * 5) + 1,
        activeConnections: Math.floor(Math.random() * 100) + 50,
        memoryUsage: Math.floor(Math.random() * 80) + 20,
        cpuUsage: Math.floor(Math.random() * 70) + 10
      };
      
      // Add calculated fields
      simulatedMetrics.cacheHitRatio = simulatedMetrics.cacheHitRatio();
      
      setMetrics(simulatedMetrics);
      setError(null);
    } catch (err) {
      setError('Failed to fetch performance metrics');
      console.error('Error fetching performance metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetMetrics = async () => {
    try {
      // In a real implementation, this would call the backend API to reset metrics
      alert('Metrics reset successfully');
      fetchPerformanceMetrics();
    } catch (err) {
      setError('Failed to reset metrics');
      console.error('Error resetting metrics:', err);
    }
  };

  const handleExport = (format) => {
    // In a real implementation, this would export the metrics
    alert(`Exporting metrics as ${format.toUpperCase()}`);
  };

  if (loading && !metrics) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Generate chart data
  const responseTimeData = [];
  const requestsData = [];
  const cpuUsageData = [];
  const memoryUsageData = [];
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date();
    time.setHours(time.getHours() - i);
    
    responseTimeData.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responseTime: Math.floor(Math.random() * 300) + 50
    });
    
    requestsData.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      requests: Math.floor(Math.random() * 200) + 50
    });
    
    cpuUsageData.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cpu: Math.floor(Math.random() * 80) + 10
    });
    
    memoryUsageData.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      memory: Math.floor(Math.random() * 70) + 20
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Performance Monitoring
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button onClick={() => handleExport('csv')} size="sm">
            Export CSV
          </Button>
          <Button onClick={() => handleExport('pdf')} size="sm">
            Export PDF
          </Button>
          <Button onClick={handleResetMetrics} variant="danger" size="sm">
            Reset Metrics
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">API Calls</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{metrics.apiCalls.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Response Time</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{metrics.averageResponseTime}ms</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Cache Hit Ratio</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{metrics.cacheHitRatio}%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Slow Requests</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{metrics.slowRequests}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Response Time Trends */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Response Time Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="responseTime" stroke="#8884d8" fill="#8884d8" name="Response Time (ms)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests Per Minute */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Requests Per Minute</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#82ca9d" name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* CPU Usage */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">CPU Usage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cpuUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#ff7300" name="CPU Usage (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Memory Usage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memoryUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="memory" stroke="#0088fe" name="Memory Usage (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cache Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Cache Hits</span>
                <span className="text-sm font-medium text-gray-700">{metrics.cacheHits.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Cache Misses</span>
                <span className="text-sm font-medium text-gray-700">{metrics.cacheMisses.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Hit Ratio</span>
                <span className="text-sm font-medium text-gray-700">{metrics.cacheHitRatio}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${metrics.cacheHitRatio}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Resources</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Active Connections</span>
                <span className="text-sm font-medium text-gray-700">{metrics.activeConnections}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Database Queries</span>
                <span className="text-sm font-medium text-gray-700">{metrics.databaseQueries.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Bytes Transferred</span>
                <span className="text-sm font-medium text-gray-700">{(metrics.bytesTransferred / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Error Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Error Rate</span>
                <span className="text-sm font-medium text-gray-700">{metrics.errorRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${metrics.errorRate}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Slow Requests</span>
                <span className="text-sm font-medium text-gray-700">{metrics.slowRequests}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total API Calls
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {metrics.apiCalls.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Total number of API requests processed
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Average Response Time
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {metrics.averageResponseTime} ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Average time to respond to API requests
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Cache Hit Ratio
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {metrics.cacheHitRatio}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Percentage of requests served from cache
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Database Queries
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {metrics.databaseQueries.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Total number of database queries executed
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Bytes Transferred
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(metrics.bytesTransferred / 1024 / 1024).toFixed(2)} MB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Total data transferred to clients
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitoringDashboard;