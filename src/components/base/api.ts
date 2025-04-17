// Тип ответа от API, когда приходит список
export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
  };
  
  // Разрешённые методы запроса
  export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
  
  // Класс для общения с сервером — обёртка над fetch
  export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;
  
    constructor(baseUrl: string, options: RequestInit = {}) {
      // Подчищаю слэш на конце, чтобы не было // при склейке
      this.baseUrl = baseUrl.replace(/\/+$/, '');
      this.options = {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers as object ?? {})
        }
      };
    }
  
    // Обрабатываю ответ сервера. Использую дженерик, чтобы знать тип ответа.
    protected handleResponse<T>(response: Response): Promise<T> {
      if (response.ok) {
        return response.json();
      } else {
        return response.json()
          .then((data) => {
            const message = data?.error || `Ошибка: ${response.status}`;
            return Promise.reject(message);
          })
          .catch(() => {
            // Если даже json не получился, просто выдам статус
            return Promise.reject(`Ошибка: ${response.status}`);
          });
      }
    }
  
    // GET-запрос. Добавляю ведущий слэш к uri при необходимости.
    get<T>(uri: string): Promise<T> {
      const fullUrl = `${this.baseUrl}${uri.startsWith('/') ? uri : '/' + uri}`;
      return fetch(fullUrl, {
        ...this.options,
        method: 'GET'
      }).then((res) => this.handleResponse<T>(res));
    }
  
    // POST/PUT/DELETE-запрос. Всё тоже самое, только с телом.
    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
      const fullUrl = `${this.baseUrl}${uri.startsWith('/') ? uri : '/' + uri}`;
      return fetch(fullUrl, {
        ...this.options,
        method,
        body: JSON.stringify(data)
      }).then((res) => this.handleResponse<T>(res));
    }
  }