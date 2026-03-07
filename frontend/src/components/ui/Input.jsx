import { forwardRef } from 'react';

export const Input = forwardRef(({ className = '', error, ...props }, ref) => {
    return (
        <div className="w-full relative">
            <input
                ref={ref}
                className={`w-full bg-surface border border-surface-hover rounded-xl px-4 py-3 text-white placeholder:text-text-secondary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all ${error ? 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-brand-danger text-xs mt-1 absolute -bottom-5 left-1">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';
