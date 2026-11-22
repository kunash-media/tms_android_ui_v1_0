import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, View } from 'react-native';
import Pressable from '../../components/Pressable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PlaceSearchModal from '../../components/PlaceSearchModal';
import TripDetailsModal from '../../components/TripDetailsModal';
import NotificationsModal from '../../components/NotificationsModal';
import ConfirmModal from '../../components/ConfirmModal';
import DistanceModal from '../../components/DistanceModal';
import { useTrips } from '../../context/TripContext';
import { calcLegs } from '../../services/routeService';
import { NOTIFICATIONS } from '../../data/dummy';

// ---------- dummy data ----------
const DRIVER = { name: 'Rahul' };

const STATS = [
  { label: 'Today', value: 2, icon: 'calendar-today' },
  { label: 'This week', value: 8, icon: 'calendar-week' },
  { label: 'This month', value: 23, icon: 'calendar-month' },
];

const shadow = {
  elevation: 4,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
};

// ---------- pieces ----------
const StatCard = ({ label, value, icon }) => (
  <View className="flex-1 p-3 mx-1 bg-white border border-[#9e084757] rounded-2xl" style={shadow}>
    <View className="items-center justify-center w-8 h-8 mb-2 rounded-full bg-primary/10">
      <MaterialCommunityIcons name={icon} size={18} color="#AF1D5A" />
    </View>
    <Text className="text-xs text-slate-500">{label}</Text>
    <Text className="text-2xl font-extrabold text-slate-900">{value}</Text>
  </View>
);

const LocationField = ({ dotColor, placeholder, value, onPress }) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-3.5 active:bg-slate-100"
  >
    <MaterialCommunityIcons name="map-marker" size={20} color={dotColor} />
    <Text
      className={`flex-1 ml-2 ${value ? 'text-slate-900 font-medium' : 'text-slate-400'}`}
      numberOfLines={1}
    >
      {value || placeholder}
    </Text>
    <MaterialCommunityIcons name="magnify" size={20} color="#AF1D5A" />
  </Pressable>
);

