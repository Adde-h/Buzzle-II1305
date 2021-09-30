/**
 * LoadingScreen
 *
 * Is loaded on every start of the app,
 * checks if it's the first time the user uses the app
 * and navigates to new view accordingly
 *
 * TODO: Stop using AsyncStorage, switch to reactnavigation v.5
 */
import React, { Component } from "react";
import {
  Text,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  SafeAreaView,
} from "react-native";

import * as firebase from "firebase";

class LoadingScreen extends Component {
  constructor() {
    super();
    this.unsubscribe = null; // Set a empty class method
    this.state = {
      loading: true,
      user: null,
    };
  }

  // Is called when the component is mounted
  // Check if user is logged in and switch screen depending on if it exists
  // The screen is unmounted and thrown away
  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      //  var user = firebase.auth().currentUser;
      if (user) {
        this.props.navigation.navigate("Home");
      } else {
        this.props.navigation.navigate("Initial");
      }
    });
  }

  componentWillUnmount() {
    // Call the unsubscriber if it has been set
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // Render a loading screen that is seen while fetching user token
  render() {
    return (
      <SafeAreaView>
        <Text>Loading</Text>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

export default LoadingScreen;
