import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function GuruDashboard() {
  const router = useRouter();

  const today = new Date();
  const dayNames = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Guru</Text>
        <Text style={styles.headerSubtitle}>{`${
          dayNames[today.getDay()]
        }, ${today.toLocaleDateString()}`}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#28a745' }]}
            onPress={() => router.push('/guru/absensi-cepat')}
          >
            <Ionicons name="checkmark-circle-outline" size={32} color="#fff" />
            <Text style={styles.actionButtonText}>Absensi Cepat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#17a2b8' }]}
            onPress={() => router.push('/guru/jadwal-hari-ini')}
          >
            <Ionicons name="today-outline" size={32} color="#fff" />
            <Text style={styles.actionButtonText}>Jadwal Hari Ini</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/guru/kelas-saya')}
          >
            <Ionicons name="people-outline" size={24} color="#007bff" />
            <Text style={styles.menuTitle}>Kelas Saya</Text>
            <Text style={styles.menuDesc}>Daftar kelas & siswa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/guru/absensi')}
          >
            <Ionicons name="calendar-outline" size={24} color="#28a745" />
            <Text style={styles.menuTitle}>Absensi</Text>
            <Text style={styles.menuDesc}>Input & rekap absensi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/guru/jadwal-mengajar')}
          >
            <Ionicons name="time-outline" size={24} color="#17a2b8" />
            <Text style={styles.menuTitle}>Jadwal</Text>
            <Text style={styles.menuDesc}>Jadwal mengajar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/guru/laporan')}
          >
            <Ionicons name="document-text-outline" size={24} color="#ffc107" />
            <Text style={styles.menuTitle}>Laporan</Text>
            <Text style={styles.menuDesc}>Rekap & analisis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/guru/izin-siswa')}
          >
            <Ionicons name="mail-outline" size={24} color="#6f42c1" />
            <Text style={styles.menuTitle}>Izin Siswa</Text>
            <Text style={styles.menuDesc}>Kelola surat izin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/guru/profil')}
          >
            <Ionicons name="person-outline" size={24} color="#dc3545" />
            <Text style={styles.menuTitle}>Profil</Text>
            <Text style={styles.menuDesc}>Info & pengaturan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#28a745',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionButton: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    color: '#fff',
    marginTop: 5,
    fontWeight: '500',
  },
  menuGrid: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  menuDesc: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
});