// ---------- screen ----------
const Dashboard = () => {
  const navigation = useNavigation();
  const { active: LIVE_TRIP, upcoming: UPCOMING, startTrip, cancelTrip, resolveTrip } = useTrips();

  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [drops, setDrops] = useState([]);
  const [modal, setModal] = useState(null); // 'source' | 'destination' | 'drops'
  const [sheet, setSheet] = useState(null); // 'distance' | 'start' | 'cancel'
  const [plan, setPlan] = useState(null); // { points, legs }
  const [calculating, setCalculating] = useState(false);
  const [detailsTrip, setDetailsTrip] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const unread = notifs.filter((n) => !n.read).length;
  const canStart = !!source && (!!destination || drops.length > 0);

  const confirm = (list) => {
    if (modal === 'source') setSource(list[0]);
    if (modal === 'destination') setDestination(list[0]);
    if (modal === 'drops') setDrops(list);
    setModal(null);
  };

  const onStartPress = async () => {
    if (LIVE_TRIP) {
      Alert.alert('Trip already live', 'Complete or cancel your current trip before starting a new one.');
      return;
    }
    const points = [source, ...drops, ...(destination ? [destination] : [])];
    setCalculating(true);
    const legs = await calcLegs(points);
    setCalculating(false);
    setPlan({ points, legs });
    setSheet(legs.some((l) => l === null) ? 'distance' : 'start');
  };

  const onDistancesSubmitted = (filled) => {
    setPlan((p) => ({ ...p, legs: filled }));
    setSheet('start');
  };

  const onConfirmStart = () => {
    startTrip({ points: plan.points, legs: plan.legs });
    setSource(null);
    setDestination(null);
    setDrops([]);
    setPlan(null);
    setSheet(null);
  };

  const onConfirmCancel = () => {
    cancelTrip();
    setSheet(null);
  };

  // route summary shown in the "Start this trip?" overlay
  const routeSummary = (() => {
    if (!plan || !plan.legs.every(Boolean)) return '';
    const lines = plan.points.slice(1).map((p, i) => {
      const l = plan.legs[i];
      return `${plan.points[i].name} → ${p.name}: ${l.km} km${l.src === 'manual' ? ' (manual)' : ''}`;
    });
    const total = Math.round(plan.legs.reduce((a, l) => a + l.km, 0) * 10) / 10;
    return `${lines.join('\n')}\n\nTotal: ${total} km\nCheck every distance before you start.`;
  })();

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* header */}
        <LinearGradient colors={['#AF1D5A', '#7E1241']} style={{ paddingBottom: 56 }}>
          <SafeAreaView edges={['top']}>
            <View className="flex-row items-center justify-between px-5 pt-3">
              <View>
                <Text className="text-sm text-white/80">Good morning,</Text>
                <Text className="text-2xl font-extrabold text-white">{DRIVER.name} 👋</Text>
              </View>
              <Pressable
                onPress={() => setNotifOpen(true)}
                className="items-center justify-center rounded-full w-11 h-11 bg-white/20 active:bg-white/30"
              >
                <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
                {unread > 0 && (
                  <View className="absolute items-center justify-center bg-white rounded-full -top-1 -right-1 min-w-[18px] h-[18px] px-1">
                    <Text className="text-[10px] font-extrabold text-primary">{unread}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* stats overlap header */}
        <View className="flex-row px-3 -mt-10">
          {STATS.map((s) => <StatCard key={s.label} {...s} />)}
        </View>

        {/* start a trip */}
        <View className="p-4 mx-4 mt-5 bg-white border border-[#9e084757] rounded-3xl" style={shadow}>
          <View className="flex-row items-center mb-3">
            <MaterialCommunityIcons name="steering" size={20} color="#AF1D5A" />
            <Text className="ml-2 text-base font-bold text-slate-900">Start a trip</Text>
          </View>

          <LocationField
            dotColor="#16A34A"
            placeholder="Start from (source)"
            value={source?.name}
            onPress={() => setModal('source')}
          />

          {drops.length > 0 ? (
            <View className="py-3 pl-6 my-1 border-l-2 border-dashed ml-[22px] border-primary/50">
              {drops.map((d, i) => (
                <View key={d.id} className="flex-row items-center py-1.5">
                  <View className="w-2 h-2 mr-2 rounded-full bg-primary" />
                  <Text className="flex-1 text-xs font-medium text-slate-700" numberOfLines={1}>
                    Drop {i + 1} · {d.name}{d.manual ? ` · ${d.km} km` : ''}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="h-10 my-1 border-l-2 border-dashed ml-[22px] border-primary/50" />
          )}

          <LocationField
            dotColor="#AF1D5A"
            placeholder="End drop (destination)"
            value={destination ? `${destination.name}${destination.manual ? ` · ${destination.km} km` : ''}` : ''}
            onPress={() => setModal('destination')}
          />

          <Pressable
            onPress={() => setModal('drops')}
            className="flex-row items-center self-start px-3 py-2 mt-3 rounded-full bg-primary/10 active:bg-primary/20"
          >
            <MaterialCommunityIcons name="map-marker-plus" size={18} color="#AF1D5A" />
            <Text className="ml-1.5 text-sm font-semibold text-primary">
              {drops.length ? `Edit drops (${drops.length})` : 'Select multiple drops'}
            </Text>
          </Pressable>

          <Pressable
            disabled={!canStart || calculating}
            onPress={onStartPress}
            className={`mt-4 flex-row items-center justify-center rounded-2xl py-4 ${
              canStart ? 'bg-primary active:bg-primary-dark' : 'bg-slate-200'
            }`}
          >
            <MaterialCommunityIcons name="play-circle" size={22} color={canStart ? '#fff' : '#94A3B8'} />
            <Text className={`ml-2 font-bold text-base ${canStart ? 'text-white' : 'text-slate-400'}`}>
              Start trip
            </Text>
          </Pressable>
        </View>

        {/* live trip */}
        <View className="flex-row items-center justify-between px-5 mt-6 mb-2">
          <Text className="text-lg font-bold text-slate-900">Live trip</Text>
          {LIVE_TRIP && (
            <View className="flex-row items-center bg-green-100 rounded-full px-2.5 py-1">
              <View className="w-2 h-2 rounded-full bg-green-600 mr-1.5" />
              <Text className="text-xs font-semibold text-green-700">In transit</Text>
            </View>
          )}
        </View>

        {LIVE_TRIP ? (
          <View className="p-4 mx-4 bg-white border border-[#9e084757] rounded-3xl" style={shadow}>
            <View className="flex-row items-center">
              <Text className="flex-1 font-bold text-slate-900" numberOfLines={1}>{LIVE_TRIP.source}</Text>
              <MaterialCommunityIcons name="arrow-right-thin" size={26} color="#AF1D5A" />
              <Text className="flex-1 font-bold text-right text-slate-900" numberOfLines={1}>{LIVE_TRIP.destination}</Text>
            </View>

            <View className="h-2 mt-4 overflow-hidden rounded-full bg-slate-100">
              <View className="h-2 rounded-full bg-primary" style={{ width: `${LIVE_TRIP.progress * 100}%` }} />
            </View>
            <Text className="mt-2 text-xs text-slate-500">
              {LIVE_TRIP.stops.filter((s) => s.done).length}/{LIVE_TRIP.stops.length} points confirmed · {LIVE_TRIP.distanceKm} km
            </Text>

            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-xs text-slate-500">{LIVE_TRIP.startedAt}</Text>
              <Pressable onPress={() => setSheet('cancel')} className="flex-row items-center active:opacity-60">
                <MaterialCommunityIcons name="close-circle-outline" size={16} color="#DC2626" />
                <Text className="ml-1 text-sm font-semibold text-red-600">Cancel trip</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => setDetailsTrip(LIVE_TRIP)}
              className="flex-row items-center justify-center py-3.5 mt-3 rounded-2xl bg-primary active:bg-primary-dark"
            >
              <MaterialCommunityIcons name="map-marker-path" size={20} color="#fff" />
              <Text className="ml-2 text-base font-bold text-white">View trip details</Text>
            </Pressable>
          </View>
        ) : (
          <View className="items-center p-6 mx-4 bg-white border border-dashed border-slate-300 rounded-3xl">
            <MaterialCommunityIcons name="truck-outline" size={32} color="#CBD5E1" />
            <Text className="mt-2 font-semibold text-slate-500">No live trip</Text>
            <Text className="text-xs text-slate-400">Select locations above and start a trip</Text>
          </View>
        )}

        {/* upcoming */}
        <View className="flex-row items-center justify-between px-5 mt-6 mb-2">
          <Text className="text-lg font-bold text-slate-900">Upcoming trips</Text>
          <Pressable onPress={() => navigation.navigate('Trips')}>
            <Text className="text-sm font-semibold text-primary">View all</Text>
          </Pressable>
        </View>
        {UPCOMING.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setDetailsTrip(t)}
            className="flex-row items-center p-3 mx-4 mb-3 bg-white border border-slate-200 rounded-2xl active:bg-slate-50"
            style={shadow}
          >
            <View className="items-center justify-center mr-3 w-11 h-11 rounded-xl bg-primary/10">
              <MaterialCommunityIcons name="truck-fast" size={22} color="#AF1D5A" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-slate-900">{t.from} › {t.to}</Text>
              <Text className="text-xs text-slate-500 mt-0.5">{t.date}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
          </Pressable>
        ))}
      </ScrollView>

      {/* overlays */}
      <TripDetailsModal trip={resolveTrip(detailsTrip)} onClose={() => setDetailsTrip(null)} />

      <Modal visible={calculating} transparent animationType="fade" onRequestClose={() => {}}>
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="items-center px-8 py-6 bg-white rounded-3xl">
            <ActivityIndicator size="large" color="#AF1D5A" />
            <Text className="mt-3 font-semibold text-slate-800">Calculating route distance…</Text>
          </View>
        </View>
      </Modal>

      <DistanceModal
        visible={sheet === 'distance'}
        points={plan?.points || []}
        legs={plan?.legs || []}
        onSubmit={onDistancesSubmitted}
        onCancel={() => setSheet(null)}
      />

      <ConfirmModal
        visible={sheet === 'start'}
        icon="play-circle"
        title="Start this trip?"
        message={routeSummary}
        confirmText="Yes, start"
        cancelText="No"
        onConfirm={onConfirmStart}
        onCancel={() => setSheet(null)}
      />
      <ConfirmModal
        visible={sheet === 'cancel'}
        danger
        icon="alert-circle"
        title="Cancel this trip?"
        message="The trip will be marked as cancelled and moved to History. This can't be undone."
        confirmText="Yes, cancel trip"
        cancelText="Keep trip"
        onConfirm={onConfirmCancel}
        onCancel={() => setSheet(null)}
      />

      <NotificationsModal
        visible={notifOpen}
        items={notifs}
        onChange={setNotifs}
        onClose={() => setNotifOpen(false)}
      />

      <PlaceSearchModal
        visible={modal !== null}
        multi={modal === 'drops'}
        needKm={modal !== 'source'}
        initial={modal === 'drops' ? drops : []}
        title={
          modal === 'source' ? 'Select source'
          : modal === 'destination' ? 'Select destination'
          : 'Select drop points'
        }
        onClose={() => setModal(null)}
        onConfirm={confirm}
      />
    </View>
  );
};

export default Dashboard;