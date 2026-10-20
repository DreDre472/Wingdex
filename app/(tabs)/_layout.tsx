import { Tabs } from 'expo-router';
import { Compass, Database, ScanLine } from 'lucide-react-native';
import { colors } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 4 },
        tabBarStyle: { height: 66, paddingTop: 8, backgroundColor: colors.paper, borderTopColor: colors.line },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Identify', tabBarIcon: ({ color, size }) => <ScanLine color={color} size={size} /> }} />
      <Tabs.Screen name="birds" options={{ title: 'Birds', tabBarIcon: ({ color, size }) => <Compass color={color} size={size} /> }} />
      <Tabs.Screen name="pokedex" options={{ title: 'Pokedex', tabBarIcon: ({ color, size }) => <Database color={color} size={size} /> }} />
    </Tabs>
  );
}