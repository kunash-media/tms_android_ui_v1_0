import { useState } from 'react';
import {
  ActivityIndicator, Alert, Image, Linking, Modal, ScrollView,
  StyleSheet, Text, View,
} from 'react-native';
import Pressable from './Pressable';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTrips } from '../context/TripContext';
import { uploadProof } from '../services/proofService';

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

const placeRef = (s) => (s.lat != null ? `${s.lat},${s.lng}` : `${s.name} ${s.area}`);

// origin = the trip's selected source; origin null -> Google Maps uses current location
const openDirections = (origin, dest) => {
  let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(placeRef(dest))}&travelmode=driving`;
  if (origin) url += `&origin=${encodeURIComponent(placeRef(origin))}`;
  Linking.openURL(url);
};

const TripDetailsModal = ({ trip, onClose }) => {
  const { active, markStopDone } = useTrips();
  const [pending, setPending] = useState(null); // { index, uri }
  const [uploading, setUploading] = useState(false);

  const stops = trip?.stops || [];
  const live = !!trip && active?.id === trip.id;
  const nextIndex = stops.findIndex((s) => !s.done);
  const doneCount = stops.filter((s) => s.done).length;
  const from = trip?.source ?? trip?.from;
  const to = trip?.destination ?? trip?.to;
  const when = trip?.startedAt ?? trip?.date;
  const pill = PILL[trip?.status] || PILL.Scheduled;

  const capture = async (index) => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera permission needed', 'Allow camera access in phone settings to upload receipt proof.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!res.canceled) setPending({ index, uri: res.assets[0].uri });
  };

  const submit = async () => {
    if (!pending) return;
    const willComplete = doneCount === stops.length - 1;
    setUploading(true);
    try {
      await uploadProof(trip.id, pending.index, pending.uri);
      markStopDone(trip.id, pending.index, pending.uri);
      setPending(null);
      if (willComplete) {
        Alert.alert('Trip completed', 'All receipts uploaded. The trip is now in your History.');
      }
    } catch {
      Alert.alert('Upload failed', 'Check your connection and try again.');
    }
    setUploading(false);
  };

  const close = () => {
    if (uploading) return;
    setPending(null);
    onClose();
  };

  return (
    <Modal visible={!!trip} transparent animationType="slide" onRequestClose={close}>
       <Pressable plain className="justify-end flex-1 bg-black/50" onPress={close}>
         <Pressable plain className="bg-white rounded-t-3xl max-h-[88%]" onPress={() => {}}>
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
            {live && (
              <Text className="mb-1 text-xs font-semibold text-primary">
                {doneCount}/{stops.length} points confirmed · upload a receipt photo at each point
              </Text>
            )}
          </View>

          {/* timeline */}
          <ScrollView style={{ flexGrow: 0 }} className="px-5" showsVerticalScrollIndicator={false}>
            <Text className="mt-1 mb-3 text-sm font-bold text-slate-900">Route & drops</Text>
            {stops.map((s, i) => {
              const last = i === stops.length - 1;
              const tag = i === 0 ? 'Pickup' : last ? 'Final drop' : `Drop ${i}`;
              const isNext = live && i === nextIndex;
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
                    <View
                      className={`p-3 border rounded-2xl ${
                        isNext ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-2">
                          <Text className="text-[10px] font-bold uppercase text-primary">{tag}</Text>
                          <Text className="font-bold text-slate-900">{s.name}</Text>
                          <Text className="text-xs text-slate-500">{s.area}</Text>
                        </View>
                        <View className="flex-row">
                          {live && !s.done && (
                            <Pressable
                              disabled={!isNext}
                              onPress={() => capture(i)}
                              className={`p-2 mr-2 rounded-full ${
                                isNext ? 'bg-primary active:bg-primary-dark' : 'bg-slate-200'
                              }`}
                            >
                              <MaterialCommunityIcons name="camera" size={18} color={isNext ? '#fff' : '#94A3B8'} />
                            </Pressable>
                          )}
                          <Pressable
                            onPress={() => openDirections(i === 0 ? null : stops[0], s)}
                            className="p-2 rounded-full bg-primary/10 active:bg-primary/20"
                          >
                            <MaterialCommunityIcons name="navigation-variant" size={18} color="#AF1D5A" />
                          </Pressable>
                        </View>
                      </View>

                      <View className="flex-row flex-wrap mt-2">
                        {i > 0 && (
                          <View className="flex-row items-center mr-3">
                            <MaterialCommunityIcons name="road-variant" size={14} color="#64748B" />
                            <Text className="ml-1 text-xs text-slate-600">
                              +{s.km} km{s.kmSource === 'manual' ? ' (manual)' : ''}
                            </Text>
                          </View>
                        )}
                        <View className="flex-row items-center">
                          <MaterialCommunityIcons name="clock-outline" size={14} color="#64748B" />
                          <Text className="ml-1 text-xs text-slate-600">
                            {s.time ? `${s.date} · ${s.time}` : 'Not reached yet'}
                          </Text>
                        </View>
                      </View>

                      {s.proofUri && (
                        <View className="flex-row items-center mt-2">
                          <MaterialCommunityIcons name="check-decagram" size={14} color="#16A34A" />
                          <Text className="ml-1 text-xs font-semibold text-green-700">Receipt uploaded</Text>
                        </View>
                      )}
                      {isNext && (
                        <Text className="mt-2 text-xs font-semibold text-primary">
                          Tap the camera to upload the acknowledgement receipt
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View className="px-5 pt-2 pb-5">
            <Pressable onPress={close} className="items-center py-3.5 rounded-2xl bg-primary active:bg-primary-dark">
              <Text className="font-bold text-white">Close</Text>
            </Pressable>
          </View>

          {/* receipt preview overlay */}
          {pending && (
            <View
              style={StyleSheet.absoluteFillObject}
              className="items-center justify-center px-5 bg-black/80 rounded-t-3xl"
            >
              <View className="w-full p-4 bg-white rounded-3xl">
                <Text className="text-base font-extrabold text-slate-900">Acknowledgement receipt</Text>
                <Text className="mb-3 text-xs text-slate-500" numberOfLines={1}>
                  {stops[pending.index]?.name}
                </Text>
                <Image
                  source={{ uri: pending.uri }}
                  style={{ width: '100%', height: 320, borderRadius: 16 }}
                  resizeMode="cover"
                />
                <Pressable
                  disabled={uploading}
                  onPress={submit}
                  className="flex-row items-center justify-center py-3.5 mt-4 rounded-2xl bg-primary active:bg-primary-dark"
                >
                  {uploading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <MaterialCommunityIcons name="cloud-upload" size={20} color="#fff" />
                  )}
                  <Text className="ml-2 font-bold text-white">{uploading ? 'Uploading…' : 'Submit & confirm'}</Text>
                </Pressable>
                <View className="flex-row mt-2">
                  <Pressable
                    disabled={uploading}
                    onPress={() => capture(pending.index)}
                    className="items-center flex-1 py-3 mr-2 border rounded-2xl border-slate-300"
                  >
                    <Text className="font-semibold text-slate-700">Retake</Text>
                  </Pressable>
                  <Pressable
                    disabled={uploading}
                    onPress={() => setPending(null)}
                    className="items-center flex-1 py-3 ml-2 border border-red-300 rounded-2xl"
                  >
                    <Text className="font-semibold text-red-600">Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default TripDetailsModal;