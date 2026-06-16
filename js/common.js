document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  var dropdowns = document.querySelectorAll('.dropdown > a');
  dropdowns.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        var menu = this.nextElementSibling;
        if (menu) {
          menu.classList.toggle('show');
        }
      }
    });
  });

  fetchSettings();

  if (document.getElementById('calc-form') && typeof initCalculator === 'function') {
    initCalculator();
  }
});

function fetchSettings() {
  fetch('data/settings.json')
    .then(function (r) { return r.json(); })
    .then(function (s) {
      document.querySelectorAll('[data-phone]').forEach(function (el) {
        el.textContent = s.phone;
      });
      document.querySelectorAll('[data-email]').forEach(function (el) {
        el.textContent = s.email;
      });
      document.querySelectorAll('[data-address]').forEach(function (el) {
        el.textContent = s.address;
      });
      document.querySelectorAll('[data-company]').forEach(function (el) {
        el.textContent = s.companyName;
      });
      var vk = document.querySelectorAll('.social-vk');
      var tg = document.querySelectorAll('.social-tg');
      vk.forEach(function (el) { el.href = s.vk; });
      tg.forEach(function (el) { el.href = s.telegram; });
    })
    .catch(function () {});
}

function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function fetchJSON(url) {
  return fetch(url).then(function (r) { return r.json(); });
}

function createProjectCard(p) {
  var card = document.createElement('a');
  card.href = 'project-detail.html?id=' + p.id;
  card.className = 'card';
  card.style.display = 'block';
  card.style.textDecoration = 'none';
  card.style.color = 'inherit';

  var img = document.createElement('img');
  img.className = 'card-img';
  img.src = p.image;
  img.alt = p.name;
  img.loading = 'lazy';
  card.appendChild(img);

  var body = document.createElement('div');
  body.className = 'card-body';

  var title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = p.name;
  body.appendChild(title);

  var meta = document.createElement('div');
  meta.className = 'card-meta';
  meta.textContent = p.area + ' м² • ' + formatPrice(p.price) + ' ₽';
  body.appendChild(meta);

  var action = document.createElement('div');
  action.className = 'card-action';
  var btn = document.createElement('span');
  btn.className = 'btn btn-outline btn-sm';
  btn.textContent = 'Подробнее';
  action.appendChild(btn);
  body.appendChild(action);

  card.appendChild(body);
  return card;
}
