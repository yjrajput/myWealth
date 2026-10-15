import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const singIn = () => {
  return (
    <SafeAreaView>
        <View className='flex justify-center items-center'>
      <Text className='text-xl font-bold flex justify-center items-center'>sing-in</Text>
    </View>
    </SafeAreaView>
    
  )
}

export default singIn