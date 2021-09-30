/**
 * Start-navigator
 *
 * Navigator for first time users.
 */
import { createStackNavigator } from "react-navigation-stack";

// Import screens
import InitialScreen from "_scenes/login/index";
import GetStartedScreen from "_scenes/getstarted/index";
import LoginScreen from "_scenes/login/login";
import SignUpScreen from "_scenes/login/signup";
import NickNameScreen from "_scenes/getstarted/nickname";
import TutorialScreen from "_scenes/tutorial/index";
import tosScreen from "_scenes/getstarted/tos";

/**
 * Create a StackNavigatorConfig
 */
const StartNavigatorConfig = {
  initialRouteName: "Initial", // Sets default screen of the stack (using keys in RouteConfigs)
  header: null, // Used to display a customized header
  headerMode: "none", // No header will be rendered
};

/**
 * Create mapping from route name to route config
 * Tells the navigator what to present for that route
 */
const RouteConfigs = {
  Initial: InitialScreen,
  Getstarted: GetStartedScreen,
  Login: LoginScreen,
  Signup: SignUpScreen,
  Nickname: NickNameScreen,
  Tutorial: TutorialScreen,
  TOS: tosScreen,
};

/**
 * Provide a way to transition between screens where each new
 * screen is placed on top of a stack.
 *
 * New screens slide in from the right on iOS and from the bottom
 * on Android. Modal style can be configured.
 */
const StartNavigator = createStackNavigator(RouteConfigs, StartNavigatorConfig);

export default StartNavigator;
