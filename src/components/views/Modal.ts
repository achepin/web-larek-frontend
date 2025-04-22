export class Modal {
    private element: HTMLElement;
    private content: HTMLElement;
    private closeButton: HTMLElement;
    private escHandler: (e: KeyboardEvent) => void;

    constructor() {
        this.element = document.querySelector('.modal') as HTMLElement;
        this.content = this.element.querySelector('.modal__content') as HTMLElement;
        this.closeButton = this.element.querySelector('.modal__close') as HTMLElement;
        
        // Привязываем контекст для обработчика ESC
        this.escHandler = this.handleEscape.bind(this);
        
        // Инициализируем обработчики
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Закрытие по клику на оверлей
        this.element.addEventListener('click', (e: MouseEvent) => {
            if (e.target === this.element) {
                this.close();
            }
        });

        // Закрытие по клику на крестик
        this.closeButton.addEventListener('click', () => {
            this.close();
        });
    }

    private handleEscape(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    open(content: HTMLElement): void {
        this.content.innerHTML = '';
        this.content.appendChild(content);
        this.element.classList.add('modal_active');
        // Добавляем обработчик Escape при открытии
        document.addEventListener('keydown', this.escHandler);
    }

    close(): void {
        this.element.classList.remove('modal_active');
        this.content.innerHTML = '';
        // Удаляем обработчик Escape при закрытии
        document.removeEventListener('keydown', this.escHandler);
    }

    getContent(): HTMLElement {
        return this.content;
    }
}