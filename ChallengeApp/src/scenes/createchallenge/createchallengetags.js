// Tags-function courtesy of Expo
import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import {
  TransparentHeaderView,
  YellowButton,
  PurpleButton,
  RedButton,
  SingleRowTextInput,
  MultiRowTextInput,
  PopupModalView,
  ShadowButton,
} from "_organisms";
import TagInput from "react-native-tags-input";
import { Typography, Colors } from "_styles";
import { StatusBar } from "expo-status-bar";

const mainColor = Colors.BACKGROUND_WHITE;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: {
        tag: "",
        tagsArray: [],
      },
      suggestions: [],
      tagsColor: "#fff",
      tagsText: "#fff",
    };
  }

  updateTagState = (state) => {
    this.setState(
      {
        tags: state,
      },
      () => {
        this.updateSuggestionState(state);
      }
    );
  };

  updateSuggestionState = (state) => {
    if (state.tag === "") {
      return;
    }

    // Replace this with a callback from a search in your database
    let suggestionsArr = [
      "KTH",
      "STOCKHOLM",
      "KISTA",
      "CINTE",
      "MATH",
      "PHYSICS",
      "PROGRAMMING",
    ];
    let tempSuggestions = []; //
    //
    for (let i = 0; i < suggestionsArr.length; i++) {
      //
      if (suggestionsArr[i].startsWith(state.tag) === true) {
        // Replace this with database search result which will be
        tempSuggestions.push(suggestionsArr[i]); // added to the tempSuggestions-array.
      } //
    }
    if (tempSuggestions.length > 0) {
      this.setState({
        suggestions: tempSuggestions,
      });
    } else {
      this.setState({
        suggestions: [],
      });
    }
  };

  renderSuggestions = () => {
    if (this.state.suggestions.length > 0) {
      return this.state.suggestions.map((item, count) => {
        return (
          <TouchableHighlight
            onPress={() => this.onSuggestionClick(item)}
            key={count}
            style={{ backgroundColor: "white", padding: 2 }}
          >
            <Text>{item}</Text>
          </TouchableHighlight>
        );
      });
    } else {
      return null;
    }
  };

  onSuggestionClick = (suggestion) => {
    let state = this.state.tags;

    state.tagsArray.push(suggestion);

    this.setState({
      tags: {
        tag: "",
        tagsArray: state.tagsArray,
      },
      suggestions: [],
    });
  };

  render() {
    const tags = this.state.tags.tagsArray;

    return (
      <TransparentHeaderView
        backgroundColor={Colors.BACKGROUND_WHITE}
        headerBackgroundColor={Colors.DARK_PURPLE}
        barStyle={"light-content"}
        accentColor={"#fff"}
      >
        <Text style={styles.masterText}>Add Tags to Challenge</Text>
        <StatusBar style="auto" />
        <View style={styles.container}>
          <TagInput
            updateState={this.updateTagState}
            tags={this.state.tags}
            placeholder="Tags..."
            label="Press enter to add a tag"
            labelStyle={{
              color: "#000000",
              textAlign: "left",
              width: "90%",
              marginLeft: 4,
              fontFamily: Typography.FONT_FAMILY_BLACK,
              fontWeight: Typography.FONT_WEIGHT_BLACK,
            }}
            leftElement={
              <Icon
                name={"tag-multiple"}
                type={"material-community"}
                color={this.state.tagsText}
              />
            }
            leftElementContainerStyle={{ marginLeft: 3 }}
            containerStyle={{ width: Dimensions.get("window").width - 40 }}
            inputContainerStyle={[
              styles.textInput,
              { backgroundColor: this.state.tagsColor },
            ]}
            inputStyle={{ color: this.state.tagsText }}
            onFocus={() =>
              this.setState({ tagsColor: "#fff", tagsText: "black" })
            }
            onBlur={() =>
              this.setState({ tagsColor: "#fff", tagsText: "black" })
            }
            autoCapitalize={"characters"}
            customElement={<View>{this.renderSuggestions()}</View>}
            tagStyle={styles.tag}
            tagTextStyle={styles.tagText}
            keysForTag={", "}
          />

          <PurpleButton
            title="CHOOSE TAGS"
            onPress={() => {
              this.props.navigation.navigate("Create", { tags: tags });
            }}
          ></PurpleButton>
          <PurpleButton
            title="GO BACK"
            onPress={() => this.props.navigation.goBack(null)}
          ></PurpleButton>
        </View>
      </TransparentHeaderView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: mainColor,
    marginBottom: 80,
  },
  textInput: {
    height: 40,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    padding: 3,
  },
  tag: {
    backgroundColor: "#fff",
  },
  tagText: {
    color: "black",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 7,
    width: "90%",
    margin: 5,
  },
  masterText: {
    color: "#000000",
    fontSize: 30,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
    textAlign: "center",
  },
});
