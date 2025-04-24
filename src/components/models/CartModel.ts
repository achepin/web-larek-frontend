import { EventEmitter } from '../base/EventEmitter';
import { IProduct, CartItem, CartState } from '../../types';

export class CartModel extends EventEmitter {
    private items: CartItem[] = [];

    constructor() {
        super();
        // Инициализируем начальное состояние корзины
        this.emitChange();
    }

    addToCart(product: IProduct): void {
        // Проверяем, что у товара есть цена
        if (product.price === null) {
            return;
        }

        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ product, quantity: 1 });
        }
        this.emitChange();
    }

    removeFromCart(productId: string): void {
        const index = this.items.findIndex(item => item.product.id === productId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.emitChange();
        }
    }

    clearCart(): void {
        this.items = [];
        this.emitChange();
    }

    getCartState(): CartState {
        return {
            items: [...this.items],
            totalPrice: this.calculateTotalPrice()
        };
    }

    private calculateTotalPrice(): number {
        return this.items.reduce((sum, item) => 
            sum + (item.product.price || 0) * item.quantity, 0);
    }

    private emitChange(): void {
        // Генерируем событие изменения корзины
        this.emit('cart-change', this.getCartState());
    }
}