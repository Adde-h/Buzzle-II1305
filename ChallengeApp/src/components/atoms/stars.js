import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { Colors, Typography } from "_styles";

const Stars = (props) => {
  const starArrays = [
    ["star", farStar, farStar, farStar, farStar],
    ["star", "star", farStar, farStar, farStar],
    ["star", "star", "star", farStar, farStar],
    ["star", "star", "star", "star", farStar],
    ["star", "star", "star", "star", "star"],
  ];

  const rating = props.rating;
  if (rating != 0) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.starsContainer}>
          <Text style={styles.smallDescription}>{rating}</Text>
          <TouchableOpacity style={styles.starBox} activeOpacity={1}>
            <FontAwesomeIcon
              icon={starArrays[rating - 1][0]}
              size={15}
              style={styles.starIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.starBox} activeOpacity={1}>
            <FontAwesomeIcon
              icon={starArrays[rating - 1][1]}
              size={15}
              style={styles.starIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.starBox} activeOpacity={1}>
            <FontAwesomeIcon
              icon={starArrays[rating - 1][2]}
              size={15}
              style={styles.starIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.starBox} activeOpacity={1}>
            <FontAwesomeIcon
              icon={starArrays[rating - 1][3]}
              size={15}
              style={styles.starIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.starBox} activeOpacity={1}>
            <FontAwesomeIcon
              icon={starArrays[rating - 1][4]}
              size={15}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return <Text style={styles.smallDescription}>No rating</Text>;
  }
};
const padding = 25; //Move this to styles probably
// Styles
const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
  },
  starsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  starBox: {
    alignItems: "center",
    margin: "auto",
    width: 17,
    height: 20,
  },
  starIcon: {
    color: Colors.ORANGE,
  },
  smallDescription: {
    color: Colors.GRAY_DARK,
  },
});

export default Stars;
