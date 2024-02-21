(function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Отменяем поведение по умолчанию для события отправки формы

    const phone = form.querySelector('#phone');

    const checkIn = form.querySelector('#checkin-date');
    const checkOut = form.querySelector('#checkout-date');

    const adults = form.querySelector('#adults');
    const children = form.querySelector('#children');
    const radios = form.querySelectorAll('input[type="radio"]');
    let activeRadio;
    for (const radio of radios) {
      if (radio.checked) {
        activeRadio = radio.value;
      }
    }

    function formValid(isValid, input) {
      if (isValid) {
        input.classList.remove('field-error');
        input.classList.add('field-correct');
      } else {
        input.classList.remove('field-correct');
        input.classList.add('field-error');
      }
    }

    const isValidTel = validateTel(phone.value);
    formValid(isValidTel, phone);

    const isValidDate = validateDates(checkIn.value, checkOut.value);
    formValid(isValidDate, checkIn);
    formValid(isValidDate, checkOut);

    const isValidGuests = validateGuests(+adults.value, +children.value, activeRadio);
    formValid(isValidGuests, adults);
    formValid(isValidGuests, children);

    // Если есть хотя бы одно поле с классом field-error, форма не отправляется
    if (form.querySelector('.field-error')) {
      return;
    }

    return true;
  });

  function validateTel(value) {
    const phoneNumberRegex =
      /^\+7\s?\(?[0-9]{3}\)?\s?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$/;
    return phoneNumberRegex.test(value);
  }

  function validateDates(checkInDate, checkOutDate) {
    const dateFormat1 = /^\d{4}-\d{2}-\d{2}$/;
    const dateFormat2 = /^\d{2}\.\d{2}\.\d{4}$/;

    if (dateFormat1.test(checkInDate) && dateFormat1.test(checkOutDate)) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (
        checkOut > checkIn &&
        checkOut.getTime() - checkIn.getTime() < 4 * 24 * 60 * 60 * 1000
      ) {
        return false;
      }

      return true;
    } else if (
      dateFormat2.test(checkInDate) &&
      dateFormat2.test(checkOutDate)
    ) {
      const [inDay, inMonth, inYear] = checkInDate.split('.');
      const [outDay, outMonth, outYear] = checkOutDate.split('.');

      const checkIn = new Date(inYear, inMonth - 1, inDay);
      const checkOut = new Date(outYear, outMonth - 1, outDay);

      const differenceInMilliseconds = checkOut.getTime() - checkIn.getTime();
      const differenceInDays = differenceInMilliseconds / (24 * 60 * 60 * 1000);

      return differenceInDays >= 4;
    } else {
      return false;
    }
  }

  function validateGuests(adults, children, typeOfRoom) {
    if (adults && children <= adults) {
      switch (typeOfRoom) {
        case 'single': {
          return adults === 1;
        }
        case 'double': {
          return adults > 1;
        }
        case 'family': {
          return adults >= 2 && children >= 1;
        }
        // default: {
        //   return false;
        // }
      }
    } else {
      return false;
    }
  }
})();
