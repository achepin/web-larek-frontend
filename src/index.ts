// Подключаю стили
import './scss/styles.scss';

import { Api } from './components/base/api';

const gallery = document.querySelector('.gallery');
const modal = document.querySelector<HTMLElement>('#modal-container');
const modalContent = modal?.querySelector('.modal__content');
const cardPreviewTemplate = document.querySelector<HTMLTemplateElement>('#card-preview');
const cartCounter = document.querySelector('.header__basket-counter');
const basketButton = document.querySelector('.header__basket');
const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket');
const basketItemTemplate = document.querySelector<HTMLTemplateElement>('#card-basket');
const orderTemplate = document.querySelector<HTMLTemplateElement>('#order');
const contactsTemplate = document.querySelector<HTMLTemplateElement>('#contacts');
const successTemplate = document.querySelector<HTMLTemplateElement>('#success');

const apiOrigin = 'https://larek-api.nomoreparties.co';
const API_URL = `${apiOrigin}/api/weblarek`;
const CDN_URL = `${apiOrigin}/content/weblarek`;

const api = new Api(API_URL);

const cart: string[] = [];
const productsMap: Record<string, any> = {};

function getCategoryClass(category: string): string {
  switch (category) {
    case 'софт-скил': return 'card__category_soft';
    case 'другое': return 'card__category_other';
    case 'дополнительное': return 'card__category_additional';
    case 'кнопка': return 'card__category_button';
    case 'хард-скил': return 'card__category_hard';
    default: return 'card__category_default';
  }
}

api.get('/product')
  .then((data: any) => {
    data.items.forEach((product: any) => {
      const imageUrl = `${CDN_URL}${product.image}`;
      productsMap[product.id] = product;

      const card = document.createElement('button');
      card.classList.add('card', 'gallery__item');

      card.innerHTML = `
        <span class="card__category ${getCategoryClass(product.category)}">${product.category}</span>
        <h2 class="card__title">${product.title}</h2>
        <div class="card__image-wrapper">
          <img class="card__image" src="${imageUrl}" alt="${product.title}" />
        </div>
        <span class="card__price">${product.price ? `${product.price} синапсов` : 'Бесценно'}</span>
      `;

      card.addEventListener('click', () => {
        const cardElement = cardPreviewTemplate?.content.cloneNode(true) as HTMLElement;
        if (!cardElement || !modal || !modalContent) return;

        const title = cardElement.querySelector('.card__title');
        const category = cardElement.querySelector('.card__category');
        const image = cardElement.querySelector<HTMLImageElement>('.card__image');
        const text = cardElement.querySelector('.card__text');
        const price = cardElement.querySelector('.card__price');
        const button = cardElement.querySelector<HTMLButtonElement>('.card__button');

        title!.textContent = product.title;
        category!.textContent = product.category;
        category!.className = `card__category ${getCategoryClass(product.category)}`;
        image!.src = imageUrl;
        image!.alt = product.title;
        text!.textContent = product.description;
        price!.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

        button?.addEventListener('click', () => {
          if (!cart.includes(product.id)) {
            cart.push(product.id);
            cartCounter!.textContent = String(cart.length);
          }
        });

        modalContent.innerHTML = '';
        modalContent.appendChild(cardElement);
        modal.classList.add('modal_active');
      });

      gallery?.appendChild(card);
    });
  });

basketButton?.addEventListener('click', () => {
  const basketTitle = document.createElement('h2');
  basketTitle.textContent = 'Заглушка корзины';
  modalContent!.innerHTML = '';
  modalContent!.appendChild(basketTitle);
  modal!.classList.add('modal_active');
});

const modals = document.querySelectorAll<HTMLElement>('.modal');
modals.forEach((modal) => {
  const closeButton = modal.querySelector('.modal__close');
  closeButton?.addEventListener('click', () => modal.classList.remove('modal_active'));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('modal_active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.remove('modal_active');
  });
});
