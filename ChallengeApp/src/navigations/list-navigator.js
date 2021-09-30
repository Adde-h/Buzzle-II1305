/**
 * List-navigator
 *
 * Navigator for first time users.
 */

import { createStackNavigator } from "react-navigation-stack";

/**
 *
 * Import screens used for menu
 *
 */
import ChallengeSummaryScreen from "_scenes/challengesummary";
import ChallengeListScreen from "_scenes/challengelist";
import CompleteChallengeScreen from "_scenes/completechallenge";
import ResultScreen from "_scenes/completechallenge/completechallengeresult";

const ListNavigatorConfig = {
  initialRouteName: "List", // Sets default screen of the stack (using keys in RouteConfigs)
  header: null, // Used to display a customized header
  headerMode: "none", // No header will be rendered
};

const RouteConfigs = {
  List: {
    screen: ChallengeListScreen,
  },
  Summary: {
    screen: ChallengeSummaryScreen,
  },
  Complete: {
    screen: CompleteChallengeScreen,
  },
  Result: {
    screen: ResultScreen,
  },
};

const ListNavigator = createStackNavigator(RouteConfigs, ListNavigatorConfig);

export default ListNavigator;
