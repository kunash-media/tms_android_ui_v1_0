import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import TripDetailsModal from '../../components/TripDetailsModal';
import { useTrips } from '../../context/TripContext';

const FILTERS = ['All', 'Completed', 'Cancelled'];
const PILL = {
  Completed: ['bg-green-100', 'text-green-700'],
  Cancelled: ['bg-red-100', 'text-red-700'],
};

const Meta = ({ icon, text }) => (
  <View className="flex-row items-center mr-4">
    <MaterialCommunityIcons name={icon} size={15} color="#64748B" />
    <Text className="ml-1 text-xs text-slate-600">{text}</Text>
  </View>
);

const History = () => {

  const [filter, setFilter] = useState('All');
  const { history: HISTORY_TRIPS } = useTrips();
  const [selected, setSelected] = useState(null);

  const list = HISTORY_TRIPS.filter((t) => filter === 'All' || t.status === filter);
  const done = HISTORY_TRIPS.filter((t) => t.status === 'Completed');
  const totalKm = done.reduce((a, t) => a + t.distanceKm, 0);

  return (
    <View className="flex-1 bg-slate-50">
      <ScreenHeader title="History" subtitle="Your past trips">
        <View className="flex-row mt-4">
          <View className="border border-[#F2DACE] flex-1 p-3 mr-2 rounded-2xl bg-white/15">
            <Text className="text-2xl font-extrabold text-white">{done.length}</Text>
            <Text className="text-xs text-white">Completed trips</Text>
          </View>
          <View className="border border-[#F2DACE] flex-1 p-3 ml-2 rounded-2xl bg-white/15">
            <Text className="text-2xl font-extrabold text-white">{totalKm}</Text>
            <Text className="text-xs text-white">Total km</Text>
          </View>
        </View>
      </ScreenHeader>

      {/* filters */}
      <View className="flex-row px-4 pt-4">
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-2 mr-2 border rounded-full ${
              filter === f ? 'bg-primary border-primary' : 'bg-white border border-[#9e084757]'
            }`}
          >
            <Text className={`text-sm font-semibold ${filter === f ? 'text-white' : 'text-slate-600'}`}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {list.length === 0 && <Text className="mt-10 text-center text-slate-400">No trips found</Text>}
        {list.map((t) => {
          const pill = PILL[t.status];
          return (
            <Pressable
              key={t.id}
              onPress={() => setSelected(t)}
              className="p-4 mb-3 bg-white  rounded-2xl border border-[#9e084757] active:bg-slate-50"
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-semibold text-slate-500">{t.id}</Text>
                <View className={`px-2.5 py-1 rounded-full ${pill[0]}`}>
                  <Text className={`text-xs font-bold ${pill[1]}`}>{t.status}</Text>
                </View>
              </View>
              <View className="flex-row items-center mt-2">
                <Text className="flex-1 text-xl font-bold text-slate-900" numberOfLines={1}>{t.from}</Text>
                <MaterialCommunityIcons name="arrow-right-thin" size={24} color="#AF1D5A" />
                <Text className="flex-1 text-xl font-bold text-right text-slate-900" numberOfLines={1}>{t.to}</Text>
              </View>
              <View className="flex-row flex-wrap pt-3 mt-3 border-t border-slate-400">
                <Meta icon="calendar-clock" text={t.date} />
                <Meta icon="road-variant" text={`${t.distanceKm} km`} />
                <Meta icon="timer-outline" text={t.duration} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <TripDetailsModal trip={selected} onClose={() => setSelected(null)} />
    </View>
  );
};

export default History;