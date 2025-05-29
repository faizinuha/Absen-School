import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Student {
  id: string;
  username: string;
  fullName: string;
  kelas: string;
}

interface AbsensiData {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  kelas: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  timestamp: string;
  guruId: string;
  keterangan?: string;
}

interface GroupedStudents {
  [kelas: string]: Student[];
}

interface AbsensiRecord {
  [key: string]: AbsensiData;
}

interface StatusButtonProps {
  status: string;
  color: string;
  onPress: () => void;
  isSelected: boolean;
  disabled: boolean;
}

export default function AbsensiPage() {
  const router = useRouter();
  const [selectedKelas, setSelectedKelas] = useState<string>('');
  const [kelasList, setKelasList] = useState<string[]>([]);
  const [students, setStudents] = useState<GroupedStudents>({});
  const [absensiData, setAbsensiData] = useState<AbsensiRecord>({});
  const [loading, setLoading] = useState(true);
  const [savingAbsensi, setSavingAbsensi] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const loadData = useCallback(async () => {
    try {
      await Promise.all([loadStudentsData(), loadTodayAbsensi()]);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadStudentsData = async () => {
    try {
      const filePath = `${FileSystem.documentDirectory}users.json`;
      const content = await FileSystem.readAsStringAsync(filePath);
      const userData = JSON.parse(content);

      // Group students by kelas
      const grouped: GroupedStudents = {};
      userData.students.forEach((student: Student) => {
        if (!grouped[student.kelas]) {
          grouped[student.kelas] = [];
        }
        grouped[student.kelas].push(student);
      });

      // Sort kelas and students
      const sortedKelas = Object.keys(grouped).sort();
      const sortedGrouped: GroupedStudents = {};
      sortedKelas.forEach((kelas) => {
        sortedGrouped[kelas] = grouped[kelas].sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        );
      });

      setStudents(sortedGrouped);
      setKelasList(sortedKelas);
      setSelectedKelas(sortedKelas[0] || '');
    } catch (error) {
      console.error('Error loading students:', error);
      throw error;
    }
  };

  const loadTodayAbsensi = async () => {
    try {
      const absensiPath = `${FileSystem.documentDirectory}absensi.json`;
      const todayData: AbsensiRecord = {};

      try {
        const content = await FileSystem.readAsStringAsync(absensiPath);
        const allData: AbsensiRecord = JSON.parse(content);

        // Filter untuk data hari ini
        Object.entries(allData).forEach(([_, value]) => {
          if (value.date === today) {
            todayData[value.studentId] = value;
          }
        });
      } catch {
        // File belum ada
      }

      setAbsensiData(todayData);
    } catch (error) {
      console.error('Error loading absensi:', error);
      throw error;
    }
  };

  const handleAbsensi = async (
    student: Student,
    status: 'hadir' | 'izin' | 'sakit' | 'alpha'
  ) => {
    if (savingAbsensi) return;

    setSavingAbsensi(true);
    try {
      const absensiId = `${today}_${student.id}`;
      const newAbsensi: AbsensiData = {
        id: absensiId,
        date: today,
        studentId: student.id,
        studentName: student.fullName,
        kelas: student.kelas,
        status,
        timestamp: new Date().toISOString(),
        guruId: 'guru1',
        keterangan: '',
      };

      const absensiPath = `${FileSystem.documentDirectory}absensi.json`;
      let existingData: AbsensiRecord = {};

      try {
        const content = await FileSystem.readAsStringAsync(absensiPath);
        existingData = JSON.parse(content);
      } catch {
        // File belum ada
      }

      const updatedData = {
        ...existingData,
        [absensiId]: newAbsensi,
      };

      await FileSystem.writeAsStringAsync(
        absensiPath,
        JSON.stringify(updatedData, null, 2)
      );

      setAbsensiData((prev) => ({
        ...prev,
        [student.id]: newAbsensi,
      }));

      Alert.alert(
        'Sukses',
        `Absensi ${
          student.fullName
        } berhasil dicatat sebagai ${status.toUpperCase()}`
      );
    } catch (error) {
      console.error('Error saving absensi:', error);
      Alert.alert('Error', 'Gagal menyimpan absensi');
    } finally {
      setSavingAbsensi(false);
    }
  };

  const StatusButton: React.FC<StatusButtonProps> = ({
    status,
    color,
    onPress,
    isSelected,
    disabled,
  }) => (
    <TouchableOpacity
      style={[
        styles.statusButton,
        { backgroundColor: isSelected ? color : '#fff' },
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.statusText,
          { color: isSelected ? '#fff' : color },
          disabled && styles.disabledText,
        ]}
      >
        {status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Absensi Kelas</Text>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Kelas Selection */}
      <ScrollView
        horizontal
        style={styles.kelasContainer}
        showsHorizontalScrollIndicator={false}
      >
        {kelasList.map((kelas) => (
          <TouchableOpacity
            key={kelas}
            style={[
              styles.kelasButton,
              selectedKelas === kelas && styles.selectedKelasButton,
            ]}
            onPress={() => setSelectedKelas(kelas)}
          >
            <Text
              style={[
                styles.kelasText,
                selectedKelas === kelas && styles.selectedKelasText,
              ]}
            >
              {kelas}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#28a745" />
            <Text style={styles.loadingText}>Memuat data siswa...</Text>
          </View>
        ) : (
          students[selectedKelas]?.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.fullName}</Text>
                <Text style={styles.studentClass}>{student.kelas}</Text>
              </View>

              <View style={styles.statusButtons}>
                <StatusButton
                  status="Hadir"
                  color="#28a745"
                  onPress={() => handleAbsensi(student, 'hadir')}
                  isSelected={absensiData[student.id]?.status === 'hadir'}
                  disabled={savingAbsensi}
                />
                <StatusButton
                  status="Izin"
                  color="#ffc107"
                  onPress={() => handleAbsensi(student, 'izin')}
                  isSelected={absensiData[student.id]?.status === 'izin'}
                  disabled={savingAbsensi}
                />
                <StatusButton
                  status="Sakit"
                  color="#17a2b8"
                  onPress={() => handleAbsensi(student, 'sakit')}
                  isSelected={absensiData[student.id]?.status === 'sakit'}
                  disabled={savingAbsensi}
                />
                <StatusButton
                  status="Alpha"
                  color="#dc3545"
                  onPress={() => handleAbsensi(student, 'alpha')}
                  isSelected={absensiData[student.id]?.status === 'alpha'}
                  disabled={savingAbsensi}
                />
              </View>
            </View>
          ))
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerDate: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 12,
  },
  kelasContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  kelasButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f8f9fa',
  },
  selectedKelasButton: {
    backgroundColor: '#28a745',
  },
  kelasText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedKelasText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  studentInfo: {
    marginBottom: 10,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  studentClass: {
    fontSize: 14,
    color: '#666',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
