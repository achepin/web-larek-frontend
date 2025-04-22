import { IProduct, CartState } from '../../types';
import { EventEmitter } from '../base/EventEmitter';

export class CartView {
    private readonly template: HTMLTemplateElement;
    private readonly cardTemplate: HTMLTemplateElement;
    private readonly basketButton: HTMLElement;
    private readonly basketCounter: HTMLElement;

    constructor(
        private eventEmitter: EventEmitter,
        private onRemove: (product: IProduct) => void
    ) {
        this.template = document.querySelector('#basket') as HTMLTemplateElement;
        this.cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
        this.basketButton = document.querySelector('.header__basket') as HTMLElement;
        this.basketCounter = this.basketButton.querySelector('.header__basket-counter') as HTMLElement;
        
        this.basketButton.addEventListener('click', () => {
            this.eventEmitter.emit('cart:open');
        });

        this.updateCounter(0);
    }

    render(state: CartState): HTMLElement {
        // Обновляем счетчик корзины
        this.updateCounter(state.items.length);

        // Клонируем шаблон корзины
        const basket = this.template.content.cloneNode(true) as HTMLElement;
        const list = basket.querySelector('.basket__list') as HTMLElement;
        const total = basket.querySelector('.basket__price') as HTMLElement;
        const button = basket.querySelector('.basket__button') as HTMLButtonElement;
        
        // Очищаем список
        list.innerHTML = '';
        
        // Добавляем каждый товар
        state.items.forEach((item, index) => {
            const itemElement = this.cardTemplate.content.cloneNode(true) as HTMLElement;
            const itemCard = itemElement.querySelector('.basket__item') as HTMLElement;
            
            const indexElement = itemCard.querySelector('.basket__item-index');
            if (indexElement) {
                indexElement.textContent = (index + 1).toString();
            }

            const titleElement = itemCard.querySelector('.card__title');
            if (titleElement) {
                titleElement.textContent = item.product.name;
            }

            const priceElement = itemCard.querySelector('.card__price');
            if (priceElement) {
                priceElement.textContent = item.product.price ? `${item.product.price} синапсов` : 'Бесценно';
            }
            
            const deleteButton = itemCard.querySelector('.basket__item-delete');
            if (deleteButton) {
                deleteButton.addEventListener('click', (e: Event) => {
                    e.stopPropagation();
                    this.onRemove(item.product);
                });
            }
            
            list.appendChild(itemCard);
        });
        
        // Устанавливаем общую сумму
        if (total) {
            total.textContent = `${state.totalPrice} синапсов`;
        }

        // Активируем/деактивируем кнопку оформления заказа
        if (button) {
            button.disabled = state.items.length === 0;
            const submitHandler = () => {
                this.eventEmitter.emit('order:submit');
            };
            button.addEventListener('click', submitHandler, { once: true });
        }
        
        return basket;
    }

    private updateCounter(count: number): void {
        if (this.basketCounter) {
            this.basketCounter.textContent = count.toString();
            this.basketCounter.style.display = count > 0 ? 'flex' : 'none';
        }
    }
}