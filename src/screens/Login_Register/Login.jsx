import { memo, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  LinearGradient as SvgLinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
  RadialGradient as SvgRadialGradient,
} from 'react-native-svg';

/* =========================================================
   CONSTANTS
========================================================= */

const DUMMY_ACCOUNTS = {
  '8830750491': 'driver@123',
  '9876543211': 'driver@456',
  '9876543212': 'driver@789',
};

const C = {
  primary: '#E879A5',
  deepRose: '#C94F82',
  lightPink: '#FCE7F0',
  softBg: '#FFF8FB',
  road: '#E8DCE2',
  roadBorder: 'rgba(200, 80, 130, 0.15)',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  white: '#FFFFFF',
  error: '#DC2626',
  success: '#059669',
  black: '#000000',
};

/* ---------------- splash palette ---------------- */

const P = {
  rose: '#E88AAE',
  roseLight: '#F5B5CC',
  roseSoft: '#F9DCE8',
  roseDark: '#A83F6C',
  roseDeep: '#873653',
  phone: '#26334A',
  phoneDark: '#1A2335',
  tyre: '#1E1722',
  metal: '#3A2F40',
};

/* ---------------- splash scene geometry ---------------- */

const { width: SCREEN_W } = Dimensions.get('window');

const W0 = 660;
const H0 = 640;
const SCENE_W = Math.min(SCREEN_W, 540);
const S = SCENE_W / W0;
const SCENE_H = H0 * S;
const OX = (SCREEN_W - SCENE_W) / 2;

const TS = 1.4;
const TV_W = 300;
const TV_H = 150;
const TRUCK_PX_W = TV_W * TS * S;
const TRUCK_PX_H = TV_H * TS * S;

const STOP_X = 40;
const STOP_Y = 400;

const WHEEL_R = 20;
const WHEEL_CY = 112;
const WHEEL_CX = [62, 182];

const START_TX = SCREEN_W - OX - STOP_X * S + 10;
const WHEEL_DEG = (START_TX / (WHEEL_R * TS * S)) * (180 / Math.PI);

/* =========================================================
   ARTWORK
========================================================= */

/* ---------------- smartphone with navigation map ---------------- */

const PhoneArt = memo(() => (
  <Svg width={SCENE_W} height={SCENE_H} viewBox={`0 0 ${W0} ${H0}`}>
    <Defs>
      <SvgLinearGradient id="scr" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#FDEBF2" />
        <Stop offset="1" stopColor={P.roseSoft} />
      </SvgLinearGradient>

      <SvgLinearGradient id="frame" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#2E3C57" />
        <Stop offset="1" stopColor="#1F2A40" />
      </SvgLinearGradient>

      <ClipPath id="clipScr">
        <Rect x="365" y="50" width="210" height="410" rx="28" />
      </ClipPath>
    </Defs>

    <Ellipse cx="480" cy="478" rx="115" ry="9" fill={P.roseDeep} opacity="0.12" />

    <Rect x="364" y="47" width="230" height="430" rx="36" fill={P.phoneDark} />
    <Rect x="355" y="40" width="230" height="430" rx="36" fill="url(#frame)" />
    <Rect
      x="356"
      y="41"
      width="228"
      height="428"
      rx="35"
      fill="none"
      stroke="#3E4E6C"
      strokeWidth="1.5"
      opacity="0.7"
    />

    <Rect x="584" y="150" width="4" height="52" rx="2" fill="#3A4864" />
    <Rect x="365" y="50" width="210" height="410" rx="28" fill="url(#scr)" />

    {/* Map city blocks */}
    <Rect x="430" y="82" width="74" height="44" rx="6" fill={P.roseLight} opacity="0.55" clipPath="url(#clipScr)" />
    <Rect x="432" y="176" width="64" height="96" rx="6" fill={P.roseLight} opacity="0.5" clipPath="url(#clipScr)" />
    <Rect x="526" y="176" width="46" height="96" rx="6" fill={P.roseLight} opacity="0.45" clipPath="url(#clipScr)" />
    <Rect x="372" y="176" width="34" height="96" rx="6" fill={P.roseLight} opacity="0.45" clipPath="url(#clipScr)" />
    <Rect x="432" y="336" width="62" height="66" rx="6" fill={P.roseLight} opacity="0.5" clipPath="url(#clipScr)" />
    <Rect x="528" y="376" width="44" height="60" rx="6" fill={P.roseLight} opacity="0.45" clipPath="url(#clipScr)" />
    <Rect x="372" y="334" width="30" height="70" rx="6" fill={P.roseLight} opacity="0.45" clipPath="url(#clipScr)" />

    {/* Map roads */}
    <Path
      d="M356 142 L590 112 M356 302 L590 352 M418 40 L398 470 M512 40 L548 470 M360 430 L584 262"
      stroke="#FFFFFF"
      strokeWidth="11"
      strokeLinecap="round"
      clipPath="url(#clipScr)"
    />

    {/* Trees */}
    <Rect x="393" y="388" width="3" height="12" fill={P.roseDark} opacity="0.6" />
    <Circle cx="394.5" cy="380" r="10" fill={P.rose} />
    <Rect x="549" y="150" width="3" height="12" fill={P.roseDark} opacity="0.6" />
    <Circle cx="550.5" cy="143" r="9" fill={P.rose} />

    {/* Navigation route */}
    <Path
      d="M470 266 L470 304 L500 334 L500 404 L476 448"
      fill="none"
      stroke={P.roseDark}
      strokeWidth="4"
      strokeDasharray="7 8"
      strokeLinecap="round"
      clipPath="url(#clipScr)"
    />

    <Circle cx="500" cy="334" r="6" fill={P.roseDark} />
    <Circle cx="500" cy="334" r="2.4" fill="#FFFFFF" />

    {/* Location pin */}
    <Ellipse cx="470" cy="266" rx="19" ry="7" fill={P.roseLight} opacity="0.9" />
    <Ellipse cx="470" cy="266" rx="19" ry="7" fill="none" stroke={P.roseDark} strokeWidth="2.5" />

    <Path
      d="M470 262 C470 262 445 236 445 214 C445 199 456 188 470 188 C484 188 495 199 495 214 C495 236 470 262 470 262Z"
      fill={P.roseDark}
    />

    <Path
      d="M470 188 C456 188 445 199 445 214 C445 228 455 243 463 252 C457 238 456 224 460 211 C462 202 465 194 470 188Z"
      fill="#C25A86"
      opacity="0.55"
    />

    <Circle cx="470" cy="214" r="9" fill="#FFFFFF" />

    {/* Phone notch and status bar */}
    <Rect x="437" y="57" width="86" height="19" rx="9.5" fill={P.phone} />
    <Rect x="486" y="62" width="30" height="9" rx="4.5" fill={P.phoneDark} opacity="0.6" />

    <SvgText x="382" y="71" fontSize="12" fontWeight="bold" fill={P.roseDeep}>
      9:41
    </SvgText>

    <Rect x="540" y="62" width="22" height="9" rx="3" fill={P.roseDeep} opacity="0.75" />
  </Svg>
));

