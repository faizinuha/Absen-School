import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LoadingModal } from '../../components/LoadingModal'; // Pastikan path ini sesuai dengan struktur project Anda

export default function ManajemenKelas() {
  // const router = useRouter();
  const [classes, setClasses] = useState([
    // Contoh data awal
    {
      id: 1,
      nama_kelas: 'X IPA 1',
      tahun_ajaran: '2024/2025',
      wali_kelas: 'Bu Siti',
      jurusan: 'IPA',
    },
    {
      id: 2,
      nama_kelas: 'XI IPS 2',
      tahun_ajaran: '2024/2025',
      wali_kelas: 'Pak Budi',
      jurusan: 'IPS',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nama_kelas: '',
    tahun_ajaran: '',
    wali_kelas: '',
    jurusan: '',
  });

  // useEffect(() => {
  //   fetchClasses();
  // }, []);

  // const fetchClasses = async () => { ... } // dihapus

  const handleSubmit = () => {
    if (!formData.nama_kelas || !formData.tahun_ajaran) {
      Alert.alert('Error', 'Nama kelas dan tahun ajaran harus diisi');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (editingId) {
        setClasses((prev) =>
          prev.map((kelas) =>
            kelas.id === editingId ? { ...kelas, ...formData } : kelas
          )
        );
      } else {
        setClasses((prev) => [{ ...formData, id: Date.now() }, ...prev]);
      }
      resetForm();
      setLoading(false);
      Alert.alert('Sukses', 'Data kelas berhasil disimpan');
    }, 500);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Konfirmasi', 'Yakin ingin menghapus kelas ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          setLoading(true);
          setTimeout(() => {
            setClasses((prev) => prev.filter((kelas) => kelas.id !== id));
            setLoading(false);
            Alert.alert('Sukses', 'Kelas berhasil dihapus');
          }, 500);
        },
      },
    ]);
  };

  const handleEdit = (kelas: any) => {
    setFormData({
      nama_kelas: kelas.nama_kelas,
      tahun_ajaran: kelas.tahun_ajaran,
      wali_kelas: kelas.wali_kelas || '',
      jurusan: kelas.jurusan || '',
    });
    setEditingId(kelas.id);
    setIsAddMode(true);
  };

  const resetForm = () => {
    setFormData({
      nama_kelas: '',
      tahun_ajaran: '',
      wali_kelas: '',
      jurusan: '',
    });
    setEditingId(null);
    setIsAddMode(false);
  };

  return (
    <View className="flex-1 bg-white">
      {/* LoadingModal digunakan untuk loading state */}
      <LoadingModal visible={loading} />

      <View className="p-4 border-b border-gray-200">
        <Text className="text-xl font-bold">Manajemen Kelas</Text>
        {!isAddMode ? (
          <TouchableOpacity
            onPress={() => setIsAddMode(true)}
            className="mt-2 bg-blue-500 p-2 rounded-lg"
          >
            <Text className="text-white text-center">Tambah Kelas Baru</Text>
          </TouchableOpacity>
        ) : (
          <View className="mt-4">
            <TextInput
              className="border border-gray-300 p-2 rounded-lg mb-2"
              placeholder="Nama Kelas"
              value={formData.nama_kelas}
              onChangeText={(text) =>
                setFormData({ ...formData, nama_kelas: text })
              }
            />
            <TextInput
              className="border border-gray-300 p-2 rounded-lg mb-2"
              placeholder="Tahun Ajaran"
              value={formData.tahun_ajaran}
              onChangeText={(text) =>
                setFormData({ ...formData, tahun_ajaran: text })
              }
            />
            <TextInput
              className="border border-gray-300 p-2 rounded-lg mb-2"
              placeholder="Wali Kelas"
              value={formData.wali_kelas}
              onChangeText={(text) =>
                setFormData({ ...formData, wali_kelas: text })
              }
            />
            <TextInput
              className="border border-gray-300 p-2 rounded-lg mb-2"
              placeholder="Jurusan"
              value={formData.jurusan}
              onChangeText={(text) =>
                setFormData({ ...formData, jurusan: text })
              }
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-green-500 p-2 rounded-lg flex-1 mr-2"
              >
                <Text className="text-white text-center">
                  {editingId ? 'Update' : 'Simpan'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={resetForm}
                className="bg-gray-500 p-2 rounded-lg flex-1 ml-2"
              >
                <Text className="text-white text-center">Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 p-4">
        {classes.map((kelas) => (
          <View
            key={kelas.id}
            className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-100"
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-bold">{kelas.nama_kelas}</Text>
                <Text className="text-gray-600">
                  Tahun: {kelas.tahun_ajaran}
                </Text>
                {kelas.wali_kelas && (
                  <Text className="text-gray-600">
                    Wali: {kelas.wali_kelas}
                  </Text>
                )}
                {kelas.jurusan && (
                  <Text className="text-gray-600">
                    Jurusan: {kelas.jurusan}
                  </Text>
                )}
              </View>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => handleEdit(kelas)}
                  className="mr-2"
                >
                  <Ionicons name="pencil" size={24} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(kelas.id)}>
                  <Ionicons name="trash-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
