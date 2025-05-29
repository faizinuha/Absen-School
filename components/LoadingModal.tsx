import React from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';

interface LoadingModalProps {
  visible: boolean;
}

export function LoadingModal({ visible }: LoadingModalProps) {
  return (
    <Modal transparent visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    </Modal>
  );
}
