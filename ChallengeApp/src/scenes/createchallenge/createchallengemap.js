import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import * as Location from "expo-location";
import { YellowButton, ShadowButton } from "_organisms";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Typography, Colors } from "_styles";


export default function App({ navigation }) {
  const [location, setLocation] = useState({
    latitude: 59.3496993433936,
    longitude: 18.070177816177978,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const lat = {location}.location["latitude"]; 
  const lng = {location}.location["longitude"];

  const saveCoords = (coords) => {
    setLocation(coords);
  };

  const [activityIndicator, setActivityIndicator] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    console.log("Location updated: ", { location });
  }

  getMyPosition = async () => {
    let location = await Location.getCurrentPositionAsync({});
    console.log("Added location with coordinates: ", location);
    setLocation(location.coords);

    getAddress();
  };

  getAddress = async () => {
    let regionName = await Location.reverseGeocodeAsync({ location }.location);
    let numbers = /^[0-9 ]+$/;

    //setSave(regionName[0].name);
    if (regionName[0].name.match(numbers) || regionName[0].name.length < 5) {
      navigation.navigate("Create", {
        latitude: location.latitude,
        longitude: location.longitude,
        address:
          regionName[0].street +
          " " +
          regionName[0].name +
          ", " +
          regionName[0].district,
      });
    } else {
      navigation.navigate("Create", {
        latitude: location.latitude,
        longitude: location.longitude,
        address: regionName[0].name + ", " + regionName[0].district,
      });
    }
  };

  return (
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
      >
        <Marker
          draggable
          coordinate={{
            latitude: 59.3496993433936,
            longitude: 18.070177816177978,
          }}
          image = {require("_assets/images/map-marker.png")}
          onDragEnd={(eventer) => {
            setLocation(eventer.nativeEvent.coordinate);
            //saveCoords(eventer.nativeEvent.coordinate);
          }}
        />
      </MapView>
      <View style={styles.indicator}>
        <ActivityIndicator size="large" animating={activityIndicator} />
      </View>
      <Text style={styles.smallFormText}>
        Drag the marker to the location of the challange (hold the marker to
        move it)
      </Text>
      <View style={styles.yellow}>
        <ShadowButton
          title="CHOOSE MY CURRENT POSITION"
          onPress={() => {
            setActivityIndicator(true);
            getMyPosition();
          }}
        >
          <FontAwesomeIcon icon="crosshairs" size={16} />
        </ShadowButton>

        <ShadowButton
          title="SAVE"
          onPress={() => {
            getAddress();
          }}
        ></ShadowButton>

        <ShadowButton
          title="GO BACK"
          onPress={() => navigation.goBack(null)}
        ></ShadowButton>
      </View>

      {/* <TouchableOpacity
        style={styles.buttonMy}
        onPress={() => {
          getMyPosition();
        }}
      >
        <Text>Choose my location</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        style={styles.buttonSave}
        onPress={() => {
          //console.log("Added location with koords: ", location);

          getAddress();
        }}
      >
        <Text>Save</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack(null)}
      >
        <Text>Go Back</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#f23535",
    padding: 7,
    width: "90%",
    bottom: "5%",
    position: "absolute",
  },
  buttonSave: {
    alignItems: "center",
    backgroundColor: "#4ba3eb",
    padding: 7,
    width: "90%",
    bottom: "10%",
    position: "absolute",
  },
  yellow: {
    bottom: "5%",
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  buttonMy: {
    alignItems: "center",
    backgroundColor: "#4ba3eb",
    padding: 7,
    width: "90%",
    bottom: "15%",
    position: "absolute",
  },
  smallFormText: {
    position: "absolute",
    color: "#000000",
    textAlign: "center",
    width: "90%",
    top: "10%",
  },
  indicator: {
    position: "absolute",
    textAlign: "center",
    top: "20%",
  },
});
