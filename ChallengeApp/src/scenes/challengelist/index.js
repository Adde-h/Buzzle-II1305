/**
 * Challenge list (TEMPLATE)
 */
import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Switch,
} from "react-native";
import { database } from "../../../App";
import { DrawerActions } from "react-navigation-drawer";
import { Colors } from "_styles";

import {
  ListScreenHeaderView,
  CardBox,
  PopupModalView,
  ShadowButton,
} from "_organisms";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";


export default class ChallengeListScreen extends Component {
  /**
   * Store state of list
   */

  state = {
    loading: false,
    displayData: [],             // Change this how much you want
    originalData: [],
    modalVisible: false,
    toggleLimited: false,
    toggleUnlimited: false,
    sortingType: 0,
    isFetching: false,
  };

  onRefresh() {
    this.setState({
      isFetching: true,
    }, () => {
      this.fetchdata();
    });
  }

  // Fetch data from firestore
  fetchdata = async () => {
    console.log("[DBGET] CHALLENGELIST fetchdata");
    const challengesRef = database.collection("Challenges");

    const snapshot = await challengesRef.where("published", "==", true).orderBy("timeCreated", "desc").get();

    let documentData = [];
    const nowTime = new Date(Date.now() + 10000).getTime() / 1000;
    snapshot.docs.forEach((doc) => {
      if ((doc.data().endTime.seconds > nowTime || doc.data().endTime == "") && doc.data().nrOfQuestions != 0) {
        documentData.push(doc.data());
      }
    });

    this.setState({
      displayData: documentData,               // Change this how much you want
      originalData: documentData,       //Should never change - never update originalData after this
      loading: false,
      isFetching: false,
    });

    switch (this.state.sortingType) {
      case 1:
        this.sortName(documentData);
        break;
      case 2:
        this.sortTime(documentData);
        break;
      case 3:
        this.sortNew(documentData);
        break;
      case 4:
        this.showLimitedTime(documentData);
        break;
      case 5:
        this.showUnlimitedTime(documentData);
        break;
    }
  };

  sortTime(documentData) {
    documentData.sort((a, b) => {
      if (a.endTime == b.endTime) {
        return 0;
      } else if (a.endTime < b.endTime) {
        return 1;
      }
      return -1;
    });

    this.setState({
      displayData: documentData,
      loading: false,
      sortingType: 2,
    });
  }

  showUnlimitedTime(documentData) {
    let unlimitedDocument = [];

    documentData.forEach((document) => {
      if (document.endTime == "") {
        unlimitedDocument.push(document);
      }
    });

    this.setState({
      displayData: unlimitedDocument,
      loading: false,
      sortingType: 5,
    });
  }

  showLimitedTime(documentData) {
    let limitedDocument = [];
    const nowTime = new Date(Date.now() + 10000).getTime() / 1000;

    documentData.forEach((document) => {
      if (document.endTime.seconds > nowTime) {
        limitedDocument.push(document);
      }
    });

    this.setState({
      displayData: limitedDocument,
      loading: false,
      sortingType: 4,
    });
  }

  sortNew(documentData) {
    documentData.sort((a, b) => {
      if (a.timeCreated == b.timeCreated) {
        return 0;
      } else if (a.timeCreated < b.timeCreated) {
        return 1;
      }
      return -1;
    })

    this.setState({
      displayData: documentData,
      loading: false,
      sortingType: 3,
    });
  }

  sortName(documentData) {
    documentData.sort(function (a, b) {

      if (a.name == "" || b.name == "") {
        return -1;
      }
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    this.setState({
      displayData: documentData,
      loading: false,
      sortingType: 1,
    });
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
     this.fetchdata();
    });
  }
  
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  clickAction(item) {
    this.props.navigation.navigate("Summary", { itemId: item.id });
  }

