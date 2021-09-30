/**
 * Organisms:
 * Combination of molecules/atoms that work together and form more elaborate interfaces
 */
import React from "react";

import { Typography, Spacing, Colors, Mixins } from "_styles";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import { Header, Icon } from "react-native-elements";
import { Svg, Path, } from "react-native-svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

/***************************************
         [Header views/containers]
  **************************************/

/**
 *
 * @param {function} leftOnPress function for left header item
 * @param {String} leftIcon icon for left header item
 * @param {function} rightOnPress function for right header item
 * @param {String} rightIcon icon for left header item
 * @param {String} title title for the header
 * @param {String} backgroundColor backgroundcolor for screen
 * @param {String} headerBackgroundColor backgroundcolor for header
 * @param {String} barStyle light-content or dark-content
 * @param {String} accentColor color of header items and text
 */
export const HeaderAndStatusBar = (props) => {
  //let leftIcon;
  /*if(props.leftIcon) {
     leftIcon = <FontAwesomeIcon icon={props.leftIcon} color={props.accentColor || Colors.WHITE} onPress={props.leftOnPress}/>;
   } else {
     leftIcon = <></>
   }*/
  let leftMenuItem = <></>;
  if (props.leftIcon) {
    leftMenuItem = (
      <FontAwesomeIcon
        size={props.iconSize || 30}
        icon={props.leftIcon}
        color={props.accentColor || Colors.WHITE}
        onPress={props.leftOnPress}
      />
    );
  }

  let rightMenuItem = <></>;
  if (props.rightIcon) {
    rightMenuItem = (
      <FontAwesomeIcon
        size={props.iconSize || 20}
        icon={props.rightIcon}
        color={props.accentColor || Colors.WHITE}
        onPress={props.rightOnPress}
      />
    );
  }

  return (
    <View style={styles.root} backgroundColor={props.backgroundColor}>
      <Mixins.FocusAwareStatusBar
        barStyle={props.barStyle}
        backgroundColor={props.headerBackgroundColor || "light-content"}
      />
      <Header
        leftComponent={leftMenuItem}
        centerComponent={{
          text: props.title,
          style: [
            styles.centerBarText,
            { color: props.accentColor || Colors.WHITE },
          ],
        }}
        rightComponent={rightMenuItem}
        backgroundColor={props.headerBackgroundColor}
        style={styles.box}
      />
      {props.children}
    </View>
  );
};

/**
 *
 * @param {function} leftOnPress function for left header item
 * @param {String} leftIcon icon for left header item
 * @param {function} rightOnPress function for right header item
 * @param {String} rightIcon icon for left header item
 * @param {String} title title for the header
 * @param {String} backgroundColor backgroundcolor for screen
 * @param {String} headerBackgroundColor backgroundcolor for header
 * @param {String} barStyle light-content or dark-content
 * @param {String} accentColor color of header items and text
 *
 * @param {String} bottomHeight The height of the bottom form
 */
export const HeaderWithStatusBarView = (props) => {
  return (
    <HeaderAndStatusBar
      leftOnPress={props.leftOnPress}
      leftIcon={props.leftIcon}
      rightOnPress={props.rightOnPress}
      rightIcon={props.rightIcon}
      title={props.title}
      backgroundColor={props.backgroundColor}
      headerBackgroundColor={props.headerBackgroundColor}
      barStyle={props.barStyle}
      accentColor={props.accentColor}
    >
      <CorneredBottom
        bottomHeight={props.bottomHeight || 0}
        backgroundColor={props.headerBackgroundColor}
      />
      <View
        style={[styles.container, { backgroundColor: props.backgroundColor }]}
      >
        {props.children}
      </View>
    </HeaderAndStatusBar>
  );
};

