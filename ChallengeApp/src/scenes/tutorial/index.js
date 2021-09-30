import React, { Component } from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { View, StyleSheet, Text, Image } from "react-native";
import { TransparentHeaderView } from "_organisms";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Typography, Colors } from "_styles";

const slides = [
  {
    key: "one",
    title: "Buzzle Tutorial!",
    text: "In this tutorial you will learn\nhow to use Buzzle! ",
    image: require("_assets/images/tutorialpic01.png"),
  },
  {
    key: "two",
    title: "Menu Bar",
    text: "Here is the menu!\nUse this to navigate around the app! ",
    image: require("_assets/images/tutorialpic11.png"),
  },
  {
    key: "three",
    title: "Menu Bar",
    text: "This is how the menu looks like!\nUse this to navigate around the app! ",
    image: require("_assets/images/tutorialpic21.png"),
  },
  {
    key: "four",
    title: "Create A Challenge",
    text: "Use this button to create a challenge!\n  ",
    image: require("_assets/images/tutorialpic31.png"),
  },
  {
    key: "five",
    title: "Create A Challenge",
    text: "Here is how you create your very own challenge!\n",
    image: require("_assets/images/tutorialpic41.png"),
  },
  {
    key: "six",
    title: "You have mastered \nthe tutorial!",
    text: "This marks the end of the tutorial!\nNow you are ready to make challenges of \n your own. Click on the check-button to enter the app",
    image: require("_assets/images/tutorialpic51.png"),
  },
];

export default class TutorialScreen extends Component {
  state = {
    showRealApp: false,
  };
  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} />
        <Text style={styles.masterText}>{item.title}</Text>
        <Text style={styles.smallFormText}>{item.text}</Text>
      </View>
    );
  };
  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <FontAwesomeIcon
          icon="arrow-right"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  _renderPrevButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <FontAwesomeIcon
          icon="arrow-left"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <FontAwesomeIcon
          icon="check-circle"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  _onDone = () => {
    this.setState({ showRealApp: true });
  };
  render() {
    if (this.state.showRealApp) {
      return this.props.navigation.navigate("Nickname");
    } else {
      return (
        <TransparentHeaderView
          title="TUTORIAL"
          backgroundColor={Colors.BACKGROUND_WHITE}
          headerBackgroundColor={Colors.DARK_PURPLE}
          barStyle={"light-content"}
          accentColor={"#fff"}
        >
          <AppIntroSlider
            renderItem={this._renderItem}
            data={slides}
            renderDoneButton={this._renderDoneButton}
            renderNextButton={this._renderNextButton}
            renderPrevButton={this._renderPrevButton}
            showPrevButton={true}
            onDone={this._onDone}
            activeDotStyle={{ backgroundColor: Colors.ORANGE }}
          />
        </TransparentHeaderView>
      );
    }
  }
}

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  masterText: {
    color: "#000000",
    fontSize: 25,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
    textAlign: "center",
    marginTop: 20,
  },
  smallFormText: {
    color: "#000000",
    textAlign: "center",
    marginTop: 10,
  },
  slide: {
    alignSelf: "center",
  },
});
