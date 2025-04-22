import { CheckoutForm } from './CheckoutForm';

export class PaymentForm extends CheckoutForm {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(onSubmit: (data: { payment: string; address: string }) => void) {
        super('order', onSubmit);
        
        this.paymentButtons = Array.from(this.form.querySelectorAll('.button_alt'));
        this.addressInput = this.form.querySelector('input[name="address"]') as HTMLInputElement;
    }

    protected handleSubmit(e: Event): void {
        e.preventDefault();
        if (this.validate()) {
            const activeButton = this.paymentButtons.find(button => 
                button.classList.contains('button_alt-active'));
                
            const data = {
                payment: activeButton?.name || '',
                address: this.addressInput.value
            };
            
            this.onSubmit(data);
        }
    }

    protected validate(): boolean {
        const errors: string[] = [];
        const activeButton = this.paymentButtons.find(button => 
            button.classList.contains('button_alt-active'));
        
        if (!activeButton) {
            errors.push('Выберите способ оплаты');
        }

        if (!this.addressInput.value.trim()) {
            errors.push('Введите адрес доставки');
        } else if (this.addressInput.value.trim().length < 5) {
            errors.push('Адрес должен быть не короче 5 символов');
        }

        this.button.disabled = errors.length > 0;
        this.showErrors(errors);
        return errors.length === 0;
    }

    render(): HTMLFormElement {
        const form = super.render();
        this.paymentButtons = Array.from(form.querySelectorAll('.button_alt'));
        this.addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
        
        // Добавляем обработчики для кнопок оплаты
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
                this.validate();
            });
        });

        // Добавляем обработчик для валидации при вводе адреса
        this.addressInput.addEventListener('input', () => {
            this.validate();
        });

        return form;
    }
}