/**
 *
 * @param {function} leftOnPress function for left header item
 * @param {String} leftIcon icon for left header item
 * @param {function} rightOnPress function for right header item
 * @param {String} rightIcon icon for left header item
 * @param {String} title title for the header
 * @param {String} backgroundColor backgroundcolor for screen
 * @param {String} headerBackgroundColor backgroundcolor for header
 * @param {String} barStyle light-content or dark-content
 * @param {String} accentColor color of header items and text
 *
 * @param {String} onChangeText The onchangetext function of the searchfield
 * @param {String} value The value of the searchfield
 * @param {String} placeholder The placeholder of the searchfield
 * @param {String} inputWidth The width of the searchfield in percent
 */
export const ListScreenHeaderView = (props) => {
  return (
    <HeaderAndStatusBar
      leftOnPress={props.leftOnPress}
      leftIcon={props.leftIcon}
      rightOnPress={props.rightOnPress}
      rightIcon={props.rightIcon}
      title={props.title}
      backgroundColor={props.backgroundColor}
      headerBackgroundColor={props.headerBackgroundColor}
      barStyle={props.barStyle}
      accentColor={props.accentColor}
    >
      <CorneredBottom
        bottomHeight={80}
        backgroundColor={props.headerBackgroundColor}
      >
        <SingleRowTextInput
          width={props.inputWidth || "75%"}
          onChangeText={props.onChangeText}
          value={props.value}
          placeholder={props.placeholder || "Search here (COMING SOON)"}
        />
      </CorneredBottom>
      <View
        style={[styles.container, { backgroundColor: props.backgroundColor }]}
      >
        {props.children}
      </View>
    </HeaderAndStatusBar>
  );
};

/**
 *
 * @param {function} leftOnPress function for left header item
 * @param {String} leftIcon icon for left header item
 * @param {function} rightOnPress function for right header item
 * @param {String} rightIcon icon for left header item
 * @param {String} title title for the header
 * @param {String} backgroundColor backgroundcolor for screen
 */
export const TransparentHeaderView = (props) => {
  return (
    <HeaderAndStatusBar
      leftOnPress={props.leftOnPress}
      leftIcon={props.leftIcon}
      rightOnPress={props.rightOnPress}
      rightIcon={props.rightIcon}
      title={props.title}
      backgroundColor={props.backgroundColor}
      headerBackgroundColor={"transparent"}
      barStyle={"dark-content"}
      accentColor={Colors.BLACK}
    >
      <View
        style={[styles.container, { backgroundColor: props.backgroundColor }]}
      >
        {props.children}
      </View>
    </HeaderAndStatusBar>
  );
};

/**
 * Used to add a bended area below the header, for example to use with
 * searchbar.
 *
 * @param {String} backgroundColor Use same background as for the header
 */
export const CorneredBottom = (props) => {
  return (
    <View
      style={styles.box}
      height={props.bottomHeight}
      backgroundColor={props.backgroundColor}
    >
      {props.children}
    </View>
  );
};

/***************************************
             [Custom buttons]
  **************************************/

/**
 * Buttons
 *
 * Usage: <BlackButton title="ADD COLLECTION" width="90%" />
 *        <RedButton title="ADD COLLECTION" width="90%" />
 *        <YellowButton title="ADD COLLECTION" width="90%" />
 *        <PurpleButton title="ADD COLLECTION" width="90%" />
 *        <WhiteButton title="ADD COLLECTION" width="90%" />
 *
 * @param {String} title text to display on the button
 * @param {function} onPress function to call on press of the button
 * @param {String} width set the width of the button, 75% by default
 */
