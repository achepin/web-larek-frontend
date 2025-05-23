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
import { PageView } from './components/views/PageView';
import { IProduct, CartState, OrderData, PaymentFormData, ContactFormData } from './types';

// Инициализация базовых классов
const api = new Api(API_URL);
const eventEmitter = new EventEmitter();

// Инициализация моделей
const productModel = new ProductModel(api);
const cartModel = new CartModel();
const orderModel = new OrderModel(api);

// Инициализация отображения
const modal = new Modal();
const page = new PageView(eventEmitter); // <-- Инициализируем главную страницу
const cartView = new CartView(eventEmitter, (product: IProduct) => {
    cartModel.removeFromCart(product.id);
});
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

// При загрузке списка товаров
productModel.on('products-updated', (products: IProduct[]) => {
    const cards = products.map(product => productCard.render(product));
    page.renderGallery(cards); // <-- через PageView вставляем карточки
});

// При изменении корзины
cartModel.on('cart-change', (state: CartState) => {
    page.updateBasketCounter(state.items.length); // <-- обновляем счётчик корзины
    const basketContent = modal.getContent().querySelector('.basket');
    if (basketContent) {
        modal.open(cartView.render(state));
    }
});

// Открытие корзины
eventEmitter.on('cart:open', () => {
    modal.open(cartView.render(cartModel.getCartState()));
});

// Обработка оформления заказа
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
                    cartModel.clearCart(); // <-- очищаем корзину при успешном заказе
                    const successModal = new OrderSuccessModal(() => {
                        modal.close();
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

// Стартовая загрузка товаров
productModel.fetchProducts();