/* ---------------- cloud ---------------- */

const CloudArt = memo(({ width }) => (
  <Svg width={width} height={width * (70 / 120)} viewBox="0 0 120 70">
    <Defs>
      <SvgLinearGradient id="cl" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#FFFFFF" />
        <Stop offset="1" stopColor="#FBE4EE" />
      </SvgLinearGradient>
    </Defs>

    <Ellipse cx="60" cy="58" rx="50" ry="9" fill="#F2BFD3" opacity="0.35" />
    <Rect x="14" y="36" width="92" height="26" rx="13" fill="url(#cl)" />
    <Circle cx="38" cy="40" r="20" fill="url(#cl)" />
    <Circle cx="64" cy="30" r="26" fill="url(#cl)" />
    <Circle cx="88" cy="42" r="19" fill="url(#cl)" />
  </Svg>
));

/* ---------------- delivery truck body ---------------- */

const BodyArt = memo(({ scale = 1 }) => (
  <Svg
    width={TRUCK_PX_W * scale}
    height={TRUCK_PX_H * scale}
    viewBox={`0 0 ${TV_W} ${TV_H}`}
  >
    <Defs>
      <SvgLinearGradient id="cargo" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#D9578A" />
        <Stop offset="1" stopColor="#B8386A" />
      </SvgLinearGradient>

      <SvgLinearGradient id="cab" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F7A3C2" />
        <Stop offset="1" stopColor="#E57AA3" />
      </SvgLinearGradient>

      <SvgLinearGradient id="roof" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#F2A2C0" />
        <Stop offset="1" stopColor="#E88AAE" />
      </SvgLinearGradient>
    </Defs>

    {/* Far-side wheels */}
    <Circle cx="80" cy="100" r="18" fill="#241B29" />
    <Circle cx="200" cy="100" r="18" fill="#241B29" />

    {/* Chassis */}
    <Rect x="28" y="98" width="212" height="12" rx="3" fill="#2A2030" />
    <Rect x="112" y="104" width="58" height="12" rx="3" fill={P.metal} />

    {/* Cargo roof */}
    <Polygon points="88,16 106,4 236,4 218,16" fill="url(#roof)" />
    <Polygon points="106,4 236,4 234,6.5 108,6.5" fill="#FFFFFF" opacity="0.35" />

    {/* Rear cargo interior */}
    <Polygon points="218,16 236,4 236,88 218,100" fill="#47202F" />
    <Polygon points="218,100 236,88 236,92 218,104" fill="#2A2030" />

    {/* Cargo side */}
    <Rect x="88" y="16" width="130" height="84" rx="3" fill="url(#cargo)" />
    <Rect x="88" y="16" width="130" height="3" fill="#FFFFFF" opacity="0.28" />
    <Rect x="88" y="94" width="130" height="6" fill="#8F2D58" opacity="0.55" />

    <Path
      d="M104 22 V92 M120 22 V92 M136 22 V92 M152 22 V92 M168 22 V92 M184 22 V92 M200 22 V92"
      stroke="#FFFFFF"
      strokeWidth="1"
      opacity="0.07"
    />

    <Rect x="92" y="90" width="6" height="3" rx="1.5" fill="#FFC857" />

    {/* Delivery wordmark */}
    <Path
      d="M98 52 H110 M95 59 H108 M98 66 H106"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.85"
    />

    <SvgText
      x="165"
      y="67"
      fontSize="22"
      fontWeight="bold"
      fontStyle="italic"
      fill="#FFFFFF"
      textAnchor="middle"
    >
      Delivery
    </SvgText>

    {/* Cab */}
    <Path
      d="M22 100 L22 68 Q22 60 30 57 L50 37 Q54 32 61 32 L88 32 L88 100 Z"
      fill="url(#cab)"
    />

    <Path
      d="M30 57 L50 37 Q54 32 61 32 L88 32 L88 35 L62 35 Q57 35 54 39 L34 59 Z"
      fill="#FFFFFF"
      opacity="0.3"
    />

    {/* Cab window */}
    <Path d="M44 68 L57 42 L82 42 L82 68 Z" fill={P.phone} />
    <Path d="M50 64 L60 45 L66 45 L56 64 Z" fill="#FFFFFF" opacity="0.14" />

    {/* Door seams and handle */}
    <Path d="M40 70 V98 M84 70 V98" stroke="#C85F88" strokeWidth="1.2" />
    <Rect x="72" y="76" width="9" height="3.2" rx="1.6" fill="#C85F88" />

    {/* Mirror */}
    <Rect x="25" y="44" width="8" height="18" rx="3.5" fill={P.phone} />
    <Rect x="27" y="62" width="2.2" height="9" rx="1" fill="#C85F88" />

    {/* Wheel arches */}
    <Circle cx="62" cy="112" r="25" fill={P.tyre} />
    <Circle cx="182" cy="112" r="25" fill={P.tyre} />

    {/* Front bumper and lights */}
    <Rect x="12" y="94" width="38" height="13" rx="4" fill="#2A2030" />
    <Rect x="14" y="97" width="12" height="4" rx="2" fill="#B9A5B1" />
    <Rect x="20" y="76" width="7" height="13" rx="3" fill="#FFEBB8" />
    <Rect x="20" y="76" width="7" height="13" rx="3" fill="none" stroke="#F3C879" strokeWidth="0.8" />
    <Rect x="29" y="84" width="9" height="9" rx="2" fill="#3A2F40" />

    {/* Rear bumper */}
    <Rect x="214" y="102" width="26" height="9" rx="3" fill="#2A2030" />
  </Svg>
));

/* ---------------- rear door ---------------- */

