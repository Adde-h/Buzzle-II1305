/**
 * Profile (TEMPLATE)
 *
 */

import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, Image, View } from "react-native";
import { Header, Icon } from "react-native-elements";
import { DrawerActions } from "react-navigation-drawer";
import * as firebase from "firebase";
import {
  TransparentHeaderView,
  CardBox,
  RedButton,
  PurpleButton,
} from "_organisms";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Colors } from "_styles";
import { signOut } from "./api";

const ProfileScreen = ({ navigation }) => {
  const [displayName, changeDisplayName] = useState("");

  const IMG_URI =
    "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";

  const didFocusSubscription = navigation.addListener("didFocus", (payload) => {
    const nickName = navigation.getParam("nickName", "none");

    if (nickName != "none") {
      changeDisplayName(nickName);
      console.log("Nickname param [PROFILE] GET FROM PARAMETER: ", nickName);
    } else {
      var user = firebase.auth().currentUser;
      if (user) {
        changeDisplayName(user.displayName);
        console.log(
          "Nickname param [PROFILE] GET FROM DATABASE: ",
          user.displayName
        );
      }
    }
  });

  return (
    <TransparentHeaderView
      leftOnPress={() => {
        navigation.dispatch(DrawerActions.openDrawer());
      }}
      leftIcon="bars"
      title="PROFILE"
      backgroundColor={Colors.BACKGROUND_WHITE}
      headerBackgroundColor={Colors.DARK_PURPLE}
      barStyle={"light-content"}
      accentColor={"#fff"}
    >
      <View style={styles.container}>
        <CardBox backgroundColor={Colors.DARK_PURPLE}>
          <Image style={styles.userImage} source={{ uri: IMG_URI }} />
          <Text style={{ color: Colors.WHITE }}>Name: {displayName}</Text>
        </CardBox>

        <PurpleButton
          title="Change nickname"
          onPress={() => {
            navigation.navigate("Nickname");
          }}
        />
        <RedButton
          title="LOGOUT"
          onPress={() => {
            signOut();
            navigation.navigate("Initial");
          }}
        />
      </View>
    </TransparentHeaderView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND_WHITE,
  },

  userImage: {
    borderRadius: 60,
    height: 90,
    marginBottom: -30,
    marginTop: -15,
    width: 90,
    top: -45,
  },
});
