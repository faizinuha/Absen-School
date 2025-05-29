import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface StudentProfile {
  id: string;
  username: string;
  fullName: string;
  kelas: string;
  email: string;
}

interface AttendanceRecord {
  date: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alpha';
  timestamp: string;
}

export default function SiswaDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
    loadAttendanceHistory();
  }, []);

  const loadStudentData = async () => {
    try {
      const usersPath = FileSystem.documentDirectory + 'users.json';
      const content = await FileSystem.readAsStringAsync(usersPath);
      const userData = JSON.parse(content);

      // TODO: Get logged in student ID from authentication context
      const studentId = '1'; // Temporary hardcoded ID
      const student = userData.students.find(
        (s: StudentProfile) => s.id === studentId
      );

      if (student) {
        setProfile(student);
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  };

  const loadAttendanceHistory = async () => {
    try {
      const absensiPath = FileSystem.documentDirectory + 'absensi.json';
      const content = await FileSystem.readAsStringAsync(absensiPath);
      const absensiData = JSON.parse(content);

      // Filter untuk siswa yang sedang login
      const studentId = '1'; // Temporary hardcoded ID
      const studentRecords = absensiData.records
        .filter((record: any) => record.studentId === studentId)
        .slice(0, 5); // Ambil 5 record terakhir

      setRecentAttendance(studentRecords);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir':
        return '#28a745';
      case 'sakit':
        return '#17a2b8';
      case 'izin':
        return '#ffc107';
      case 'alpha':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Profile */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile?.fullName || 'Nama Siswa'}</Text>
            <Text style={styles.subtitle}>{profile?.kelas || 'Kelas'}</Text>
          </View>
        </View>
      </View>

      {/* Kartu Digital */}
      <View style={styles.cardContainer}>
        <View style={styles.digitalCard}>
          <Text style={styles.cardTitle}>Kartu Digital Siswa</Text>
          <View style={styles.qrContainer}>
            {profile && (
              <QRCode
                value={`SMK-${profile.id}-${profile.kelas}`}
                size={150}
                backgroundColor="white"
              />
            )}
          </View>
          <Text style={styles.cardSubtitle}>
            Tunjukan QR code ini untuk absensi
          </Text>
        </View>
      </View>

      {/* Menu Grid */}
      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log('Profile')}
        >
          <Ionicons name="person-outline" size={24} color="#007bff" />
          <Text style={styles.menuTitle}>Profil</Text>
          <Text style={styles.menuDesc}>Edit informasi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log('Attendance')}
        >
          <Ionicons name="calendar-outline" size={24} color="#28a745" />
          <Text style={styles.menuTitle}>Absensi</Text>
          <Text style={styles.menuDesc}>Riwayat kehadiran</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log('Schedule')}
        >
          <Ionicons name="time-outline" size={24} color="#17a2b8" />
          <Text style={styles.menuTitle}>Jadwal</Text>
          <Text style={styles.menuDesc}>Jadwal pelajaran</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log('Permission')}
        >
          <Ionicons name="document-text-outline" size={24} color="#ffc107" />
          <Text style={styles.menuTitle}>Izin</Text>
          <Text style={styles.menuDesc}>Ajukan izin</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Attendance */}
      <View style={styles.attendanceContainer}>
        <Text style={styles.sectionTitle}>Riwayat Kehadiran Terakhir</Text>
        {recentAttendance.map((record, index) => (
          <View key={index} style={styles.attendanceItem}>
            <View style={styles.attendanceInfo}>
              <Text style={styles.attendanceDate}>
                {new Date(record.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text
                style={[
                  styles.attendanceStatus,
                  { color: getStatusColor(record.status) },
                ]}
              >
                {record.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.attendanceTime}>
              {new Date(record.timestamp).toLocaleTimeString('id-ID')}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  profileInfo: {
    marginLeft: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  cardContainer: {
    padding: 15,
  },
  digitalCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  qrContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
  },
  cardSubtitle: {
    marginTop: 15,
    color: '#666',
    fontSize: 14,
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
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  menuDesc: {
    fontSize: 12,
    color: '#666',
  },
  attendanceContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  attendanceItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  attendanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  attendanceDate: {
    fontSize: 14,
    color: '#333',
  },
  attendanceStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  attendanceTime: {
    fontSize: 12,
    color: '#666',
  },
});
