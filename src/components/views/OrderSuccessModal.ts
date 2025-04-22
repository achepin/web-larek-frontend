import { Modal } from './Modal';

export class OrderSuccessModal {
    private template: HTMLTemplateElement;

    constructor(private onClose: () => void) {
        this.template = document.querySelector('#success') as HTMLTemplateElement;
    }

    render(totalPrice: number): HTMLElement {
        const content = this.template.content.cloneNode(true) as HTMLElement;
        const modal = content.querySelector('.order-success') as HTMLElement;
        
        // Устанавливаем сумму заказа
        const description = modal.querySelector('.order-success__description') as HTMLElement;
        if (description) {
            description.textContent = `Списано ${totalPrice} синапсов`;
        }

        // Кнопка закрытия
        const closeButton = modal.querySelector('.order-success__close') as HTMLElement;
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.onClose();
            });
        }
        
        return modal;
    }
}