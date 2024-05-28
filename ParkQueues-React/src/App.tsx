import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Header from './Components/CustomStatusBar'
import { colorPalette, platformStyle } from './styles'
import ParkPage from './Pages/ParkPage'
import AttractionPage from './Pages/AttractionPage'
import { DataProvider } from './Data/DataContext'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DestinationsList from './Pages/DestinationsList'
import { Ionicons } from '@expo/vector-icons'
// import SettingsPage from './Pages/SettingsPage'
import AccountPage from './Pages/AccountPage'

const platform = Platform.OS
const Tab = createBottomTabNavigator()

const PrimaryStack = createNativeStackNavigator()

function PrimaryStackScreen (): React.JSX.Element {
  return (
    <PrimaryStack.Navigator screenOptions={{
      contentStyle: {
        backgroundColor: colorPalette.layer15
      },
      headerBackTitleVisible: false
    }}>
      <PrimaryStack.Screen
        name="Destinations"
        component={DestinationsList}
        options={{
          headerTitle: () => <Header platform={platform} title="ParkQueues" />,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: platformStyle.statusBar.bgColor
          },
          headerShadowVisible: true,
          presentation: 'card'
        }}
      />
      <PrimaryStack.Screen
        name="Park"
        component={ParkPage}
        options={{
          headerTitle: () => <Header platform={platform} title="View Attractions" />,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: platformStyle.statusBar.bgColor
          },
          headerShadowVisible: false,
          presentation: 'card'
        }}
      />
      <PrimaryStack.Screen
        name="Attraction"
        component={AttractionPage}
        options={{
          headerTitle: () => <Header platform={platform} title="View Attraction" />,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: platformStyle.statusBar.bgColor
          },
          headerShadowVisible: false,
          presentation: 'card'
        }}
      />
    </PrimaryStack.Navigator>
  )
}

/* const SettingsStack = createNativeStackNavigator()

function SettingsStackScreen (): React.JSX.Element {
  return (
    <SettingsStack.Navigator screenOptions={{
      contentStyle: {
        backgroundColor: colorPalette.layer15
      },
      headerBackTitleVisible: false
    }}>
      <SettingsStack.Screen
        name={'SettingsHome'}
        component={SettingsPage}
        options={{
          headerTitle: () => <Header platform={platform} title="ParkQueues" />,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: platformStyle.statusBar.bgColor
          },
          headerShadowVisible: true,
          presentation: 'card'
        }}
      />
    </SettingsStack.Navigator>
  )
} */

const AccountStack = createNativeStackNavigator()

function AccountStackScreen (): React.JSX.Element {
  return (
    <AccountStack.Navigator screenOptions={{
      contentStyle: {
        backgroundColor: colorPalette.layer15
      },
      headerBackTitleVisible: false
    }}>
      <AccountStack.Screen
        name={'AccountHome'}
        component={AccountPage}
        options={{
          headerTitle: () => <Header platform={platform} title="ParkQueues" />,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: platformStyle.statusBar.bgColor
          },
          headerShadowVisible: true,
          presentation: 'card'
        }}
      />
    </AccountStack.Navigator>
  )
}

export default function App (): React.JSX.Element {
  return (
    <DataProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{
          tabBarStyle: {
            backgroundColor: platformStyle.statusBar.bgColor
            // height: 80
          },
          tabBarLabelStyle: {
            fontFamily: platformStyle.statusBar.fontFamily,
            fontSize: 14
          }
        }}>
          <Tab.Screen name={'Home'} component={PrimaryStackScreen} options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            )
          }}/>
          {/* <Tab.Screen name={'Settings'} component={SettingsStackScreen} options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" color={color} size={size} />
            )
          }}/> */}
          <Tab.Screen name={'Account'} component={AccountStackScreen} options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" color={color} size={size} />
            )
          }}/>
        </Tab.Navigator>
      </NavigationContainer>
    </DataProvider>
  )
}
