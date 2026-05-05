import React from 'react';
import './Grid.css';

export interface GridProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	className?: string;
}

/**
 * Grid Component
 *
 * A reusable grid layout for displaying collections of items (cards).
 * Provides responsive layout, title, and optional subtitle.
 * Used by UserGrid, ProductGrid to display multiple cards in a grid.
 *
 * Example:
 * <Grid title="All Users" subtitle="View all user cards">
 *   {users.map(user => <UserCard key={user.id} userId={user.id} />)}
 * </Grid>
 */
export const Grid: React.FC<GridProps> = ({ title, subtitle, children, className = '' }) => {
	return (
		<div className={`grid-container ${className}`.trim()}>
			<h2 className="grid-title">{title}</h2>
			{subtitle && <p className="grid-subtitle">{subtitle}</p>}
			<div className="grid">{children}</div>
		</div>
	);
};

/**
 * GridItem Component
 *
 * Individual item wrapper within a grid. Provides consistent spacing and sizing.
 */
export const GridItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
	children,
	className = ''
}) => {
	return <div className={`grid-item ${className}`.trim()}>{children}</div>;
};

export default Grid;
