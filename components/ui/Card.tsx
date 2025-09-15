
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleIcon?: JSX.Element;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleIcon }) => {
  return (
    <div className={`bg-aqua-dark rounded-xl shadow-lg p-4 md:p-6 ${className}`}>
      {title && (
        <div className="flex items-center mb-4">
          {titleIcon && <span className="text-aqua-accent mr-3">{titleIcon}</span>}
          <h3 className="text-lg font-semibold text-aqua-text-primary">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
