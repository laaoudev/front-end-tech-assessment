import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/setup';
import { PostCard } from './PostCard';
import { resetMocks } from '@/test/mocks.js';

/**
 * Tests for PostCard Component
 *
 * PostCard fetches data via API like UserCard and ProductCard.
 * Tests mock the fetch calls to simulate API responses.
 */
describe('PostCard', () => {
	beforeEach(() => {
		resetMocks();
		globalThis.fetch = vi.fn();
	});

	it('should display loading state while fetching post data', async () => {
		(globalThis.fetch as any).mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(
						() =>
							resolve({
								ok: true,
								json: async () => ({
									id: 1,
									title: 'Getting Started with React Hooks',
									content:
										'React Hooks revolutionize how we write functional components.',
									author: 'Sarah Chen',
									publishedAt: '2024-03-15',
									likes: 324,
									published: true
								})
							}),
						100
					)
				)
		);

		render(<PostCard postId={1} />);

		// Initially should show loading
		expect(screen.getByTestId('post-card-loading')).toBeInTheDocument();

		// Eventually should show content
		await waitFor(() => {
			expect(screen.getByText('Getting Started with React Hooks')).toBeInTheDocument();
		});
	});

	it('should render post with title, author, and content', async () => {
		(globalThis.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({
				id: 1,
				title: 'Getting Started with React Hooks',
				content: 'React Hooks revolutionize how we write functional components.',
				author: 'Sarah Chen',
				publishedAt: '2024-03-15',
				likes: 324,
				published: true
			})
		});

		render(<PostCard postId={1} />);

		await waitFor(() => {
			expect(screen.getByText('Getting Started with React Hooks')).toBeInTheDocument();
			expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
			expect(
				screen.getByText(/React Hooks revolutionize how we write functional components/)
			).toBeInTheDocument();
		});
	});

	it('should display publish date in correct format', async () => {
		(globalThis.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({
				id: 1,
				title: 'Test Post',
				content: 'Test content',
				author: 'Test Author',
				publishedAt: '2024-03-15',
				likes: 100,
				published: true
			})
		});

		render(<PostCard postId={1} />);

		await waitFor(() => {
			expect(screen.getByText('3/15/2024')).toBeInTheDocument();
		});
	});

	it('should show published status correctly', async () => {
		(globalThis.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({
				id: 1,
				title: 'Published Post',
				content: 'Content',
				author: 'Author',
				publishedAt: '2024-03-15',
				likes: 100,
				published: true
			})
		});

		render(<PostCard postId={1} />);

		await waitFor(() => {
			// Post is published, so draft badge should NOT appear
			expect(screen.queryByText('Concept')).not.toBeInTheDocument();
		});
	});

	it('should show draft badge for unpublished posts', async () => {
		(globalThis.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({
				id: 5,
				title: 'Draft Post',
				content: 'Content',
				author: 'Author',
				publishedAt: '2024-03-25',
				likes: 0,
				published: false
			})
		});

		render(<PostCard postId={5} />);

		await waitFor(() => {
			expect(screen.getByText('Concept')).toBeInTheDocument();
		});
	});

	it('should increment likes when like button is clicked', async () => {
		(globalThis.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({
				id: 1,
				title: 'Test Post',
				content: 'Content',
				author: 'Author',
				publishedAt: '2024-03-15',
				likes: 324,
				published: true
			})
		});

		render(<PostCard postId={1} />);

		await waitFor(() => {
			const likeBtn = screen.getByTestId('post-card-like-btn');
			expect(likeBtn).toHaveTextContent('324');

			fireEvent.click(likeBtn);
			expect(likeBtn).toHaveTextContent('325');
		});
	});

	it('should decrement likes when like button is clicked again (toggle)', async () => {
		(globalThis.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({
				id: 1,
				title: 'Test Post',
				content: 'Content',
				author: 'Author',
				publishedAt: '2024-03-15',
				likes: 324,
				published: true
			})
		});

		render(<PostCard postId={1} />);

		await waitFor(() => {
			const likeBtn = screen.getByTestId('post-card-like-btn');
			expect(likeBtn).toHaveTextContent('324');

			fireEvent.click(likeBtn);
			expect(likeBtn).toHaveTextContent('325');

			fireEvent.click(likeBtn);
			expect(likeBtn).toHaveTextContent('324');
		});
	});

	it('should apply liked styling when post is liked', async () => {
		(globalThis.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({
				id: 1,
				title: 'Test Post',
				content: 'Content',
				author: 'Author',
				publishedAt: '2024-03-15',
				likes: 100,
				published: true
			})
		});

		render(<PostCard postId={1} />);

		await waitFor(() => {
			const likeBtn = screen.getByTestId('post-card-like-btn');

			expect(likeBtn).not.toHaveClass('post-card__btn--liked');

			fireEvent.click(likeBtn);
			expect(likeBtn).toHaveClass('post-card__btn--liked');

			fireEvent.click(likeBtn);
			expect(likeBtn).not.toHaveClass('post-card__btn--liked');
		});
	});

	it('should maintain independent like counts and states for different posts', async () => {
		(globalThis.fetch as any)
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					id: 1,
					title: 'Post 1',
					content: 'Content 1',
					author: 'Author 1',
					publishedAt: '2024-03-15',
					likes: 324,
					published: true
				})
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					id: 2,
					title: 'Post 2',
					content: 'Content 2',
					author: 'Author 2',
					publishedAt: '2024-03-18',
					likes: 187,
					published: true
				})
			});

		const { rerender } = render(<PostCard postId={1} />);

		await waitFor(() => {
			const likeBtn1 = screen.getByTestId('post-card-like-btn');
			fireEvent.click(likeBtn1);
			expect(likeBtn1).toHaveTextContent('325');
		});

		rerender(<PostCard postId={2} />);

		await waitFor(() => {
			const likeBtn2 = screen.getByTestId('post-card-like-btn');
			expect(likeBtn2).toHaveTextContent('187');
			expect(likeBtn2).not.toHaveClass('post-card__btn--liked');
		});
	});

	it('should handle non-existent post gracefully', async () => {
		(globalThis.fetch as any).mockResolvedValue({
			ok: false,
			json: async () => ({
				error: 'Not found'
			})
		});

		render(<PostCard postId={999} />);

		await waitFor(() => {
			expect(screen.getByTestId('post-card-not-found')).toBeInTheDocument();
		});
	});
});
