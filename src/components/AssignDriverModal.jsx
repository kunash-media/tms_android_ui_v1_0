import { useEffect, useState } from 'react';
import { FlatList, Modal, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Pressable from './Pressable';
import { DRIVERS } from '../data/dummy';

const AssignDriverModal = ({ visible, onClose, onAssign }) => {
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    if (visible) setPicked(null);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable plain className="justify-end flex-1 bg-black/50" onPress={onClose}>
        <Pressable plain className="bg-white rounded-t-3xl max-h-[80%]" onPress={() => {}}>
          <View className="self-center w-12 h-1.5 mt-3 rounded-full bg-slate-300" />
          <View className="px-5 pt-4 pb-2">
            <Text className="text-lg font-extrabold text-slate-900">Assign trip to a driver</Text>
            <Text className="mt-0.5 text-xs text-slate-500">
              The trip will be forwarded and locked until admin reverts it.
            </Text>
          </View>

          <FlatList
            style={{ flexGrow: 0 }}
            data={DRIVERS}
            keyExtractor={(d) => d.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8 }}
            renderItem={({ item }) => {
              const on = picked?.id === item.id;
              const initials = item.name.split(' ').map((w) => w[0]).join('').slice(0, 2);
              return (
                <Pressable
                  onPress={() => setPicked(item)}
                  className={`flex-row items-center p-3 mb-3 border rounded-2xl ${
                    on ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'
                  }`}
                >
                  <View className="items-center justify-center mr-3 rounded-full w-11 h-11 bg-primary/10">
                    <Text className="font-bold text-primary">{initials}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-slate-900">{item.name}</Text>
                    <Text className="text-xs text-slate-500" numberOfLines={1}>
                      {item.vehicle} · {item.area}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={on ? 'radiobox-marked' : 'radiobox-blank'}
                    size={22}
                    color={on ? '#AF1D5A' : '#CBD5E1'}
                  />
                </Pressable>
              );
            }}
          />

          <View className="px-5 pt-1 pb-5">
            <Pressable
              disabled={!picked}
              onPress={() => onAssign(picked)}
              className={`items-center py-3.5 rounded-2xl ${picked ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <Text className={`font-bold ${picked ? 'text-white' : 'text-slate-400'}`}>
                {picked ? `Assign to ${picked.name}` : 'Select a driver'}
              </Text>
            </Pressable>
            <Pressable onPress={onClose} className="items-center py-3">
              <Text className="font-semibold text-slate-500">Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AssignDriverModal;