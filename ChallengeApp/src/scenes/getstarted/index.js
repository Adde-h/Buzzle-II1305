/**
 * Get started screen
 *
 * Shows the Terms Of Service before allowing
 * the user to proceed.
 *
 * TODO: Add text block with terms of service
 */
import React from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BlackButton } from "_organisms";
import { Typography } from "_styles";

const GetStartedScreen = ({ navigation }) => (
  <SafeAreaView
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View style={styles.container}>
      <Text style={styles.masterText}> Terms Of Service</Text>
      <TouchableOpacity onPress={() => navigation.navigate("TOS")}>
        <Text style={styles.smallFormText}>Buzzle TOS (Read Here)</Text>
      </TouchableOpacity>
    </View>
    <BlackButton
      title="AGREE TO TOS"
      onPress={() => navigation.navigate("Tutorial")}
    />
  </SafeAreaView>
);

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
    marginTop: 60,
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
    textAlign: "center",
    fontSize: 12,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },
});
