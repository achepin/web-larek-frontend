// Подключаю стили
// Подключаю стили проекта, включая SCSS с переменными, миксинами и т.п.
import './scss/styles.scss';

// Импортирую класс Api для работы с сервером (запросы товаров и заказов)
import { Api } from './components/base/api';

// Получаю элемент галереи, куда будут добавляться карточки товаров
// Получаю ссылку на контейнер, в который буду вставлять карточки товаров
const gallery = document.querySelector('.gallery');
// Модальное окно — универсальное для карточек, корзины и заказов
// Получаю DOM-элемент модального окна для отображения карточек и корзины
const modal = document.querySelector<HTMLElement>('#modal-container');
// Модальное окно — универсальное для карточек, корзины и заказов
// Получаю DOM-элемент модального окна для отображения карточек и корзины
const modalContent = modal?.querySelector('.modal__content');
const cardPreviewTemplate = document.querySelector<HTMLTemplateElement>('#card-preview');
const cartCounter = document.querySelector('.header__basket-counter');
const basketButton = document.querySelector('.header__basket');
const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket');
const basketItemTemplate = document.querySelector<HTMLTemplateElement>('#card-basket');
const orderTemplate = document.querySelector<HTMLTemplateElement>('#order');
const contactsTemplate = document.querySelector<HTMLTemplateElement>('#contacts');
const successTemplate = document.querySelector<HTMLTemplateElement>('#success');

// Здесь я задаю базовый адрес API — это основа для всех запросов к серверу
const apiOrigin = 'https://larek-api.nomoreparties.co';
// Указываю базовые URL'ы для API и CDN (загрузка изображений)
// Формирую полный путь к эндпоинту API, по которому получаю список товаров
const API_URL = `${apiOrigin}/api/weblarek`;
// Указываю базовый путь для подгрузки изображений товаров
const CDN_URL = `${apiOrigin}/content/weblarek`;

const api = new Api(API_URL);

// Массив с ID товаров, добавленных в корзину
// Здесь я храню массив id добавленных в корзину товаров
const cart: string[] = [];
// Хранилище всех загруженных товаров по ID
// Создаю объект, в который буду складывать все товары по id для быстрого доступа
const productsMap: Record<string, any> = {};

// Функция возвращает CSS-класс по названию категории товара
// Функция для сопоставления названия категории и нужного CSS-класса
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

function renderContacts(orderData: any, total: number) {
  if (!modal || !modalContent || !contactsTemplate) return;

  const fragment = contactsTemplate.content.cloneNode(true) as HTMLElement;
  const form = fragment.querySelector('form');
  const emailInput = fragment.querySelector<HTMLInputElement>('input[name="email"]');
  const phoneInput = fragment.querySelector<HTMLInputElement>('input[name="phone"]');
  const submitButton = fragment.querySelector<HTMLButtonElement>('button[type="submit"]');
  const errorBox = fragment.querySelector<HTMLElement>('.form__errors');

  const getDigits = (value: string) => value.replace(/\D/g, '');

  const formatPhone = (digits: string) => {
    if (!digits.length) return '';
    let formatted = '';
    if (digits.startsWith('7')) {
      formatted = `+7 (${digits.slice(1, 4)}`;
    } else if (digits.startsWith('8')) {
      formatted = `8 (${digits.slice(1, 4)}`;
    } else {
      formatted = `${digits[0]} (${digits.slice(1, 4)}`;
    }
    if (digits.length >= 4) formatted += `) ${digits.slice(4, 7)}`;
    if (digits.length >= 7) formatted += `-${digits.slice(7, 9)}`;
    if (digits.length >= 9) formatted += `-${digits.slice(9, 11)}`;
    return formatted;
  };

  const checkFormValidity = () => {
    const email = emailInput?.value.trim() || '';
    const phone = phoneInput?.value || '';
    const phoneDigits = getDigits(phone);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhoneValid = phoneDigits.length === 11;

    errorBox!.textContent = '';
    submitButton!.disabled = !(isEmailValid && isPhoneValid);
  };

  let isDeleting = false;

  phoneInput?.addEventListener('keydown', (e) => {
    isDeleting = e.key === 'Backspace' || e.key === 'Delete';
  });

  phoneInput?.addEventListener('input', () => {
    const rawDigits = getDigits(phoneInput.value).slice(0, 11);
    if (!isDeleting) {
      phoneInput.value = formatPhone(rawDigits);
      phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
    }
    isDeleting = false;
    checkFormValidity();
  });

  emailInput?.addEventListener('input', checkFormValidity);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput?.value.trim();
    const phone = phoneInput?.value.trim();

    api.post('/order', {
      ...orderData,
      email,
      phone,
      total,
      items: cart,
    }).then(() => {
      cart.length = 0;
      if (cartCounter) cartCounter.textContent = '0';
      renderSuccess(total);
    }).catch((err) => {
      console.error('Ошибка оформления заказа:', err);
    });
  });

  modalContent.innerHTML = '';
  modalContent.appendChild(fragment);
// Активирую модальное окно — добавляю класс, который делает его видимым
  modal.classList.add('modal_active');
  checkFormValidity();
}

