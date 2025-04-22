import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/EventEmitter';
import { Api } from './components/base/api';
import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';
import { ProductCard } from './components/views/ProductCard';
import { Modal } from './components/views/Modal';
import { CartView } from './components/views/CartView';
import { PaymentForm } from './components/views/PaymentForm';
import { ContactForm } from './components/views/ContactForm';
import { OrderSuccessModal } from './components/views/OrderSuccessModal';
import { IProduct, CartState, OrderData, PaymentFormData, ContactFormData } from './types';

// Инициализация базовых классов
const api = new Api(API_URL);
const eventEmitter = new EventEmitter();

// Инициализация моделей
const productModel = new ProductModel(api);
const cartModel = new CartModel();
const orderModel = new OrderModel(api);

// Инициализация модального окна
const modal = new Modal();

// Инициализация отображения корзины
const cartView = new CartView(eventEmitter, (product: IProduct) => {
    cartModel.removeFromCart(product.id);
});

// Инициализация карточек товаров
const productCard = new ProductCard(
    document.querySelector('#card-catalog') as HTMLTemplateElement,
    (id: string) => {
        const product = productModel.getProductById(id);
        if (product) {
            modal.open(productCard.renderPreview(product));
            const buyButton = modal.getContent().querySelector('.card__button');
            buyButton?.addEventListener('click', () => {
                cartModel.addToCart(product);
                modal.close();
            });
        }
    }
);

// Отображение каталога товаров
const gallery = document.querySelector('.gallery') as HTMLElement;
productModel.on('products-updated', (products: IProduct[]) => {
    gallery.innerHTML = '';
    products.forEach((product: IProduct) => {
        gallery.appendChild(productCard.render(product));
    });
});

// Подписка на открытие корзины
eventEmitter.on('cart:open', () => {
    modal.open(cartView.render(cartModel.getCartState()));
});

// Глобальная подписка на изменения корзины
cartModel.on('cart-change', (state: CartState) => {
    // Обновляем счетчик в любом случае
    cartView.render(state);
    
    // Обновляем содержимое корзины, если она открыта
    const basketContent = modal.getContent().querySelector('.basket');
    if (basketContent) {
        modal.open(cartView.render(state));
    }
});

// Обработка событий оформления заказа
eventEmitter.on('order:submit', () => {
    const paymentForm = new PaymentForm((paymentData: PaymentFormData) => {
        const contactForm = new ContactForm(async (contactData: ContactFormData) => {
            const orderData: OrderData = {
                ...paymentData,
                ...contactData,
                items: cartModel.getCartState().items.map(item => item.product.id),
                total: cartModel.getCartState().totalPrice
            };

            if (orderModel.validateOrder(orderData)) {
                try {
                    await orderModel.submitOrder(orderData);
                    const successModal = new OrderSuccessModal(() => {
                        modal.close();
                        cartModel.clearCart();
                    });
                    modal.open(successModal.render(orderData.total));
                } catch (error) {
                    console.error('Ошибка при оформлении заказа:', error);
                }
            }
        });
        modal.open(contactForm.render());
    });
    modal.open(paymentForm.render());
});

// Загрузка товаров при старте
productModel.fetchProducts();