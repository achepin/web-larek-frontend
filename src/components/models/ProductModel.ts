// Импортирую EventEmitter для возможности подписки на события
import { EventEmitter } from '../base/EventEmitter';
// Импортирую интерфейсы для продукта и ответа от API
import { IProduct, ApiListResponse } from '../../types';
// Импортирую класс API для запросов к серверу
import { Api } from '../base/api';

// Класс модели товаров, расширяет EventEmitter для взаимодействия через события
export class ProductModel extends EventEmitter {
  private products: IProduct[] = []; // Список всех полученных товаров

  constructor(private api: Api) {
    super();
  }

  // Метод получения товаров с сервера
  async fetchProducts(): Promise<void> {
    try {
      // Используем просто /product, так как baseUrl уже содержит /api/weblarek
      const response = await this.api.get<ApiListResponse<IProduct>>('/product');
      this.products = response.items;
      // Генерирую событие, чтобы View-компоненты могли отреагировать на обновление списка товаров
      this.emit('products-updated', this.products);
    } catch (error) {
      console.error('Ошибка при получении списка товаров:', error);
    }
  }

  // Получить товар по его id
  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  // Получить весь список товаров
  getAllProducts(): IProduct[] {
    return this.products;
  }
}