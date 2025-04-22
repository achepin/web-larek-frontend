import { EventEmitter } from '../base/EventEmitter';
import { IProduct, ApiListResponse } from '../../types';
import { Api } from '../base/api';

export class ProductModel extends EventEmitter {
	private products: IProduct[] = [];
	private api: Api;

	constructor(api: Api) {
		super();
		this.api = api;
	}

	async fetchProducts(): Promise<void> {
		try {
			const response = await this.api.get<ApiListResponse<any>>('/product');
			// Преобразуем title -> name, чтобы соответствовать интерфейсу IProduct
			this.products = response.items.map(item => ({
				...item,
				name: item.title // преобразуем title в name
			}));
			this.emit('products-updated', this.products);
		} catch (error) {
			// Обработка ошибок
		}
	}

	getProductById(id: string): IProduct | undefined {
		return this.products.find(product => product.id === id);
	}

	getAllProducts(): IProduct[] {
		return this.products;
	}
}