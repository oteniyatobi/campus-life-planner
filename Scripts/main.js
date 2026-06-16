// ===== NAVIGATION =====
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

function showPage(pageId) {
  // Hide all pages
  pages.forEach(page => page.classList.remove('active'));
  
  // Remove active from all nav links
  navLinks.forEach(link => link.classList.remove('active'));

  // Show the selected page
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');

  // Set active nav link
  const targetLink = document.querySelector(`[data-page="${pageId}"]`);
  if (targetLink) targetLink.classList.add('active');
}

// Add click event to each nav link
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = link.getAttribute('data-page');
    showPage(pageId);
  });
});