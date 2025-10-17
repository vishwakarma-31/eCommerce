import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';

const OrderFeed = () => {
  const { emitEvent } = useSocket();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  // Simulate receiving new orders
  useEffect(() => {
    // In a real implementation, we would listen for 'newOrder' events from the socket
    // For now, we'll simulate with mock data
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new order
        const newOrder = {
          id: Date.now(),
          orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'][Math.floor(Math.random() * 4)],
          amount: (Math.random() * 500 + 20).toFixed(2),
          status: ['Processing', 'Confirmed', 'Shipped', 'Delivered'][Math.floor(Math.random() * 4)],
          timestamp: new Date()
        };
        
        setOrders(prev => [newOrder, ...prev.slice(0, 9)]); // Keep only last 10 orders
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleOrderStatusChange = (orderId, newStatus) => {
    // Update order status locally
    setOrders(prev => 
      prev.map(order => 
        order.orderId === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
    
    // Emit event to server to update order status
    emitEvent('orderStatusChanged', { orderId, newStatus });
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Live Order Feed</h3>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Orders</option>
              <option value="Processing">Processing</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
            <p className="mt-1 text-sm text-gray-500">New orders will appear here in real-time.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <li key={order.id} className="px-4 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      Order {order.orderId}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customerName} • ${order.amount}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.orderId, e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderFeed;