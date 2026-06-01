// js/app.js
function initializeApp() {
  console.log('🚀 SiPinjam mulai dijalankan...');

  if (!window.data || !window.render || !window.handlers) {
    console.error('❌ File JS belum semua dimuat!');
    return;
  }

  window.data.load();
  if (window.data.daftarBarang.length === 0) {
    window.data.initData();
  }

  setupNavigation();
  window.render.showSection('dashboard');

  console.log('✅ SiPinjam siap digunakan!');
}

function setupNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      window.render.showSection(section);

      document.querySelectorAll('.nav-link').forEach(l => 
        l.classList.remove('text-blue-600', 'font-semibold')
      );
      this.classList.add('text-blue-600', 'font-semibold');
    });
  });
}

window.onload = initializeApp;