export const YellowButton = (props) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Colors.ORANGE }]}
      onPress={props.onPress}
      {...props}
    >
      {props.children}
      <Text style={[styles.buttonText, { color: Colors.BLACK }]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export const RedButton = (props) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Colors.RED }]}
      onPress={props.onPress}
      {...props}
    >
      {props.children}
      <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export const PurpleButton = (props) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Colors.DARK_PURPLE }]}
      onPress={props.onPress}
      {...props}
    >
      {props.children}
      <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export const BlackButton = (props) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Colors.BLACK }]}
      onPress={props.onPress}
      {...props}
    >
      {props.children}
      <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export const WhiteButton = (props) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Colors.BACKGROUND_WHITE }]}
      onPress={props.onPress}
      {...props}
    >
      {props.children}
      <Text style={[styles.buttonText, { color: Colors.BLACK }]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export const ShadowButton = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.button,
        styles.shadowBox,
        { backgroundColor: Colors.WHITE },
      ]}
      shadowColor={Colors.BLACK}
      {...props}
    >
      {props.children}
      <Text style={[styles.buttonText, { color: Colors.BLACK }]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

/***************************************
             [Form controls]
  **************************************/

/**
 * Use to create a normal text input
 *
 * Example:
 *    <SingleRowTextInput
 *       onChangeText={changeCname}
 *       value={cname}
 *       placeholder="Challenge Name"
 *    />
 *
 */
export const SingleRowTextInput = (props) => {
  return (
    <TextInput
      placeholderTextColor={"#757575"}
      style={styles.standardtextinput}
      {...props}
    />
  );
};

/**
 * Use to create a multiline text input
 *
 * Example:
 *    <MultiRowTextInput
 *       onChangeText={changeCdesc}
 *       value={cdesc}
 *       placeholder="Description of Challenge"
 *    />
 *
 */
export const MultiRowTextInput = (props) => {
  return (
    <TextInput
      placeholderTextColor={"#757575"}
      multiline={true}
      style={styles.multitextinput}
      {...props}
    />
  );
};

/**
 * Used as a normal text input with a dark background
 *
 * Example:
 *    <DarkSingleRowTextInput
 *       onChangeText={changeCans}
 *       value={cans}
 *       placeholder="Correct answer for the challenge"
 *    />
 */
export const DarkSingleRowTextInput = (props) => {
  return (
    <TextInput
      placeholderTextColor={"#606060"}
      style={styles.darkstandardtextinput}
      {...props}
    />
  );
};


/**
 * Requried form input description row
 */
export const RequiredFormDescription = (props) => {
  return (
    <Text style={styles.formdescriptionrow}>
      {props.children}<Text style={{color: "red"}}>*</Text>
    </Text>
  );
} 

export const ErrorRow = (props) => {
  return (
  <Text style={styles.errorrow}>
      {props.message}
  </Text>
  );
}

/**
 * Required props of switchRow:
 *  title, value
 */
export const SwitchRow = (props) => {
  return (
    <View style={{width: "90%", height: 50,}}>
      <Text style={[styles.formdescriptionrow, 
        { marginLeft: 5, 
          paddingTop: 10,
          alignSelf: "flex-start",
          color: "black",
          fontFamily: Typography.FONT_FAMILY_BLACK,
          fontWeight: Typography.FONT_WEIGHT_BLACK,
        }]}>{props.title}</Text>
    <Switch
            style={{
              alignSelf: "flex-end",
              marginTop: -20,
            }}
            trackColor={{ false: "#A0A0A0", true: "#B17E98" }}
            thumbColor={props.value ? "#925E78" : "#757575"}
            ios_backgroundColor="#A0A0A0"
            onValueChange={props.onValueChange}
            value={props.value}
      />
      </View>
  );
}


/***************************************
             [Bottom views]
  **************************************/

/**
 * A bended view on the bottom of the screen
 *
 * @param {String} backgroundColor the background color of the box, red by default
 * @param {String} shadowColor set to black to enable boxshadow
 */
export const BottomBox = (props) => {
  return (
    <View
      style={[styles.bottombox, styles.shadowBox]}
      shadowColor={props.shadow || "transparent"}
      {...props}
    >
      {props.children}
    </View>
  );
};

/**
 * Rounded svg bottom for initial screen
 */
export const ShapedBottomBox = (props) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
<Svg width={Dimensions.get('window').width+10} 
     height={0.5*Dimensions.get('window').width+10} 
     viewBox="0 0 375 188" 
     fill="none"
     style={{ bottom: -50 }}>
<Path d="M185.579 108.75C155.763 158.383 49.4365 147.911 0 136.471V187.5H375V0C361.168 9.53363 339.058 34.953 295 51.833C228 77.5027 222.848 46.7077 185.579 108.75Z" fill="#F05365"/>
</Svg>

      <View
        style={{
          backgroundColor: "#F05365",
          padding: 100,

          paddingLeft: 30,
          paddingRight: 30,

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.children}
      </View>
    </View>
  );
};

