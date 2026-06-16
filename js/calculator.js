function initCalculator() {
  var form = document.getElementById('calc-form');
  var serviceSelect = document.getElementById('calc-service');
  var areaInput = document.getElementById('calc-area');
  var resultBlock = document.getElementById('calc-result');
  var priceSpan = document.getElementById('calc-price');
  var errorBlock = document.getElementById('calc-error');

  fetchJSON('data/services.json').then(function (services) {
    services.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.title + ' — ' + formatPrice(s.pricePerM2) + ' ₽/м²';
      opt.dataset.price = s.pricePerM2;
      serviceSelect.appendChild(opt);
    });

    var preset = form ? form.dataset.presetService : null;
    if (preset) {
      serviceSelect.value = preset;
    }
  });

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    calculate();
  });

  var btn = form.querySelector('.calc-btn');
  if (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      calculate();
    });
  }

  function calculate() {
    var selected = serviceSelect.options[serviceSelect.selectedIndex];
    var pricePerM2 = selected ? parseInt(selected.dataset.price) : 0;
    var area = parseFloat(areaInput.value);

    if (!serviceSelect.value) {
      errorBlock.textContent = 'Выберите услугу';
      resultBlock.style.display = 'none';
      return;
    }
    if (!area || area <= 0) {
      errorBlock.textContent = 'Введите корректную площадь';
      resultBlock.style.display = 'none';
      return;
    }

    errorBlock.textContent = '';
    var total = pricePerM2 * area;
    priceSpan.textContent = formatPrice(total) + ' ₽';
    resultBlock.style.display = 'block';
  }
}
