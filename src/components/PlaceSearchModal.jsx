import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const KEY = process.env.EXPO_PUBLIC_LOCATIONIQ_KEY;

// returns [] when there are simply no matches, throws when the service itself failed
async function autocomplete(input) {
  const url =
    `https://api.locationiq.com/v1/autocomplete?key=${KEY}` +
    `&q=${encodeURIComponent(input)}&limit=8&countrycodes=in&dedupe=1&normalizecity=1` +
    `&viewbox=72.6,22.1,80.9,15.6`;
  const res = await fetch(url);
  if (res.status === 404) return []; // LocationIQ answers 404 for "no matches"
  if (!res.ok) throw new Error(`search ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json)) throw new Error('bad response');
  return json.map((p) => ({
    id: String(p.place_id),
    name: p.display_place || p.address?.name || p.display_name.split(',')[0],
    address: p.display_address || p.display_name,
    lat: parseFloat(p.lat),
    lng: parseFloat(p.lon),
  }));
}

/**
 * multi=false: tap a result -> onConfirm([place]) immediately
 * multi=true : tap to add chips -> "Submit drop points" -> onConfirm(list)
 * needKm     : manual places must include distance (km) from the previous point
 */
const PlaceSearchModal = ({
  visible, title, multi = false, needKm = false, initial = [], onClose, onConfirm,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [searched, setSearched] = useState(false);
  const [picked, setPicked] = useState([]);
  const [manualOpen, setManualOpen] = useState(false);
  const [mName, setMName] = useState('');
  const [mKm, setMKm] = useState('');
  const [mErr, setMErr] = useState('');
  const timer = useRef(null);
  const reqId = useRef(0);

  useEffect(() => {
    if (visible) {
      setQuery('');
      setResults([]);
      setFailed(false);
      setSearched(false);
      setManualOpen(false);
      setPicked(initial);
    }
  }, [visible]);

  useEffect(() => {
    clearTimeout(timer.current);
    setFailed(false);
    setSearched(false);
    if (query.trim().length < 3) {
      reqId.current++; // drop any in-flight response
      setResults([]);
      setLoading(false);
      return;
    }
    timer.current = setTimeout(async () => {
      const id = ++reqId.current;
      setLoading(true);
      try {
        const list = await autocomplete(query.trim());
        if (id !== reqId.current) return;
        setResults(list);
      } catch {
        if (id !== reqId.current) return;
        setResults([]);
        setFailed(true);
      }
      setSearched(true);
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer.current);
  }, [query]);

  const canManual =
    !loading && query.trim().length >= 3 && (failed || (searched && results.length === 0));

  const onPick = (p) => {
    if (multi) {
      setPicked((l) => (l.some((x) => x.id === p.id) ? l : [...l, p]));
      setQuery('');
      setResults([]);
    } else {
      onConfirm([p]);
    }
  };

  const openManual = () => {
    setMName(query.trim());
    setMKm('');
    setMErr('');
    setManualOpen(true);
  };

  const submitManual = () => {
    const name = mName.trim();
    if (!name) return setMErr('Enter the location name');
    let km;
    if (needKm) {
      km = parseFloat(mKm.replace(',', '.'));
      if (!(km > 0) || km > 5000) return setMErr('Enter a valid distance in km');
      km = Math.round(km * 10) / 10;
    }
    const place = {
      id: `manual-${Date.now()}`,
      name,
      address: 'Added manually',
      lat: null,
      lng: null,
      manual: true,
      ...(needKm ? { km } : {}),
    };
    setManualOpen(false);
    if (multi) {
      setPicked((l) => [...l, place]);
      setQuery('');
    } else {
      onConfirm([place]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white">
        {/* header */}
        <View className="flex-row items-center px-3 py-3">
          <Pressable onPress={onClose} className="p-2 rounded-full active:bg-slate-100">
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
          </Pressable>
          <Text className="ml-2 text-lg font-bold text-slate-900">{title}</Text>
        </View>

        {/* search box */}
        <View className="flex-row items-center px-4 mx-4 bg-slate-100 rounded-2xl">
          <MaterialCommunityIcons name="magnify" size={22} color="#AF1D5A" />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search location"
            placeholderTextColor="#94A3B8"
            className="flex-1 px-2 py-3 text-slate-900"
          />
          {loading ? (
            <ActivityIndicator size="small" color="#AF1D5A" />
          ) : query ? (
            <Pressable onPress={() => setQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#94A3B8" />
            </Pressable>
          ) : null}
        </View>

        {/* manual fallback: search failed or nothing found */}
        {canManual && (
          <View className="p-4 mx-4 mt-3 border border-amber-300 bg-amber-50 rounded-2xl">
            <Text className="text-sm font-semibold text-amber-900">
              {failed ? 'Location search is not responding.' : 'No places found.'}
            </Text>
            <Text className="mt-0.5 text-xs text-amber-800">
              {needKm
                ? 'Add the location manually with its distance in km.'
                : 'Add the location manually.'}
            </Text>
            <Pressable
              onPress={openManual}
              className="flex-row items-center self-start px-4 py-2.5 mt-3 rounded-xl bg-primary active:bg-primary-dark"
            >
              <MaterialCommunityIcons name="plus-circle" size={18} color="#fff" />
              <Text className="ml-1.5 text-sm font-bold text-white">Add manually</Text>
            </Pressable>
          </View>
        )}

        {/* picked chips (multi) */}
        {multi && picked.length > 0 && (
          <View className="flex-row flex-wrap px-4 pt-3">
            {picked.map((p, i) => (
              <Pressable
                key={p.id}
                onPress={() => setPicked((l) => l.filter((x) => x.id !== p.id))}
                className="flex-row items-center bg-primary/10 rounded-full pl-3 pr-2 py-1.5 mr-2 mb-2"
              >
                <Text className="text-xs font-semibold text-primary">
                  {i + 1}. {p.name}{p.manual ? ` · ${p.km} km` : ''}
                </Text>
                <MaterialCommunityIcons name="close" size={14} color="#AF1D5A" style={{ marginLeft: 4 }} />
              </Pressable>
            ))}
          </View>
        )}

        {/* results */}
        <FlatList
          className="mt-2"
          data={results}
          keyExtractor={(i) => i.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onPick(item)}
              className="flex-row items-center px-4 py-3 active:bg-slate-50"
            >
              <View className="items-center justify-center w-10 h-10 mr-3 rounded-full bg-primary/10">
                <MaterialCommunityIcons name="map-marker" size={20} color="#AF1D5A" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-slate-900" numberOfLines={1}>{item.name}</Text>
                <Text className="text-xs text-slate-500" numberOfLines={1}>{item.address}</Text>
              </View>
            </Pressable>
          )}
        />

        {multi && (
          <View className="px-4 pt-2 pb-4">
            <Pressable
              disabled={picked.length === 0}
              onPress={() => onConfirm(picked)}
              className={`rounded-2xl py-4 items-center ${picked.length ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <Text className={`font-bold ${picked.length ? 'text-white' : 'text-slate-400'}`}>
                Submit drop points ({picked.length})
              </Text>
            </Pressable>
          </View>
        )}

        {/* manual add overlay */}
       <Modal
         visible={manualOpen}
         transparent
         animationType="fade"
         onRequestClose={() => setManualOpen(false)}
       >
         <KeyboardAvoidingView
           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
           style={{
             flex: 1,
             justifyContent: 'center',
             alignItems: 'center',
             paddingHorizontal: 20,
             backgroundColor: 'rgba(0,0,0,0.6)',
           }}
         >
           <View className="w-full p-5 bg-white rounded-3xl">
              <Text className="text-lg font-extrabold text-slate-900">Add location manually</Text>

              <Text className="mt-4 mb-1.5 text-xs font-semibold text-slate-500">Location name</Text>
              <TextInput
                value={mName}
                onChangeText={(v) => { setMName(v); setMErr(''); }}
                placeholder="e.g. Wakad Chowk, Pune"
                placeholderTextColor="#94A3B8"
                className="px-3 py-3 border rounded-xl border-slate-300 text-slate-900"
              />

              {needKm && (
                <>
                  <Text className="mt-3 mb-1.5 text-xs font-semibold text-slate-500">
                    Distance from previous point (km)
                  </Text>
                  <TextInput
                    value={mKm}
                    onChangeText={(v) => { setMKm(v); setMErr(''); }}
                    placeholder="e.g. 8.7"
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                    className="px-3 py-3 border rounded-xl border-slate-300 text-slate-900"
                  />
                </>
              )}

              {mErr ? <Text className="mt-2 text-xs text-red-500">{mErr}</Text> : null}

              <View className="flex-row mt-5">
                <Pressable
                  onPress={() => setManualOpen(false)}
                  className="items-center flex-1 py-3.5 mr-2 border rounded-2xl border-slate-300"
                >
                  <Text className="font-bold text-slate-600">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={submitManual}
                  className="items-center flex-1 py-3.5 ml-2 rounded-2xl bg-primary active:bg-primary-dark"
                >
                  <Text className="font-bold text-white">Submit</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

export default PlaceSearchModal;