const doorPoints = (phi) => {
  const r = (phi * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);

  const ox = -18 * c + 48 * s;
  const oy = 12 * c;

  return `236,4 ${236 + ox},${4 + oy} ${236 + ox},${88 + oy} 236,88`;
};

const DoorLayer = ({ door, scale = 1 }) => {
  const [phi, setPhi] = useState(0);

  useEffect(() => {
    const id = door.addListener(({ value }) => setPhi(value * 100));

    return () => door.removeListener(id);
  }, [door]);

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width={TRUCK_PX_W * scale}
      height={TRUCK_PX_H * scale}
      viewBox={`0 0 ${TV_W} ${TV_H}`}
    >
      <Polygon
        points={doorPoints(phi)}
        fill="#C84A78"
        stroke="#C84A78"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      <Polygon
        points={doorPoints(phi)}
        fill="none"
        stroke="#E58AAE"
        strokeWidth="1"
        opacity="0.7"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

/* ---------------- wheel ---------------- */

const WheelArt = memo(() => (
  <Svg width="100%" height="100%" viewBox="0 0 40 40">
    <Circle cx="20" cy="20" r="20" fill={P.tyre} />

    <Path
      d="M20 1 V4 M20 36 V39 M1 20 H4 M36 20 H39 M6.6 6.6 L8.7 8.7 M31.3 31.3 L33.4 33.4 M6.6 33.4 L8.7 31.3 M31.3 8.7 L33.4 6.6"
      stroke="#4A3D50"
      strokeWidth="2"
      strokeLinecap="round"
    />

    <Circle cx="20" cy="20" r="13" fill={P.metal} />
    <Circle cx="20" cy="20" r="9.5" fill="#F4DCE6" />
    <Circle cx="20" cy="20" r="9.5" fill="none" stroke="#C9A5B6" strokeWidth="1" />

    <Circle cx="20" cy="13.6" r="1.7" fill="#9A6F85" />
    <Circle cx="26.1" cy="18" r="1.7" fill="#9A6F85" />
    <Circle cx="23.8" cy="25.2" r="1.7" fill="#9A6F85" />
    <Circle cx="16.2" cy="25.2" r="1.7" fill="#9A6F85" />
    <Circle cx="13.9" cy="18" r="1.7" fill="#9A6F85" />
    <Circle cx="20" cy="20" r="3" fill="#C9A5B6" />
  </Svg>
));

/* ---------------- cardboard box ---------------- */

const BoxArt = memo(({ k }) => (
  <Svg width={80 * k * S} height={96 * k * S} viewBox="0 0 80 96">
    <Ellipse cx="38" cy="90" rx="40" ry="6" fill={P.roseDeep} opacity="0.2" />

    <Polygon points="58,30 74,20 74,78 58,88" fill="#B67B49" />
    <Polygon points="0,30 16,20 74,20 58,30" fill="#EDC391" />
    <Rect x="0" y="30" width="58" height="58" fill="#D9A06A" />

    <Polygon points="22,30 34,30 50,20 38,20" fill="#F3D9B2" opacity="0.95" />
    <Rect x="22" y="30" width="12" height="20" fill="#F3D9B2" opacity="0.95" />

    <Rect x="7" y="62" width="20" height="13" rx="2" fill="#F8EEDD" />
    <Path d="M10 67 H24 M10 71 H20" stroke="#B89270" strokeWidth="1.3" />

    <Path d="M0 30 L58 30 M58 30 L58 88" stroke="#FFFFFF" strokeWidth="1" opacity="0.35" />
  </Svg>
));

/* =========================================================
   SPLASH SCREEN
========================================================= */

const BOXES = [
  { k: 1.25, left: 440, top: 490, fx: -70, fy: -8 },
  { k: 0.95, left: 528, top: 522, fx: -120, fy: -10 },
  { k: 0.85, left: 450, top: 447, fx: -8, fy: -46 },
];

const SplashScreen = ({ onDone }) => {
  const sceneIn = useRef(new Animated.Value(0)).current;
  const brand = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const door = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const boxes = useRef(BOXES.map(() => new Animated.Value(0))).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(drift, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    driftLoop.start();

    const seq = Animated.sequence([
      // 1. Scene fades in and truck drives into position.
      Animated.parallel([
        Animated.timing(sceneIn, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),

        Animated.timing(brand, {
          toValue: 1,
          duration: 700,
          delay: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.sequence([
          Animated.delay(300),

          Animated.timing(progress, {
            toValue: 1,
            duration: 2200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),

      // 2. Truck suspension settles.
      Animated.sequence(
        [4, -2, 1, 0].map((to) =>
          Animated.timing(bob, {
            toValue: to,
            duration: 100,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          })
        )
      ),

      Animated.delay(120),

      // 3. Rear door opens slightly faster.
      Animated.timing(door, {
        toValue: 1,
        duration: 650,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),

      Animated.delay(60),

      // 4. Parcels appear one by one.
      Animated.stagger(
        180,
        boxes.map((v) =>
          Animated.timing(v, {
            toValue: 1,
            duration: 650,
            easing: Easing.out(Easing.back(1.4)),
            useNativeDriver: true,
          })
        )
      ),

      // 5. Hold the finished scene, then show the login screen.
      Animated.delay(800),

      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    seq.start(({ finished }) => {
      if (finished) onDone();
    });

    return () => {
      seq.stop();
      driftLoop.stop();
    };
  }, []);

  const truckStyle = {
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [START_TX, 0],
        }),
      },
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-18 * S, 0],
        }),
      },
    ],
  };

  const bodyStyle = {
    transform: [
      {
        translateY: bob.interpolate({
          inputRange: [-4, 4],
          outputRange: [-1.6 * S, 1.6 * S],
        }),
      },
      {
        rotate: bob.interpolate({
          inputRange: [-4, 4],
          outputRange: ['0.7deg', '-0.7deg'],
        }),
      },
    ],
  };

  const wheelStyle = {
    transform: [
      {
        rotate: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${-WHEEL_DEG}deg`],
        }),
      },
    ],
  };

  const cloudA = {
    transform: [
      {
        translateX: drift.interpolate({
          inputRange: [0, 1],
          outputRange: [-7 * S, 7 * S],
        }),
      },
    ],
  };

  const cloudB = {
    transform: [
      {
        translateX: drift.interpolate({
          inputRange: [0, 1],
          outputRange: [6 * S, -6 * S],
        }),
      },
    ],
  };

  const boxStyle = (v, b) => ({
    opacity: v.interpolate({
      inputRange: [0, 0.3],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),

    transform: [
      {
        translateX: v.interpolate({
          inputRange: [0, 1],
          outputRange: [b.fx * S, 0],
        }),
      },
      {
        translateY: v.interpolate({
          inputRange: [0, 1],
          outputRange: [b.fy * S, 0],
        }),
      },
      {
        scale: v.interpolate({
          inputRange: [0, 1],
          outputRange: [0.55, 1],
        }),
      },
    ],
  });

  const brandStyle = {
    opacity: brand,
    transform: [
      {
        translateY: brand.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  };

  const abs = { position: 'absolute' };

  return (
    <Animated.View style={[styles.splash, { opacity: screenOpacity }]}>
      <View style={{ width: SCREEN_W, height: SCENE_H, overflow: 'hidden' }}>
        <View
          style={{
            position: 'absolute',
            left: OX,
            top: 0,
            width: SCENE_W,
            height: SCENE_H,
          }}
        >
          {/* Stationary smartphone */}
          <Animated.View style={[abs, { left: 0, top: 0, opacity: sceneIn }]}>
            <PhoneArt />
          </Animated.View>

          {/* Clouds */}
          <Animated.View
            style={[
              abs,
              { left: 215 * S, top: 105 * S, opacity: sceneIn },
              cloudA,
            ]}
          >
            <CloudArt width={150 * S} />
          </Animated.View>

          <Animated.View
            style={[
              abs,
              { left: 560 * S, top: 190 * S, opacity: sceneIn },
              cloudB,
            ]}
          >
            <CloudArt width={96 * S} />
          </Animated.View>

          {/* Animated truck */}
          <Animated.View
            style={[
              abs,
              {
                left: STOP_X * S,
                top: STOP_Y * S,
                width: TRUCK_PX_W,
                height: TRUCK_PX_H,
              },
              truckStyle,
            ]}
          >
            {/* Truck contact shadow */}
            <Svg
              style={{ position: 'absolute', left: 0, top: 122 * TS * S }}
              width={TRUCK_PX_W}
              height={20 * TS * S}
              viewBox="0 0 300 20"
            >
              <Ellipse cx="150" cy="10" rx="148" ry="8" fill={P.roseDeep} opacity="0.16" />
              <Ellipse cx="150" cy="10" rx="110" ry="5" fill={P.roseDeep} opacity="0.14" />
            </Svg>

            {/* Truck body and animated rear door */}
            <Animated.View style={[StyleSheet.absoluteFill, bodyStyle]}>
              <BodyArt />
              <DoorLayer door={door} />
            </Animated.View>

            {/* Rotating wheels */}
            {WHEEL_CX.map((cx) => (
              <Animated.View
                key={cx}
                style={[
                  abs,
                  {
                    left: (cx - WHEEL_R) * TS * S,
                    top: (WHEEL_CY - WHEEL_R) * TS * S,
                    width: WHEEL_R * 2 * TS * S,
                    height: WHEEL_R * 2 * TS * S,
                  },
                  wheelStyle,
                ]}
              >
                <WheelArt />
              </Animated.View>
            ))}
          </Animated.View>

          {/* Parcels */}
          {BOXES.map((b, i) => (
            <Animated.View
              key={i}
              style={[
                abs,
                { left: b.left * S, top: b.top * S },
                boxStyle(boxes[i], b),
              ]}
            >
              <BoxArt k={b.k} />
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Splash brand text */}
      <Animated.View style={[styles.splashBrand, brandStyle]}>
        <Text style={styles.splashTitle}>TMS Driver</Text>
        <Text style={styles.splashTag}>
          Moving Every Delivery Forward
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

/* =========================================================
   ANIMATION CHANGE 1 — SHARED TRUCK RIG
   Body + rotating wheels, built from the SAME artwork the splash
   uses (BodyArt / DoorLayer / WheelArt). `k` scales the whole truck.
   The rear door is permanently closed here (CLOSED_DOOR never fires).
========================================================= */

const CLOSED_DOOR = new Animated.Value(0);

// Truck-space unit -> screen px (for a rig scaled by k).
const unitPx = (k) => TS * S * k;

// Wheel-bottom y in truck space (= road surface).
const GROUND_LOCAL_Y = WHEEL_CY + WHEEL_R;

const TruckRig = ({ k = 1, spin, bodyStyle }) => {
  const u = unitPx(k);

  return (
    <View style={{ width: TRUCK_PX_W * k, height: TRUCK_PX_H * k }}>
      <Animated.View style={[StyleSheet.absoluteFill, bodyStyle]}>
        <BodyArt scale={k} />
        <DoorLayer door={CLOSED_DOOR} scale={k} />
      </Animated.View>

      {WHEEL_CX.map((cx) => (
        <Animated.View
          key={cx}
          style={{
            position: 'absolute',
            left: (cx - WHEEL_R) * u,
            top: (WHEEL_CY - WHEEL_R) * u,
            width: WHEEL_R * 2 * u,
            height: WHEEL_R * 2 * u,
            transform: [{ rotate: spin }],
          }}
        >
          <WheelArt />
        </Animated.View>
      ))}
    </View>
  );
};

/* ---------------- scrolling road dashes ---------------- */

const GroundDashes = ({ width, period, dash, thickness, color, top, shift }) => {
  const count = Math.ceil(width / period) + 2;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        top,
        width,
        height: thickness,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          flexDirection: 'row',
          width: count * period,
          height: thickness,
          transform: [{ translateX: shift }],
        }}
      >
        {Array.from({ length: count }, (_, i) => (
          <View key={i} style={{ width: period, height: thickness }}>
            <View
              style={{
                width: dash,
                height: thickness,
                borderRadius: thickness / 2,
                backgroundColor: color,
              }}
            />
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

/* =========================================================
   ANIMATION CHANGE 2 — LOGIN-SCREEN TRUCK ("truck login.mp4")
   The truck stays in place above the form and *drives*:
   - wheels spin continuously,
   - road dashes scroll under it at exactly the wheel's surface speed
     (one wheel revolution == one dash period, so the loop is seamless),
   - a slower far lane gives a little parallax,
   - the body floats on its suspension (two out-of-phase sways)
     plus an occasional small road bump.
========================================================= */

const WHEEL_CIRC = 2 * Math.PI * WHEEL_R * TS * S; // px per revolution
const DRIVE_MS = 800; // one wheel revolution

const LoginTruck = () => {
  const turn = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const pitchV = useRef(new Animated.Value(0)).current;
  const bump = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const drive = Animated.loop(
      Animated.timing(turn, {
        toValue: 1,
        duration: DRIVE_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const swayLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: 0,
          duration: 520,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const pitchLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pitchV, {
          toValue: 1,
          duration: 880,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pitchV, {
          toValue: 0,
          duration: 880,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const bumpLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(2300),
        Animated.timing(bump, {
          toValue: 1,
          duration: 110,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bump, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );

    drive.start();
    swayLoop.start();
    pitchLoop.start();
    bumpLoop.start();

    return () => {
      drive.stop();
      swayLoop.stop();
      pitchLoop.stop();
      bumpLoop.stop();
    };
  }, [turn, sway, pitchV, bump]);

  const spin = turn.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const nearShift = turn.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -WHEEL_CIRC],
  });

  // far lane: half the speed, half the period -> still loops seamlessly
  const farShift = turn.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -WHEEL_CIRC / 2],
  });

  const lift = Animated.add(
    sway.interpolate({ inputRange: [0, 1], outputRange: [0.8 * S, -1.2 * S] }),
    bump.interpolate({ inputRange: [0, 1], outputRange: [0, 2.4 * S] })
  );

  const bodyStyle = {
    transform: [
      { translateY: lift },
      {
        rotate: pitchV.interpolate({
          inputRange: [0, 1],
          outputRange: ['0.35deg', '-0.35deg'],
        }),
      },
    ],
  };

  const GW = Math.min(TRUCK_PX_W * 1.3, SCREEN_W - 56);
  const groundY = GROUND_LOCAL_Y * unitPx(1);

  return (
    <View style={{ width: GW, height: TRUCK_PX_H + 10 }}>
      {/* soft contact shadow (does not bob) */}
      <Svg
        pointerEvents="none"
        style={{ position: 'absolute', left: (GW - TRUCK_PX_W) / 2, top: 122 * unitPx(1) }}
        width={TRUCK_PX_W}
        height={20 * unitPx(1)}
        viewBox="0 0 300 20"
      >
        <Ellipse cx="150" cy="10" rx="148" ry="8" fill={P.roseDeep} opacity="0.14" />
        <Ellipse cx="150" cy="10" rx="110" ry="5" fill={P.roseDeep} opacity="0.12" />
      </Svg>

      {/* road lanes */}
      <GroundDashes
        width={GW}
        period={WHEEL_CIRC}
        dash={WHEEL_CIRC * 0.55}
        thickness={3}
        color="rgba(201, 79, 130, 0.35)"
        top={groundY + 1}
        shift={nearShift}
      />
      <GroundDashes
        width={GW}
        period={WHEEL_CIRC / 2}
        dash={WHEEL_CIRC * 0.16}
        thickness={2}
        color="rgba(201, 79, 130, 0.16)"
        top={groundY + 11}
        shift={farShift}
      />

      <View style={{ position: 'absolute', left: (GW - TRUCK_PX_W) / 2, top: 0 }}>
        <TruckRig k={1} spin={spin} bodyStyle={bodyStyle} />
      </View>
    </View>
  );
};

/* =========================================================
   ANIMATION CHANGE 3 — LOGIN LOADING OVERLAY ("loader .mp4")
   A separate scene shown only after the form has been submitted AND
   validation has passed. The reference van hovers in place, hops
   (small hop, then a bigger one), squashes on landing, throws dust and
   keeps its shadow in sync. Everything below is driven by ONE looping
   value `t` (0 -> 1 over LOADER_MS) so every part stays in phase.
========================================================= */

const LOADER_MS = 2000;
const LOADER_K = Math.min(1, (SCREEN_W * 0.62) / TRUCK_PX_W);
const L_W = TRUCK_PX_W * LOADER_K;
const L_H = TRUCK_PX_H * LOADER_K;
const L_U = unitPx(LOADER_K);

const HOP_A = L_W * 0.05;
const HOP_B = L_W * 0.115;
const HOVER = L_W * 0.014;
const HEAD = HOP_B + 14;
const L_GROUND = HEAD + GROUND_LOCAL_Y * L_U;
const STAGE_W = Math.min(L_W * 1.5, SCREEN_W - 40);
const STAGE_H = L_GROUND + 26;

// LAYOUT FIX: the truck artwork's visible body spans x 12..240 of its 300-wide
// box, so its centre is x = 126, not 150. Align that centre with the stage
// centre so the truck, shadow and road lane share one vertical axis.
// Caption block under the road (used to centre the whole composition).
const CAP_GAP = 10;
const CAP_H = 20;
// Visible composition = van top (at rest) -> bottom of the caption text.
// The hop headroom above the van is NOT counted, so what you SEE is centred.
const L_VISIBLE_H = STAGE_H - HEAD + CAP_GAP + CAP_H;

const L_BODY_CENTER = 126;
const L_TRUCK_LEFT = STAGE_W / 2 - L_BODY_CENTER * L_U;

const LOADER_SAMPLES = 100;

// Build a native interpolation of a function of the loop phase t in [0, 1].
const fromPhase = (value, fn, fmt = (x) => x) => {
  const inputRange = [];
  const outputRange = [];
  for (let i = 0; i <= LOADER_SAMPLES; i++) {
    const t = i / LOADER_SAMPLES;
    inputRange.push(t);
    outputRange.push(fmt(fn(t)));
  }
  return value.interpolate({ inputRange, outputRange });
};

const seg = (t, a, b) => (t - a) / (b - a);
const parabola = (u) => 4 * u * (1 - u);

// timeline: hop A .00-.28 | land | hop B .34-.62 | land | hover .72-1.0
const loaderLift = (t) => {
  if (t < 0.28) return HOP_A * parabola(t / 0.28);
  if (t < 0.34) return 0;
  if (t < 0.62) return HOP_B * parabola(seg(t, 0.34, 0.62));
  if (t < 0.72) return 0;
  return HOVER * Math.sin(Math.PI * seg(t, 0.72, 1));
};

const loaderSquash = (t) => {
  if (t >= 0.28 && t < 0.36) return 0.04 * Math.sin((Math.PI * (t - 0.28)) / 0.08);
  if (t >= 0.62 && t < 0.732) return 0.085 * Math.sin((Math.PI * (t - 0.62)) / 0.112);
  return 0;
};

const loaderPitch = (t) => {
  if (t < 0.28) return 1.2 * Math.sin((2 * Math.PI * t) / 0.28);
  if (t >= 0.34 && t < 0.62) return 3 * Math.sin(2 * Math.PI * seg(t, 0.34, 0.62));
  return 0;
};

// dust puffs kicked up behind the van after each landing
const PUFFS = [
  { start: 0.28, len: 0.22, dx: 0.1, amp: 0.55, size: 0.1 },
  { start: 0.62, len: 0.3, dx: 0.16, amp: 0.9, size: 0.14 },
  { start: 0.645, len: 0.3, dx: 0.27, amp: 0.65, size: 0.1 },
];

const puffAt = (p, t) => {
  const u = (t - p.start) / p.len;
  if (u < 0 || u > 1) return { o: 0, x: 0, y: 0, s: 0.4 };
  const fadeIn = Math.min(1, u / 0.12);
  return {
    o: p.amp * fadeIn * Math.pow(1 - u, 1.3),
    x: p.dx * L_W * Math.sqrt(u),
    y: -L_W * 0.03 * u,
    s: 0.45 + 1.05 * u,
  };
};

const Puff = ({ t, cfg }) => {
  const sz = cfg.size * L_W;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: L_TRUCK_LEFT + 236 * L_U - sz * 0.2,
        top: L_GROUND - sz * 0.75,
        width: sz,
        height: sz * 0.7,
        opacity: fromPhase(t, (v) => puffAt(cfg, v).o),
        transform: [
          { translateX: fromPhase(t, (v) => puffAt(cfg, v).x) },
          { translateY: fromPhase(t, (v) => puffAt(cfg, v).y) },
          { scale: fromPhase(t, (v) => puffAt(cfg, v).s) },
        ],
      }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 40 28">
        <Ellipse cx="20" cy="17" rx="18" ry="9" fill="#FFFFFF" />
        <Circle cx="13" cy="13" r="8" fill="#FFFFFF" />
        <Circle cx="25" cy="11" r="9" fill="#FFFFFF" />
        <Ellipse cx="20" cy="20" rx="17" ry="7" fill={P.roseLight} opacity="0.55" />
      </Svg>
    </Animated.View>
  );
};

const LoaderOverlay = ({ visible }) => {
  // Real overlay height, measured on layout, so centring never depends on
  // window-size guesses (status bar, home indicator, keyboard, rotation).
  const [boxH, setBoxH] = useState(0);
  const t = useRef(new Animated.Value(0)).current;
  const spinV = useRef(new Animated.Value(0)).current;
  const lane = useRef(new Animated.Value(0)).current;
  const dots = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loops = [
      Animated.loop(
        Animated.timing(t, {
          toValue: 1,
          duration: LOADER_MS,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.timing(spinV, {
          toValue: 1,
          duration: 560,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.timing(lane, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.timing(dots, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ];

    loops.forEach((l) => l.start());

    return () => loops.forEach((l) => l.stop());
  }, [t, spinV, lane, dots]);

  const spin = spinV.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const hopStyle = {
    transform: [
      {
        // lift off the ground; keep the wheels planted while squashing
        translateY: fromPhase(
          t,
          (v) => -loaderLift(v) + (GROUND_LOCAL_Y - TV_H / 2) * L_U * loaderSquash(v)
        ),
      },
      { rotate: fromPhase(t, loaderPitch, (d) => `${d.toFixed(3)}deg`) },
      { scaleX: fromPhase(t, (v) => 1 + loaderSquash(v) * 0.6) },
      { scaleY: fromPhase(t, (v) => 1 - loaderSquash(v)) },
    ],
  };

  const shadowStyle = {
    opacity: fromPhase(t, (v) => 0.2 - 0.11 * (loaderLift(v) / HOP_B)),
    transform: [
      { scaleX: fromPhase(t, (v) => 1 - 0.36 * (loaderLift(v) / HOP_B)) },
    ],
  };

  const laneShift = lane.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -L_W * 0.5],
  });

  const dotStyle = (i) => ({
    opacity: fromPhase(dots, (v) => {
      const p = (v + 1 - i * 0.18) % 1;
      return 0.25 + 0.75 * Math.max(0, Math.sin(Math.PI * Math.min(1, p / 0.5)));
    }),
    transform: [
      {
        translateY: fromPhase(dots, (v) => {
          const p = (v + 1 - i * 0.18) % 1;
          return -3 * Math.max(0, Math.sin(Math.PI * Math.min(1, p / 0.5)));
        }),
      },
    ],
  });

  const scrimStyle = { opacity: visible };

  const contentStyle = {
    opacity: visible,
    transform: [
      {
        translateY: visible.interpolate({
          inputRange: [0, 1],
          outputRange: [14, 0],
        }),
      },
      {
        scale: visible.interpolate({
          inputRange: [0, 1],
          outputRange: [0.96, 1],
        }),
      },
    ],
  };

  return (
    // Full-screen, swallows touches while visible so the form underneath
    // cannot be edited or re-submitted mid-login.
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="auto"
      onLayout={(e) => setBoxH(e.nativeEvent.layout.height)}
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.loaderScrim, scrimStyle]} />

      {/* Whole composition (road, van, shadow, dust, caption) as ONE group,
          positioned so its visible part is centred on the screen. */}
      {boxH > 0 ? (
      <Animated.View
        style={[
          styles.loaderGroup,
          { top: Math.max(0, (boxH - L_VISIBLE_H) / 2 - HEAD) },
          contentStyle,
        ]}
      >
        <View style={{ width: STAGE_W, height: STAGE_H }}>
          {/* rose road lanes under the van */}
          <GroundDashes
            width={STAGE_W}
            period={L_W * 0.5}
            dash={L_W * 0.26}
            thickness={3}
            color="rgba(201, 79, 130, 0.32)"
            top={L_GROUND + 14}
            shift={laneShift}
          />

          {/* ground shadow, shrinks while the van is airborne */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: (STAGE_W - L_W * 0.86) / 2,
                top: L_GROUND + 1,
                width: L_W * 0.86,
                height: 12,
              },
              shadowStyle,
            ]}
          >
            <Svg width="100%" height="100%" viewBox="0 0 100 12">
              <Ellipse cx="50" cy="6" rx="50" ry="5" fill={P.roseDeep} />
            </Svg>
          </Animated.View>

          {/* dust */}
          {PUFFS.map((p, i) => (
            <Puff key={i} t={t} cfg={p} />
          ))}

          {/* the van (same artwork as the splash / login truck) */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: L_TRUCK_LEFT,
                top: HEAD,
              },
              hopStyle,
            ]}
          >
            <TruckRig k={LOADER_K} spin={spin} bodyStyle={null} />
          </Animated.View>
        </View>

        <View style={styles.loaderCaptionRow}>
          <Text style={styles.loaderCaption}>Signing you in</Text>
          <View style={styles.loaderDots}>
            {[0, 1, 2].map((i) => (
              <Animated.View key={i} style={[styles.loaderDot, dotStyle(i)]} />
            ))}
          </View>
        </View>
      </Animated.View>
      ) : null}
    </View>
  );
};

/* =========================================================
   INPUT FIELD
========================================================= */

const Field = ({
  label,
  icon,
  rightIcon,
  onRightPress,
  editing = true,
  error,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View
        style={[
          styles.fieldBox,
          focused && styles.fieldBoxFocused,
          !!error && styles.fieldBoxError,
          !editing && styles.fieldBoxDisabled,
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={error ? C.error : focused ? C.deepRose : C.textSecondary}
          style={{ marginRight: 8 }}
        />

        <TextInput
          editable={editing}
          placeholderTextColor="#A0A0A0"
          style={styles.fieldInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />

        {rightIcon ? (
          <Pressable onPress={onRightPress} hitSlop={10}>
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={C.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
};

/* =========================================================
   LOGIN FORM
========================================================= */

// Adjusted to 4 animated sections:
// 0 = Welcome text
// 1 = E-mail
// 2 = Password
// 3 = Login button
// 4 = Footer

const ITEM_COUNT = 6;

const LoginForm = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);
  const [success, setSuccess] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  // ANIMATION CHANGE 4: loader overlay state (mounted only after validation passes)
  const [overlayOn, setOverlayOn] = useState(false);
  const overlay = useRef(new Animated.Value(0)).current;
  const timers = useRef([]);
  const alive = useRef(true);

  const items = useRef(
    Array.from({ length: ITEM_COUNT }, () => new Animated.Value(0))
  ).current;

  /* ---------------- fade-up entrance ---------------- */

  useEffect(() => {
    const anim = Animated.stagger(
      90,
      items.map((v) =>
        Animated.timing(v, {
          toValue: 1,
          duration: 560,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    );

    anim.start();

    return () => anim.stop();
  }, [items]);

  const fadeUp = (i) => ({
    opacity: items[i],
    transform: [
      {
        translateY: items[i].interpolate({
          inputRange: [0, 1],
          outputRange: [28, 0],
        }),
      },
    ],
  });


  /* ---------------- shake animation ---------------- */
  const playShake = () =>
    Animated.sequence(
      [8, -8, 6, -6, 0].map((to) =>
        Animated.timing(shake, {
          toValue: to,
          duration: 60,
          useNativeDriver: true,
        })
      )
    ).start();

  /* ---------------- validation ---------------- */

  const validate = () => {
    const e = {};

    if (!mobile.trim()) {
      e.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      e.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!password.trim()) {
      e.password = 'Password is required';
    }

    setErrors(e);

    if (Object.keys(e).length) {
      playShake();
      return false;
    }

    return true;
  };
   /* ---------------- login ---------------- */

  // ANIMATION CHANGE 4: stop everything if the screen unmounts mid-login.
  useEffect(() => {
    alive.current = true;

    return () => {
      alive.current = false;
      timers.current.forEach(clearTimeout);
      overlay.stopAnimation();
    };
  }, [overlay]);

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  const hideOverlay = (after) =>
    Animated.timing(overlay, {
      toValue: 0,
      duration: 320,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      if (!alive.current) return;
      setOverlayOn(false);
      if (after) after();
    });

  const onLogin = () => {
    setBanner(null);

    // The overlay is never shown for invalid input.
    if (!validate()) return;

    Keyboard.dismiss();

    setLoading(true);
    setSuccess(false);

    // Soften the login screen and bring in the loader.
    setOverlayOn(true);
    Animated.timing(overlay, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const id = mobile.trim();
    const pw = password.trim();

    // Keep the loader on screen for two full hop cycles (simulated request),
    // then check the demo credentials exactly as before.
    later(() => {
      const expectedPassword = DUMMY_ACCOUNTS[id];

      if (expectedPassword && expectedPassword === pw) {
        setLoading(false);
        setSuccess(true);

        // Keep the loader overlay visible until navigation happens.
        // Do NOT call hideOverlay() here, or the login form will reappear.
        later(() => {
          if (!alive.current) return;

          navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }],
          });
        }, 700);

        return;
      } else {
        setLoading(false);

        // loader fades away first, then the existing banner + shake
        hideOverlay(() => {
          setBanner({
            type: 'error',
            text: 'Incorrect mobile number or password. Please try again.',
          });

          playShake();
        });
      }
    }, LOADER_MS);
  };

  /* ---------------- button press animation ---------------- */

  const pressIn = () =>
    Animated.spring(btnScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
    }).start();

  const pressOut = () =>
    Animated.spring(btnScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();

  return (
    <>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center', // Center the form vertically
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 28,
        }}
      >
        <Animated.View
          style={[
            styles.formArea,
            { transform: [{ translateX: shake }] },
          ]}
        >

        {/* Truck illustration above the login form */}
        <Animated.View style={[styles.loginIllustration, fadeUp(0)]}>
          <LoginTruck />
        </Animated.View>

          {/* Welcome Section */}
          <Animated.View style={[styles.welcomeSection, fadeUp(0)]}>
            <Text style={styles.welcomeTitle}>Welcome to Login</Text>
            <Text style={styles.welcomeSub}>
              Welcome to EcoRide Log in now to access your account all the features built for you.
            </Text>

            {/* Login error banner */}
            {banner ? (
              <View style={styles.banner}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={18}
                  color={C.error}
                />
                <Text style={styles.bannerText}>{banner.text}</Text>
              </View>
            ) : null}
          </Animated.View>

          {/* Employee ID field */}
          <Animated.View style={fadeUp(1)}>
            <Field
              label="Mobile Number"
              icon="phone-outline"
              placeholder="Enter your mobile number"
              value={mobile}
              onChangeText={setMobile}
              error={errors.mobile}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </Animated.View>

          {/* Password field */}
          <Animated.View style={fadeUp(2)}>
            <Field
              label="Password"
              icon="lock-outline"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry={!showPw}
              autoCapitalize="none"
              autoCorrect={false}
              rightIcon={showPw ? 'eye-off-outline' : 'eye-outline'}
              onRightPress={() => setShowPw((v) => !v)}
            />
          </Animated.View>

          {/* Login button */}
          <Animated.View style={[fadeUp(3), { marginTop: 10 }]}>
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <Pressable
                onPress={onLogin}
                onPressIn={pressIn}
                onPressOut={pressOut}
                disabled={loading || success}
              >
                <View style={styles.loginBtn}>
                  {loading ? (
                    <Text style={styles.loginText}>Log in</Text>
                  ) : success ? (
                    <>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={C.white}
                      />
                      <Text style={[styles.loginText, { marginLeft: 8 }]}>
                        Welcome!
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.loginText}>Log in</Text>
                  )}
                </View>
              </Pressable>
            </Animated.View>
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[styles.footer, fadeUp(4)]}>
{/*             <Text style={styles.footerText}> */}
{/*               Don't have an account? <Text style={styles.footerLink}>Sign up</Text> */}
{/*             </Text> */}
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>

    {/* ANIMATION CHANGE 4: loading overlay (only mounted while logging in) */}
    {overlayOn ? <LoaderOverlay visible={overlay} /> : null}
    </>
  );
};

/* =========================================================
   SCREEN: SPLASH FIRST, THEN LOGIN
========================================================= */

const Login = ({ navigation }) => {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <View style={styles.screen}>
      {/*
        Updated Background with alternate corner semicircles.
        Large radial/linear blends in the top-left and bottom-right corners.
      */}
      <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <Defs>
          {/* Base soft creamy background */}
          <SvgLinearGradient id="bgBase" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FEF9FB" />
            <Stop offset="1" stopColor="#FCF3EC" />
          </SvgLinearGradient>

          {/* Top-Left Rose Pink Glow */}
          <SvgRadialGradient id="glowTL" cx="0%" cy="0%" r="70%">
            <Stop offset="0" stopColor="#F4B4CB" stopOpacity="0.85" />
            <Stop offset="0.5" stopColor="#F9D6E4" stopOpacity="0.4" />
            <Stop offset="1" stopColor="#FEF9FB" stopOpacity="0" />
          </SvgRadialGradient>

          {/* Bottom-Right Rose Pink Glow */}
          <SvgRadialGradient id="glowBR" cx="100%" cy="100%" r="80%">
            <Stop offset="0" stopColor="#E88AAE" stopOpacity="0.6" />
            <Stop offset="0.6" stopColor="#F5B5CC" stopOpacity="0.3" />
            <Stop offset="1" stopColor="#FCF3EC" stopOpacity="0" />
          </SvgRadialGradient>
        </Defs>

        {/* Layer 1: Base cream */}
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgBase)" />

        {/* Layer 2: Top-Left Semicircle glow */}
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowTL)" />

        {/* Layer 3: Bottom-Right Semicircle glow */}
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowBR)" />
      </Svg>

      {splashDone ? (
        <LoginForm navigation={navigation} />
      ) : (
        <SplashScreen onDone={() => setSplashDone(true)} />
      )}
    </View>
  );
};

export default Login;


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: '#FEF9FB',
  },

  /* ---------------- splash styles ---------------- */

  splash: {
    flex: 1,
    justifyContent: 'center',
  },

  splashBrand: {
    alignItems: 'center',
    marginTop: 14,
  },

  splashTitle: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: '800',
    color: C.text,
  },

  splashTag: {
    marginTop: 4,
    fontSize: 13,
    color: C.textSecondary,
  },

  /* ---------------- login layout ---------------- */

  formArea: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    paddingBottom: 20,
  },

loginIllustration: {
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 18,
},

  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },

  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: C.text,
    marginBottom: 8,
  },

  welcomeSub: {
    fontSize: 14,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  /* ---------------- error banner ---------------- */

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    width: '100%',
  },

  bannerText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
    color: C.error,
  },

  /* ---------------- input fields ---------------- */

  fieldWrap: {
    marginBottom: 18,
  },

  fieldLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },

  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  fieldBoxFocused: {
    borderColor: C.primary,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

  fieldBoxError: {
    borderColor: '#F87171',
  },

  fieldBoxDisabled: {
    backgroundColor: '#F8F3F6',
  },

  fieldInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'android' ? 14 : 16,
    fontSize: 15,
    color: C.text,
  },

  fieldError: {
    marginTop: 6,
    fontSize: 12,
    color: C.error,
    marginLeft: 4,
  },

  /* ---------------- login button ---------------- */

  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,

    // Gradient background using standard React Native tricks via wrapper
    // But since we are removing external libs, we use a solid theme fallback
    // with strong shadow.
    backgroundColor: C.deepRose,

    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  loginText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.white,
  },

  /* ---------------- loader overlay ---------------- */

  loaderScrim: {
    backgroundColor: 'rgba(255, 246, 250, 0.995)',
  },

  // Full-width column, children centred horizontally; `top` is set in code.
  loaderGroup: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  loaderCaptionRow: {
    alignItems: 'center',
    justifyContent: 'center',
    height: CAP_H,
    marginTop: CAP_GAP,
  },

  loaderCaption: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: CAP_H,
    letterSpacing: 0.4,
    color: C.deepRose,
  },

  // absolutely positioned so the caption text itself stays exactly centred
  loaderDots: {
    position: 'absolute',
    left: '100%',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },

  loaderDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 2,
    backgroundColor: C.deepRose,
  },

  /* ---------------- footer ---------------- */

  footer: {
    alignItems: 'center',
    marginTop: 30,
  },

  footerText: {
    fontSize: 13,
    color: C.textSecondary,
    textAlign: 'center',
  },

  footerLink: {
    fontWeight: '700',
    color: C.deepRose,
  },
});

// Exported for design previews only
export {
  PhoneArt,
  CloudArt,
  BodyArt,
  WheelArt,
  BoxArt,
  doorPoints,
  LoginTruck,
  LoaderOverlay,
  loaderLift,
  loaderSquash,
  loaderPitch,
};