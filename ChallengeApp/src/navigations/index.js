/**
 * Root navigator
 *
 * Setup the root level navigation component
 */
import { createAppContainer, createSwitchNavigator } from "react-navigation";

// Import navigators
import StartNavigator from "./start-navigator";
import SearchNavigator from "./search-navigator";
import MenuNavigator from "./menu-navigator";
import CreateChallengeNavigator from "./create-challenge-navigator";
import ListNavigator from "./list-navigator";
import ProfileNavigator from "./profile-navigator";
import HomeNavigator from "./home-navigator";

// Import loading screen
import LoadingScreen from "_scenes/login/loading";

/**
 * Create a switchnavigator that will only show
 * one screen at a time.
 *
 * This navigator does not handle back actions and
 * it resets routes to their default state when you
 * switch away.
 */
const RootNavigator = createSwitchNavigator(
  {
    // Map keys to navigators
    OnStartLoading: LoadingScreen,
    Start: StartNavigator,
    Menu: MenuNavigator,
    Search: SearchNavigator,
    CreateChallenge: CreateChallengeNavigator,
    List: ListNavigator,
    Profile: ProfileNavigator,
    Home: HomeNavigator,
  },
  {
    // Sets default screen using key above
    initialRouteName: "OnStartLoading",
  }
);

/**
 * Here we use an Higher-Order Component to inject the
 * navigation as a root-level component
 */
export default createAppContainer(RootNavigator);
