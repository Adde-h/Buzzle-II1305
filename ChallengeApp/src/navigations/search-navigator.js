/**
 * Search-navigator
 *
 * Navigator for first time users.
 */

import { createStackNavigator } from "react-navigation-stack";

/**
 *
 * Import screens used for menu
 *
 */
import SearchScreen from "_scenes/search";

const SearchNavigatorConfig = {
  initialRouteName: "Search", // Sets default screen of the stack (using keys in RouteConfigs)
  header: null, // Used to display a customized header
  headerMode: "none", // No header will be rendered
};

const RouteConfigs = {
  Search: SearchScreen,
};

const SearchNavigator = createStackNavigator(
  RouteConfigs,
  SearchNavigatorConfig
);

export default SearchNavigator;
