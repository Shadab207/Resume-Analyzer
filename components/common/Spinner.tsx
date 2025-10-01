
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent border-primary-500`} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
};
   