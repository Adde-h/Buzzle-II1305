/**
 * Home navigator
 * Drawer menu for home meny containing multiple screens
 */

import { createDrawerNavigator } from "react-navigation-drawer";

/**
 *
 * Import screens used for drawer menu
 *
 */
import HomeScreen from "_scenes/home";
import AboutScreen from "_scenes/about";
import ChallengeListScreen from "_scenes/challengelist";
import ProfileScreen from "_scenes/profile";

/**
 * DrawerNavigatorConfig
 */
const DrawerNavigatorConfig = {
  initialRouteName: "Home", // Routename for initial tab route on first load
  header: null, // No custom header
  headerMode: "none", // Don't display any header
  hideStatusBar: true,
};

const RouteConfigs = {
  Home: {
    screen: HomeScreen,
  },
  About: {
    screen: AboutScreen,
  },
  List: {
    screen: ChallengeListScreen,
  },
  Profile: {
    screen: ProfileScreen,
  },
};

/**
 * Create a navigation with drawer menu on the bottom of the screen
 * that lets you switch between different routes.
 *
 * Screen components are not mounted until focused for the first time
 */
const MenuNavigator = createDrawerNavigator(
  RouteConfigs,
  DrawerNavigatorConfig
);

export default MenuNavigator;
