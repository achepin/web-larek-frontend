export class OrderSuccessModal {
    private template: HTMLTemplateElement;

    constructor(private onClose: () => void) {
        this.template = document.querySelector('#success') as HTMLTemplateElement;
    }

    render(totalPrice: number): HTMLElement {
        const modal = this.template.content.cloneNode(true) as HTMLElement;
        
        // Устанавливаем сумму заказа
        const description = modal.querySelector('.order-success__description') as HTMLElement;
        description.textContent = `Списано ${totalPrice} синапсов`;

        // Добавляем обработчик для кнопки закрытия
        const closeButton = modal.querySelector('.order-success__close') as HTMLElement;
        closeButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            this.onClose();
        });

        return modal;
    }
}