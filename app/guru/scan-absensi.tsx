import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanningResult, Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface AbsensiStats {
  total: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
}

interface Student {
  id: string;
  fullName: string;
  kelas: string;
}

interface AbsensiRecord {
  id: string;
  studentId: string;
  studentName: string;
  kelas: string;
  date: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alpha';
  timestamp: string;
  scanMethod: string;
  location?: string;
  notes?: string;
}

interface AbsensiData {
  records: AbsensiRecord[];
  statistics: {
    [date: string]: AbsensiStats;
  };
}

export default function AbsensiScanner() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [stats, setStats] = useState<AbsensiStats>({
    total: 0,
    hadir: 0,
    sakit: 0,
    izin: 0,
    alpha: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    requestCameraPermission();
    loadAbsensiStats();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const loadAbsensiStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const absensiPath = FileSystem.documentDirectory + 'absensi.json';

      let absensiData: AbsensiData;
      try {
        const content = await FileSystem.readAsStringAsync(absensiPath);
        absensiData = JSON.parse(content);
      } catch {
        absensiData = { records: [], statistics: {} };
        await FileSystem.writeAsStringAsync(
          absensiPath,
          JSON.stringify(absensiData, null, 2)
        );
      }

      // Get today's statistics
      const todayStats = absensiData.statistics[today] || {
        total: 0,
        hadir: 0,
        sakit: 0,
        izin: 0,
        alpha: 0,
      };

      setStats(todayStats);
    } catch (error) {
      console.error('Error loading absensi stats:', error);
      Alert.alert('Error', 'Gagal memuat statistik absensi');
    }
  };

  const updateStatistics = (absensiData: AbsensiData, date: string) => {
    const dayRecords = absensiData.records.filter(
      (record) => record.date === date
    );

    absensiData.statistics[date] = {
      total: dayRecords.length,
      hadir: dayRecords.filter((r) => r.status === 'hadir').length,
      sakit: dayRecords.filter((r) => r.status === 'sakit').length,
      izin: dayRecords.filter((r) => r.status === 'izin').length,
      alpha: dayRecords.filter((r) => r.status === 'alpha').length,
    };

    return absensiData;
  };

  // Ganti handleBarCodeScanned ke handleBarCodeScannedCamera
  const handleBarCodeScannedCamera = async (result: BarCodeScanningResult) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const { data } = result;

      // Format barcode: SMK-{id}-{kelas}
      const [prefix, id, kelas] = data.split('-');

      if (prefix !== 'SMK') {
        Alert.alert('Error', 'Format barcode tidak valid');
        setIsProcessing(false);
        return;
      }

      // Cek di database siswa
      const usersPath = FileSystem.documentDirectory + 'users.json';
      const userData = JSON.parse(
        await FileSystem.readAsStringAsync(usersPath)
      );

      const student = userData.students.find(
        (s: Student) => s.id === id && s.kelas === kelas
      );

      if (!student) {
        Alert.alert('Error', 'Data siswa tidak ditemukan');
        setIsProcessing(false);
        return;
      }

      // Proses absensi
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      const absensiPath = FileSystem.documentDirectory + 'absensi.json';

      let absensiData: AbsensiData;
      try {
        const content = await FileSystem.readAsStringAsync(absensiPath);
        absensiData = JSON.parse(content);
      } catch {
        absensiData = { records: [], statistics: {} };
      }

      // Cek apakah sudah absen hari ini
      const alreadyPresent = absensiData.records.find(
        (record) => record.date === today && record.studentId === id
      );

      if (alreadyPresent) {
        Alert.alert('Info', 'Siswa sudah melakukan absensi hari ini');
        setIsProcessing(false);
        return;
      }

      // Tambah record baru
      const newRecord: AbsensiRecord = {
        id: `${today}_${id}`,
        studentId: id,
        studentName: student.fullName,
        kelas: student.kelas,
        date: today,
        status: 'hadir',
        timestamp: now,
        scanMethod: 'barcode',
      };

      absensiData.records.push(newRecord);
      absensiData = updateStatistics(absensiData, today);

      await FileSystem.writeAsStringAsync(
        absensiPath,
        JSON.stringify(absensiData, null, 2)
      );

      Alert.alert('Sukses', `Absensi ${student.fullName} berhasil dicatat`);
      loadAbsensiStats(); // Refresh statistik

      // Tambah haptic feedback
      if (Platform.OS === 'ios') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert('Error', 'Gagal memproses absensi');
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Meminta izin kamera...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Izin kamera ditolak</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Absensi Scanner</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#28a745' }]}>
              {stats.hadir}
            </Text>
            <Text style={styles.statLabel}>Hadir</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#17a2b8' }]}>
              {stats.sakit}
            </Text>
            <Text style={styles.statLabel}>Sakit</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#ffc107' }]}>
              {stats.izin}
            </Text>
            <Text style={styles.statLabel}>Izin</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#dc3545' }]}>
              {stats.alpha}
            </Text>
            <Text style={styles.statLabel}>Alpha</Text>
          </View>
        </View>
        {scanning ? (
          <View style={styles.scannerContainer}>
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFillObject}
              type={CameraType.back}
              onBarCodeScanned={handleBarCodeScannedCamera}
              barCodeScannerSettings={{
                barCodeTypes: [
                  'qr',
                  'code128',
                  'code39',
                  'code93',
                  'ean13',
                  'ean8',
                  'upc_a',
                  'upc_e',
                  'pdf417',
                  'aztec',
                  'datamatrix',
                ],
              }}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setScanning(false)}
            >
              <Text style={styles.cancelButtonText}>Tutup Scanner</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setScanning(true)}
          >
            <Ionicons name="scan-outline" size={24} color="#fff" />
            <Text style={styles.scanButtonText}>Mulai Scan</Text>
          </TouchableOpacity>
        )}
      </View>
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
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  scannerContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    position: 'relative',
  },
  scanButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
