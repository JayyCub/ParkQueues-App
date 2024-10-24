import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Header from './src/Components/Rendered/CustomStatusBar'
import { colorPalette, platformStyle } from './src/styles'
import ParkPage from './src/Pages/ParkPage'
import AttractionPage from './src/Pages/AttractionPage'
import { DataProvider, useDataContext } from './src/Data/DataContext'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DestinationsList from './src/Pages/DestinationsList'
import { Ionicons } from '@expo/vector-icons'
import AccountPage from './src/Pages/AccountPage'
import FavoritesPage from './src/Pages/FavoritesPage'
import AttractionsList from './src/Pages/AttractionsList'

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
        component={ParkPage} // Dynamic title will be set in ParkPage
      />
      <PrimaryStack.Screen
        name="AttractionsList"
        component={AttractionsList}
        options={{
          headerTitle: () => <Header platform={platform} title="All Attractions" />,
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

const FavoritesStack = createNativeStackNavigator()

function FavoritesStackScreen (): React.JSX.Element {
  return (
    <FavoritesStack.Navigator screenOptions={{
      contentStyle: {
        backgroundColor: colorPalette.layer15
      },
      headerBackTitleVisible: false
    }}>
      <FavoritesStack.Screen
        name={'FavoritesHome'}
        component={FavoritesPage}
        options={{
          headerTitle: () => <Header platform={platform} title="ParkQueues" />,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: platformStyle.statusBar.bgColor
          },
          headerShadowVisible: false,
          presentation: 'card'
        }}
      />
      <FavoritesStack.Screen
        name="FavAttraction"
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
    </FavoritesStack.Navigator>
  )
}

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
      <MainNavigation />
    </DataProvider>
  )
}

function MainNavigation (): React.JSX.Element {
  const { user } = useDataContext()

  return (
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
        {user !== null &&
          <Tab.Screen name={'Favorites'} component={FavoritesStackScreen} options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star-outline" color={color} size={size} />
            )
          }}/>
        }
        <Tab.Screen name={'Account'} component={AccountStackScreen} options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          )
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}