/**
 * Card box
 *
 * width: 90% by default
 * shadow: transparent by default, set color of shadow
 */
export const CardBox = (props) => {
  return (
    <View
      style={[styles.cardbox, styles.shadowBox]}
      width={props.width || "90%"}
      shadowColor={props.shadow || "transparent"}
      {...props}
    >
      {props.children}
    </View>
  );
};

/**
  * Modal view
  * 
  * Usage:
  * 
  * const [modalVisible, setModalVisible] = useState(false);
  * 
  * <PopupModalView modalVisible={modalVisible} onDismiss={() => setModalVisible(!modalVisible)}>
  * ...
  * <PopupModalView/>
  * 
  * Open modal with:
  * <PurpleButton title="OPEN MODAL" onPress={() => {setModalVisible(true);}} />
  * 
  *
  * Example:
  
       <PopupModalView modalVisible={modalVisible} onDismiss={() => setModalVisible(!modalVisible)}>
         <Text style={styles.masterText}>Add task</Text>
         <Text style={styles.smallFormText}>Automatically corrected task</Text>
         <ShadowButton title="ADD QUESTION" onPress={() => {
               setModalVisible(!modalVisible);
               setNrOfQuestions(nrOfQuestions + 1);
               navigation.navigate("Questions", { challengeID: challengeID });
             }} />
         <Text style={styles.smallFormText}>Manually corrected task</Text>
         <ShadowButton title="ADD SUBMISSION" />
       </PopupModalView>
  * 
  */
export const PopupModalView = (props) => {
  return (
    <Modal
      backdropOpacity={props.backdropOpacity || 0.3}
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onDismiss}
      onDismiss={props.onDismiss}
      {...props}
    >
      <TouchableWithoutFeedback onPress={props.onDismiss}>
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView} onStartShouldSetResponder={() => true}>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
                width: "100%",
                marginTop: -15,
              }}
            >
              <FontAwesomeIcon
                size={25}
                icon="times"
                color={Colors.BLACK}
                onPress={props.onDismiss}
              />
            </View>
            {props.children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

/***************************************
             [Stylesheet]
  **************************************/

const styles = StyleSheet.create({
  /**
   * Header styling
   */

  centerBarText: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    fontSize: Typography.FONT_SIZE_SMALL,
    marginTop: 5,
  },
  root: {
    flex: 1,
  },
  box: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    top: -2,

    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },

  /**
   * Buttons styling
   */
  button: {
    alignItems: "center",
    padding: 7,
    width: "90%",
    minWidth: 200,
    height: 50,
    margin: 5,
    justifyContent: "center",
    borderRadius: 16,
  },

  buttonText: {
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
    fontSize: Typography.FONT_SIZE_TINY,
  },

  /**
   * Forms styling
   */
  standardtextinput: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_REGULAR,
    fontSize: Typography.FONT_SIZE_TINY,

    color: Colors.BLACK,
    fontSize: 15,
    backgroundColor: Colors.WHITE,
    margin: 5,
    width: "90%",
    padding: 15,
    borderRadius: 16,
    height: 50,
  },

  multitextinput: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_REGULAR,
    fontSize: Typography.FONT_SIZE_TINY,
    color: Colors.BLACK,

    backgroundColor: Colors.WHITE,
    margin: 5,
    width: "90%",
    height: "10%",
    minHeight: 50,
    minWidth: 200,
    padding: 15,
    paddingTop: 15,

    textAlignVertical: "top",
    borderRadius: 16,
  },

  darkstandardtextinput: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_REGULAR,
    fontSize: Typography.FONT_SIZE_TINY,

    color: Colors.BLACK,
    fontSize: 15,
    backgroundColor: "#E5E5E5",
    margin: 5,
    width: "90%",
    padding: 15,
    borderRadius: 16,
    height: 50,
  },

  errorrow: {
    color: "red",
    textAlign: "left",
    width: "90%",
    marginLeft: 25,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },

  formdescriptionrow: {
    color: "black",
    textAlign: "left",
    width: "90%",
    marginLeft: 25,
    fontFamily: Typography.FONT_FAMILY_BLACK,
    fontWeight: Typography.FONT_WEIGHT_BLACK,
  },

  /**
   * Bottom box styles
   */
  bottombox: {
    backgroundColor: Colors.RED,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    bottom: 0,

    paddingBottom: 20,
    paddingTop: 20,

    paddingLeft: 30,
    paddingRight: 30,

    alignItems: "center",
    justifyContent: "center",
  },

  shadowBox: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  cardbox: {
    backgroundColor: Colors.RED,

    borderRadius: 30,

    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,

    alignItems: "center",
    justifyContent: "center",
  },

  /**
   * Modal popup
   */

  modalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%",
    margin: 20,
    backgroundColor: Colors.BACKGROUND_WHITE,

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    position: "absolute",
    bottom: -20,
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalButtonOpen: {
    backgroundColor: "#F194FF",
  },
  modalButtonClose: {
    backgroundColor: "#2196F3",
  },
  modalTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

