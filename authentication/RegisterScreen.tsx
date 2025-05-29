import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface UserData {
  students: Student[];
  admins: Admin[];
  teachers: Teacher[];
}

interface Student {
  username: string;
  email: string;
  password: string;
  role: 'siswa';
  fullName: string;
  kelas: string;
  createdAt: string;
}

interface Admin {
  username: string;
  password: string;
  role: 'admin';
}

interface Teacher {
  username: string;
  password: string;
  role: 'guru';
}

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [kelas, setKelas] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok!');
      return;
    }

    if (!username || !email || !password || !fullName || !kelas) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    const newStudent: Student = {
      username,
      email,
      password,
      role: 'siswa',
      fullName,
      kelas,
      createdAt: new Date().toISOString(),
    };

    try {
      // Baca file JSON yang ada
      const filePath = FileSystem.documentDirectory + 'users.json';
      let userData: UserData = { students: [], admins: [], teachers: [] };

      try {
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        userData = JSON.parse(fileContent) as UserData;
      } catch {
        // File doesn't exist yet, will create new one with initial data
        console.log('File belum ada, akan membuat baru');
      }

      // Cek apakah username sudah ada
      const isUsernameTaken = userData.students.some(
        (user) => user.username === username
      );

      if (isUsernameTaken) {
        Alert.alert('Error', 'Username sudah digunakan!');
        return;
      }

      // Tambah siswa baru
      userData.students.push(newStudent); // Simpan kembali ke file
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(userData, null, 2)
      );

      Alert.alert(
        'Sukses',
        'Registrasi berhasil! Silahkan login dengan akun yang sudah dibuat.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Gagal menyimpan data!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Siswa</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Kelas"
        value={kelas}
        onChangeText={setKelas}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Konfirmasi Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.loginText}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 20,
  },
  loginText: {
    color: '#007BFF',
    fontSize: 14,
  },
});

export default RegisterScreen;
