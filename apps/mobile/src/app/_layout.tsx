import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProgressProvider } from '../progression/ProgressProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
      <StatusBar style="dark" />
      {/* Transições estáticas também respeitam a preferência de redução de movimento. */}
      <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
