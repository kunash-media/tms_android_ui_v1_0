import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DistanceModal = ({ visible, points, legs, onSubmit, onCancel }) => {
  const [vals, setVals] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setVals({});
      setError('');
    }
  }, [visible]);

  const submit = () => {
    const filled = [];
    for (let i = 0; i < legs.length; i++) {
      if (legs[i]) {
        filled.push(legs[i]);
        continue;
      }
      const n = parseFloat(String(vals[i] ?? '').replace(',', '.'));
      if (!(n > 0) || n > 5000) {
        setError(`Enter a valid distance for ${points[i].name} → ${points[i + 1].name}`);
        return;
      }
      filled.push({ km: Math.round(n * 10) / 10, mins: null, src: 'manual' });
    }
    onSubmit(filled);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="items-center justify-center flex-1 px-5 bg-black/50">
        <View className="w-full p-5 bg-white rounded-3xl max-h-[85%]">
          <View className="items-center justify-center self-center w-14 h-14 mb-3 rounded-full bg-amber-100">
            <MaterialCommunityIcons name="map-marker-distance" size={28} color="#D97706" />
          </View>
          <Text className="text-lg font-extrabold text-center text-slate-900">Enter distance</Text>
          <Text className="mt-1 mb-4 text-sm text-center text-slate-600">
            We couldn't calculate the road distance for some legs. Enter the exact km (for example
            from Google Maps) to continue.
          </Text>

          <ScrollView style={{ flexGrow: 0 }} keyboardShouldPersistTaps="handled">
            {legs.map((leg, i) => (
              <View key={i} className="p-3 mb-2 border rounded-2xl border-slate-200 bg-slate-50">
                <Text className="text-sm font-semibold text-slate-800" numberOfLines={2}>
                  {points[i]?.name} → {points[i + 1]?.name}
                </Text>
                {leg ? (
                  <Text className="mt-1 text-xs font-semibold text-green-700">
                    {leg.km} km · {leg.src === 'manual' ? 'entered manually' : 'calculated'}
                  </Text>
                ) : (
                  <View className="flex-row items-center mt-2">
                    <TextInput
                      value={vals[i] ?? ''}
                      onChangeText={(v) => { setVals((s) => ({ ...s, [i]: v })); setError(''); }}
                      placeholder="Distance"
                      placeholderTextColor="#94A3B8"
                      keyboardType="decimal-pad"
                      className="flex-1 px-3 py-2.5 bg-white border rounded-xl border-slate-300 text-slate-900"
                    />
                    <Text className="ml-2 font-semibold text-slate-600">km</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {error ? <Text className="mt-1 text-xs text-red-500">{error}</Text> : null}

          <View className="flex-row mt-4">
            <Pressable
              onPress={onCancel}
              className="items-center flex-1 py-3.5 mr-2 border rounded-2xl border-slate-300"
            >
              <Text className="font-bold text-slate-700">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              className="items-center flex-1 py-3.5 ml-2 rounded-2xl bg-primary active:bg-primary-dark"
            >
              <Text className="font-bold text-white">Continue</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DistanceModal;