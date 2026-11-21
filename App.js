import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Dashboard from './src/screens/Dashboard/Dashboard.jsx';
import { TripProvider } from './src/context/TripContext';
import Trips from './src/screens/Trips/Trips.jsx';
import History from './src/screens/History/History.jsx';
import Profile from './src/screens/Profile/Profile.jsx';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: ['home', 'home-outline'],
  Trips: ['truck-fast', 'truck-fast-outline'],
  History: ['history', 'history'],
  Profile: ['account', 'account-outline'],
};

function Tabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#AF1D5A',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 12,
        },
        tabBarIcon: ({ focused, color }) => (
          <MaterialCommunityIcons
            name={ICONS[route.name][focused ? 0 : 1]}
            size={26}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Trips" component={Trips} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TripProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Tabs />
          </NavigationContainer>
      </TripProvider>
    </SafeAreaProvider>
  );
}