import React, { useState, useEffect } from 'react';
import { BarChart3, Table2, StickyNote } from 'lucide-react';
import Link from 'next/link';

const FloatingNav = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const navItems = [
    {
      icon: Table2,
      label: 'Tablas',
      href: './dashboard/tables'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      href: '/analytics'
    },
    {
      icon: StickyNote,
      label: 'Notas',
      href: '/notes'
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <nav 
        className={`bg-primary backdrop-blur-lg rounded-full shadow-2xl border border-gray-200/50 px-3 py-2 transition-all duration-300 ${
          isScrolling || isHovered ? 'opacity-100' : 'opacity-50'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-2">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:bg-blue-50 hover:scale-110 text-gray-600 hover:text-blue-600"
                >
                  <IconComponent size={20} strokeWidth={1.5} />
                </Link>
                
               
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                  <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                    {item.label}
            
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                  </div>
                </div>
                
             
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                  <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                    {item.label}
                   
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
export default FloatingNav;