import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="lesson/[id]"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="quiz/[id]"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="course/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
