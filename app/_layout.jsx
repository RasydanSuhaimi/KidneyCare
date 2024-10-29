import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { UserProvider } from "../context/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <UserProvider>
      <ApolloProvider client={client}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="testLottie" options={{ headerShown: false }} />
            <Stack.Screen
              name="personalInfo"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="addFood"
              options={{
                headerBackTitleVisible: false,
                headerBackVisible: false,
                headerTitle: "Add Food",
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </ApolloProvider>
    </UserProvider>
  );
};

export default RootLayout;
