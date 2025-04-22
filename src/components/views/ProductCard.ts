import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class ProductCard {
	constructor(
		private template: HTMLTemplateElement,
		private onClick: (productId: string) => void
	) {}

	private getCategoryClass(category: string): string {
		const normalizedCategory = category.toLowerCase().trim();

		switch (normalizedCategory) {
			case 'софт-скил':
			case 'soft-skill':
				return 'card__category_soft';
			case 'хард-скил':
			case 'hard-skill':
				return 'card__category_hard';
			case 'другое':
			case 'other':
				return 'card__category_other';
			case 'дополнительное':
			case 'additional':
				return 'card__category_additional';
			case 'кнопка':
			case 'button':
				return 'card__category_button';
			default:
				return 'card__category_other';
		}
	}

	render(product: IProduct): HTMLElement {
		const card = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
		
		const titleElement = card.querySelector('.card__title');
		if (titleElement) {
			titleElement.textContent = product.name || product.title || 'Без названия';
		}

		const categoryElement = card.querySelector('.card__category');
		if (categoryElement) {
			categoryElement.textContent = product.category;
			categoryElement.classList.add(this.getCategoryClass(product.category));
		}

		const priceElement = card.querySelector('.card__price');
		if (priceElement) {
			priceElement.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
		}

		const image = card.querySelector('.card__image') as HTMLImageElement;
		if (image) {
			image.src = product.image.startsWith('http') ? product.image : `${CDN_URL}${product.image}`;
			image.alt = product.name || product.title || '';
		}

		card.addEventListener('click', () => {
			this.onClick(product.id);
		});

		return card;
	}

	renderPreview(product: IProduct): HTMLElement {
		const template = document.querySelector('#card-preview') as HTMLTemplateElement;
		const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		const productName = product.name || product.title || 'Без названия';

		const titleElement = card.querySelector('.card__title');
		if (titleElement) {
			titleElement.textContent = productName;
		}

		const categoryElement = card.querySelector('.card__category');
		if (categoryElement) {
			const categoryClass = this.getCategoryClass(product.category);
			categoryElement.classList.add(categoryClass);
			categoryElement.textContent = product.category;
		}

		const textElement = card.querySelector('.card__text');
		if (textElement) {
			textElement.textContent = product.description;
		}

		const priceElement = card.querySelector('.card__price');
		if (priceElement) {
			priceElement.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
		}

		const image = card.querySelector('.card__image') as HTMLImageElement;
		if (image) {
			image.src = product.image.startsWith('http') ? product.image : `${CDN_URL}${product.image}`;
			image.alt = productName;
		}

		return card;
	}
}