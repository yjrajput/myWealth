import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect } from 'expo-router'
import { useAuth } from '@clerk/expo'

const index = () => {
  const {isSignedIn, isLoaded} = useAuth();

  if(!isLoaded) return null;
  if(isSignedIn) return <Redirect href='/(root)/(tabs)/Home'/>

  return <Redirect href='/(auth)/sing-up'/>
}

export default index