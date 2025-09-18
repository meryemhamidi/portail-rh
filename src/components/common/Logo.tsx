import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo officiel Teal */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <img 
          src="/teal-logo-new.svg" 
          alt="Teal Technology Services" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Texte du logo */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-teal-primary ${textSizeClasses[size]} leading-tight`}>
            Teal Technology
          </span>
          <span className={`font-medium text-gray-600 ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} leading-tight`}>
            Services
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
