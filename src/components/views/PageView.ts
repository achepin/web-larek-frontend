import { IProduct } from '../../types';
import { EventEmitter } from '../base/EventEmitter';

export class PageView {
    private readonly gallery: HTMLElement;
    private readonly basketButton: HTMLElement;
    private readonly basketCounter: HTMLElement;

    constructor(private eventEmitter: EventEmitter) {
        this.gallery = document.querySelector('.gallery') as HTMLElement;
        this.basketButton = document.querySelector('.header__basket') as HTMLElement;
        this.basketCounter = this.basketButton.querySelector('.header__basket-counter') as HTMLElement;
        
        // Добавляем обработчик клика по корзине
        this.basketButton.addEventListener('click', () => {
            this.eventEmitter.emit('cart:open');
        });

        // Инициализируем счетчик
        this.updateBasketCounter(0);
    }

    // Отображает товары в галерее
    renderGallery(items: HTMLElement[]): void {
        this.gallery.innerHTML = '';
        items.forEach(item => {
            this.gallery.appendChild(item);
        });
    }

    // Обновляет счетчик товаров в корзине
    updateBasketCounter(count: number): void {
        this.basketCounter.textContent = count.toString();
        this.basketCounter.style.display = count > 0 ? 'flex' : 'none';
    }
}