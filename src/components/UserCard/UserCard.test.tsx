import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/setup';
import { UserCard } from './UserCard';
import { resetMocks } from '@/test/mocks.js';

/**
 * BEFORE: Tests for the tightly-coupled UserCard component
 *
 * These tests are difficult to write because:
 * 1. Hard to mock API calls (global fetch)
 * 2. Component tightly coupled to /api/users endpoint
 * 3. Can't easily test the logic independently
 * 4. Must mock entire fetch behavior for each test
 */

describe('UserCard (Before Refactoring)', () => {
	// Mock global fetch
	beforeEach(() => {
		resetMocks();
		globalThis.fetch = vi.fn();
	});

	/**
	 * TEST 1: Component renders loading state initially
	 *
	 * What to test:
	 * - Verify loading indicator appears while data fetches
	 * - Component should show "Loading user..." text
	 */
	it('should display loading state while fetching user data', async () => {
		// Mock a delayed response to see loading state
		(globalThis.fetch as any).mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(
						() =>
							resolve({
								ok: true,
								json: async () => ({
									id: 1,
									name: 'John Doe',
									email: 'john@example.com',
									role: 'user',
									createdAt: '2024-01-01'
								})
							}),
						100
					)
				)
		);

		render(<UserCard userId={1} />);

		// Should show loading message
		expect(screen.getByTestId('user-card__loading')).toBeInTheDocument();

		// Wait for data to load
		await waitFor(() => {
			expect(screen.queryByTestId('user-card__loading')).not.toBeInTheDocument();
		});

		// Should display user data
		expect(screen.getByText('John Doe')).toBeInTheDocument();
	});

	/**
	 * TEST 2: Component displays user data correctly and shows admin badge
	 *
	 * What to test:
	 * - User name, email, and created date render correctly
	 * - Admin badge appears for admin users
	 * - Edit button is available
	 */
	it('should render user data and show admin badge for admin users', async () => {
		(globalThis.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({
				id: 1,
				name: 'Admin User',
				email: 'admin@example.com',
				role: 'admin',
				createdAt: '2024-01-01'
			})
		});

		render(<UserCard userId={1} />);

		await waitFor(() => {
			expect(screen.getByText('Admin User')).toBeInTheDocument();
		});

		// Verify data is rendered
		expect(screen.getByText(/admin@example.com/)).toBeInTheDocument();
		expect(screen.getByTestId('user-card__edit-btn')).toBeInTheDocument();
		expect(document.querySelector('.user-card__badge')).toHaveTextContent('Beheerder');
	});

	/**
	 * TEST 3: Component allows editing and saving user name
	 *
	 * What to test:
	 * - Edit button switches to edit mode
	 * - Input field appears and can be modified
	 * - Save button persists changes via API
	 * - Component returns to display mode after save
	 */
	it('should allow editing and saving user name', async () => {
		const mockUserData = {
			id: 1,
			name: 'John Doe',
			email: 'john@example.com',
			role: 'admin',
			createdAt: '2024-01-01'
		};

		// Mock fetch for initial load and save
		(globalThis.fetch as any)
			.mockResolvedValueOnce({
				ok: true,
				json: async () => mockUserData
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ ...mockUserData, name: 'Jane Doe' })
			});

		render(<UserCard userId={1} />);

		// Wait for initial load
		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		// Click Edit button
		const editBtn = screen.getByTestId('user-card__edit-btn');
		fireEvent.click(editBtn);

		// Input should appear in edit mode
		const input = screen.getByTestId('user-card__title-input') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.value).toBe('John Doe');

		// Change name
		fireEvent.change(input, { target: { value: 'Jane Doe' } });
		expect(input.value).toBe('Jane Doe');

		// Click Save button
		const saveBtn = screen.getByTestId('user-card__save-btn');
		fireEvent.click(saveBtn);

		// Should verify fetch was called with updated data
		await waitFor(() => {
			expect(globalThis.fetch).toHaveBeenCalledWith(
				'/api/users/1',
				expect.objectContaining({
					method: 'PUT'
				})
			);
		});

		// Should return to display mode
		expect(screen.queryByTestId('user-card__title-input')).not.toBeInTheDocument();
	});

	/**
	 * TEST 4: Non-admin users cannot edit (permission check)
	 *
	 * What to test:
	 * - Edit button is disabled for non-admin users
	 * - Button shows permission denied tooltip
	 * - Admin users have enabled edit button
	 */
	it('should disable edit button for non-admin users', async () => {
		(globalThis.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({
				id: 2,
				name: 'Bob Smith',
				email: 'bob@example.com',
				role: 'user', // Non-admin role
				createdAt: '2024-02-20'
			})
		});

		render(<UserCard userId={2} />);

		await waitFor(() => {
			expect(screen.getByText('Bob Smith')).toBeInTheDocument();
		});

		// Edit button should be disabled for non-admin users
		const editBtn = screen.getByTestId('user-card__edit-btn');
		expect(editBtn).toBeDisabled();
		expect(editBtn).toHaveAttribute('title', 'Alleen beheerders kunnen gebruikers bewerken');
	});

	/**
	 * TEST 5: Admin users cannot edit other admins (permission denied response)
	 *
	 * What to test:
	 * - When API returns permission denied, error is displayed
	 * - User cannot proceed with edit
	 */
	it('should show permission error when admin tries to edit', async () => {
		const mockUserData = {
			id: 1,
			name: 'Alice Johnson',
			email: 'alice@example.com',
			role: 'admin',
			createdAt: '2024-01-15'
		};

		// Mock fetch for initial load
		(globalThis.fetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => mockUserData
		});

		// Mock fetch for save - returns permission denied
		(globalThis.fetch as any).mockResolvedValueOnce({
			ok: false,
			json: async () => ({
				error: 'Permission denied: Only admins can edit users',
				code: 'FORBIDDEN'
			})
		});

		render(<UserCard userId={1} />);

		// Wait for initial load
		await waitFor(() => {
			expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
		});

		// Click Edit
		const editBtn = screen.getByTestId('user-card__edit-btn');
		fireEvent.click(editBtn);

		// Change name
		const input = screen.getByTestId('user-card__title-input') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'Alice New' } });

		// Click Save
		const saveBtn = screen.getByTestId('user-card__save-btn');
		fireEvent.click(saveBtn);

		// Should show permission error
		await waitFor(() => {
			expect(screen.getByTestId('user-card__permission-error')).toBeInTheDocument();
			expect(screen.getByText(/Permission denied/)).toBeInTheDocument();
		});

		// Should remain in edit mode
		expect(screen.getByTestId('user-card__title-input')).toBeInTheDocument();
	});
});
