const projectsGrid = document.getElementById('projectsGrid');
const prevButton = document.getElementById('projectsPrev');
const nextButton = document.getElementById('projectsNext');

function getScrollAmount() {
  const card = projectsGrid.querySelector('.project-card');
  if (!card) return 320;

  const gridStyles = window.getComputedStyle(projectsGrid);
  const gap = parseInt(gridStyles.gap || gridStyles.columnGap || '24', 10);
  return card.offsetWidth + gap;
}

function scrollProjects(direction) {
  const amount = getScrollAmount();
  projectsGrid.scrollBy({ left: amount * direction, behavior: 'smooth' });
}

if (prevButton && nextButton && projectsGrid) {
  prevButton.addEventListener('click', () => scrollProjects(-1));
  nextButton.addEventListener('click', () => scrollProjects(1));

  window.addEventListener('resize', () => {
    projectsGrid.scrollBy({ left: 0 });
  });
}
