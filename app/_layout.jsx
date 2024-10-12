import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { UserProvider } from "../context/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Ensure gesture-handler is imported

// Prevent auto-hiding the splash screen until fonts are loaded
SplashScreen.preventAutoHideAsync();

const client = new ApolloClient({
  uri: "https://hsinhkamhsai.us-east-a.ibm.stepzen.net/api/hoping-sheep/__graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      "apikey hsinhkamhsai::local.net+1000::e0b4d67d4eb1f34c9854a50b49c5db3cec88f3629a198729a800aac38f4d080e",
  },
});

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <UserProvider>
      <ApolloProvider client={client}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </ApolloProvider>
    </UserProvider>
  );
};

export default RootLayout;