/***************************************
             [EXAMPLE CODE]
  **************************************/

/**
   import { ListScreenHeaderView, BottomBox } from '_organisms'
   import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
   <ListScreenHeaderView
       navigation={navigation}
       leftOnPress={() => {
         navigation.dispatch(DrawerActions.openDrawer());
       }}
       leftIcon="menu"
       rightOnPress={() => {
         navigation.navigate("Search");
       }}
       rightIcon="search"
       title="EXPLORE"
       backgroundColor={Colors.BACKGROUND_WHITE}
       headerBackgroundColor={Colors.DARK_PURPLE}
       barStyle={"light-content"}
       accentColor={"#fff"}
       placeholder={"Search here plz"}
       >
     <Text style={styles.text}>HOME (TEMPLATE)</Text>
       <View style={{
         flex:1,
         flexDirection:'row',
         alignItems:'center',
         alignSelf: "stretch",
       }}>
         
         
       <View style={{
         width: '100%',
         height: '30%',
         justifyContent: 'stretch',
         alignItems: 'stretch',
         alignSelf: "stretch",
       }}>
       <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Hello')}>
       <Text>TEST</Text>
       </TouchableOpacity>
     </View>
     
     
       <FontAwesomeIcon icon="arrows-alt-v" />
       <FontAwesomeIcon icon="search" />
     </View>
     <BottomBox backgroundColor={Colors.RED} shadowColor={Colors.BLACK}>
       <BlackButton title="ADD COLLECTION" width="90%" />
     </BottomBox>
   </ListScreenHeaderView>
  */

/**
  * Buttons example
  
 <View style={styles.container}>
     <YellowButton title="ADD COLLECTION" />
     <RedButton title="ADD COLLECTION" />
     <PurpleButton title="ADD COLLECTION" />
     <BlackButton title="ADD COLLECTION" />
     <WhiteButton title="ADD COLLECTION" />
 </View>
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: mainColor,
   },
  */

/**
  * Buttons and header
  * 
  * <TransparentHeaderView navigation={this.props.navigation}
       leftOnPress={() => {
         this.props.navigation.navigate("Create");
       }}
       leftIcon="home"
       title="EXPLORE"
       backgroundColor={Colors.BACKGROUND_WHITE}
       headerBackgroundColor={Colors.DARK_PURPLE}
       barStyle={"light-content"}
       accentColor={"#fff"}>
       <View style={styles.container}>
       <YellowButton title="ADD COLLECTION" />
       <RedButton title="ADD COLLECTION" />
       <PurpleButton title="ADD COLLECTION" />
       <BlackButton title="ADD COLLECTION" />
       <WhiteButton title="ADD COLLECTION" />
       </View>
       </TransparentHeaderView>
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: Colors.BACKGROUND_WHITE,
   },
  */
