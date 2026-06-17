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

function getIconForAdvantage(text) {
  var svgAttrs = 'width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1F3B2C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var map = {
    'экологичн': '<svg ' + svgAttrs + '><path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" stroke="currentColor" fill="none"/><path d="M12 12v8" stroke="currentColor"/><path d="M8 10v4" stroke="currentColor"/><path d="M16 10v4" stroke="currentColor"/></svg>',
    'натуральн': '<svg ' + svgAttrs + '><path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" stroke="currentColor" fill="none"/><path d="M12 12v8" stroke="currentColor"/><path d="M8 10v4" stroke="currentColor"/><path d="M16 10v4" stroke="currentColor"/></svg>',
    'долговечн': '<svg ' + svgAttrs + '><path d="M12 2L3 7v5c0 5 4 8 9 10 5-2 9-5 9-10V7l-9-5z" stroke="currentColor" fill="none"/></svg>',
    'надежн': '<svg ' + svgAttrs + '><path d="M12 2L3 7v5c0 5 4 8 9 10 5-2 9-5 9-10V7l-9-5z" stroke="currentColor" fill="none"/></svg>',
    'индивидуальн': '<svg ' + svgAttrs + '><rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" fill="none"/><line x1="8" y1="8" x2="16" y2="8" stroke="currentColor"/><line x1="8" y1="12" x2="14" y2="12" stroke="currentColor"/><line x1="8" y1="16" x2="12" y2="16" stroke="currentColor"/></svg>',
    'проект': '<svg ' + svgAttrs + '><rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" fill="none"/><line x1="8" y1="8" x2="16" y2="8" stroke="currentColor"/><line x1="8" y1="12" x2="14" y2="12" stroke="currentColor"/><line x1="8" y1="16" x2="12" y2="16" stroke="currentColor"/></svg>',
    'полный цикл': '<svg ' + svgAttrs + '><path d="M12 2v4M12 18v4M2 12h4M18 12h4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" stroke="currentColor" stroke-linecap="round"/></svg>',
    'под ключ': '<svg ' + svgAttrs + '><path d="M12 2v4M12 18v4M2 12h4M18 12h4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" stroke="currentColor" stroke-linecap="round"/></svg>',
    'быстрая сборка': '<svg ' + svgAttrs + '><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor"/></svg>',
    'срок': '<svg ' + svgAttrs + '><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor"/></svg>',
    'экономия': '<svg ' + svgAttrs + '><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor"/></svg>',
    'отделк': '<svg ' + svgAttrs + '><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor"/></svg>',
    '3d': '<svg ' + svgAttrs + '><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" fill="none"/><path d="M7 10h10" stroke="currentColor"/><path d="M7 14h6" stroke="currentColor"/></svg>',
    'визуализация': '<svg ' + svgAttrs + '><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" fill="none"/><path d="M7 10h10" stroke="currentColor"/><path d="M7 14h6" stroke="currentColor"/></svg>',
    'дизайн': '<svg ' + svgAttrs + '><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" fill="none"/><path d="M7 10h10" stroke="currentColor"/><path d="M7 14h6" stroke="currentColor"/></svg>',
    'согласование': '<svg ' + svgAttrs + '><rect x="6" y="4" width="12" height="16" rx="1" stroke="currentColor" fill="none"/><path d="M8 8h8" stroke="currentColor"/><path d="M8 12h6" stroke="currentColor"/><path d="M8 16h4" stroke="currentColor"/></svg>',
    'заказчик': '<svg ' + svgAttrs + '><rect x="6" y="4" width="12" height="16" rx="1" stroke="currentColor" fill="none"/><path d="M8 8h8" stroke="currentColor"/><path d="M8 12h6" stroke="currentColor"/><path d="M8 16h4" stroke="currentColor"/></svg>',
    'бюджет': '<svg ' + svgAttrs + '><path d="M12 2v20M2 12h20" stroke="currentColor"/></svg>',
    'оптимизация': '<svg ' + svgAttrs + '><path d="M12 2v20M2 12h20" stroke="currentColor"/></svg>',
    'материал': '<svg ' + svgAttrs + '><rect x="4" y="8" width="16" height="8" rx="1" stroke="currentColor" fill="none"/><path d="M8 16v4M16 16v4" stroke="currentColor"/><path d="M4 12h16" stroke="currentColor"/></svg>',
    'качеств': '<svg ' + svgAttrs + '><rect x="4" y="8" width="16" height="8" rx="1" stroke="currentColor" fill="none"/><path d="M8 16v4M16 16v4" stroke="currentColor"/><path d="M4 12h16" stroke="currentColor"/></svg>',
    'гарантия': '<svg ' + svgAttrs + '><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor"/></svg>',
    'команда': '<svg ' + svgAttrs + '><path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" fill="none"/><path d="M20 20v-2a6 6 0 00-12 0v2" stroke="currentColor"/></svg>',
    'опыт': '<svg ' + svgAttrs + '><path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" fill="none"/><path d="M20 20v-2a6 6 0 00-12 0v2" stroke="currentColor"/></svg>'
  };
  var lower = text.toLowerCase();
  for (var key in map) {
    if (lower.includes(key)) return map[key];
  }
  return '<svg ' + svgAttrs + '><path d="M20 6L9 17l-5-5" stroke="currentColor"/></svg>';
}

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
    var card = document.createElement('div');
    card.className = 'advantage-card fade-in-up';
    card.innerHTML = getIconForAdvantage(adv) + '<span class="advantage-text">' + adv + '</span>';
    advGrid.appendChild(card);
  });
  initScrollAnimation();

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
      initScrollAnimation();
    } else {
      section.style.display = 'none';
    }
  });

  var calcForm = document.getElementById('calc-form');
  if (calcForm) {
    calcForm.dataset.presetService = service.id;
  }
}
