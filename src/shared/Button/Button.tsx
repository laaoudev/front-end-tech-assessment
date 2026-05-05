import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary';
	children: React.ReactNode;
}

/**
 * Button Component
 *
 * A reusable button with baseline styling and variants.
 * Used by UserCard, ProductCard, PostCard for consistent interactions.
 *
 * Example:
 * <Button variant="primary" onClick={handleSave}>Save</Button>
 * <Button variant="secondary" disabled>Cancel</Button>
 */
export const Button: React.FC<ButtonProps> = ({
	variant = 'primary',
	className = '',
	...props
}) => {
	const baseClass = 'btn';
	const variantClass = `btn--${variant}`;
	const finalClass = `${baseClass} ${variantClass} ${className}`.trim();

	return <button {...props} className={finalClass} />;
};

export default Button;
