import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class ProductCard {
	constructor(
		private template: HTMLTemplateElement,
		private onClick: (productId: string) => void
	) {}

	render(product: IProduct): HTMLElement {
		const card = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		card.querySelector('.card__title')!.textContent = product.name;
		card.querySelector('.card__category')!.textContent = product.category;
		card.querySelector('.card__price')!.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

		const image = card.querySelector('.card__image') as HTMLImageElement;
		image.src = product.image.startsWith('http') ? product.image : `${CDN_URL}${product.image}`;
		image.alt = product.name;

		card.addEventListener('click', () => {
			this.onClick(product.id);
		});

		return card;
	}

	renderPreview(product: IProduct): HTMLElement {
		const template = document.querySelector('#card-preview') as HTMLTemplateElement;
		const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		card.querySelector('.card__title')!.textContent = product.name;
		card.querySelector('.card__category')!.textContent = product.category;
		card.querySelector('.card__price')!.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
		card.querySelector('.card__text')!.textContent = product.description;

		const image = card.querySelector('.card__image') as HTMLImageElement;
		image.src = product.image.startsWith('http') ? product.image : `${CDN_URL}${product.image}`;
		image.alt = product.name;

		return card;
	}
}