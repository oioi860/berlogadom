var currentSlide = 0;
var gallery = [];

document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'));
  if (!id) {
    document.getElementById('project-content').innerHTML = '<p class="section" style="text-align:center;">Проект не найден</p>';
    return;
  }

  fetchJSON('data/projects.json').then(function (projects) {
    var project = projects.find(function (p) { return p.id === id; });
    if (!project) {
      document.getElementById('project-content').innerHTML = '<p class="section" style="text-align:center;">Проект не найден</p>';
      return;
    }
    renderProject(project, projects);
  });
});

function renderProject(project, allProjects) {
  document.getElementById('project-title').textContent = project.name;
  document.getElementById('page-title').textContent = project.name + ' | Берлога';

  gallery = project.gallery.length ? project.gallery : [project.image];
  var track = document.getElementById('slider-track');
  var dots = document.getElementById('slider-dots');
  track.innerHTML = '';
  dots.innerHTML = '';
  gallery.forEach(function (src, i) {
    var slide = document.createElement('div');
    slide.className = 'slider-slide';
    var img = document.createElement('img');
    img.src = src;
    img.alt = 'Фото ' + (i + 1);
    slide.appendChild(img);
    track.appendChild(slide);

    var dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function () { goToSlide(i); });
    dots.appendChild(dot);
  });
  currentSlide = 0;

  var specs = document.getElementById('project-specs');
  specs.innerHTML = '';
  var specData = [
    { label: 'Площадь', value: project.area + ' м²' },
    { label: 'Цена', value: formatPrice(project.price) + ' ₽' },
    { label: 'Материал', value: project.material },
    { label: 'Сроки строительства', value: project.timeline }
  ];
  specData.forEach(function (s) {
    var div = document.createElement('div');
    div.className = 'spec-item';
    div.innerHTML = '<span class="spec-label">' + s.label + '</span><span class="spec-value">' + s.value + '</span>';
    specs.appendChild(div);
  });

  document.getElementById('project-description').textContent = project.description;

  var similar = allProjects.filter(function (p) {
    return p.type === project.type && p.id !== project.id;
  }).slice(0, 3);
  var similarGrid = document.getElementById('similar-grid');
  var similarSection = document.getElementById('similar-section');
  if (similar.length) {
    similarSection.style.display = 'block';
    similarGrid.innerHTML = '';
    similar.forEach(function (p) {
      similarGrid.appendChild(createProjectCard(p));
    });
    initScrollAnimation();
  } else {
    similarSection.style.display = 'none';
  }
}

function goToSlide(index) {
  currentSlide = index;
  var track = document.getElementById('slider-track');
  track.style.transform = 'translateX(-' + (index * 100) + '%)';
  document.querySelectorAll('.slider-dot').forEach(function (dot, i) {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  var next = (currentSlide + 1) % gallery.length;
  goToSlide(next);
}

function prevSlide() {
  var prev = (currentSlide - 1 + gallery.length) % gallery.length;
  goToSlide(prev);
}
