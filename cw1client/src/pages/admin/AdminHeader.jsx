// Header Component
import React from "react";
import { Bell } from "react-feather";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  // Define page titles and subtitles based on routes
  const getPageInfo = () => {
    const path = location.pathname;
    
    const pageMap = {
      '/admin/dashboard': {
        title: 'Dashboard',
        subtitle: 'Welcome back, Manager',
        icon: '🏠'
      },
      '/admin/staff': {
        title: 'Staff Management',
        subtitle: 'Manage your team members',
        icon: '👔'
      },
      '/admin/customers': {
        title: 'Customers',
        subtitle: 'View and manage customer information',
        icon: '👥'
      },
      '/admin/orders': {
        title: 'Orders',
        subtitle: 'Track and manage all orders',
        icon: '🛍️'
      },
      '/admin/service-control': {
        title: 'Service Control',
        subtitle: 'Manage services and categories',
        icon: '⚙️'
      },
      '/admin/task-manager': {
        title: 'Task Manager',
        subtitle: 'Assign and track tasks',
        icon: '📋'
      },
      '/admin/payments': {
        title: 'Payments',
        subtitle: 'View payment history and transactions',
        icon: '💰'
      },
      '/admin/reports': {
        title: 'Reports',
        subtitle: 'Comprehensive business reports and insights',
        icon: '📊'
      }
    };

    // Return matching page info or default
    return pageMap[path] || {
      title: 'Dashboard',
      subtitle: 'Welcome back, Manager',
      icon: '🏠'
    };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">{pageInfo.icon}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {pageInfo.title}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{pageInfo.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors duration-200 group">
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          
          <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-4 py-2.5 border border-purple-100 hover:border-purple-200 transition-all duration-200 cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">AM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">Admin Manager</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;