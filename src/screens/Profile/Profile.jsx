import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View,
} from 'react-native';
import Pressable from '../../components/Pressable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import { PROFILE } from '../../data/dummy';

const Field = ({ label, icon, editing, multiline, error, ...props }) => (
  <View className="mb-4">
    <Text className="mb-1.5 text-xs font-semibold text-slate-500">{label}</Text>
    <View
      className={`flex-row items-center px-3 border rounded-xl ${
        error ? 'border-red-400 bg-white' : editing ? 'border-primary bg-white' : 'border-slate-200 bg-slate-50'
      }`}
    >
      <MaterialCommunityIcons name={icon} size={20} color={editing ? '#AF1D5A' : '#94A3B8'} />
      <TextInput
        editable={editing}
        multiline={multiline}
        placeholderTextColor="#94A3B8"
        className="flex-1 px-2 py-3 text-slate-900"
        style={multiline ? { minHeight: 72, textAlignVertical: 'top' } : undefined}
        {...props}
      />
    </View>
    {error ? <Text className="mt-1 text-xs text-red-500">{error}</Text> : null}
  </View>
);

const Profile = () => {
  const [saved, setSaved] = useState(PROFILE);
  const [draft, setDraft] = useState(PROFILE);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (v) => setDraft((d) => ({ ...d, [k]: v }));

  const save = () => {
    const e = {};
    if (!draft.firstName.trim()) e.firstName = 'Required';
    if (!draft.lastName.trim()) e.lastName = 'Required';
    if (!/^\d{6}$/.test(draft.pincode)) e.pincode = 'Enter a 6-digit pincode';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaved(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(saved);
    setErrors({});
    setEditing(false);
  };

  const initials = `${saved.firstName[0] || ''}${saved.lastName[0] || ''}`.toUpperCase();

  return (
    <KeyboardAvoidingView className="flex-1 bg-slate-50" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenHeader title="Profile" subtitle="Manage your details" />

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* avatar card */}
        <View className="flex-row items-center p-4 mb-4 bg-white border rounded-3xl border-slate-200">
          <View className="items-center justify-center w-16 h-16 mr-4 rounded-full bg-primary">
            <Text className="text-2xl font-extrabold text-white">{initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900">{saved.firstName} {saved.lastName}</Text>
            <View className="flex-row items-center mt-1">
              <MaterialCommunityIcons name="truck" size={16} color="#AF1D5A" />
              <Text className="ml-1 text-sm text-slate-600">{saved.vehicle}</Text>
            </View>
          </View>
        </View>

        {/* form card */}
        <View className="p-4 bg-white border rounded-3xl border-slate-200">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-bold text-slate-900">Personal details</Text>
            {!editing && (
              <Pressable
                onPress={() => setEditing(true)}
                className="flex-row items-center px-3 py-1.5 rounded-full bg-primary/10 active:bg-primary/20"
              >
                <MaterialCommunityIcons name="pencil" size={16} color="#AF1D5A" />
                <Text className="ml-1 text-sm font-semibold text-primary">Edit</Text>
              </Pressable>
            )}
          </View>

          <Field label="First name" icon="account-outline" editing={editing} value={draft.firstName} onChangeText={set('firstName')} error={errors.firstName} />
          <Field label="Last name" icon="account-outline" editing={editing} value={draft.lastName} onChangeText={set('lastName')} error={errors.lastName} />
          <Field label="Address" icon="home-outline" editing={editing} multiline value={draft.address} onChangeText={set('address')} />
          <Field label="Pincode" icon="map-marker-outline" editing={editing} value={draft.pincode} onChangeText={set('pincode')} keyboardType="number-pad" maxLength={6} error={errors.pincode} />
          <Field label="Vehicle name" icon="truck-outline" editing={editing} value={draft.vehicle} onChangeText={set('vehicle')} />

          {editing && (
            <View className="flex-row mt-1">
              <Pressable onPress={cancel} className="items-center flex-1 py-3.5 mr-2 border rounded-2xl border-slate-300">
                <Text className="font-bold text-slate-600">Cancel</Text>
              </Pressable>
              <Pressable onPress={save} className="items-center flex-1 py-3.5 ml-2 rounded-2xl bg-primary active:bg-primary-dark">
                <Text className="font-bold text-white">Save</Text>
              </Pressable>
            </View>
          )}
        </View>

        <Pressable
          onPress={() => {}}
          className="flex-row items-center justify-center py-3.5 mt-4 border border-red-300 rounded-2xl bg-white active:bg-red-50"
        >
          <MaterialCommunityIcons name="logout" size={20} color="#DC2626" />
          <Text className="ml-2 font-bold text-red-600">Log out</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;