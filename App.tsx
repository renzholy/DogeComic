import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { LogBox } from 'react-native'
import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'

import Home from './src/home'
import Search from './src/search'
import Detail from './src/detail'
import Comic from './src/comic'
import { ParamList } from './src/type'

const client = new QueryClient()

const Stack = createStackNavigator<ParamList>()

LogBox.ignoreLogs(['Setting a timer', 'Require cycle'])

const App = () => {
  return (
    <QueryClientProvider client={client}>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator screenOptions={TransitionPresets.SlideFromRightIOS}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Detail" component={Detail} />
          <Stack.Screen name="Comic" component={Comic} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

export default App
