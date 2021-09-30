import * as React from "react";
import { Dimensions, PixelRatio, StatusBar } from "react-native";
import { withNavigationFocus } from "react-navigation";

const WINDOW_WIDTH = Dimensions.get("window").width;
const guidelineBaseWidth = 375;

export const scaleSize = (size) => (WINDOW_WIDTH / guidelineBaseWidth) * size;

export const scaleFont = (size) => size * PixelRatio.getFontScale();

function dimensions(top, right = top, bottom = top, left = right, property) {
  let styles = {};

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin(top, right, bottom, left) {
  return dimensions(top, right, bottom, left, "margin");
}

export function padding(top, right, bottom, left) {
  return dimensions(top, right, bottom, left, "padding");
}

export function boxShadow(
  color,
  offset = { height: 2, width: 2 },
  radius = 4,
  opacity = 0.25
) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
  };
}

export const FocusAwareStatusBar = withNavigationFocus(
  ({ isFocused, ...rest }) => (isFocused ? <StatusBar {...rest} /> : null)
);
