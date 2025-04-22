import { CheckoutForm } from './CheckoutForm';

export class ContactForm extends CheckoutForm {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(onSubmit: (data: { email: string; phone: string }) => void) {
        super('contacts', onSubmit);
    }

    protected validate(): boolean {
        const errors: string[] = [];
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneValue = this.phoneInput.value.replace(/\D/g, '');

        if (!this.emailInput.value.trim()) {
            errors.push('Введите email');
        } else if (!emailPattern.test(this.emailInput.value)) {
            errors.push('Некорректный формат email');
        }

        if (!phoneValue) {
            errors.push('Введите телефон');
        } else if (phoneValue.length < 11) {
            errors.push('Телефон должен содержать не менее 11 цифр');
        }

        this.button.disabled = errors.length > 0;
        this.showErrors(errors);
        return errors.length === 0;
    }

    protected handleSubmit(e: Event): void {
        e.preventDefault();
        if (this.validate()) {
            this.onSubmit({
                email: this.emailInput.value.trim(),
                phone: this.phoneInput.value.trim()
            });
        }
    }

    render(): HTMLFormElement {
        const form = super.render();
        
        // Обновляем ссылки на элементы формы после клонирования
        this.emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
        this.button = form.querySelector('button[type="submit"]') as HTMLButtonElement;

        // Добавляем обработчик маски телефона
        this.phoneInput.addEventListener('input', () => {
            let phone = this.phoneInput.value.replace(/\D/g, '');
            if (phone.length > 0) {
                phone = '+' + phone;
                if (phone.length > 2) {
                    phone = phone.slice(0, 2) + ' (' + phone.slice(2);
                }
                if (phone.length > 7) {
                    phone = phone.slice(0, 7) + ') ' + phone.slice(7);
                }
                if (phone.length > 12) {
                    phone = phone.slice(0, 12) + '-' + phone.slice(12);
                }
                if (phone.length > 15) {
                    phone = phone.slice(0, 15) + '-' + phone.slice(15);
                }
            }
            this.phoneInput.value = phone;
            this.validate();
        });

        // Добавляем обработчик для email
        this.emailInput.addEventListener('input', () => {
            this.validate();
        });

        // Добавляем обработчик отправки формы
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Изначально кнопка должна быть неактивна
        this.button.disabled = true;

        return form;
    }
}