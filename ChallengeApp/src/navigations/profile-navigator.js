/**
 * Profile-navigator
 *
 * Navigator for first time users.
 */

import { createStackNavigator } from "react-navigation-stack";

/**
 *
 * Import screens used for menu
 *
 */

import ProfileScreen from "_scenes/profile";
import NickNameScreen from "_scenes/getstarted/nickname";


const ProfileNavigatorConfig = {
  initialRouteName: "Profile", // Sets default screen of the stack (using keys in RouteConfigs)
  header: null, // Used to display a customized header
  headerMode: "none", // No header will be rendered
};

const RouteConfigs = {
  Profile: {
    screen: ProfileScreen,
  },
  Nickname: {
    screen: NickNameScreen,
    navigationOptions: {
      gestureEnabled: false,
    },
  },
};

const ProfileNavigator = createStackNavigator(
  RouteConfigs,
  ProfileNavigatorConfig
);

export default ProfileNavigator;
