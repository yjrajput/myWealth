import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/expo'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const profile = () => {
  const {signOut} = useAuth();
  const router = useRouter();

  const handleOnSingOut = async () =>{
    try{
      await signOut();
      router.replace("/sing-in");
    }catch(error){
      console.log("Error singin out:", error)
    }
  }
  return (
    <SafeAreaView className='mt-10'>
      <TouchableOpacity onPress={handleOnSingOut}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default profile