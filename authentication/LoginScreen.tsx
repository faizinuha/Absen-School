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

interface AuthorizedUser {
  username: string;
  password: string;
  role: 'admin' | 'guru' | 'siswa';
  name?: string;
  fullName?: string;
  email?: string;
  kelas?: string;
}

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Data admin dan guru yang diizinkan login
  const authorizedUsers: AuthorizedUser[] = [
    {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Administrator',
    },
    {
      username: 'guru1',
      password: 'guru123',
      role: 'guru',
      name: 'Budi Santoso',
    },
  ];

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username dan password harus diisi');
      return;
    }

    // Cek admin/guru terlebih dahulu
    const adminGuruUser = authorizedUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (adminGuruUser) {
      handleSuccessfulLogin(adminGuruUser);
      return;
    }

    // Jika bukan admin/guru, cek data siswa
    try {
      const filePath = FileSystem.documentDirectory + 'users.json';
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      const userData = JSON.parse(fileContent);

      const studentUser = userData.students.find(
        (student: AuthorizedUser) =>
          student.username === username && student.password === password
      );

      if (studentUser) {
        handleSuccessfulLogin({
          ...studentUser,
          name: studentUser.fullName, // Gunakan fullName untuk tampilan
        });
      } else {
        Alert.alert('Login Gagal', 'Username atau password salah');
      }
    } catch (error) {
      console.error('Error reading user data:', error);
      Alert.alert('Error', 'Gagal memverifikasi data siswa');
    }
  };
  const handleSuccessfulLogin = (user: AuthorizedUser) => {
    const welcomeMessage =
      user.role === 'siswa'
        ? `Selamat datang, ${user.fullName}`
        : `Selamat datang, ${user.name}`;

    Alert.alert('Login Berhasil', welcomeMessage, [
      {
        text: 'OK',
        onPress: () => {
          switch (user.role) {
            case 'admin':
              router.replace('/admin/dashboard');
              break;
            case 'guru':
              router.replace('/guru/dashboard');
              break;
            case 'siswa':
              router.replace('/siswa/dashboard');
              break;
          }
        },
      },
    ]);
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Silahkan Masuk</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>
          Belum punya akun? Daftar di sini
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
  },
  registerText: {
    color: '#007bff',
    fontSize: 14,
  },
});

export default LoginScreen;
