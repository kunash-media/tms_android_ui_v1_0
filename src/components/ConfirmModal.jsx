import { Modal, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Pressable from './Pressable';

const TONES = {
  primary: { iconBg: 'bg-primary/10', icon: '#AF1D5A', btn: 'bg-primary' },
  danger: { iconBg: 'bg-red-100', icon: '#DC2626', btn: 'bg-red-600' },
  warning: { iconBg: 'bg-amber-100', icon: '#D97706', btn: 'bg-amber-500' },
};

const ConfirmModal = ({
  visible, icon = 'help-circle', tone, danger = false, title, message,
  confirmText = 'Yes', cancelText = 'No', onConfirm, onCancel,
}) => {
  const t = TONES[tone || (danger ? 'danger' : 'primary')];
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="items-center justify-center flex-1 px-6 bg-black/50">
        <View className="w-full p-5 bg-white rounded-3xl">
          <View className={`items-center justify-center self-center w-14 h-14 mb-3 rounded-full ${t.iconBg}`}>
            <MaterialCommunityIcons name={icon} size={30} color={t.icon} />
          </View>
          <Text className="text-lg font-extrabold text-center text-slate-900">{title}</Text>
          <Text className="mt-1.5 mb-5 text-sm text-center text-slate-600">{message}</Text>
          <View className="flex-row">
            <Pressable
              onPress={onCancel}
              className="items-center flex-1 py-3.5 mr-2 border rounded-2xl border-slate-300"
            >
              <Text className="font-bold text-slate-700">{cancelText}</Text>
            </Pressable>
            <Pressable onPress={onConfirm} className={`items-center flex-1 py-3.5 ml-2 rounded-2xl ${t.btn}`}>
              <Text className="font-bold text-white">{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;