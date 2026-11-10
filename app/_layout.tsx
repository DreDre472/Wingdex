import { useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashReveal } from '../src/components/SplashReveal';
import { colors } from '../src/theme';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const dismissSplash = useCallback(() => setShowSplash(false), []);

  return (
    <SafeAreaProvider>
      <StatusBar style={showSplash ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="bird/[id]" options={{ presentation: 'modal' }} />
      </Stack>
      {showSplash && <SplashReveal onFinish={dismissSplash} />}
    </SafeAreaProvider>
  );
}