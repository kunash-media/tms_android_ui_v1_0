import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Pressable from '../../components/Pressable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import TripDetailsModal from '../../components/TripDetailsModal';
import { useTrips } from '../../context/TripContext';
import { STATUS_UI } from '../../utils/tripStatus';

const RouteList = ({ stops }) => (
  <View>
    {stops.map((s, i) => {
      const last = i === stops.length - 1;
      return (
        <View key={`${s.name}-${i}`} className="flex-row">
          <View className="items-center w-5 mr-2">
            <View
              className={`w-3 h-3 mt-1 rounded-full ${
                i === 0 ? 'bg-green-600' : last ? 'bg-primary' : 'bg-white border-2 border-primary'
              }`}
            />
            {!last && <View className="flex-1 w-0.5 bg-slate-300" />}
          </View>
          <View className={`flex-1 flex-row justify-between ${last ? '' : 'pb-3'}`}>
            <Text className="flex-1 text-sm font-semibold text-slate-800" numberOfLines={1}>{s.name}</Text>
            <Text className="ml-2 text-xs text-slate-500">{i === 0 ? s.time : `+${s.km} km`}</Text>
          </View>
        </View>
      );
    })}
  </View>
);

const Trips = () => {
  const [selected, setSelected] = useState(null);
  const { active: LIVE_TRIP, upcoming: UPCOMING_TRIPS, resolveTrip } = useTrips();

  return (
    <View className="flex-1 bg-slate-50">
      <ScreenHeader title="My Trips" subtitle={`${LIVE_TRIP ? 1 : 0} live · ${UPCOMING_TRIPS.length} upcoming`} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* live */}
        <Text className="mb-2 text-lg font-bold text-slate-900">Live trip</Text>
        {LIVE_TRIP ? (
          <Pressable
            onPress={() => setSelected(LIVE_TRIP)}
            className="p-4 mb-6 bg-white border rounded-3xl border-primary/40 active:bg-slate-50"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-slate-500">{LIVE_TRIP.id}</Text>
            <View className={`flex-row items-center px-2.5 py-1 border rounded-full ${STATUS_UI[LIVE_TRIP.status].box}`}>
              <View className={`w-2 h-2 mr-1.5 rounded-full ${STATUS_UI[LIVE_TRIP.status].dot}`} />
              <Text className={`text-xs font-semibold ${STATUS_UI[LIVE_TRIP.status].text}`}>{LIVE_TRIP.status}</Text>
            </View>
            </View>
            <View className="flex-row items-center mt-2">
              <Text className="flex-1 font-bold text-slate-900" numberOfLines={1}>{LIVE_TRIP.source}</Text>
              <MaterialCommunityIcons name="arrow-right-thin" size={26} color="#AF1D5A" />
              <Text className="flex-1 font-bold text-right text-slate-900" numberOfLines={1}>{LIVE_TRIP.destination}</Text>
            </View>
            <View className="h-2 mt-3 overflow-hidden rounded-full bg-slate-100">
              <View className="h-2 rounded-full bg-primary" style={{ width: `${LIVE_TRIP.progress * 100}%` }} />
            </View>
            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-xs text-slate-500">
                {LIVE_TRIP.distanceKm} km · {LIVE_TRIP.stops.filter((s) => s.done).length}/{LIVE_TRIP.stops.length} points confirmed
              </Text>
              <Text className="text-sm font-semibold text-primary">View route ›</Text>
            </View>
          </Pressable>
        ) : (
          <View className="items-center p-6 mb-6 bg-white border border-dashed border-slate-300 rounded-3xl">
            <Text className="font-semibold text-slate-500">No live trip</Text>
          </View>
        )}

        {/* upcoming */}
        <Text className="mb-2 text-lg font-bold text-slate-900">Upcoming trips</Text>
        {UPCOMING_TRIPS.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setSelected(t)}
            className="p-4 mb-4 bg-white border rounded-3xl border-gray-400 active:bg-slate-50"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="items-center justify-center mr-2 w-9 h-9 rounded-xl bg-primary/10">
                  <MaterialCommunityIcons name="truck-fast" size={20} color="#AF1D5A" />
                </View>
                <View>
                  <Text className="font-bold text-slate-900">{t.from} › {t.to}</Text>
                  <Text className="text-xs text-slate-500">{t.id}</Text>
                </View>
              </View>
              <View className="px-2.5 py-1 rounded-full bg-amber-100">
                <Text className="text-xs font-bold text-amber-700">{t.status}</Text>
              </View>
            </View>

            <View className="p-3 border rounded-2xl border-slate-400 bg-slate-50">
              <RouteList stops={t.stops} />
            </View>

            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="calendar-clock" size={16} color="#64748B" />
                <Text className="ml-1 text-xs text-slate-600">{t.date}</Text>
                <MaterialCommunityIcons name="map-marker-distance" size={16} color="#64748B" style={{ marginLeft: 12 }} />
                <Text className="ml-1 text-xs text-slate-600">{t.distanceKm} km</Text>
              </View>
              <Text className="text-sm font-semibold text-primary">Details ›</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <TripDetailsModal trip={resolveTrip(selected)} onClose={() => setSelected(null)} />
    </View>
  );
};

export default Trips;