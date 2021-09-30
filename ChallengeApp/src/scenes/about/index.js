/**
 * About screen (TEMPLATE)
 */
import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { DrawerActions } from "react-navigation-drawer";
import { TransparentHeaderView } from "_organisms";
import { Typography, Colors } from "_styles";

const AboutScreen = ({ navigation }) => {
  return (
    <TransparentHeaderView
      leftOnPress={() => {
        navigation.dispatch(DrawerActions.openDrawer());
      }}
      leftIcon="bars"
      title="ABOUT"
      backgroundColor={Colors.BACKGROUND_WHITE}
      headerBackgroundColor={Colors.DARK_PURPLE}
      barStyle={"light-content"}
      accentColor={"#fff"}
    >
      <View style={styles.container}>
        <Text style={styles.masterText}> About Buzzle</Text>
        <Text style={styles.smallFormText}>
          Buzzle is a social app where you can create and play challenges, and
          compete with both your friends and strangers from around the globe.
        </Text>
      </View>
      <View style={styles.container2}>
        <Text style={styles.masterText}> Behind Buzzle</Text>

        <Text style={styles.smallFormText}>
          This app was made as a project in the course II1305 at KTH, Sweden by
          a group of 6 students over the course of 4 weeks. Buzzle was built
          using React Native and Expo.
          {"\n"}
          {"\n"}The creators and developers of this app:{"\n"}
          {"\n"}Adeel Hussain
          {"\n"}Alexander Astély
          {"\n"}Elvira Häggström
          {"\n"}Hemen Ali
          {"\n"}Johan Korduner Ekroth
          {"\n"}Kani Talabani
        </Text>
      </View>
      <View style={styles.icon}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://z-boson.netlify.app/");
          }}
        >
          <Icon name="react" type="material-community" size={80} />
          <Text style={styles.iconText}> The Buzzle Project</Text>
        </TouchableOpacity>
      </View>
    </TransparentHeaderView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
    marginTop: 60,
  },
  container2: {
    textAlign: "center",
    marginTop: 80,
  },
  masterText: {
    color: "#000000",
    fontSize: 20,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
    textAlign: "center",
  },
  smallFormText: {
    color: "#000000",
    textAlign: "left",
    width: "90%",
    marginLeft: 25,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },
  iconText: {
    color: "#000000",
    textAlign: "center",
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },
  icon: {
    marginTop: 60,
  },
});
