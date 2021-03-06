import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  SplashScreen,
  Login,
  Register,
  MainScreen,
  ListContact,
  Profile,
  EditProfile,
  ChatPage,
  AddContact,
  FriendLocation,
  FriendProfile
} from '../screens/index';

const AuthNavigationStack = createStackNavigator(
  {
    Login,
    Register
  },
  {
    headerMode: 'none',
    initialRouteName: 'Login'
  }
)

const ProfileNavigationStack = createStackNavigator(
  {
    Profile,
    EditProfile
  },
  {
    headerMode: 'none',
    initialRouteName: 'Profile'
  }
)

ProfileNavigationStack.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if (routeName == 'EditProfile') {
    tabBarVisible = false
  }

  return {
    tabBarVisible,
  }
}

const BottomNavigationStack = createBottomTabNavigator(
  {
    Home: {
      screen: MainScreen,
      navigationOptions: {
        tabBarLabel: 'CHAT',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="message1" color={tintColor} size={25} />
        ),
      },
    },
    FriendLocation: {
      screen: FriendLocation,
      navigationOptions: {
        tabBarLabel: 'NEAR FRIEND',
        tabBarIcon: ({ tintColor }) => (
          <IconM name="map-marker-multiple" color={tintColor} size={25} />
        ),
      },
    },
    ListContact: {
      screen: ListContact,
      navigationOptions: {
        tabBarLabel: 'CONTACT',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="contacts" color={tintColor} size={25} />
        ),
      },
    },
    Profile: {
      screen: ProfileNavigationStack,
      navigationOptions: {
        tabBarLabel: 'PROFILE',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="user" color={tintColor} size={25} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
    tabBarOptions: {
      activeTintColor: '#FAF8ED',
      inactiveTintColor: '#A7BF2E',
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: '#2F2B32',
        paddingTop: 5,
        paddingBottom: 10,
        height: 70,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
      },
    },
  },
);

const AppNavigationStack = createStackNavigator(
  {
    BottomNavigationStack,
    ChatPage,
    AddContact,
    FriendProfile
  },
  {
    headerMode: 'none',
    initialRouteName: 'BottomNavigationStack'
  }
)


const Router = createSwitchNavigator(
  {
    SplashScreen,
    AuthNavigationStack,
    AppNavigationStack
  },
  {
    headerMode: 'none',
    initialRouteName: 'SplashScreen'
  }
)

export default createAppContainer(Router)