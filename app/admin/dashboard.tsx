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

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Admin</Text>
        <Text style={styles.headerSubtitle}>SMK Al-Azhar</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>150</Text>
            <Text style={styles.statLabel}>Total Siswa</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Total Guru</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Kelas</Text>
          </View>
        </View>

        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/manajemen-kelas')}
          >
            <Ionicons name="school-outline" size={24} color="#007bff" />
            <Text style={styles.menuTitle}>Manajemen Kelas</Text>
            <Text style={styles.menuDesc}>Atur kelas dan jadwal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/data-siswa')}
          >
            <Ionicons name="people-outline" size={24} color="#28a745" />
            <Text style={styles.menuTitle}>Data Siswa</Text>
            <Text style={styles.menuDesc}>Database siswa & status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/data-guru')}
          >
            <Ionicons name="person-outline" size={24} color="#17a2b8" />
            <Text style={styles.menuTitle}>Data Guru</Text>
            <Text style={styles.menuDesc}>Kelola guru & mapel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/rekap-absensi')}
          >
            <Ionicons name="document-text-outline" size={24} color="#ffc107" />
            <Text style={styles.menuTitle}>Rekap Absensi</Text>
            <Text style={styles.menuDesc}>Laporan kehadiran</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/pengumuman')}
          >
            <Ionicons name="megaphone-outline" size={24} color="#6f42c1" />
            <Text style={styles.menuTitle}>Pengumuman</Text>
            <Text style={styles.menuDesc}>Broadcast info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#dc3545" />
            <Text style={styles.menuTitle}>Pengaturan</Text>
            <Text style={styles.menuDesc}>Konfigurasi sistem</Text>
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
    backgroundColor: '#007bff',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
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
