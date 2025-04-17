// Подключаю стили
import './scss/styles.scss';

// Импортирую API-класс, чтобы ходить за товарами
import { Api } from './components/base/api';

// Получаю gallery — туда вставляются карточки
const gallery = document.querySelector('.gallery');

// Указываю адрес API (беру из переменной окружения или сразу пишу напрямую)
const apiOrigin = 'https://larek-api.nomoreparties.co';
const api = new Api(`${apiOrigin}/api/weblarek`);

// При загрузке страницы получаю товары и добавляю в DOM
api.get('/product')
  .then((data: any) => {
    data.items.forEach((product: any) => {
      // Вывожу в консоль путь до картинки, чтобы отследить проблему
      console.log('Image path:', product.image);

      const imagePath = product.image.startsWith('/')
        ? '/uploads' + product.image
        : '/uploads/' + product.image;

      const imageUrl = `${apiOrigin}${imagePath}`;
      console.log('Final image URL:', imageUrl);

      // Создаю карточку по БЭМ
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${imageUrl}" alt="${product.title}" class="card__image">
        <span class="card__category card__category_${product.category}">${product.category}</span>
        <h2 class="card__title">${product.title}</h2>
        <p class="card__text">${product.description}</p>
        <div class="card__price">${product.price ? product.price + ' синапсов' : 'Бесценно'}</div>
      `;
      gallery?.appendChild(card);
    });
  })
  .catch((err) => {
    console.error('Ошибка при загрузке товаров:', err);
  });

// Закрытие модального окна — добавлено ранее
const modals = document.querySelectorAll<HTMLElement>('.modal.modal_active');

modals.forEach((modal) => {
  const closeButton = modal.querySelector('.modal__close');
  const modalContainer = modal.querySelector('.modal__container');

  function closeModal() {
    modal.classList.remove('modal_active');
  }

  closeButton?.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
});
