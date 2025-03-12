import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { OrgBottomTab } from "@/components/OrgBottomTab";
import { Icon1, Icon2} from "@/assets/icons/OrgBottomTabIcons";
import { View } from "react-native";
import { Platform } from "react-native";

const TabLayout = () => {
  return (
    <View className={`flex-1 ${Platform.OS === 'ios' ? 'pt-12' : ''}  bg-black`}>
      <Tabs tabBar={(props) => <OrgBottomTab {...props} />}>
        <Tabs.Screen
          name="org-home"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Icon2 color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="org-profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => <MaterialIcons name="analytics" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="org-event"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => <FontAwesome6 name="circle-user" color={color} size={size} />,
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabLayout;
