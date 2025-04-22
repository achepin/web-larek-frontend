export abstract class CheckoutForm {
    protected form: HTMLFormElement;
    protected button: HTMLButtonElement;
    protected errors: HTMLElement;

    constructor(private formId: string, protected onSubmit: (data: object) => void) {
        const template = document.querySelector(`#${formId}`) as HTMLTemplateElement;
        this.form = template.content.querySelector('form') as HTMLFormElement;
        this.button = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errors = this.form.querySelector('.form__errors') as HTMLElement;
    }

    protected abstract validate(): boolean;

    render(): HTMLFormElement {
        const form = this.form.cloneNode(true) as HTMLFormElement;
        this.button = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errors = form.querySelector('.form__errors') as HTMLElement;

        // Устанавливаем обработчик отправки формы
        form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            if (this.validate()) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                this.onSubmit(data);
            }
        });

        return form;
    }

    showErrors(errors: string[]): void {
        if (this.errors) {
            this.errors.textContent = errors.join('. ');
        }
    }

    clearErrors(): void {
        if (this.errors) {
            this.errors.textContent = '';
        }
    }
}