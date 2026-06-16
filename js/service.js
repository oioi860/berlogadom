document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  if (!id) {
    document.getElementById('service-container').innerHTML = '<p class="section" style="text-align:center;">Услуга не выбрана. Выберите услугу из меню.</p>';
    document.getElementById('service-hero-block').style.display = 'none';
    return;
  }

  fetchJSON('data/services.json').then(function (services) {
    var service = services.find(function (s) { return s.id === id; });
    if (!service) {
      document.getElementById('service-container').innerHTML = '<p class="section" style="text-align:center;">Услуга не найдена</p>';
      document.getElementById('service-hero-block').style.display = 'none';
      return;
    }
    renderService(service);
  });
});

var advantageSvg = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2C4C3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,16 12,24 28,8"/></svg>';

function renderService(service) {
  document.title = service.metaTitle || service.title + ' | Берлога';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = service.metaDesc || '';

  document.getElementById('service-title-hero').textContent = service.title;
  document.getElementById('service-desc-hero').textContent = service.description;

  document.getElementById('service-text').textContent = service.description;
  if (service.pricePerM2 > 0) {
    document.getElementById('service-price').textContent = 'Стоимость: от ' + formatPrice(service.pricePerM2) + ' ₽ за м²';
  }
  var img = document.getElementById('service-image');
  img.src = service.image;
  img.alt = service.title;

  var advGrid = document.getElementById('service-advantages');
  advGrid.innerHTML = '';
  service.advantages.forEach(function (adv) {
    var div = document.createElement('div');
    div.className = 'advantage-item';
    div.innerHTML = '<div class="advantage-icon-svg">' + advantageSvg + '</div><h3>' + adv + '</h3>';
    advGrid.appendChild(div);
  });

  fetchJSON('data/projects.json').then(function (projects) {
    var related = projects.filter(function (p) { return p.serviceId === service.id; });
    var grid = document.getElementById('service-projects-grid');
    var section = document.getElementById('service-projects-section');
    if (related.length) {
      section.style.display = 'block';
      grid.innerHTML = '';
      related.forEach(function (p) {
        grid.appendChild(createProjectCard(p));
      });
    } else {
      section.style.display = 'none';
    }
  });

  var calcForm = document.getElementById('calc-form');
  if (calcForm) {
    calcForm.dataset.presetService = service.id;
  }
}
