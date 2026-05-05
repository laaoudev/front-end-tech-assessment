/**
 * PostGrid Component
 *
 * Displays all mock posts in a grid layout using the shared Grid component.
 * Shows published and unpublished posts, different like counts, and various states.
 */

import { PostCard } from '../PostCard/PostCard';
import { Grid, GridItem } from '../../shared/Grid/Grid';

export const PostGrid: React.FC = () => {
	const postIds = [1, 2, 3, 4, 5];

	return (
		<Grid
			title="All Posts"
			subtitle="Mix of published and unpublished posts with varying engagement levels."
		>
			{postIds.map((postId) => (
				<GridItem key={postId}>
					<PostCard postId={postId} />
				</GridItem>
			))}
		</Grid>
	);
};
