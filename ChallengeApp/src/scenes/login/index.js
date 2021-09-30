/**
 * Initial screen
 *
 * First screen that is shown to new users
 */
import React from "react";
import { SafeAreaView, View, Text, TouchableHighlight } from "react-native";
import { Colors, Typography } from "_styles";
import { BlackButton, WhiteButton, ShapedBottomBox } from "_organisms";
const InitialScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.ORANGE }}>
      <View style={{ width: "90%", paddingLeft: 35 }}>
        <Text
          style={{
            color: Colors.BLACK,
            fontSize: Typography.FONT_SIZE_LARGE,
            fontFamily: Typography.FONT_FAMILY_BOLD,
            fontWeight: Typography.FONT_WEIGHT_BOLD,
            paddingTop: 80,
          }}
        >
          welcome to
        </Text>
        <Text
          style={{
            color: Colors.BLACK,
            fontSize: Typography.FONT_SIZE_LARGE + 10,
            fontFamily: Typography.FONT_FAMILY_BOLD,
            fontWeight: Typography.FONT_WEIGHT_BOLD,
          }}
        >
          buzzle!
        </Text>
      </View>

      <ShapedBottomBox>
        <BlackButton
          title="GET STARTED"
          onPress={() => navigation.navigate("Getstarted")}
        />

        <WhiteButton
          title="LOGIN / SIGN UP"
          onPress={() => navigation.navigate("Login")}
        />
      </ShapedBottomBox>
    </View>
  );
};

export default InitialScreen;
