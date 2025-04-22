import { CheckoutForm } from './CheckoutForm';

export class PaymentForm extends CheckoutForm {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(onSubmit: (data: { payment: string; address: string }) => void) {
        super('order', onSubmit);
    }

    protected handleSubmit(e: Event): void {
        e.preventDefault();
        if (this.validate()) {
            const activeButton = this.paymentButtons.find(button => 
                button.classList.contains('button_alt-active'));

            const data = {
                payment: activeButton?.name || '',
                address: this.addressInput.value.trim()
            };
            
            this.onSubmit(data);
        }
    }

    protected validate(): boolean {
        const errors: string[] = [];
        
        // Проверяем выбран ли способ оплаты
        const activeButton = this.paymentButtons.find(button => 
            button.classList.contains('button_alt-active'));
        
        if (!activeButton) {
            errors.push('Выберите способ оплаты');
        }

        // Проверяем адрес
        const addressValue = this.addressInput.value.trim();
        if (!addressValue) {
            errors.push('Введите адрес доставки');
        } else if (addressValue.length < 1) {
            errors.push('Адрес должен содержать минимум 1 символ');
        }

        this.button.disabled = errors.length > 0;
        this.showErrors(errors);
        return errors.length === 0;
    }

    render(): HTMLFormElement {
        const form = super.render();
        
        // Получаем новые ссылки на элементы после клонирования
        this.paymentButtons = Array.from(form.querySelectorAll('.button_alt'));
        this.addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
        this.button = form.querySelector('button[type="submit"]') as HTMLButtonElement;

        // Добавляем обработчики для кнопок оплаты
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
                this.validate();
            });
        });

        // Добавляем обработчик для адреса
        this.addressInput.addEventListener('input', () => {
            this.validate();
        });

        // Добавляем обработчик отправки формы
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Изначально кнопка должна быть неактивна
        this.button.disabled = true;

        return form;
    }
}