import { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Modal,
  Animated,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import { PROFILE } from '../../data/dummy';

/* =========================================================
   ROSE THEME
========================================================= */

const PINK = '#AF1D5A';
const PINK_DARK = '#8F1749';
const PINK_LIGHT = '#FCE7F0';
const TEXT = '#241923';
const MUTED = '#817681';

/* =========================================================
   REUSABLE DETAIL FIELD
========================================================= */

const Field = ({
  label,
  icon,
  editing,
  multiline = false,
  error,
  value,
  onChangeText,
  keyboardType,
  maxLength,
  autoCapitalize,
}) => {
  const [contentHeight, setContentHeight] = useState(44);

  return (
    <View className="flex-1">
      <Text className="mb-2 text-xs font-semibold tracking-wide text-slate-500">
        {label}
      </Text>

      <View
        className={`flex-row items-start rounded-2xl border px-3 ${
          error
            ? 'border-red-300 bg-red-50'
            : editing
              ? 'border-rose-200 bg-white'
              : 'border-transparent bg-rose-50/70'
        }`}
      >
        <View className="items-center justify-center w-8 h-8 mt-2 mr-2 rounded-xl bg-white">
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={editing ? PINK : '#B79AA9'}
          />
        </View>

        <TextInput
          editable={editing}
          multiline={multiline}
          value={value ?? ''}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          placeholderTextColor="#A99AA3"
          textAlignVertical={multiline ? 'top' : 'center'}
          onContentSizeChange={(event) => {
            if (multiline) {
              setContentHeight(
                Math.max(44, event.nativeEvent.contentSize.height)
              );
            }
          }}
          style={{
            flex: 1,
            minHeight: multiline ? contentHeight : 44,
            paddingVertical: 12,
            color: TEXT,
            fontSize: 14,
          }}
        />
      </View>

      {error ? (
        <Text className="mt-1.5 text-xs text-red-500">{error}</Text>
      ) : null}
    </View>
  );
};

/* =========================================================
   PROFILE SCREEN
========================================================= */

const Profile = () => {
  const navigation = useNavigation();

  // Preserve the existing saved/draft editing model.
  const [saved, setSaved] = useState(PROFILE);
  const [draft, setDraft] = useState(PROFILE);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  /* ---------------- logout modal animation ---------------- */

  useEffect(() => {
    if (showLogoutModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 75,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.85);
    }
  }, [showLogoutModal, fadeAnim, scaleAnim]);

  const set = (key) => (value) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /* ---------------- save profile ---------------- */

  const save = () => {
    const nextErrors = {};

    if (!draft.firstName?.trim()) {
      nextErrors.firstName = 'Required';
    }

    if (!draft.lastName?.trim()) {
      nextErrors.lastName = 'Required';
    }

    if (!/^\d{6}$/.test(draft.pincode ?? '')) {
      nextErrors.pincode = 'Enter a 6-digit pincode';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    setSaved(draft);
    setEditing(false);

    Alert.alert('Profile updated', 'Your profile details have been saved.');
  };

  /* ---------------- cancel editing ---------------- */

  const cancel = () => {
    setDraft(saved);
    setErrors({});
    setEditing(false);
  };

  /* ---------------- logout modal controls ---------------- */

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => setShowLogoutModal(false));
  };

  const confirmLogout = () => {
    closeLogoutModal();

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 220);
  };

  const initials =
    `${saved.firstName?.[0] || ''}${saved.lastName?.[0] || ''}`.toUpperCase();

  const fullName = `${saved.firstName || ''} ${saved.lastName || ''}`.trim();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FFF8FB]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader title="Profile" subtitle="Manage your details" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 32,
        }}
      >
        {/* =================================================
            COMPACT PROFILE HEADER
        ================================================= */}

        <View className="mb-5 overflow-hidden rounded-[26px] border border-rose-100 bg-white">
          {/* Short banner */}
          <View
            className="relative h-[86px] flex-row items-center justify-end px-5"
            style={{ backgroundColor: PINK_DARK }}
          >
            {/* Subtle decorative shapes */}
            <View
              pointerEvents="none"
              className="absolute top-0 right-0 w-32 h-32 rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.07)',
                transform: [{ translateX: 35 }, { translateY: -65 }],
              }}
            />

            <View
              pointerEvents="none"
              className="absolute bottom-0 left-0 w-24 h-24 rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                transform: [{ translateX: -35 }, { translateY: 45 }],
              }}
            />

            <View className="items-end">
              <Text className="text-[10px] font-bold tracking-[2px] text-rose-200">
                DRIVER
              </Text>
              <Text className="text-lg font-extrabold text-white">
                Profile
              </Text>
            </View>
          </View>

          {/* White area: avatar on left, details on right */}
          <View className="flex-row items-center min-h-[88px] px-4 pb-3">
            {/* Avatar overlaps the banner */}
            <View
              className="items-center justify-center w-[72px] h-[72px] -mt-9 rounded-full border-4 border-white"
              style={{ backgroundColor: PINK_LIGHT }}
            >
              <Text className="text-xl font-extrabold" style={{ color: PINK }}>
                {initials || 'DR'}
              </Text>
            </View>

            {/* Driver name and vehicle details */}
            <View className="flex-1 min-w-0 ml-3 pt-2">
              <Text
                className="text-base font-extrabold"
                style={{ color: TEXT }}
                numberOfLines={1}
              >
                {fullName || 'Driver name'}
              </Text>

              <View className="flex-row items-center mt-1">
                <MaterialCommunityIcons
                  name="truck-outline"
                  size={15}
                  color={PINK}
                />
                <Text
                  className="ml-1.5 text-xs font-medium"
                  style={{ color: MUTED }}
                  numberOfLines={1}
                >
                  {saved.vehicle || 'Vehicle not provided'}
                  {saved.vehicleNumber ? ` · ${saved.vehicleNumber}` : ''}
                </Text>
              </View>

              {editing ? (
                <View className="flex-row items-center mt-1">
                  <View className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500" />
                  <Text className="text-[11px] font-semibold text-amber-700">
                    Editing profile
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* =================================================
            PERSONAL DETAILS
        ================================================= */}

        <View className="p-4 mb-5 bg-white border rounded-[26px] border-rose-100">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1 pr-3">
              <Text className="text-lg font-extrabold" style={{ color: TEXT }}>
                Personal details
              </Text>
              <Text
                className="mt-1 text-xs leading-5"
                style={{ color: MUTED }}
              >
                Keep your contact and address information up to date.
              </Text>
            </View>

            {!editing ? (
              <Pressable
                onPress={() => setEditing(true)}
                className="flex-row items-center px-3.5 py-2 rounded-full bg-rose-50"
                android_ripple={{ color: '#F4D5E2', borderless: true }}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={16}
                  color={PINK}
                />
                <Text className="ml-1.5 text-sm font-bold" style={{ color: PINK }}>
                  Edit
                </Text>
              </Pressable>
            ) : null}
          </View>

          <View className="h-1 mb-4 overflow-hidden rounded-full bg-rose-50">
            <View
              className="w-1/3 h-full rounded-full"
              style={{ backgroundColor: PINK }}
            />
          </View>

          {/* First name + Last name */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Field
                label="First name"
                icon="account-outline"
                editing={editing}
                value={draft.firstName}
                onChangeText={set('firstName')}
                error={errors.firstName}
              />
            </View>

            <View className="flex-1 ml-2">
              <Field
                label="Last name"
                icon="account-outline"
                editing={editing}
                value={draft.lastName}
                onChangeText={set('lastName')}
                error={errors.lastName}
              />
            </View>
          </View>

          {/* Address */}
          <View className="mb-4">
            <Field
              label="Address"
              icon="home-outline"
              editing={editing}
              multiline
              value={draft.address}
              onChangeText={set('address')}
            />
          </View>

          {/* Pincode + Vehicle number */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Field
                label="Pincode"
                icon="map-marker-outline"
                editing={editing}
                value={draft.pincode}
                onChangeText={set('pincode')}
                keyboardType="number-pad"
                maxLength={6}
                error={errors.pincode}
              />
            </View>

            <View className="flex-1 ml-2">
              <Field
                label="Vehicle number"
                icon="card-account-details-outline"
                editing={editing}
                value={draft.vehicleNumber}
                onChangeText={set('vehicleNumber')}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Vehicle name */}
          <Field
            label="Vehicle name"
            icon="truck-outline"
            editing={editing}
            value={draft.vehicle}
            onChangeText={set('vehicle')}
          />

          {/* Save and cancel actions */}
          {editing ? (
            <View className="flex-row mt-2">
              <Pressable
                onPress={cancel}
                className="flex-row items-center justify-center flex-1 py-3 mr-2 border rounded-2xl border-rose-200 bg-white"
                android_ripple={{ color: '#FCE7EF' }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={17}
                  color="#766773"
                />
                <Text className="ml-1.5 font-bold text-slate-600">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={save}
                className="flex-row items-center justify-center flex-1 py-3 ml-2 rounded-2xl"
                style={{ backgroundColor: PINK }}
                android_ripple={{ color: PINK_DARK }}
              >
                <MaterialCommunityIcons
                  name="check"
                  size={18}
                  color="#FFFFFF"
                />
                <Text className="ml-1.5 font-bold text-white">
                  Save changes
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {/* =================================================
            RECTANGULAR GRADIENT LOGOUT BUTTON
        ================================================= */}

        <Pressable
          onPress={openLogoutModal}
          className="self-center overflow-hidden rounded-xl"
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          style={{
            width: '100%',
            maxWidth: 320,
            borderRadius: 12,
            shadowColor: PINK_DARK,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.22,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <LinearGradient
            colors={['#C72D70', '#8F1749']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              minHeight: 52,
              paddingHorizontal: 24,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
            }}
          >
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color="#FFFFFF"
            />
            <Text className="ml-2 text-sm font-bold text-white">
              Log out
            </Text>
          </LinearGradient>
        </Pressable>

        <Text className="mt-3 text-xs text-center" style={{ color: MUTED }}>
          Manage your account securely
        </Text>
      </ScrollView>

      {/* =================================================
          LOGOUT CONFIRMATION MODAL
      ================================================= */}

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeLogoutModal}
      >
        <View className="items-center justify-center flex-1 px-6 bg-black/40">
          <TouchableWithoutFeedback onPress={closeLogoutModal}>
            <View className="absolute inset-0" />
          </TouchableWithoutFeedback>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              width: '100%',
              maxWidth: 360,
            }}
            className="p-6 bg-white rounded-[28px]"
          >
            <View className="items-center">
              <View className="items-center justify-center w-16 h-16 rounded-2xl bg-rose-50">
                <MaterialCommunityIcons
                  name="logout"
                  size={29}
                  color={PINK}
                />
              </View>

              <Text className="mt-5 text-xl font-extrabold text-center text-slate-900">
                Are you sure?
              </Text>

              <Text className="mt-2 text-sm leading-5 text-center text-slate-500">
                Are you sure you want to log out of your account? You will
                need to log in again to access your profile.
              </Text>
            </View>

            <View className="flex-row mt-7">
              <Pressable
                onPress={closeLogoutModal}
                className="items-center justify-center flex-1 py-3.5 mr-2 border rounded-xl border-slate-200 bg-white"
                android_ripple={{ color: '#F1F5F9' }}
              >
                <Text className="font-bold text-slate-600">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={confirmLogout}
                className="flex-row items-center justify-center flex-1 py-3.5 ml-2 rounded-xl"
                style={{ backgroundColor: PINK }}
                android_ripple={{ color: PINK_DARK }}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={17}
                  color="#FFFFFF"
                />
                <Text className="ml-1.5 font-bold text-white">
                  Yes, Log out
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Profile;