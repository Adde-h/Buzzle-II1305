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
 import ResultScreen from "_scenes/completechallenge/completechallengeresult";
 import HomeScreen from "_scenes/home";

 const HomeNavigatorConfig = {
   initialRouteName: "Home", // Sets default screen of the stack (using keys in RouteConfigs)
   header: null, // Used to display a customized header
   headerMode: "none", // No header will be rendered
 };

 const RouteConfigs = {
   Summary: {
     screen: ChallengeSummaryScreen,
   },
   Complete: {
     screen: CompleteChallengeScreen,
   },
   Result: {
     screen: ResultScreen,
   },
   Home: {
       screen: HomeScreen,
   },
 };

 const HomeNavigator = createStackNavigator(RouteConfigs, HomeNavigatorConfig);

 export default HomeNavigator;
