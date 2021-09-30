import { scaleFont } from "./mixins";

// FONT FAMILY
export const FONT_FAMILY_REGULAR = "Roboto_400Regular";
export const FONT_FAMILY_BOLD = "Roboto_700Bold";
export const FONT_FAMILY_THIN = "Roboto_300Light";
export const FONT_FAMILY_BLACK = "Roboto_900Black";

// FONT WEIGHT
export const FONT_WEIGHT_REGULAR = "400";
export const FONT_WEIGHT_BOLD = "700";
export const FONT_WEIGHT_THIN = "300";
export const FONT_WEIGHT_BLACK = "900";

// FONT SIZE
export const FONT_SIZE_LARGE = scaleFont(34); //FONT_SIZE_16 = scaleFont(16);
export const FONT_SIZE_MEDIUM_LARGE = scaleFont(30);
export const FONT_SIZE_MEDIUM = scaleFont(20); //FONT_SIZE_14 = scaleFont(14);
export const FONT_SIZE_SMALL = scaleFont(16); //FONT_SIZE_12 = scaleFont(12);
export const FONT_SIZE_TINY = scaleFont(13);

// LINE HEIGHT
export const LINE_HEIGHT_24 = scaleFont(24);
export const LINE_HEIGHT_20 = scaleFont(20);
export const LINE_HEIGHT_16 = scaleFont(16);

// FONT STYLE
export const FONT_REGULAR = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
};

export const FONT_BOLD = {
  fontFamily: FONT_FAMILY_BOLD,
  fontWeight: FONT_WEIGHT_BOLD,
};

export const FONT_THIN = {
  fontFamily: FONT_FAMILY_THIN,
  fontWeight: FONT_WEIGHT_THIN,
};

export const FONT_BLACK = {
  fontFamily: FONT_FAMILY_BLACK,
  fontWeight: FONT_WEIGHT_BLACK,
};
