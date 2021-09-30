/**
 * App navigator
 *
 * Navigator for the home screen
 */
import { createStackNavigator } from "react-navigation-stack";

/**
 * Import screens
 */

import CreateChallengeScreen from "_scenes/createchallenge";
import MapsScreen from "_scenes/createchallenge/createchallengemap";
import TagsScreen from "_scenes/createchallenge/createchallengetags";
import QuestionsScreen from "_scenes/createchallenge/createchallengequestion";
import SubmissionsScreen from "_scenes/createchallenge/createchallengesubmission";
import HomeScreen from "_scenes/home";

/**
 * TabNavigatorConfig
 */
const StackNavigatorConfig = {
  initialRouteName: "Home", // Routename for initial tab route on first load
  header: null, // No custom header
  headerMode: "none", // Don't display any header
};

/**
 * Create mapping from route name to route config
 * Tells the navigator what to present for that route
 */
const RouteConfigs = {
  Home: {
    screen: HomeScreen,
  },
  Create: {
    screen: CreateChallengeScreen,
    navigationOptions: {
      gestureEnabled: false,
    },
  },
  Maps: {
    screen: MapsScreen,
  },
  Tags: {
    screen: TagsScreen,
  },
  Questions: {
    screen: QuestionsScreen,
  },
  Submissions: {
    screen: SubmissionsScreen,
  },
};

const CreateChallengeNavigator = createStackNavigator(
  RouteConfigs,
  StackNavigatorConfig
);

export default CreateChallengeNavigator;
