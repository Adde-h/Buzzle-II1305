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
import CompleteChallengeScreen from "_scenes/completechallenge";

const SummaryNavigatorConfig = {
  initialRouteName: "Summary", // Sets default screen of the stack (using keys in RouteConfigs)
  header: null, // Used to display a customized header
  headerMode: "none", // No header will be rendered
};

const RouteConfigs = {
  Complete: {
    screen: CompleteChallengeScreen,
  },
  Summary: {
    screen: ChallengeSummaryScreen,
  },
};

const SummaryNavigator = createStackNavigator(
  RouteConfigs,
  SummaryNavigatorConfig
);

export default SummaryNavigator;
