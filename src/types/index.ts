// Тип данных для одного товара
export interface IProduct {
  id: string;                    // Уникальный идентификатор товара
  name: string;                  // Название товара
  price: number | null;          // Цена товара (может быть null, если товар бесценен)
  description: string;           // Подробное описание товара
  category: string;              // Категория (например, "UI", "Backend" и т.д.)
  image: string;                 // Ссылка на изображение товара
}

// Типизированный ответ от API со списком товаров
export type ApiListResponse<T> = {
  total: number;                 // Общее количество товаров на сервере
  items: T[];                    // Массив объектов типа T
};

// Один товар в корзине
export interface CartItem {
  product: IProduct;             // Экземпляр товара
  quantity: number;              // Количество этого товара в корзине
}

// Состояние корзины целиком
export interface CartState {
  items: CartItem[];             // Массив всех товаров в корзине
  totalPrice: number;            // Общая сумма заказа
}

// Данные, которые передаются при оформлении заказа
export interface OrderData {
  address: string;               // Адрес доставки
  payment: string;               // Способ оплаты (напр. 'card', 'cash')
  email: string;                 // Email покупателя
  phone: string;                 // Телефон покупателя
  items: string[];               // Массив ID товаров
  total: number;                 // Общая сумма заказа
}

// Интерфейс для данных формы оплаты
export interface PaymentFormData {
  payment: string;               // Способ оплаты
  address: string;               // Адрес доставки
}

// Интерфейс для данных формы контактов
export interface ContactFormData {
  email: string;                 // Email покупателя
  phone: string;                 // Телефон покупателя
}