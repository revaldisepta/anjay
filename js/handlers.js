// js/handlers.js

function showFormTambahBarang() {
  const content = document.getElementById('content');

  const modalHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="modal-backdrop">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-xl font-semibold">Tambah Barang Baru</h3>
          <button id="btn-tutup-modal" class="text-3xl text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <form id="form-tambah-barang" class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Barang *</label>
            <input type="text" id="nama-barang" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea id="deskripsi-barang" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-xl"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stok Awal *</label>
            <input type="number" id="stok-barang" min="1" value="1" class="w-full px-4 py-3 border border-gray-300 rounded-xl" required>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" id="btn-batal" class="flex-1 py-3 border rounded-xl">Batal</button>
            <button type="submit" class="flex-1 py-3 bg-blue-600 text-white rounded-xl">Simpan Barang</button>
          </div>
        </form>
      </div>
    </div>
  `;

  content.insertAdjacentHTML('beforeend', modalHTML);

  const form = document.getElementById('form-tambah-barang');
  const btnTutup = document.getElementById('btn-tutup-modal');
  const btnBatal = document.getElementById('btn-batal');

  function tutupModal() {
    const modal = document.getElementById('modal-backdrop');
    if (modal) modal.remove();
  }

  btnTutup.addEventListener('click', tutupModal);
  btnBatal.addEventListener('click', tutupModal);

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nama = document.getElementById('nama-barang').value.trim();
    const deskripsi = document.getElementById('deskripsi-barang').value.trim();
    const stok = parseInt(document.getElementById('stok-barang').value);

    if (!nama) {
      alert('Nama barang harus diisi!');
      return;
    }

    if (isNaN(stok) || stok < 1) {
      alert('Stok minimal 1!');
      return;
    }

    // ✅ pakai method baru
    window.data.tambahBarang({
      id: window.data.generateNewId(),
      nama: nama,
      stok: stok,
      deskripsi: deskripsi || "-"
    });

    tutupModal();

    // ✅ render pakai namespace
    window.render.renderDaftarBarang();

    alert('Barang berhasil ditambahkan!');
  });
}

function showFormPinjam(barangId) {
    const content = document.getElementById('content');

    const barang = window.data.daftarBarang.find(b => b.id === barangId);

    if (!barang) {
      alert("Barang tidak ditemukan");
      return;
    }

    const modalHTML = `
     <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="modal-backdrop">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-xl font-semibold">Pinjam Barang</h3>
          <button id="btn-tutup-modal" class="text-3xl text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <form id="form-pinjam-barang" class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Peminjam *</label>
            <input type="text" id="nama-peminjam" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500" required>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Lama Pinjam (hari)*</label>
            <input type="number" id="lama-hari" min="1" value="1" class="w-full px-4 py-3 border border-gray-300 rounded-xl" required>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" id="btn-batal" class="flex-1 py-3 border rounded-xl">Batal</button>
            <button type="submit" class="flex-1 py-3 bg-blue-600 text-white rounded-xl">Pinjam Sekarang</button>
          </div>
        </form>
      </div>
    </div>
    `;
    content.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('modal-backdrop');
    const form = document.getElementById('form-pinjam-barang');
    const btnTutup = document.getElementById('btn-tutup-modal');
    const btnBatal = document.getElementById('btn-batal');

    function tutupModal() {
        if (modal) modal.remove();
    }

    btnTutup.addEventListener('click', tutupModal);
    btnBatal.addEventListener('click', tutupModal);

    form.addEventListener('submit', function(e) {
     e.preventDefault();

     const namaPeminjam = document.getElementById('nama-peminjam').value.trim();
     const lamaHari = document.getElementById('lama-hari').value;

     if (!namaPeminjam) {
      alert('Nama peminjam harus diisi');
      return;
     }

     if (!lamaHari || parseInt(lamaHari) < 1) {
      alert("Lama pinjam minimal 1 hari!");
      return;
     }

     const berhasil = window.data.pinjamBarang(barangId, namaPeminjam, lamaHari);

     

    console.log("Akan meminjam:", {
            barangId: barangId,
            namaBarang: barang.nama,
            namaPeminjam: namaPeminjam,
            lamaHari: lamaHari
        });
        
       if (berhasil) {
            tutupModal();                    // tutup modal
            window.render.renderDaftarBarang(); // refresh daftar barang (stok berkurang)
            
            alert(`✅ Berhasil meminjam "${barang.nama}" untuk ${namaPeminjam} selama ${lamaHari} hari`);
        } else {
            alert("❌ Gagal melakukan peminjaman! Stok mungkin habis.");
        }
    });
    
}

// Ekspor
window.handlers = {
  showFormTambahBarang,
  showFormPinjam
};