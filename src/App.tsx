/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, Image} from 'react-native';
import {Notification, Notifications} from 'react-native-notifications';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {backgroundColor, tabColor, borderColor} from './colors';
import MatchesView from './MatchesView/MatchesView';
import TeamsView from './TeamsView/TeamsView';
import {LeagueFavoritesProvider} from '@contexts/leagueFavorites';
import {NotificationCompletion} from 'react-native-notifications/lib/dist/interfaces/NotificationCompletion'

const Tab = createBottomTabNavigator();

const App = () => {
  useEffect(() => {
    Notifications.events().registerNotificationReceivedForeground(
      (
        notification: Notification,
        completion: (response: NotificationCompletion) => void,
      ) => {
        console.log(JSON.stringify(notification.payload));

        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        completion({alert: true, sound: true, badge: false});
      },
    );
  }, [])

  const style = {
    backgroundColor: tabColor,
    borderTopColor: borderColor,
    borderTopWidth: 2,
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{flex: 0, backgroundColor: backgroundColor}} />
      <LeagueFavoritesProvider>
        <Tab.Navigator
          initialRouteName="Matches"
          tabBarOptions={{
            style,
            showLabel: false,
          }}
          screenOptions={({route}) => ({
            tabBarIcon: ({focused}) => {
              let iconName
              let opacity

              if (route.name === 'Matches') {
                opacity = focused ? 1 : 0.4;
                iconName = focused
                  ? require('../images/league-active.png')
                  : require('../images/league-inactive.png')
              } else if (route.name === 'Teams') {
                opacity = focused ? 1 : 0.4;
                iconName = focused
                  ? require('../images/team-active.png')
                  : require('../images/team-inactive.png')
              }

              return (
                <Image
                  source={iconName}
                  style={{width: 30, height: 30, opacity: opacity}}
                />
              )
            },
          })}>
          <Tab.Screen name="Matches" component={MatchesView} />
          <Tab.Screen name="Teams" component={TeamsView} />
        </Tab.Navigator>
      </LeagueFavoritesProvider>
    </NavigationContainer>
  );
}

export default App;