  render() {
    const Item = ({ title, endTime, creatorUserId, address, coords, tags, nrOfSubchallenges, id }) => {

      let timeLeft;
      let location;
      let tagsComponent;


      if (address != undefined) {
        location = address;
      } else if (coords != undefined) {
        if (coords["laticoords"] != undefined && coords["longicoords"] != undefined) {
          if (coords["laticoords"] != 0 && coords["longicoords"] != 0) {    // This code reeks
            location = coords["laticoords"] + "\u00b0N, " + coords["longicoords"] + "\u00b0E";
          }
        }
      }

      if (tags != undefined && tags.length != 0 && tags != "No-Tags") {
        tagsComponent = tags.map((element) => (
          <CardBox
            key={id + "_" + (Math.random() * 100)}      // Hotfix for Children missing Key warning - Might need double check
            paddingBottom={1}
            paddingTop={1}
            paddingRight={20}
            paddingLeft={20}
            width="auto"
            textAlign="center"
            borderRadius={15}
            marginHorizontal={3}
            marginVertical={2}
            backgroundColor={Colors.BACKGROUND_WHITE}
          >
            <Text>{element}</Text>
          </CardBox>
        ));
      } else {
        tagsComponent = <Text style={styles.notags}>No tags set</Text>;
      }

      if (endTime != "") {      // We have an end time!
        const difference = +new Date(`${endTime.toDate()}`) - +new Date();
        
        if (difference > 0) {     // If end time hasn't passed
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
      }

      return (
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
          {creatorUserId != undefined ?
            <Text style={styles.subtitle}>
              <FontAwesomeIcon icon="user" size={15} /> {creatorUserId}
            </Text>
            :
            <Text style={styles.subtitle}>
              <FontAwesomeIcon icon="user" size={15} /> {"Unnamed Creator"}
            </Text>
          }
          <Text style={styles.timeRem}>
            <FontAwesomeIcon icon="question-circle" size={15} /> Number of subchallenges: {nrOfSubchallenges}
          </Text>
          {timeLeft != undefined ?
            <Text style={styles.timeRem}>
              <FontAwesomeIcon icon="clock" size={15} /> {timeLeft.days} days{" "}
              {timeLeft.hours} hours {timeLeft.minutes} minutes
            </Text>
            :
            <Text style={styles.timeRem}>
              <FontAwesomeIcon icon="clock" size={15} /> No time limit
            </Text>
          }
          {location != undefined ?
            <Text style={styles.timeRem}>
              <FontAwesomeIcon icon="map-marker-alt" size={15} /> {location}
            </Text>
            :
            <Text style={styles.timeRem}>
              <FontAwesomeIcon icon="map-marker-alt" size={15} /> This challenge can be done anywhere
            </Text>
          }
          <View style={styles.tags}>
            <FontAwesomeIcon icon="tags" marginVertical={15}/>
            {tagsComponent}
          </View>
        </View>
      );

      //     </View>
      //   );
      // } else {
      //   return (
      //     <View style={styles.item}>
      //       <Text style={styles.title}>{title}</Text>

      //       <Text style={styles.subtitle}>
      //         <FontAwesomeIcon icon="user" size={11} /> {creatorUserId}
      //       </Text>

      //       <Text style={styles.timeRem}>
      //         <FontAwesomeIcon icon="question-circle" size={15} /> Number of
      //         subchallenges: {nrOfSubchallenges}
      //       </Text>

      //       <Text style={styles.timeRem}>
      //         <FontAwesomeIcon icon="clock" size={12} /> No End Date
      //       </Text>

      //       <View style={styles.tags}>
      //         <FontAwesomeIcon icon="tags" marginVertical={12}/>
      //         {tagsComponent}
      //       </View>
      //     </View>
      //   );
      // }
    };

    const renderItem = ({ item }) => (
      <TouchableOpacity onPress={() => this.clickAction(item)}>
        <Item
          title={item.name}
          endTime={item.endTime}
          creatorUserId={item.creatorUserId}
          tags={item.tags}
          address={item.address}
          location={item.location}
          nrOfSubchallenges={item.nrOfQuestions}
          id={item.id}
        />
      </TouchableOpacity>
    );

    if (this.state.loading) {
      return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="dodgerblue" />
        </SafeAreaView>
      );
    }

    return (
      //<SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <PopupModalView
          modalVisible={this.state.modalVisible}
          onDismiss={() =>
            this.setState({ modalVisible: !this.state.modalVisible })
          }
        >
          <Text>Show only challenges with time limit</Text>
          <Switch
            title="Limited Time"
            trackColor={{ false: "#767577", true: "#925e78" }}
            thumbColor={this.state.toggleLimited ? "#925e78" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              this.setState({ toggleUnlimited: false });
              this.setState({ toggleLimited: !this.state.toggleLimited });
              if (!this.state.toggleLimited) {
                this.showLimitedTime(this.state.originalData);
              } else {
                this.sortTime(this.state.originalData);
              }
            }}
            value={this.state.toggleLimited}
          />

          <Text>Show only challenges without time limit</Text>
          <Switch
            title="Unlimited Time"
            trackColor={{ false: "#767577", true: "#925e78" }}
            thumbColor={this.state.toggleUnlimited ? "#925e78" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              this.setState({ toggleLimited: false });
              this.setState({ toggleUnlimited: !this.state.toggleUnlimited });
              if (!this.state.toggleUnlimited) {
                this.showUnlimitedTime(this.state.originalData);
              } else {
                this.sortTime(this.state.originalData);
              }
            }}
            value={this.state.toggleUnlimited}
          />

          <ShadowButton
            title="Sort By Name"
            onPress={() => {
              this.setState({ modalVisible: !this.state.modalVisible });
              this.sortName(this.state.displayData);
            }}
          />

          <ShadowButton
            title="Sort By Time Left"
            onPress={() => {
              this.setState({ modalVisible: !this.state.modalVisible });
              this.sortTime(this.state.displayData);
            }}
          />

          <ShadowButton
            title="Sort By New"
            onPress={() => {
              this.setState({ modalVisible: !this.state.modalVisible });
              this.sortNew(this.state.displayData);
            }}
          />
        </PopupModalView>

        <ListScreenHeaderView
          backgroundColor={Colors.BACKGROUND_WHITE}
          headerBackgroundColor={Colors.DARK_PURPLE}
          barStyle={"light-content"}
          accentColor={"#fff"}
          leftOnPress={() => {
            this.props.navigation.dispatch(DrawerActions.openDrawer());
          }}
          leftIcon={"bars"}
          rightIcon={"filter"}
          rightOnPress={() => {
            this.setState({ modalVisible: !this.state.modalVisible });
          }}
        >
          <FlatList
            data={this.state.displayData}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </ListScreenHeaderView>
      </View>
      // </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    //backgroundColor: "#de9bb8",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
  },
  timeRem: {
    fontSize: 14,
  },
  header: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 14,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  notags: {
    //paddingVertical: "auto",  //style here
    paddingTop: 10,
    paddingLeft: 2,
  },
  checkbox: {
    alignSelf: "center",
  },
});
