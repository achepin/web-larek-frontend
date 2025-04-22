// Класс EventEmitter реализует паттерн "Наблюдатель". Он нужен,
// чтобы компоненты могли обмениваться событиями, не зная друг о друге.
export class EventEmitter {
  private events: Record<string, Function[]> = {};

  // Подписка на событие
  on(event: string, callback: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // Отписка от события
  off(event: string, callback: Function): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }

  // Генерация события с передачей данных подписчикам
  emit(event: string, data?: unknown): void {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event ${event} handler:`, error);
      }
    });
  }

  // Метод для отладки - показывает все активные подписки
  getEventListeners(event?: string): Record<string, number> {
    if (event) {
      return { [event]: this.events[event]?.length || 0 };
    }
    return Object.fromEntries(
      Object.entries(this.events).map(([key, handlers]) => [key, handlers.length])
    );
  }
}

