/**
 * Entry point to the app
 * Here we import the Navigator component from
 * navigations folder and render it to the app.
 */
import React from "react";

import Navigator from "_navigations";

import AppLoading from "expo-app-loading";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
  Roboto_300Light,
  Roboto_900Black,
} from "@expo-google-fonts/roboto";

const ChallengeApp = () => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_300Light,
    Roboto_900Black,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <Navigator />;
};

export default ChallengeApp;
