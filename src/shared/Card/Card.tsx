import { ReactNode } from 'react';

interface CardProps {
	header: ReactNode;
	body: ReactNode;
	footer: ReactNode;
	dataTestId?: string;
	className?: string;
}

/**
 * BaseCard Component - Headless card structure
 *
 * Provides a flexible, reusable card layout with three main sections:
 * - header: For title, badges, and metadata
 * - body: For main content
 * - footer: For actions, controls, and buttons
 *
 * This component handles only the structure. Styling and entity-specific
 * logic are delegated to the parent component.
 */
export const Card: React.FC<CardProps> = ({
	header,
	body,
	footer,
	dataTestId = 'card',
	className = 'card',
}) => (
	<div data-testid={dataTestId} className={className}>
		<div className={`${className}__header`}>{header}</div>
		<div className={`${className}__body`}>{body}</div>
		<div className={`${className}__footer`}>{footer}</div>
	</div>
);
