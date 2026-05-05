import { vi } from 'vitest';

/**
 * Shared test setup for mocking fetch globally
 *
 * This file is imported by vitest.config.ts and runs before all tests.
 * It sets up a global fetch mock that can be controlled in individual tests.
 *
 * Usage in test files:
 *   import { resetMocks } from '@/test/mocks'
 *
 *   describe('MyComponent', () => {
 *     beforeEach(() => {
 *       resetMocks()
 *     })
 *   })
 */

/**
 * Setup global fetch mock
 * Call this in beforeEach hook in your test files
 */
export function setupMockFetch(): void {
	if (typeof fetch === 'undefined') {
		globalThis.fetch = vi.fn();
	}
}

/**
 * Reset all mocks between tests
 */
export function resetMocks(): void {
	vi.resetAllMocks();
}

/**
 * Helper to mock successful API response
 */
export function mockFetchSuccess(data: unknown): void {
	(globalThis.fetch as any).mockResolvedValue({
		ok: true,
		json: async () => data
	});
}

/**
 * Helper to mock failed API response
 */
export function mockFetchError(error: string, code?: string): void {
	(globalThis.fetch as any).mockResolvedValue({
		ok: false,
		json: async () => ({
			error,
			code
		})
	});
}

/**
 * Helper to mock delayed response (for testing loading states)
 */
export function mockFetchDelayed(data: unknown, delay: number = 100): void {
	(globalThis.fetch as any).mockImplementation(
		() =>
			new Promise((resolve) =>
				setTimeout(
					() =>
						resolve({
							ok: true,
							json: async () => data
						}),
					delay
				)
			)
	);
}

/**
 * Helper to setup multiple responses for sequential calls
 */
export function mockFetchSequence(...responses: Array<{ ok: boolean; data: unknown }>): void {
	(globalThis.fetch as any)
		.mockResolvedValueOnce({
			ok: responses[0].ok,
			json: async () => responses[0].data
		})
		.mockResolvedValueOnce({
			ok: responses[1].ok,
			json: async () => responses[1].data
		});

	// Add more if needed, but handle dynamically
	for (let i = 2; i < responses.length; i++) {
		(globalThis.fetch as any).mockResolvedValueOnce({
			ok: responses[i].ok,
			json: async () => responses[i].data
		});
	}
}
