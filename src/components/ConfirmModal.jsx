import { Modal, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ConfirmModal = ({
  visible, icon = 'help-circle', danger = false, title, message,
  confirmText = 'Yes', cancelText = 'No', onConfirm, onCancel,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View className="items-center justify-center flex-1 px-6 bg-black/50">
      <View className="w-full p-5 bg-white rounded-3xl">
        <View
          className={`items-center justify-center self-center w-14 h-14 mb-3 rounded-full ${
            danger ? 'bg-red-100' : 'bg-primary/10'
          }`}
        >
          <MaterialCommunityIcons name={icon} size={30} color={danger ? '#DC2626' : '#AF1D5A'} />
        </View>
        <Text className="text-lg font-extrabold text-center text-slate-900">{title}</Text>
        <Text className="mt-1.5 mb-5 text-sm text-center text-slate-600">{message}</Text>
        <View className="flex-row">
          <Pressable
            onPress={onCancel}
            className="items-center flex-1 py-3.5 mr-2 border rounded-2xl border-slate-300 active:bg-slate-50"
          >
            <Text className="font-bold text-slate-700">{cancelText}</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            className={`items-center flex-1 py-3.5 ml-2 rounded-2xl ${
              danger ? 'bg-red-600 active:bg-red-700' : 'bg-primary active:bg-primary-dark'
            }`}
          >
            <Text className="font-bold text-white">{confirmText}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

export default ConfirmModal;