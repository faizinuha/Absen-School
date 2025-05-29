> Edited for use in IDX on 07/09/12

# Aplikasi Absensi SMK Al-Azhar 📱

Aplikasi ini dibuat untuk memudahkan proses absensi di SMK Al-Azhar dengan menggunakan teknologi [Expo](https://expo.dev) dan React Native.

## Struktur Role dan Alasan Pembagian 👥

Aplikasi ini memiliki 3 role utama:

### 1. Admin 👨‍💼
Admin memiliki akses penuh ke sistem dengan kemampuan:
- Mengelola data siswa (tambah, edit, hapus)
- Mengelola data guru
- Melihat laporan absensi keseluruhan
- Mengatur konfigurasi sistem

**Alasan**: Role admin diperlukan untuk:
- Kontrol penuh atas sistem
- Manajemen user (siswa dan guru)
- Pengawasan dan pelaporan tingkat sekolah
- Pemeliharaan data master

### 2. Guru 👨‍🏫
Guru memiliki akses untuk:
- Menginput absensi siswa
- Melihat rekap absensi kelas yang diampu
- Mengelola jadwal mengajar
- Mengupdate profil

**Alasan**: Role guru diperlukan untuk:
- Pencatatan absensi harian
- Monitoring kehadiran siswa
- Pelaporan ke admin
- Manajemen kelas

### 3. Siswa 👨‍🎓
Siswa memiliki akses untuk:
- Melihat status kehadiran
- Mengecek riwayat absensi
- Melihat jadwal pelajaran
- Mengupdate profil

**Alasan**: Role siswa diperlukan untuk:
- Transparansi data absensi
- Akses informasi jadwal
- Manajemen data pribadi

## Struktur Folder 📁

```
app/
├── (tabs)/              # Hanya halaman utama tabbar (index, explore, onboarding)
├── admin/               # Semua fitur admin (dashboard, manajemen kelas, data guru, dsb)
├── guru/                # Semua fitur guru (dashboard, absensi, scan-absensi, dsb)
├── siswa/               # Semua fitur siswa (dashboard, dsb)
├── authentication/      # Komponen autentikasi
├── data/                # Penyimpanan data JSON
└── components/          # Komponen UI
```

> Catatan: Sekarang tabbar hanya menampilkan tab utama (Home & Explore). Semua fitur admin/guru/siswa diakses lewat navigasi dari dashboard masing-masing, bukan sebagai tab.

## Fitur Utama yang Sudah Diimplementasikan ✨

1. **Sistem Autentikasi**
   - Login multi-role (admin, guru, siswa)
   - Registrasi khusus siswa
   - Penyimpanan data di JSON lokal

2. **Dashboard Khusus per Role**
   - Interface berbeda untuk admin, guru, siswa
   - Menu dashboard lengkap (admin: manajemen kelas, data siswa/guru, rekap, pengumuman, settings; guru: absensi, scan, jadwal, laporan, izin, profil; siswa: dashboard)
   - Navigasi antar fitur sudah rapi

3. **Manajemen Data**
   - CRUD kelas (admin)
   - CRUD data siswa/guru (admin, coming soon)
   - Absensi barcode (guru)
   - Statistik absensi harian (guru)
   - Validasi input & penanganan error

## Teknologi yang Digunakan 🛠️

- Expo Router untuk navigasi
- React Native untuk UI
- TypeScript untuk type safety
- Expo FileSystem untuk penyimpanan lokal

## Cara Navigasi & Penggunaan 📱

- Tabbar hanya untuk Home & Explore
- Untuk masuk ke fitur admin/guru/siswa, login sesuai role lalu gunakan menu dashboard
- Semua menu dashboard sudah tersedia, jika ada menu "Coming Soon" berarti fitur akan segera dikembangkan

## Pengembangan Selanjutnya 🚀

Fitur yang akan ditambahkan:
1. Implementasi absensi real-time & lokasi
2. Notifikasi ketidakhadiran
3. Laporan bulanan & rekap
4. Backup data cloud
5. Pengumuman & pengaturan sistem

## Keamanan 🔒

- Password tidak disimpan dalam bentuk plain text
- Validasi input untuk mencegah injeksi
- Pemisahan akses berdasarkan role
- Struktur folder sudah dipisahkan agar navigasi lebih aman dan rapi
