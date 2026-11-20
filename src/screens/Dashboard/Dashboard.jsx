import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PlaceSearchModal from '../../components/PlaceSearchModal';
import TripDetailsModal from '../../components/TripDetailsModal';
import NotificationsModal from '../../components/NotificationsModal';
import { LIVE_TRIP, UPCOMING_TRIPS as UPCOMING, NOTIFICATIONS } from '../../data/dummy';

// ---------- dummy data ----------
const DRIVER = { name: 'Rahul' };

const STATS = [
  { label: 'Today', value: 2, icon: 'calendar-today' },
  { label: 'This week', value: 8, icon: 'calendar-week' },
  { label: 'This month', value: 23, icon: 'calendar-month' },
];



const shadow = { elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } };

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
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [drops, setDrops] = useState([]);
 const [modal, setModal] = useState(null); // 'source' | 'destination' | 'drops'
  const navigation = useNavigation();
  const [detailsTrip, setDetailsTrip] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter((n) => !n.read).length;

  const confirm = (list) => {
    if (modal === 'source') setSource(list[0]);
    if (modal === 'destination') setDestination(list[0]);
    if (modal === 'drops') setDrops(list);
    setModal(null);
  };

  const canStart = !!source && (!!destination || drops.length > 0);

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
              <Pressable onPress={() => setNotifOpen(true)} className="items-center justify-center rounded-full w-11 h-11 bg-white/20 active:bg-white/30">                
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

        {/* active trip */}
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

          {drops.length > 0 && (
            <View className="pl-4 my-2 ml-5 border-l-2 border-dashed border-primary/40">
              {drops.map((d, i) => (
                <Text key={d.id} className="py-1 text-xs text-slate-600" numberOfLines={1}>
                  Drop {i + 1} · {d.name}
                </Text>
              ))}
            </View>
          )}
          {drops.length === 0 && <View className="h-2" />}

          <LocationField
            dotColor="#AF1D5A"
            placeholder="End drop (destination)"
            value={destination?.name}
            onPress={() => setModal('destination')}
          />

          <Pressable
            onPress={() => setModal('drops')}
            className="flex-row items-center self-start px-3 py-2 mt-3 rounded-full bg-primary/10 active:bg-primary/20"
          >
            <MaterialCommunityIcons name="map-marker-plus" size={18} color="#AF1D5A" />
            <Text className="ml-1.5 text-primary text-sm font-semibold">
              {drops.length ? `Edit drops (${drops.length})` : 'Select multiple drops'}
            </Text>
          </Pressable>

          <Pressable
            disabled={!canStart}
            onPress={() => {}}
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
          <View className="flex-row items-center bg-green-100 rounded-full px-2.5 py-1">
            <View className="w-2 h-2 rounded-full bg-green-600 mr-1.5" />
            <Text className="text-xs font-semibold text-green-700">In transit</Text>
          </View>
        </View>
        <View className="p-4 mx-4 bg-white border border-[#9e084757] rounded-3xl" style={shadow}>
          <View className="flex-row items-center">
            <Text className="flex-1 font-bold text-slate-900" numberOfLines={1}>{LIVE_TRIP.source}</Text>
            <MaterialCommunityIcons name="arrow-right-thin" size={26} color="#AF1D5A" />
            <Text className="flex-1 font-bold text-right text-slate-900" numberOfLines={1}>{LIVE_TRIP.destination}</Text>
          </View>

          <View className="h-2 mt-4 overflow-hidden rounded-full bg-slate-100">
            <View className="h-2 rounded-full bg-primary" style={{ width: `${LIVE_TRIP.progress * 100}%` }} />
          </View>
          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-xs text-slate-500">{LIVE_TRIP.startedAt}</Text>
            <Pressable onPress={() => setDetailsTrip(LIVE_TRIP)} className="flex-row items-center">
              <Text className="text-sm font-semibold text-primary">View trip details</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color="#AF1D5A" />
            </Pressable>
          </View>
        </View>

        {/* upcoming */}
        <View className="flex-row items-center justify-between px-5 mt-6 mb-2">
          <Text className="text-lg font-bold text-slate-900">Upcoming trips</Text>
          <Pressable onPress={() => navigation.navigate('Trips')}>
            <Text className="text-sm font-semibold text-primary">View all</Text>
          </Pressable>
        </View>
        {UPCOMING.map((t) => (
          <Pressable key={t.id} onPress={() => setDetailsTrip(t)} className="flex-row items-center p-3 mx-4 mb-3 bg-white border border-slate-200 rounded-2xl active:bg-slate-50" style={shadow}>
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

      <TripDetailsModal trip={detailsTrip} onClose={() => setDetailsTrip(null)} />
      <NotificationsModal
        visible={notifOpen}
        items={notifs}
        onChange={setNotifs}
        onClose={() => setNotifOpen(false)}
      />
      <PlaceSearchModal
        visible={modal !== null}
        multi={modal === 'drops'}
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