function renderSuccess(total: number) {
  if (!modal || !modalContent || !successTemplate) return;

  const fragment = successTemplate.content.cloneNode(true) as HTMLElement;
  fragment.querySelector('.order-success__description')!.textContent = `Списано ${total} синапсов`;
  fragment.querySelector('.order-success__close')?.addEventListener('click', () => {
    modal.classList.remove('modal_active');
  });

  modalContent.innerHTML = '';
  modalContent.appendChild(fragment);
// Активирую модальное окно — добавляю класс, который делает его видимым
  modal.classList.add('modal_active');
}

function renderBasket() {
  if (!modal || !modalContent || !basketTemplate || !basketItemTemplate) return;

  const basketFragment = basketTemplate.content.cloneNode(true) as HTMLElement;
  const list = basketFragment.querySelector('.basket__list');
  const priceEl = basketFragment.querySelector('.basket__price');
  const submitButton = basketFragment.querySelector('.basket__button');

  let total = 0;
  list!.innerHTML = '';

  cart.forEach((id, index) => {
// Создаю объект, в который буду складывать все товары по id для быстрого доступа
    const product = productsMap[id];
    const item = basketItemTemplate.content.cloneNode(true) as HTMLElement;

    item.querySelector('.basket__item-index')!.textContent = String(index + 1);
    item.querySelector('.card__title')!.textContent = product.title;
    item.querySelector('.card__price')!.textContent = `${product.price} синапсов`;
    total += product.price ?? 0;

    const deleteButton = item.querySelector<HTMLButtonElement>('.basket__item-delete');
    deleteButton?.addEventListener('click', () => {
      const itemIndex = cart.indexOf(id);
      if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        renderBasket();
        if (cartCounter) {
          cartCounter.textContent = String(cart.length);
        }
      }
    });

    list!.appendChild(item);
  });

  if (priceEl) priceEl.textContent = `${total} синапсов`;

  submitButton?.addEventListener('click', () => {
    if (!orderTemplate) return;
    const orderForm = orderTemplate.content.cloneNode(true) as HTMLElement;
    const form = orderForm.querySelector('form')!;
    const submitStepOne = orderForm.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const addressInput = form.querySelector<HTMLInputElement>('input[name="address"]');
    const paymentButtons = form.querySelectorAll<HTMLButtonElement>('.order__buttons .button');

    const checkFormValidity = () => {
      const addressFilled = addressInput?.value.trim().length > 0;
      const selectedPayment = Array.from(paymentButtons).some(btn => btn.classList.contains('button_alt_active'));
      submitStepOne.disabled = !(selectedPayment && addressFilled);
    };

    paymentButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        paymentButtons.forEach((b) => {
          b.classList.remove('button_alt_active');
          b.style.boxShadow = 'none';
        });
        btn.classList.add('button_alt_active');
        btn.style.boxShadow = '0 0 0 2px #fff';
        checkFormValidity();
      });
    });

    addressInput?.addEventListener('input', checkFormValidity);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const payment = form.querySelector('.button_alt_active')?.getAttribute('name') || 'card';
      const address = addressInput?.value.trim() || '';
      renderContacts({ address, payment }, total);
    });

    modalContent!.innerHTML = '';
    modalContent!.appendChild(orderForm);
    checkFormValidity();
  });

  modalContent.innerHTML = '';
  modalContent.appendChild(basketFragment);
// Активирую модальное окно — добавляю класс, который делает его видимым
  modal.classList.add('modal_active');
}

// Получаю список товаров с сервера и создаю карточки
api.get('/product').then((data: any) => {
// Обрабатываю каждый товар из ответа API
  data.items.forEach((product: any) => {
    const imageUrl = `${CDN_URL}${product.image}`;
// Создаю объект, в который буду складывать все товары по id для быстрого доступа
    productsMap[product.id] = product;

// Создаю DOM-элемент карточки вручную, чтобы управлять порядком элементов
// Создаю DOM-элемент карточки товара вручную — так я могу контролировать порядок вложенности
    const card = document.createElement('button');
    card.classList.add('card', 'gallery__item');

    const category = document.createElement('span');
    category.className = `card__category ${getCategoryClass(product.category)}`;
    category.textContent = product.category;

    const title = document.createElement('h2');
    title.className = 'card__title';
    title.textContent = product.title;

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'card__image-wrapper';

    const image = document.createElement('img');
    image.className = 'card__image';
    image.src = imageUrl;
    image.alt = product.title;
    imageWrapper.appendChild(image);

    const price = document.createElement('span');
    price.className = 'card__price';
    price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

    card.append(category, title, imageWrapper, price);

// Обрабатываю клик по карточке — открываю модальное окно с информацией
// Добавляю обработчик клика по карточке, чтобы открыть детальный просмотр товара
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
// Активирую модальное окно — добавляю класс, который делает его видимым
      modal.classList.add('modal_active');
    });

    gallery?.appendChild(card);
  });
});

// Пока что здесь заглушка для открытия корзины
basketButton?.addEventListener('click', renderBasket);

// Модальное окно — универсальное для карточек, корзины и заказов
// Получаю DOM-элемент модального окна для отображения карточек и корзины
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