import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenHeader = ({ title, subtitle, children }) => (
  <LinearGradient
    colors={['#AF1D5A', '#7E1241']}
    style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
  >
    <SafeAreaView edges={['top']}>
      <View className="px-5 pt-3 pb-5">
        <Text className="text-2xl font-extrabold text-white">{title}</Text>
        {subtitle ? <Text className="text-sm text-white/80 mt-0.5">{subtitle}</Text> : null}
        {children}
      </View>
    </SafeAreaView>
  </LinearGradient>
);

export default ScreenHeader;