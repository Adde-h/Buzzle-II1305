/**
 * Serach function (TEMPLATE)
 *
 */
import React, { Component } from "react";
import { SafeAreaView, Text, BackHandler } from "react-native";
import { Header, SearchBar } from "react-native-elements";
import { HeaderBackButton } from "react-navigation-stack";

class SearchScreen extends Component {
  // Handling custom backbutton for Android
  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonPressAndroid
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonPressAndroid
    );
  }

  handleBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Home");
    return true;
  };

  state = {
    search: "",
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    return (
      <SafeAreaView>
        <Header
          leftComponent={
            <HeaderBackButton
              tintColor={"#FFF"}
              onPress={() => {
                this.props.navigation.navigate("Home");
              }}
            />
          }
          centerComponent={{
            text: "SEARCH",
            style: { color: "#fff" },
          }}
        />

        <Text>Search (COMING SOON)</Text>
        <SearchBar
          showLoading={false}
          platform={Platform.OS}
          clearIcon={true}
          onChangeText={this.updateSearch}
          onClearText={() => console.log("onClearText")}
          placeholder="COMING SOON"
          //placeholder="Search..."
          cancelButtonTitle="Cancel"
        />
      </SafeAreaView>
    );
  }
}

export default SearchScreen;
