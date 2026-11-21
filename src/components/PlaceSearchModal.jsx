import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, Modal, Pressable, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const KEY = process.env.EXPO_PUBLIC_LOCATIONIQ_KEY;

async function autocomplete(input) {
  const url =
    `https://api.locationiq.com/v1/autocomplete?key=${KEY}` +
    `&q=${encodeURIComponent(input)}&limit=8&countrycodes=in&dedupe=1&normalizecity=1`;
  const res = await fetch(url);
  const json = await res.json();
  // no matches / rate limit come back as an object, not an array
  if (!Array.isArray(json)) return [];

  return json.map((p) => ({
    id: String(p.place_id),
    name: p.display_place || p.address?.name || p.display_name.split(',')[0],
    address: p.display_address || p.display_name,
    lat: parseFloat(p.lat),
    lng: parseFloat(p.lon),
  }));
}

// coordinates already come with the result, so no second call is needed
const placeDetails = async (p) => p;
/**
 * multi=false: tap a result -> onConfirm([place]) immediately
 * multi=true : tap to add chips -> "Submit drop points" -> onConfirm(list)
 */
const PlaceSearchModal = ({ visible, title, multi = false, initial = [], onClose, onConfirm }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    if (visible) {
      setQuery('');
      setResults([]);
      setPicked(initial);
    }
  }, [visible]);

  useEffect(() => {
    clearTimeout(timer.current);
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        setResults(await autocomplete(query.trim()));
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer.current);
  }, [query]);

  const onPick = async (p) => {
    setLoading(true);
    let full = p;
    try {
      full = await placeDetails(p);
    } catch {}
    setLoading(false);
    if (multi) {
      setPicked((l) => (l.some((x) => x.id === full.id) ? l : [...l, full]));
      setQuery('');
      setResults([]);
    } else {
      onConfirm([full]);
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
                  {i + 1}. {p.name}
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
          ListEmptyComponent={
            query.trim().length >= 3 && !loading ? (
              <Text className="mt-10 text-center text-slate-400">No places found</Text>
            ) : null
          }
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
      </SafeAreaView>
    </Modal>
  );
};

export default PlaceSearchModal;