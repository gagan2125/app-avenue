import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import { StyleSheet, View, Animated } from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useBottomSheet } from '@/context/BottomSheetContext';

export function BottomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();
  const { isBottomSheetOpen } = useBottomSheet();

  if (isBottomSheetOpen) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)", "black"]}
        style={styles.wrapper}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.tabbar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <PlatformPressable
                key={route.key}
                href={buildHref(route.name, route.params)}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  backgroundColor: isFocused ? "black" : "transparent",
                }}
                className="flex flex-row justify-center items-center bg-black rounded-full h-14 w-14"
              >
                {options.tabBarIcon?.({
                  focused: isFocused,
                  color: isFocused ? '#ffffff' : '#666666',
                  size: 24,
                })}
              </PlatformPressable>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  wrapper: {
    width: "100%",
    height: 170,
    backgroundColor: "transparent",
  },
  tabbar: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    marginHorizontal: 90,
    padding: 8,
    borderRadius: 100,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 15,
    display: "flex",
    gap: 10,
  },
});
