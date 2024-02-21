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
   * Настройки аккордеона, параметры получаются из командной строки
   *
   * tabs_limit - number, максимальное количество одновременно открытых элементов,
   * по умолчанию 0 - не ограничено
   *
   * Для тестирования работы своего скрипта при разных значениях tabs_limit
   * временно переопределяйте значение переменной, хранящей этот параметр.
   * Либо можете дописыват GET-параметр с нужным значением в конец адресной строки,
   * например: ?tabs_limit=1
   */
  const settings = {
    tabsLimit: getUrlValue('tabs_limit') || 0,
  };

  /* Код компонента пишите ниже */
  // const limit = settings.tabsLimit;
  const accordeonItems = document.querySelectorAll('.accordeon-item');
  let opened = [];
  let activeContents = [];

  accordeonItems.forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('accordeon-item--open');
      const accordeonContent = item.querySelector('.accordeon-item-content');
      if (item.classList.contains('accordeon-item--open')) {
        accordeonContent.style.display = 'block';
        opened.push(item);
        activeContents.push(accordeonContent);
      } else {
        accordeonContent.style.display = 'none';
        opened = opened.filter((i) => i !== item);
        activeContents = opened.filter((i) => i !== accordeonContent);
      }

      if (settings.tabsLimit > 0 && opened.length > settings.tabsLimit) {
        opened.shift().classList.remove('accordeon-item--open');
        activeContents.shift().style.display = 'none';
      }
    });
  });
})();
