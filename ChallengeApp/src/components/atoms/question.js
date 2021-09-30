import React from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { Colors, Typography } from "_styles";

const Question = (props) => {
  return (
    <ScrollView>
      <Text style={styles.questionText}>{props.questionText}</Text>
    </ScrollView>
  );
};

const padding = 25; //Move this to styles probably
// Styles
const styles = StyleSheet.create({
  questionText: {
    color: Colors.WHITE,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_MEDIUM,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    marginBottom: 10,
    textAlign: "left",
  },
});

export default Question;
