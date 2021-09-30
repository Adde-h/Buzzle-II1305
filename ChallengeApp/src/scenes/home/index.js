import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Header, Icon } from "react-native-elements";
import { DrawerActions } from "react-navigation-drawer";
import { addChallenge } from "../createchallenge/api";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Colors, Typography } from "_styles";
import { TransparentHeaderView, YellowButton, BottomBox } from "_organisms";
import MapView, { Callout, Marker } from "react-native-maps";
import { database } from "../../../App";
import { Button } from "react-native-elements/dist/buttons/Button";

const HomeScreen = ({ navigation }) => {
  const [array, setArray] = useState([]);

  const getCoords = () => {
    challengeRef = database.collection("Challenges");
    var arrayCoords = [];
    challengeRef.get().then((challengeSnapshot) => {
      challengeSnapshot.forEach((doc) => {
        if (doc.data().location["laticoords"] != 0) {
          arrayCoords.push({
            challengeId: doc.data()["id"],
            location: {
              latitude: doc.data().location["laticoords"],
              longitude: doc.data().location["longicoords"],
            },
            title: doc.data()["name"],
            description: doc.data()["description"],
          });
        }
      });
      setArray(arrayCoords);
    });
  };

  useEffect(() => {
    getCoords();
  }, []);

  renderMarker = () => {
    return array.map((item) => {
      return (
        <Marker
          coordinate={item.location}
          key={item.challengeId}
          description={item.description}
          title={item.title}
          image={require("_assets/images/map-marker2.png")}
        >
          <Callout
            onPress={() =>
              navigation.navigate("Summary", { itemId: item.challengeId })
            }
          >
            <View>
              <Text style={styles.smallBlack}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          </Callout>
        </Marker>
      );
    });
  };
  return (
    <TransparentHeaderView
      leftOnPress={() => {
        navigation.dispatch(DrawerActions.openDrawer());
      }}
      leftIcon="bars"
      rightOnPress={() => {
        navigation.navigate("Search");
      }}
      rightIcon="search"
      title="EXPLORE"
      backgroundColor={Colors.BACKGROUND_WHITE}
      headerBackgroundColor={Colors.DARK_PURPLE}
      barStyle={"light-content"}
      accentColor={"#fff"}
    >
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 59.3496993433936,
            longitude: 18.070177816177978,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={MapView.PROVIDER_GOOGLE}
          onPress={(e) => {
            console.log(e.nativeEvent.coordinate);
          }}
        >
          {renderMarker()}
        </MapView>
      </View>
      <BottomBox backgroundColor={Colors.WHITE} shadowColor={Colors.BLACK}>
        <YellowButton
          title="CREATE CHALLENGE"
          onPress={() => {
            const challengeId = addChallenge();
            navigation.navigate("Create", { challengeId: challengeId });
          }}
        />
      </BottomBox>
    </TransparentHeaderView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND_WHITE,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
    top: "0%",
    flex: 2,
  },
  smallBlack: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_SMALL,
    fontWeight: Typography.FONT_WEIGTH_BOLD,
    textAlign: "left",
  },
});
