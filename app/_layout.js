import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { AuthProvider, useAuth } from '../context/AuthContext';

export const unstable_settings = {
  initialRouteName: "(app)",
};

const InitialLayout = () => {
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session) {
      // User is logged in
      if (inAuthGroup) {
        // Redirect away from auth screens
        if (!session.username) {
          router.replace('/setup-username');
        } else {
          router.replace('/home');
        }
      } else if (!session.username && segments[1] !== 'setup-username') {
        // Logged in but no username yet — force setup
        router.replace('/setup-username');
      }
    } else if (!session && !inAuthGroup) {
      // User is not logged in
      router.replace('/login');
    }
  }, [session, initialized, fontsLoaded, segments]);

  if (!fontsLoaded || !initialized) return null;

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
