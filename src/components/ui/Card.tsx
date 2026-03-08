import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
      'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all',
      onClick && 'cursor-pointer hover:shadow-md hover:border-indigo-200',
      className
    )}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('p-6 border-b border-gray-100', className)}>{children}</div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('p-6', className)}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('p-6 border-t border-gray-100 bg-gray-50/50', className)}>{children}</div>
);