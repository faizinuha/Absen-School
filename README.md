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

## Fitur Utama yang Sudah Diimplementasikan ✨

1. **Sistem Autentikasi**
   - Login multi-role (admin, guru, siswa)
   - Registrasi khusus siswa
   - Penyimpanan data di JSON lokal

2. **Dashboard Khusus per Role**
   - Interface yang berbeda untuk setiap role
   - Menu yang disesuaikan dengan kebutuhan
   - Navigasi yang intuitif

3. **Manajemen Data**
   - Penyimpanan data user
   - Validasi input
   - Penanganan error

## Struktur Folder 📁

```
app/
├── (tabs)/              # Halaman utama aplikasi
│   ├── admin/           # Dashboard admin
│   ├── guru/            # Dashboard guru
│   └── siswa/           # Dashboard siswa
├── authentication/      # Komponen autentikasi
└── data/               # Penyimpanan data JSON
```

## Teknologi yang Digunakan 🛠️

- Expo Router untuk navigasi
- React Native untuk UI
- TypeScript untuk type safety
- Expo FileSystem untuk penyimpanan lokal

## Cara Penggunaan 📱

### Admin
1. Login dengan akun admin default:
   - Username: admin
   - Password: admin123

### Guru
1. Login dengan akun guru:
   - Username: guru1
   - Password: guru123

### Siswa
1. Registrasi akun baru
2. Login dengan akun yang sudah dibuat
3. Akses fitur siswa

## Pengembangan Selanjutnya 🚀

Fitur yang akan ditambahkan:
1. Implementasi absensi real-time
2. Notifikasi ketidakhadiran
3. Laporan bulanan
4. Backup data cloud

## Keamanan 🔒

- Password tidak disimpan dalam bentuk plain text
- Validasi input untuk mencegah injeksi
- Pemisahan akses berdasarkan role
