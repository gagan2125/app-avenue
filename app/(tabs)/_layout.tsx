// import React from "react";
// import { Tabs, usePathname } from "expo-router";
// import { FontAwesome6, Ionicons } from "@expo/vector-icons";
// import { BottomTabs } from "@/components/BottomTabs";
// import { Icon1, Icon2 } from "@/assets/icons/BottomTabIcons";
// import { View } from "react-native";
// import { Platform } from "react-native";

// const TabLayout = () => {
//   const pathname = usePathname();
//   return (
//     <View className={`flex-1 ${Platform.OS === 'ios' ? 'pt-12' : ''}  bg-black`}>
//       <Tabs tabBar={(props) => <BottomTabs {...props} />}>
//         <Tabs.Screen
//           name="index"
//           options={{
//             headerShown: false,
//             tabBarStyle: { display: "none" },
//             tabBarIcon: ({ color, size }) => <Icon1 color={color} size={size} />,
//           }}
//         />
//         <Tabs.Screen
//           name="purchased-tickets"
//           options={{
//             headerShown: false,
//             tabBarIcon: ({ color, size }) => <Icon2 color={color} size={size} />,
//           }}
//         />
//         <Tabs.Screen
//           name="saved-events"
//           options={{
//             headerShown: false,
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="bookmark" color={color} size={size} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="profile"
//           options={{
//             headerShown: false,
//             tabBarIcon: ({ color, size }) => (
//               <FontAwesome6 name="circle-user" color={color} size={size} />
//             ),
//           }}
//         />
//       </Tabs>
//     </View>
//   );
// };

// export default TabLayout;

import React from "react";
import { Tabs, usePathname } from "expo-router";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { BottomTabs } from "@/components/BottomTabs";
import { Icon1, Icon2 } from "@/assets/icons/BottomTabIcons";
import { View, Platform } from "react-native";

const TabLayout = () => {
  const pathname = usePathname();

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 12 : 0, backgroundColor: "black" }}>
      <Tabs
        tabBar={(props) => (pathname === "/" ? null : <BottomTabs {...props} />)}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarStyle: { display: "none" },
            tabBarIcon: ({ color, size }) => <Icon1 color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="purchased-tickets"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Icon2 color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="saved-events"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bookmark" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome6 name="circle-user" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabLayout;

