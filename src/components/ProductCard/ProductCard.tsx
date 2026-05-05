import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../shared/Card/Card';
import { Button } from '../../shared/Button/Button';
import { Product } from '../../shared/types';
import '../../shared/Button/Button.css';

/**
 * BEFORE: Product Card - Sterk gekoppeld met ANDER design dan UserCard
 *
 * Opmerking:
 * 1. Vergelijkbare structuur met UserCard maar andere CSS-klassen
 * 2. Directe API-oproep naar /api/products-eindpunt
 * 3. Productspecifieke logica (prijs, voorraad, categorie)
 * 4. Ander bewerkingsschema (voorraadhoeveelheid in plaats van naam)
 * 5. Inconsistente styling-benadering - dit is het probleem dat u zult oplossen
 */

export const ProductCard: React.FC<{ productId: number }> = ({ productId }) => {
	const { t } = useTranslation();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedStock, setEditedStock] = useState(0);

	useEffect(() => {
		// Directe API-oproep - sterk gekoppeld aan productendpunt
		const fetchProductData = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/products/${productId}`);

				if (!response.ok) throw new Error('Product ophalen mislukt');

				const data = await response.json();

				setProduct(data);
				setEditedStock(data.stock);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Onbekende fout');
			} finally {
				setLoading(false);
			}
		};

		fetchProductData();
	}, [productId]);

	const handleSave = async () => {
		if (!product) return;

		try {
			// Directe API-oproep om product bij te werken
			const response = await fetch(`/api/products/${productId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ stock: editedStock }),
			});

			if (!response.ok) throw new Error('Product bijwerken mislukt');

			const updated = await response.json();

			setProduct(updated);
			setIsEditing(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Onbekende fout');
		}
	};

	if (loading) return <div data-testid="product-card-loading">{t('productCard.loading')}</div>;
	if (error) {
		return (
			<div data-testid="product-card-error">
				{t('productCard.error')}
				{error}
			</div>
		);
	}
	if (!product) {
		return <div data-testid="product-card-not-found">{t('productCard.notFound')}</div>;
	}

	// Product-specific logic
	const isInStock = product.stock > 0;
	const formattedPrice = `$${product.price.toFixed(2)}`;

	const header = (
		<div className="product-card__header-content">
			<div className="product-card__title-section">
				<h3 className="product-card__title">{product.name}</h3>
				<p className="product-card__meta">{product.category}</p>
			</div>
			<div className="product-card__badge product-card__badge--price">{formattedPrice}</div>
		</div>
	);

	const body = (
		<div>
			<div className="product-card__description-section">
				<p className="product-card__description">{product.description}</p>

				<div className="product-card__status">
					<span
						className={`product-card__stock ${
							isInStock
								? 'product-card__stock--available'
								: 'product-card__stock--sold-out'
						}`}
					>
						{isInStock ? t('productCard.inStock') : t('productCard.soldOut')}
					</span>
				</div>
			</div>

			<div className="product-card__controls">
				{isEditing ? (
					<div className="product-card__edit-group">
						<label htmlFor="stock-input" className="product-card__label">
							{t('productCard.stock')}
						</label>
						<input
							id="stock-input"
							data-testid="product-card-stock-input"
							type="number"
							min="0"
							value={editedStock}
							onChange={(e) => setEditedStock(parseInt(e.target.value, 10))}
							className="product-card__input"
						/>
					</div>
				) : (
					<span className="product-card__stock-display">
						{t('productCard.stock')}
						{product.stock}
					</span>
				)}
			</div>
		</div>
	);

	const footer = (
		<div className="product-card__actions">
			{isEditing ? (
				<>
					<Button
						data-testid="product-card-save-btn"
						variant="primary"
						onClick={handleSave}
					>
						{t('productCard.save')}
					</Button>
					<Button
						data-testid="product-card-cancel-btn"
						variant="secondary"
						onClick={() => {
							setIsEditing(false);
							setEditedStock(product.stock);
						}}
					>
						{t('productCard.cancel')}
					</Button>
				</>
			) : (
				<Button
					data-testid="product-card-edit-btn"
					variant="primary"
					onClick={() => setIsEditing(true)}
				>
					{t('productCard.editStock')}
				</Button>
			)}
		</div>
	);

	return (
		<Card
			header={header}
			body={body}
			footer={footer}
			dataTestId="product-card"
			className="product-card"
		/>
	);
};
