import { Linking, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PILL = {
  'In transit': ['bg-green-100', 'text-green-700'],
  Scheduled: ['bg-amber-100', 'text-amber-700'],
  Completed: ['bg-green-100', 'text-green-700'],
  Cancelled: ['bg-red-100', 'text-red-700'],
};

const Chip = ({ icon, text }) => (
  <View className="flex-row items-center px-2.5 py-1.5 mr-2 mb-2 rounded-full border border-slate-200 bg-slate-50">
    <MaterialCommunityIcons name={icon} size={14} color="#AF1D5A" />
    <Text className="ml-1 text-xs font-semibold text-slate-700">{text}</Text>
  </View>
);

const openMap = (s) =>
  Linking.openURL(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name} ${s.area}`)}`
  );

const TripDetailsModal = ({ trip, onClose }) => {
  const stops = trip?.stops || [];
  const from = trip?.source ?? trip?.from;
  const to = trip?.destination ?? trip?.to;
  const when = trip?.startedAt ?? trip?.date;
  const pill = PILL[trip?.status] || PILL.Scheduled;

  return (
    <Modal visible={!!trip} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="justify-end flex-1 bg-black/50" onPress={onClose}>
        <Pressable className="bg-white rounded-t-3xl max-h-[88%]" onPress={() => {}}>
          <View className="self-center w-12 h-1.5 mt-3 rounded-full bg-slate-300" />

          {/* header */}
          <View className="px-5 pt-4 pb-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-slate-500">{trip?.id}</Text>
              <View className={`px-2.5 py-1 rounded-full ${pill[0]}`}>
                <Text className={`text-xs font-bold ${pill[1]}`}>{trip?.status}</Text>
              </View>
            </View>
            <View className="flex-row items-center mt-2">
              <Text className="flex-1 text-xl font-extrabold text-slate-900" numberOfLines={1}>{from}</Text>
              <MaterialCommunityIcons name="arrow-right-thin" size={28} color="#AF1D5A" />
              <Text className="flex-1 text-xl font-extrabold text-right text-slate-900" numberOfLines={1}>{to}</Text>
            </View>
            <View className="flex-row flex-wrap mt-3">
              <Chip icon="map-marker-distance" text={`${trip?.distanceKm ?? 0} km`} />
              <Chip icon="source-fork" text={`${Math.max(stops.length - 2, 0)} drops`} />
              <Chip icon="calendar-clock" text={when} />
            </View>
          </View>

          {/* timeline */}
          <ScrollView style={{ flexGrow: 0 }} className="px-5" showsVerticalScrollIndicator={false}>
            <Text className="mt-1 mb-3 text-sm font-bold text-slate-900">Route & drops</Text>
            {stops.map((s, i) => {
              const last = i === stops.length - 1;
              const tag = i === 0 ? 'Pickup' : last ? 'Final drop' : `Drop ${i}`;
              return (
                <View key={`${s.name}-${i}`} className="flex-row">
                  <View className="items-center w-6">
                    <View
                      className={`items-center justify-center w-5 h-5 border-2 rounded-full ${
                        s.done ? 'bg-green-600 border-green-600' : 'bg-white border-primary'
                      }`}
                    >
                      {s.done && <MaterialCommunityIcons name="check" size={12} color="#fff" />}
                    </View>
                    {!last && <View className={`flex-1 w-0.5 ${s.done ? 'bg-green-500' : 'bg-slate-200'}`} />}
                  </View>

                  <View className="flex-1 pb-4 pl-2">
                    <View className="p-3 border rounded-2xl border-slate-200 bg-slate-50">
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-2">
                          <Text className="text-[10px] font-bold uppercase text-primary">{tag}</Text>
                          <Text className="font-bold text-slate-900">{s.name}</Text>
                          <Text className="text-xs text-slate-500">{s.area}</Text>
                        </View>
                        <Pressable
                          onPress={() => openMap(s)}
                          className="p-2 rounded-full bg-primary/10 active:bg-primary/20"
                        >
                          <MaterialCommunityIcons name="navigation-variant" size={18} color="#AF1D5A" />
                        </Pressable>
                      </View>
                      <View className="flex-row flex-wrap mt-2">
                        {i > 0 && (
                          <View className="flex-row items-center mr-3">
                            <MaterialCommunityIcons name="road-variant" size={14} color="#64748B" />
                            <Text className="ml-1 text-xs text-slate-600">+{s.km} km</Text>
                          </View>
                        )}
                        <View className="flex-row items-center">
                          <MaterialCommunityIcons name="clock-outline" size={14} color="#64748B" />
                          <Text className="ml-1 text-xs text-slate-600">{s.date} · {s.time}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View className="px-5 pt-2 pb-5">
            <Pressable onPress={onClose} className="items-center py-3.5 rounded-2xl bg-primary active:bg-primary-dark">
              <Text className="font-bold text-white">Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default TripDetailsModal;