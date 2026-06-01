// js/render.js
function showSection(section) {
  const content = document.getElementById('content');
  
  // Render konten sesuai section
  if (section === 'dashboard') {
    renderDashboard();
  } else if (section === 'barang') {
    renderDaftarBarang();
  } else if (section === 'peminjaman') {
    renderPeminjamanAktif();
  } else if (section === 'pinjam') {
    renderPeminjamanAktif();
  }
  // === PERBAIKAN UTAMA: Update highlight navigasi ===
  updateActiveNav(section);
}

// Fungsi baru untuk mengatur highlight menu
function updateActiveNav(section) {
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-section') === section) {
      link.classList.add('text-blue-600', 'font-semibold');     // aktif
    } else {
      link.classList.remove('text-blue-600', 'font-semibold');  // non-aktif
    }
  });
}

function renderDashboard() {
  const content = document.getElementById('content');

  // Safety check agar tidak error kalau data belum siap
  const daftarBarang = window.data?.daftarBarang || [];
  const peminjamanAktif = window.data?.peminjamanAktif || [];

  const totalBarang = daftarBarang.length;
  const totalDipinjam = peminjamanAktif.length;
  const totalStok = daftarBarang.reduce((sum, b) => sum + (b.stok || 0), 0);

  content.innerHTML = `
    <h2 class="text-3xl font-semibold mb-6">Dashboard</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow">
        <p class="text-gray-500">Total Barang</p>
        <p class="text-4xl font-bold">${totalBarang}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow">
        <p class="text-gray-500">Barang Dipinjam</p>
        <p class="text-4xl font-bold">${totalDipinjam}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow">
        <p class="text-gray-500">Total Stok</p>
        <p class="text-4xl font-bold text-green-600">${totalStok}</p>
      </div>
    </div>
  `;
}

function renderDaftarBarang() {
  const content = document.getElementById('content');
  
  const daftarBarang = window.data?.daftarBarang || [];

  let html = `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-semibold">Daftar Barang</h2>
      <button id="btn-tambah-barang" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2">
        + Tambah Barang Baru
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="barang-grid"></div>
  `;

  content.innerHTML = html;

  const grid = document.getElementById('barang-grid');

  if (daftarBarang.length === 0) {
    grid.innerHTML = `<p class="col-span-3 text-center py-10 text-gray-500">Belum ada barang. Tambahkan barang baru.</p>`;
    return;
  }

  daftarBarang.forEach(barang => {
    const card = document.createElement('div');
    card.className = "bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all";
    card.innerHTML = `
      <h3 class="font-semibold text-xl mb-2">${barang.nama}</h3>
      <p class="text-gray-600 text-sm mb-4">${barang.deskripsi}</p>
      <div class="flex justify-between items-end">
        <div>
          <p class="text-xs text-gray-500">Stok tersedia</p>
          <p class="text-3xl font-bold text-blue-600">${barang.stok}</p>
        </div>
        <button data-id="${barang.id}" class="pinjam-btn bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-medium">
          Pinjam
        </button>
      </div>
    `;

    // Di dalam renderDaftarBarang(), di dalam forEach
const pinjamBtn = card.querySelector('.pinjam-btn');

if (pinjamBtn) {
    pinjamBtn.addEventListener('click', () => {
        console.log("Tombol pinjam diklik untuk barang id:", barang.id);
        
        if (typeof window.handlers?.showFormPinjam === 'function') {
            window.handlers.showFormPinjam(barang.id);
        } else {
            console.error("Fungsi showFormPinjam belum tersedia");
        }
    });
}

    grid.appendChild(card);
  });

  // Pasang event listener tombol Tambah Barang
  const btnTambah = document.getElementById('btn-tambah-barang');
  if (btnTambah && window.handlers && typeof window.handlers.showFormTambahBarang === 'function') {
    btnTambah.addEventListener('click', window.handlers.showFormTambahBarang);
  }
}

function renderPeminjamanAktif() {
  const content = document.getElementById('content');
  const peminjamanAktif = window.data?.peminjamanAktif || [];

  let html = `
    <h2 class="text-3xl font-semibold mb-6">Peminjaman Aktif</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="peminjaman-grid"></div>
  `;

  content.innerHTML = html;

  const grid = document.getElementById('peminjaman-grid');

  if (peminjamanAktif.length === 0) {
    grid.innerHTML = `<p class="col-span-3 text-center py-10 text-gray-500">Belum ada barang yang sedang dipinjam.</p>`;
    return;
  }

  peminjamanAktif.forEach(p => {
    const card = document.createElement('div');
    card.className = "bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all";
    card.innerHTML = `
      <h3 class="font-semibold text-xl mb-2">${p.namaBarang}</h3>
      <p class="text-gray-600">Dipinjam oleh: <strong>${p.namaPeminjam}</strong></p>
      <p class="text-sm text-gray-500 mt-1">
        Tanggal: ${p.tanggalPinjam} | Lama: ${p.lamaHari} hari
      </p>
      <button data-id="${p.id}" 
              class="kembalikan-btn mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-medium">
        Kembalikan
      </button>
    `;
    grid.appendChild(card);
  });

  // Event listener tombol Kembalikan
  document.querySelectorAll('.kembalikan-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const pinjamId = parseInt(this.getAttribute('data-id'));

      if (confirm('Yakin ingin mengembalikan barang ini?')) {
        const berhasil = window.data.kembalikanBarang(pinjamId);

        if (berhasil) {
          if (berhasil) {
  window.render.showSection('dashboard');   // ganti halaman + update menu
} // refresh halaman ini saja
          
        } else {
          alert('Gagal mengembalikan barang.');
        }
      }
    });
  });
}

// Ekspor agar bisa dipakai di file lain
window.render = {
  showSection,
  renderDashboard,
  renderDaftarBarang,
  renderPeminjamanAktif
};