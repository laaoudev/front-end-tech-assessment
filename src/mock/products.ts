/**
 * Mock data for Products
 * Used for development and testing without a real API
 */

export interface Product {
	id: number;
	name: string;
	price: number;
	stock: number;
	category: string;
	description: string;
}

export const MOCK_PRODUCTS: Record<number, Product> = {
	1: {
		id: 1,
		name: 'Wireless Headphones',
		price: 79.99,
		stock: 15,
		category: 'Electronics',
		description: 'High-quality wireless headphones with noise cancellation'
	},
	2: {
		id: 2,
		name: 'Mechanical Keyboard',
		price: 149.99,
		stock: 8,
		category: 'Electronics',
		description: 'Professional mechanical keyboard with RGB lighting'
	},
	3: {
		id: 3,
		name: 'USB-C Cable',
		price: 12.99,
		stock: 0,
		category: 'Accessories',
		description: '2-meter durable USB-C charging and data cable'
	},
	4: {
		id: 4,
		name: '4K Monitor',
		price: 399.99,
		stock: 3,
		category: 'Electronics',
		description: '27-inch 4K UHD monitor with HDR support'
	},
	5: {
		id: 5,
		name: 'Desk Lamp',
		price: 34.99,
		stock: 22,
		category: 'Office',
		description: 'LED desk lamp with adjustable brightness and color temperature'
	}
};

export const DEFAULT_PRODUCT: Product = MOCK_PRODUCTS[1];
