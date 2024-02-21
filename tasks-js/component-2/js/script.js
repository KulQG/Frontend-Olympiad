(function () {
  /**
   * Служебная функция для считывания параметров из адресной строки
   * и определения конфигурации компонента
   * @param  {string} name - имя параметра
   * @return {number} - значение параметра в адресной строке
   */
  const getUrlValue = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get(name), 10);
  };

  /**
   * Настройки слайдера, параметры получаются из командной строки
   * pagination - boolean, отображает пагинацию
   * loop - boolean, зацикливает слайдер
   *
   * Для тестирования работы своего скрипта при разных значениях параметров временно
   * переопределяйте значение переменных, хранящих эти параметр.
   * Либо можете дописыват гет-параметры с нужным значением в конец адресной строки,
   * например: ?pagination=1&loop=0
   */
  const settings = {
    pagination: !!getUrlValue('pagination'),
    loop: !!getUrlValue('loop'),
  };

  /* Код компонента пишите ниже */
  const sliderItems = document.querySelectorAll('.slider-item');
  const prevBtn = document.querySelector('.slider-toggle--prev');
  const nextBtn = document.querySelector('.slider-toggle--next');
  const pagPanel = document.querySelector('.slider-pagination');
  const panelBtns = document.querySelectorAll('.slider-pagination-item');
  const classCur = 'slider-item--current';

  if (settings.pagination > 0) {
    pagPanel.classList.add('slider-pagination--shown');
  }

  if (settings.loop > 0) {
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  const getCurrentItem = () => document.querySelector(`.${classCur}`);

  const getCurIndex = () => {
    let res = 0;
    sliderItems.forEach((i, index) => {
      if (i.classList.contains('slider-item--current')) {
        res = index;
      }
    });
    return res;
  };

  const toggleImage = (action = 'next') => {
    const cur = getCurrentItem();
    cur.classList.remove(classCur);
    if (action === 'next') {
      if (settings.loop > 0) {
        if (cur === sliderItems[sliderItems.length - 1]) {
          sliderItems[0].classList.add(classCur);
        } else {
          cur.nextElementSibling.classList.add(classCur);
        }
      } else {
        cur.nextElementSibling.classList.add(classCur);
        prevBtn.disabled = false;
      }
    } else {
      if (settings.loop > 0) {
        if (cur === sliderItems[0]) {
          sliderItems[sliderItems.length - 1].classList.add(classCur);
        } else {
          cur.previousElementSibling.classList.add(classCur);
        }
      } else {
        nextBtn.disabled = false;
      }
    }

    if (settings.pagination > 0) {
      panelBtns.forEach((item, index) => {
        if (index === getCurIndex()) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    }
  };

  const stop = (action = 'next') => {
    if (settings.loop < 1) {
      if (action === 'next') {
        if (getCurrentItem() === sliderItems[sliderItems.length - 1]) {
          nextBtn.disabled = true;
        }
      } else {
        if (getCurrentItem() === sliderItems[0]) {
          prevBtn.disabled = true;
        }
      }
    }
  };

  nextBtn.addEventListener('click', () => {
    toggleImage('next');
    stop();
  });

  prevBtn.addEventListener('click', () => {
    toggleImage('prev');
    stop('prev');
  });

  if (settings.pagination > 0) {
    panelBtns.forEach((i, index) => {
      if (getCurIndex() === index) {
        panelBtns.forEach((item) => (item.disabled = false));
        i.disabled = true;
      }
      i.addEventListener('click', () => {
        const cur = getCurrentItem();
        cur.classList.remove(classCur);
        sliderItems[index].classList.add(classCur);
        panelBtns.forEach((btn) => (btn.disabled = false));
        panelBtns[index].disabled = true;
        if (index === panelBtns.length - 1) {
          prevBtn.disabled = false;
          stop();
        } else if (index === 0) {
          nextBtn.disabled = false;
          stop('prev');
        } else {
          prevBtn.disabled = false;
          nextBtn.disabled = false;
        }
      });
    });
  }
})();
