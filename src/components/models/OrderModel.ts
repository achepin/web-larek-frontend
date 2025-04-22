import { EventEmitter } from '../base/EventEmitter';
import { OrderData } from '../../types';
import { Api } from '../base/api';

export class OrderModel extends EventEmitter {
    constructor(private api: Api) {
        super();
    }

    async submitOrder(order: OrderData): Promise<void> {
        try {
            await this.api.post('/order', order);
            this.emit('order:success', order);
        } catch (error) {
            this.emit('order:error', error);
            throw error;
        }
    }

    validateOrder(order: Partial<OrderData>): boolean {
        const errors: string[] = [];

        if (!order.address || order.address.length < 1) {
            errors.push('Некорректный адрес доставки');
        }

        if (!order.payment || !['cash', 'card'].includes(order.payment)) {
            errors.push('Некорректный способ оплаты');
        }

        if (!order.email || !order.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.push('Некорректный email');
        }

        if (!order.phone || !order.phone.replace(/\D/g, '').match(/^\d{11,}/)) {
            errors.push('Некорректный телефон');
        }

        if (!order.items || !order.items.length) {
            errors.push('Корзина пуста');
        }

        if (typeof order.total !== 'number' || order.total <= 0) {
            errors.push('Некорректная сумма заказа');
        }

        return errors.length === 0;
    }
}