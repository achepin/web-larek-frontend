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
        // Сохраняем текущий контент, если он есть
        const currentContent = this.content.firstElementChild;
        
        // Проверяем, нужно ли сохранять состояние текущей формы
        if (currentContent && 
            currentContent.classList.contains('form') && 
            content.classList.contains('form')) {
            // Не очищаем контент, просто заменяем его
            this.content.replaceChild(content, currentContent);
        } else {
            // В остальных случаях очищаем и добавляем новый контент
            this.content.innerHTML = '';
            this.content.appendChild(content);
        }
        
        this.element.classList.add('modal_active');
        document.addEventListener('keydown', this.escHandler);
    }

    close(): void {
        this.element.classList.remove('modal_active');
        this.content.innerHTML = '';
        document.removeEventListener('keydown', this.escHandler);
    }

    getContent(): HTMLElement {
        return this.content;
    }
}