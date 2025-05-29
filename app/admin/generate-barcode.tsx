import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Student {
  id: string;
  username: string;
  fullName: string;
  kelas: string;
  barcode?: string;
}

export default function GenerateBarcode() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const filePath = FileSystem.documentDirectory + 'users.json';
      const content = await FileSystem.readAsStringAsync(filePath);
      const userData = JSON.parse(content);

      // Generate barcode untuk siswa yang belum punya
      interface UserData {
        students: Student[];
        [key: string]: any;
      }

      const updatedStudents: Student[] = (userData as UserData).students.map(
        (student: Student): Student => ({
          ...student,
          barcode: student.barcode || `SMK-${student.id}-${student.kelas}`,
        })
      );

      // Simpan kembali data dengan barcode
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify({ ...userData, students: updatedStudents }, null, 2)
      );

      setStudents(updatedStudents);
      setLoading(false);
    } catch (error) {
      console.error('Error loading students:', error);
      Alert.alert('Error', 'Gagal memuat data siswa');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generate Kartu Siswa</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{students.length}</Text>
            <Text style={styles.statLabel}>Total Siswa</Text>
          </View>
        </View>

        <View style={styles.cardGrid}>
          {students.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.schoolName}>SMK AL-AZHAR</Text>
                <Text style={styles.cardType}>KARTU SISWA</Text>
              </View>

              <View style={styles.qrContainer}>
                <QRCode
                  value={student.barcode}
                  size={100}
                  backgroundColor="white"
                />
              </View>

              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.fullName}</Text>
                <Text style={styles.studentDetail}>Kelas: {student.kelas}</Text>
                <Text style={styles.studentDetail}>ID: {student.id}</Text>
              </View>
            </View>
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
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
  cardGrid: {
    flexDirection: 'column',
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  cardType: {
    fontSize: 14,
    color: '#666',
  },
  qrContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  studentInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  studentDetail: {
    fontSize: 14,
    color: '#666',
  },
});
