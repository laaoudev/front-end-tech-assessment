/**
 * Mock data for Users
 * Used for development and testing without a real API
 */

export interface User {
	id: number;
	name: string;
	email: string;
	role: 'admin' | 'user';
	createdAt: string;
}

/**
 * Helper to check if a user has admin privileges
 */
export function isUserAdmin(user: User | null): boolean {
	return user?.role === 'admin';
}

export const MOCK_USERS: Record<number, User> = {
	1: {
		id: 1,
		name: 'Alice Johnson',
		email: 'alice.johnson@example.com',
		role: 'admin',
		createdAt: '2024-01-15'
	},
	2: {
		id: 2,
		name: 'Bob Smith',
		email: 'bob.smith@example.com',
		role: 'user',
		createdAt: '2024-02-20'
	},
	3: {
		id: 3,
		name: 'Carol Williams',
		email: 'carol.williams@example.com',
		role: 'user',
		createdAt: '2024-03-10'
	},
	4: {
		id: 4,
		name: 'Diana Martinez',
		email: 'diana.martinez@example.com',
		role: 'admin',
		createdAt: '2024-01-05'
	}
};

export const DEFAULT_USER: User = MOCK_USERS[1];
