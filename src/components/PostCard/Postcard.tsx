import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../shared/Card/Card';
import { Post } from '../../shared/types';
import './PostCard.css';

/**
 * PostCard Component
 *
 * Displays a blog post with:
 * - Title, author, publish date, content
 * - Like button with local state management
 * - Published/unpublished status indicator
 *
 * Uses the headless Card component for consistent structure.
 * Fetches post data via API like UserCard and ProductCard.
 */
export const PostCard: React.FC<{ postId: number }> = ({ postId }) => {
	const { t } = useTranslation();
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [likes, setLikes] = useState(0);
	const [hasLiked, setHasLiked] = useState(false);

	useEffect(() => {
		const fetchPostData = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/posts/${postId}`);

				if (!response.ok) throw new Error('Post ophalen mislukt');

				const data = await response.json();

				setPost(data);
				setLikes(data.likes);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Onbekende fout');
			} finally {
				setLoading(false);
			}
		};

		fetchPostData();
	}, [postId]);

	if (loading) return <div data-testid="post-card-loading">{t('postCard.loading')}</div>;
	if (error) {
		return (
			<div data-testid="post-card-error">
				{t('postCard.error')}
				{error}
			</div>
		);
	}
	if (!post) {
		return <div data-testid="post-card-not-found">{t('postCard.notFound')}</div>;
	}

	const publishedDate = new Date(post.publishedAt).toLocaleDateString();
	const isPublished = post.published;

	const handleLikeToggle = () => {
		if (hasLiked) {
			setLikes(likes - 1);
			setHasLiked(false);
		} else {
			setLikes(likes + 1);
			setHasLiked(true);
		}
	};

	const header = (
		<div>
			<h3 className="post-card__title">{post.title}</h3>
			<div className="post-card__meta">
				<span className="post-card__author">{post.author}</span>
				{!isPublished && (
					<span className="post-card__badge post-card__badge--draft">
						{t('postCard.draft')}
					</span>
				)}
			</div>
		</div>
	);

	const body = (
		<div>
			<p className="post-card__date">{publishedDate}</p>
			<p className="post-card__description">{post.content}</p>
		</div>
	);

	const footer = (
		<div className="post-card__actions">
			<button
				data-testid="post-card-like-btn"
				type="button"
				onClick={handleLikeToggle}
				className={`post-card__btn post-card__btn--like ${hasLiked ? 'post-card__btn--liked' : ''}`}
			>
				👍 {likes}
			</button>
		</div>
	);

	return (
		<Card
			header={header}
			body={body}
			footer={footer}
			dataTestId="post-card"
			className="post-card"
		/>
	);
};
