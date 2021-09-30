import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { Colors, Typography } from "_styles";

const StarRating = (props) => {
  const starArrays = [
    ["star", farStar, farStar, farStar, farStar],
    ["star", "star", farStar, farStar, farStar],
    ["star", "star", "star", farStar, farStar],
    ["star", "star", "star", "star", farStar],
    ["star", "star", "star", "star", "star"],
  ];

  const rating = props.rating;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.starsContainer}>
        <TouchableOpacity
          style={styles.starBox}
          activeOpacity={1}
          onPress={() => props.rate(1)}
        >
          <FontAwesomeIcon
            icon={starArrays[rating - 1][0]}
            size={45}
            style={styles.starIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.starBox}
          activeOpacity={1}
          onPress={() => props.rate(2)}
        >
          <FontAwesomeIcon
            icon={starArrays[rating - 1][1]}
            size={45}
            style={styles.starIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.starBox}
          activeOpacity={1}
          onPress={() => props.rate(3)}
        >
          <FontAwesomeIcon
            icon={starArrays[rating - 1][2]}
            size={45}
            style={styles.starIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.starBox}
          activeOpacity={1}
          onPress={() => props.rate(4)}
        >
          <FontAwesomeIcon
            icon={starArrays[rating - 1][3]}
            size={45}
            style={styles.starIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.starBox}
          onPress={() => props.rate(5)}
          activeOpacity={1}
        >
          <FontAwesomeIcon
            icon={starArrays[rating - 1][4]}
            size={45}
            style={styles.starIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const padding = 25; //Move this to styles probably
// Styles
const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    margin: 25,
  },
  starsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  starBox: {
    alignItems: "center",
    margin: "auto",
    width: 50,
    height: 50,
  },
  starIcon: {
    color: Colors.ORANGE,
  },
});

export default StarRating;
