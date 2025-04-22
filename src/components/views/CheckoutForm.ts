export abstract class CheckoutForm {
    protected form: HTMLFormElement;
    protected button: HTMLButtonElement;
    protected errors: HTMLElement;

    constructor(private formId: string, protected onSubmit: (data: object) => void) {
        const template = document.querySelector(`#${formId}`) as HTMLTemplateElement;
        this.form = template.content.querySelector('form') as HTMLFormElement;
        this.button = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errors = this.form.querySelector('.form__errors') as HTMLElement;
        this.form.addEventListener('input', () => this.validate());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    protected abstract validate(): boolean;

    render(): HTMLFormElement {
        return this.form.cloneNode(true) as HTMLFormElement;
    }

    showErrors(errors: string[]): void {
        this.errors.textContent = errors.join('. ');
    }

    clearErrors(): void {
        this.errors.textContent = '';
    }

    protected handleSubmit(e: Event): void {
        e.preventDefault();
        if (this.validate()) {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            this.onSubmit(data);
        }
    }
}