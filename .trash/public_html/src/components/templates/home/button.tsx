import React from 'react';

interface GradientButtonProps {
    text: string;
    variant: 'border' | 'filled'; // 'border' for gradient border, 'filled' for gradient background
    onClick?: () => void;
    disabled?: boolean;
    className?: string; // To allow additional styling
}

/**
 * GradientButton Component
 *
 * This reusable button component supports two styles:
 * 1. `border`: Renders a button with a gradient border, no background, and text in gradient color.
 * 2. `filled`: Renders a button with a gradient background and white text.
 *
 * Props:
 * - `text`: The text to display on the button.
 * - `variant`: Determines the button style ('border' or 'filled').
 * - `onClick`: Optional click handler function.
 * - `className`: Optional additional custom classes for styling.
 *
 * Usage:
 * ```
 * <GradientButton text="Click Me" variant="border" />
 * <GradientButton text="Submit" variant="filled" onClick={handleSubmit} />
 * ```
 */
const GradientButton: React.FC<GradientButtonProps> = ({ text, disabled, variant, onClick, className = '' }) => {
    // Common styles
    const baseStyles = 'px-4 py-2 !rounded-lg font-semibold text-sm transition-all';

    // Variant-specific styles
    const styles = {
        border: `bg-transparent text-green-600 border-2 border-transparent 
             border-gradient-to-r from-green-600 to-green-800 
             hover:bg-gradient-to-r hover:from-green-600 hover:to-green-800 hover:text-white`,
        filled: `bg-gradient-to-r from-green-600 to-green-800 text-white 
             hover:opacity-90`,
    };

    return (
        <button
            disabled={disabled}
            className={`${baseStyles} !rounded-lg ${variant === 'border' ? styles.border : styles.filled} ${className}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default GradientButton;