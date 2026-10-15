import { Icon } from "expo-router";
import { NativeTabs } from "expo-router/build/native-tabs";
import { Label } from "expo-router/build/react-navigation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout(){
    return(
        <NativeTabs>
            <NativeTabs.Trigger name="Home">
                <Label>Home</Label>
                <Icon sf="house.fill"/>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="Profile">
                <Label>Profile</Label>
                <Icon sf="person.fill"/>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="Saved">
                <Label>Saved</Label>
                <Icon sf='heart.fill'/>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="Search">
                <Label>Search</Label>
                <Icon sf="magnifyingglass"/>
            </NativeTabs.Trigger>
        </NativeTabs>
    
    )
}