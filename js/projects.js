var allProjects = [];
var filteredProjects = [];
var currentPage = 1;
var perPage = 9;
var currentType = 'all';
var currentArea = 'all';

document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('projects-grid');
  if (!grid) return;

  fetchJSON('data/projects.json').then(function (projects) {
    allProjects = projects;
    applyFilters();
  });

  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      currentType = btn.dataset.filter;
      currentPage = 1;
      applyFilters();
    });
  });

  var areaFilter = document.getElementById('area-filter');
  if (areaFilter) {
    areaFilter.addEventListener('change', function () {
      currentArea = this.value;
      currentPage = 1;
      applyFilters();
    });
  }
});

function applyFilters() {
  filteredProjects = allProjects.filter(function (p) {
    if (currentType !== 'all' && p.type !== currentType) return false;
    if (currentArea !== 'all') {
      if (currentArea === '0-100' && (p.area < 0 || p.area > 100)) return false;
      if (currentArea === '100-200' && (p.area < 100 || p.area > 200)) return false;
      if (currentArea === '200+' && p.area < 200) return false;
    }
    return true;
  });
  renderPage();
}

function renderPage() {
  var grid = document.getElementById('projects-grid');
  var pagination = document.getElementById('pagination');
  if (!grid) return;

  var totalPages = Math.ceil(filteredProjects.length / perPage);
  if (totalPages < 1) totalPages = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  var start = (currentPage - 1) * perPage;
  var end = start + perPage;
  var pageItems = filteredProjects.slice(start, end);

  grid.innerHTML = '';
  pageItems.forEach(function (p) {
    grid.appendChild(createProjectCard(p));
  });
  initScrollAnimation();

  pagination.innerHTML = '';
  for (var i = 1; i <= totalPages; i++) {
    (function (page) {
      var btn = document.createElement('button');
      btn.textContent = page;
      if (page === currentPage) btn.classList.add('active');
      btn.addEventListener('click', function () {
        currentPage = page;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      pagination.appendChild(btn);
    })(i);
  }
}
