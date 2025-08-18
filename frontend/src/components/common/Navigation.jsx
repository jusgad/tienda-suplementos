import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ mobile = false }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { 
      path: '/shop', 
      label: 'Shop',
      submenu: [
        { path: '/shop/vitamins', label: 'Vitamins' },
        { path: '/shop/minerals', label: 'Minerals' },
        { path: '/shop/herbal', label: 'Herbal' },
        { path: '/shop/sports-nutrition', label: 'Sports Nutrition' },
        { path: '/shop/protein', label: 'Protein' },
        { path: '/shop/amino-acids', label: 'Amino Acids' },
        { path: '/shop/omega-fatty-acids', label: 'Omega Fatty Acids' },
        { path: '/shop/probiotics', label: 'Probiotics' }
      ]
    },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/shop' && location.pathname.startsWith('/shop'));
  };

  const navClass = mobile 
    ? "flex flex-col space-y-2" 
    : "flex items-center space-x-6";

  const linkClass = (path) => {
    const baseClass = mobile 
      ? "block py-2 px-4 rounded-md hover:bg-green-800 transition-colors" 
      : "hover:text-orange-300 transition-colors relative";
    
    const activeClass = isActive(path) 
      ? mobile 
        ? "bg-green-800 text-orange-300" 
        : "text-orange-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-orange-300"
      : "";
    
    return `${baseClass} ${activeClass}`;
  };

  return (
    <nav className={navClass}>
      {navItems.map((item) => (
        <div key={item.path} className="relative group">
          <Link to={item.path} className={linkClass(item.path)}>
            {item.label}
            {item.submenu && !mobile && (
              <svg className="inline-block ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </Link>

          {/* Desktop Submenu */}
          {item.submenu && !mobile && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 invisible group-hover:visible z-50">
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900"
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}

          {/* Mobile Submenu */}
          {item.submenu && mobile && (
            <div className="ml-4 mt-2 space-y-1">
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className="block py-1 px-2 text-sm hover:text-orange-300"
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navigation;