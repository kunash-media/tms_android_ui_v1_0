import { FlatList, Modal, Text, View } from 'react-native';
import Pressable from './Pressable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ICON = {
  trip: ['truck-fast', '#AF1D5A'],
  alert: ['alert-circle', '#D97706'],
  info: ['information', '#2563EB'],
};

const NotificationsModal = ({ visible, items, onChange, onClose }) => {
  const markRead = (id) => onChange(items.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAll = () => onChange(items.map((n) => ({ ...n, read: true })));

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-row items-center justify-between px-3 py-3 bg-white border-b border-slate-200">
          <View className="flex-row items-center">
            <Pressable onPress={onClose} className="p-2 rounded-full active:bg-slate-100">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
            </Pressable>
            <Text className="ml-2 text-lg font-bold text-slate-900">Notifications</Text>
          </View>
          <Pressable onPress={markAll} className="px-3 py-2">
            <Text className="text-sm font-semibold text-primary">Mark all read</Text>
          </Pressable>
        </View>

        <FlatList
          data={items}
          keyExtractor={(n) => String(n.id)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const [icon, color] = ICON[item.type] || ICON.info;
            return (
              <Pressable
                onPress={() => markRead(item.id)}
                className={`flex-row p-3 mb-3 border rounded-2xl ${
                  item.read ? 'bg-white border-slate-200' : 'bg-primary/5 border-primary/30'
                }`}
              >
                <View
                  className="items-center justify-center mr-3 w-11 h-11 rounded-xl"
                  style={{ backgroundColor: `${color}1A` }}
                >
                  <MaterialCommunityIcons name={icon} size={22} color={color} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 font-bold text-slate-900" numberOfLines={1}>{item.title}</Text>
                    {!item.read && <View className="w-2.5 h-2.5 ml-2 rounded-full bg-primary" />}
                  </View>
                  <Text className="mt-0.5 text-sm text-slate-600">{item.body}</Text>
                  <Text className="mt-1 text-xs text-slate-400">{item.time}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default NotificationsModal;