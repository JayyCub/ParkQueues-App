import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './Pages/Home'
import Header from './Components/CustomStatusBar'
import { colorPalette, platformStyle } from './styles'
import DestinationPage from './Pages/DestinationPage'
import ParkPage from './Pages/ParkPage'
import AttractionPage from './Pages/AttractionPage'
import { DataProvider } from './Data/DataContext'
import { Platform } from 'react-native'

const Stack = createNativeStackNavigator()
const platform = Platform.OS

export default function App (): React.JSX.Element {
  return (
    <DataProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          contentStyle: {
            backgroundColor: colorPalette.layer15
          },
          headerBackTitleVisible: false
        }}>
          <Stack.Screen
            name="Home"
            component={Home}
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
          <Stack.Screen
            name="Destination"
            component={DestinationPage}
            options={{
              headerTitle: () => <Header platform={platform} title="Select a Park" />,
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: platformStyle.statusBar.bgColor
              },
              headerShadowVisible: false,
              presentation: 'card'
            }}
          />
          <Stack.Screen
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
          <Stack.Screen
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
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  )
}
