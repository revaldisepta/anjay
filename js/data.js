// js/data.js

window.data = {
  daftarBarang: [],
  peminjamanAktif: [],
  
  

  // 🔹 Load dari localStorage
  load() {
    const barang = localStorage.getItem('daftarBarang');
    const pinjam = localStorage.getItem('peminjamanAktif');

    if (barang) this.daftarBarang = JSON.parse(barang);
    if (pinjam) this.peminjamanAktif = JSON.parse(pinjam);
  },

  // 🔹 Simpan ke localStorage
  save() {
    localStorage.setItem('daftarBarang', JSON.stringify(this.daftarBarang));
    localStorage.setItem('peminjamanAktif', JSON.stringify(this.peminjamanAktif));
  },

  // 🔹 Data awal (kalau kosong)
  initData() {
    this.daftarBarang = [
      { id: 1, nama: "Laptop Dell", stok: 5, deskripsi: "Core i5 8GB RAM" },
      { id: 2, nama: "Proyektor Epson", stok: 3, deskripsi: "HD Ready" },
      { id: 3, nama: "Kabel HDMI", stok: 15, deskripsi: "2 meter" }
    ];
    this.peminjamanAktif = [
      { 

      }
    ];
    this.save(); // ⬅️ penting
  },

  // 🔹 Generate ID baru
  generateNewId() {
    if (this.daftarBarang.length === 0) return 1;
    return Math.max(...this.daftarBarang.map(b => b.id)) + 1;
  },

  generateNewIdPeminjaman: function() {
    if (this.peminjamanAktif.length === 0) return 1;
    return Math.max(...this.peminjamanAktif.map(p => p.id)) +1;
  },

  pinjamBarang: function(barangId, namaPeminjam, lamaHari) {
    const barang = this.daftarBarang.find(b => b.id === barangId);

    if (!barang) {
      alert("barang tidak ditemukan");
      return false;
    }

    if (barang.stok <= 0) {
      alert("entek bosss");
      return false;
    }

    barang.stok -= 1;

    const today = new Date().toISOString().split('T')[0];

    const idPinjamBaru = this.generateNewIdPeminjaman();

    const peminjamanBaru = {
      id: idPinjamBaru,
      barangId: barang.id,
      namaBarang: barang.nama,
      namaPeminjam: namaPeminjam,
      tanggalPinjam: today,
      lamaHari: parseInt(lamaHari),
      status: "aktif"
    };

    this.peminjamanAktif.push(peminjamanBaru);
      
    this.save();

    console.log("Peminjaman Berhasil:", peminjamanBaru);
    return true;
  },

  kembalikanBarang(pinjamId) {
    const index = this.peminjamanAktif.findIndex(p => p.id === pinjamId);
    
    if (index === -1) {
      alert("Data peminjaman tidak ditemukan");
      return false;
    }

    const peminjaman = this.peminjamanAktif[index];
  
  // Cari barang dan tambahkan stok kembali
  const barang = this.daftarBarang.find(b => b.id === peminjaman.barangId);
  if (barang) {
    barang.stok += 1;
  }

    this.peminjamanAktif.splice(index, 1);

    this.save();
    return true;
  },

  // 🔹 Tambah barang (dipakai di handler)
  tambahBarang(barang) {
    this.daftarBarang.push(barang);
    this.save();
  }
};