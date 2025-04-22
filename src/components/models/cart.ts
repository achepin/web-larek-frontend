
import { EventEmitter } from '../base/EventEmitter';
import { IProduct } from '../../types';

export interface CartItem {
  product: IProduct;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
}

export class CartModel {
  private items: CartItem[] = [];
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  /** Возвращает текущее состояние корзины */
  getState(): CartState {
    return {
      items: this.items,
      totalPrice: this.calculateTotalPrice(),
    };
  }

  /** Добавляет товар в корзину */
  addToCart(product: IProduct): void {
    const existingItem = this.items.find((item) => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.events.emit('cart-change', this.getState());
  }

  /** Удаляет товар из корзины по ID */
  removeFromCart(productId: string): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.events.emit('cart-change', this.getState());
  }

  /** Очищает корзину */
  clear(): void {
    this.items = [];
    this.events.emit('cart-change', this.getState());
  }

  /** Вычисляет общую стоимость всех товаров */
  private calculateTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.product.price ?? 0) * item.quantity;
    }, 0);
  }
}
