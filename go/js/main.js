document.addEventListener("DOMContentLoaded", () => {
  // Влияет на скролл Сафари
  document.addEventListener("click", (event) => {
    if (event.target.matches("button")) {
      event.target.focus();
    }
  });

  // Форма обратной связи настройка.

  const dateSelect = document.getElementById("date-select");
  const timeSelect = document.getElementById("time-select");
  const quantitySelect = document.getElementById("quantity-select");
  const submitButton = document.querySelector(".booking-submit-button");

  // Пример добавления сегодняшней даты и ближайших часов в select
  function populateDateTimeOptions() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    dateSelect.innerHTML = `<option value="" disabled selected>Дата</option>`;
    dateSelect.innerHTML += `<option value="${
      today.toISOString().split("T")[0]
    }">${today.toLocaleDateString("ru-RU")}</option>`;
    dateSelect.innerHTML += `<option value="${
      tomorrow.toISOString().split("T")[0]
    }">${tomorrow.toLocaleDateString("ru-RU")}</option>`;
    dateSelect.innerHTML += `<option value="${
      dayAfterTomorrow.toISOString().split("T")[0]
    }">${dayAfterTomorrow.toLocaleDateString("ru-RU")}</option>`;

    timeSelect.innerHTML = `<option value="" disabled selected>Время</option>`;
    for (let i = 9; i <= 20; i++) {
      // Время с 9:00 до 20:00
      const time = `${String(i).padStart(2, "0")}:00`;
      timeSelect.innerHTML += `<option value="${time}">${time}</option>`;
    }

    quantitySelect.innerHTML = `<option value="" disabled selected>Сколько человек</option>`;
    for (let i = 1; i <= 10; i++) {
      // От 1 до 10 человек
      quantitySelect.innerHTML += `<option value="${i}">${i} человек${
        i > 1 ? "а" : ""
      }</option>`;
    }
  }

  populateDateTimeOptions();

  submitButton.addEventListener("click", (e) => {
    // Простая клиентская валидация (дополнительно к required атрибутам)
    const form = submitButton.closest("fieldset");
    const requiredInputs = form.querySelectorAll("[required]");
    let allValid = true;

    requiredInputs.forEach((input) => {
      if (!input.value) {
        allValid = false;
        input.style.borderColor = "red"; // Пример подсветки незаполненных полей
      } else {
        input.style.borderColor = "";
      }
    });

    if (!allValid) {
      e.preventDefault(); // Предотвратить отправку формы, если есть незаполненные поля
      alert("Пожалуйста, заполните все обязательные поля.");
    } else {
      // Здесь можно отправить данные на сервер или выполнить другое действие
      // e.preventDefault(); // раскомментировать, если отправка формы происходит через JS (например, AJAX)
      // console.log('Форма отправлена!', {
      //     date: dateSelect.value,
      //     time: timeSelect.value,
      //     quantity: quantitySelect.value,
      //     name: document.getElementById('name-name').value,
      //     lastName: document.getElementById('last-name').value,
      //     phone: document.getElementById('tel-name').value,
      //     email: document.getElementById('email-name').value
      // });
    }
  });

  // Можно добавить обработчики для снятия красной рамки при вводе
  document
    .querySelectorAll(".booking-input, .custom-select")
    .forEach((input) => {
      input.addEventListener("input", () => {
        input.style.borderColor = "";
      });
      input.addEventListener("change", () => {
        input.style.borderColor = "";
      });
    });

  const items = document.querySelectorAll(".questions-item");

  items.forEach((item) => {
    const btn = item.querySelector(".questions-btn");

    btn.addEventListener("click", () => {
      // если нужно, чтобы открывался только один — раскомментируйте 2 строки ниже:
      // items.forEach(i => i !== item && i.classList.remove('is-open'));

      item.classList.toggle("is-open");
    });
  });

  // Модальное окно

  const openBtn = document.getElementById("openCallModal");
  const modal = document.getElementById("callModal");
  const form = document.getElementById("callForm");

  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const timeInput = document.getElementById("timeInput");

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    nameInput && nameInput.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    openBtn.focus();
  }

  openBtn.addEventListener("click", openModal);

  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  // 1) Имя: только буквы (рус/лат), пробел, дефис. Авто-очистка лишнего.
  nameInput.addEventListener("input", () => {
    const cleaned = nameInput.value
      .replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, "") // убираем всё кроме букв/пробела/дефиса
      .replace(/\s{2,}/g, " ") // двойные пробелы -> один
      .replace(/-{2,}/g, "-") // двойные дефисы -> один
      .trimStart(); // не даём начинать с пробела
    if (nameInput.value !== cleaned) nameInput.value = cleaned;
  });

  // 2) Телефон: маска +7 (999) 999-99-99 (без библиотек)
  function formatPhone(value) {
    const digits = value.replace(/\D/g, "");
    // допускаем ввод с 8/7/9 — приведём к формату РФ
    let d = digits;

    if (d.startsWith("8")) d = "7" + d.slice(1);
    if (d.startsWith("9")) d = "7" + d; // если ввели 9ХХ..., добавим 7

    // оставляем максимум 11 цифр (7 + 10)
    d = d.slice(0, 11);

    // строим маску
    let out = "+7";
    const rest = d.startsWith("7") ? d.slice(1) : d; // 10 цифр после 7

    if (rest.length > 0) out += " (" + rest.slice(0, 3);
    if (rest.length >= 3) out += ")";
    if (rest.length > 3) out += " " + rest.slice(3, 6);
    if (rest.length > 6) out += "-" + rest.slice(6, 8);
    if (rest.length > 8) out += "-" + rest.slice(8, 10);

    return out;
  }

  phoneInput.addEventListener("input", () => {
    const formatted = formatPhone(phoneInput.value);
    phoneInput.value = formatted;
  });

  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value) phoneInput.value = "+7 (";
  });

  phoneInput.addEventListener("blur", () => {
    // если оставили только префикс — очистим
    if (phoneInput.value === "+7 (" || phoneInput.value === "+7")
      phoneInput.value = "";
  });

  // 3) Время: маска HH:MM (00:00–23:59). Ввод только цифр, двоеточие ставится само.
  function formatTime(value) {
    const digits = value.replace(/\D/g, "").slice(0, 4); // HHMM
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + ":" + digits.slice(2, 4);
  }

  function clampTime(value) {
    // value вида "HH:MM" или "H" и т.п.
    const m = value.match(/^(\d{2}):(\d{2})$/);
    if (!m) return value;

    let hh = parseInt(m[1], 10);
    let mm = parseInt(m[2], 10);

    if (Number.isNaN(hh) || Number.isNaN(mm)) return value;

    hh = Math.max(0, Math.min(23, hh));
    mm = Math.max(0, Math.min(59, mm));

    const hhStr = String(hh).padStart(2, "0");
    const mmStr = String(mm).padStart(2, "0");
    return `${hhStr}:${mmStr}`;
  }

  timeInput.addEventListener("input", () => {
    timeInput.value = formatTime(timeInput.value);
  });

  timeInput.addEventListener("blur", () => {
    timeInput.value = clampTime(timeInput.value);
  });

  /* -------------------- submit -------------------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Простая проверка телефона: должно быть 10 цифр после +7
    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    if (phoneDigits.length < 11) {
      alert("Введите корректный номер телефона.");
      phoneInput.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    console.log("Заявка на звонок:", data);

    form.reset();
    closeModal();
    alert("Спасибо! Мы скоро вам перезвоним.");
  });

  // Скролл вниз

  const btn = document.getElementById("scrollToggleBtn");
  const nextSection = document.querySelector("#nextSection");

  let lastTop = 0;
  let isFloating = false;
  let rafId = null;
  let isAutoScrolling = false;

  const SHIFT_MS = 250;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function scrollToSlow(toY, duration = 1400) {
    if (rafId) cancelAnimationFrame(rafId);

    const fromY = window.pageYOffset;
    const start = performance.now();
    const delta = toY - fromY;

    isAutoScrolling = true;

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeInOutCubic(t);
      window.scrollTo(0, fromY + delta * eased);

      if (t < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        rafId = null;
        // небольшая пауза, чтобы "scroll" от инерции не считался ручным
        setTimeout(() => (isAutoScrolling = false), 80);
      }
    }

    rafId = requestAnimationFrame(frame);
  }

  function getDownTargetY() {
    if (nextSection) {
      const rect = nextSection.getBoundingClientRect();
      return window.pageYOffset + rect.top;
    }
    return window.pageYOffset + window.innerHeight;
  }

  function updateArrowState() {
    btn.classList.toggle("is-up", isFloating);
    btn.setAttribute("aria-label", isFloating ? "Вверх" : "Вниз");
  }

  function toFloating(withShift = true) {
    if (isFloating) return;

    // сохраняем "точку возврата" только один раз при уходе вниз от верха
    lastTop = lastTop || window.pageYOffset;

    if (withShift) {
      btn.classList.add("is-shifted");
      setTimeout(() => {
        btn.classList.remove("is-shifted");
        btn.classList.add("is-floating");
      }, SHIFT_MS);
    } else {
      btn.classList.add("is-floating");
    }

    isFloating = true;
    updateArrowState();
  }

  /* 1) Авто-перемещение кнопки при ручном скролле */
  let scrollDebounce;
  window.addEventListener(
    "scroll",
    () => {
      if (isAutoScrolling) return;

      // если пользователь реально прокручивает страницу и ушел вниз от верха — делаем floating
      if (window.pageYOffset > 10) {
        toFloating(true);
      } else {
        // если вернулись к самому верху — вернем кнопку на место
        toInline();
      }

      // (опционально) можно "успокаивать" shift, если скролл длительный
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        btn.classList.remove("is-shifted");
      }, 200);
    },
    { passive: true }
  );

  /* 2) Клик: вниз/вверх как было */
  btn.addEventListener(
    "click",
    (e) => {
      // на всякий случай — чтобы не ломали другие обработчики
      e.stopPropagation();

      if (!isFloating) {
        toFloating(true);
        scrollToSlow(getDownTargetY(), 5000);
      } else {
        scrollToSlow(lastTop || 0, 3500);
        setTimeout(() => {
          toInline();
        }, 1650);
      }
    },
    true // <-- capture
  );

  updateArrowState();
});
