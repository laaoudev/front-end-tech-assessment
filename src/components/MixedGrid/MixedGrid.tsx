/**
 * MixedGrid Component
 *
 * Displays 2 of each card type (User, Product, Post) in a grid layout.
 * Perfect for demonstrating height inconsistency across different card types
 * and for working on grid item height consistency bonus challenges.
 */

import { UserCard } from '../UserCard/UserCard';
import { ProductCard } from '../ProductCard/ProductCard';
import { PostCard } from '../PostCard/PostCard';
import { Grid, GridItem } from '../../shared/Grid/Grid';

export const MixedGrid: React.FC = () => (
	<Grid title="Mixed Cards Preview" subtitle="2 of each card type showing height inconsistency">
		<GridItem>
			<UserCard userId={1} />
		</GridItem>
		<GridItem>
			<ProductCard productId={1} />
		</GridItem>
		<GridItem>
			<PostCard postId={1} />
		</GridItem>
		<GridItem>
			<UserCard userId={2} />
		</GridItem>
		<GridItem>
			<ProductCard productId={2} />
		</GridItem>
		<GridItem>
			<PostCard postId={2} />
		</GridItem>
	</Grid>
);
