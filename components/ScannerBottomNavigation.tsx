import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get("window");

interface BottomTabBarProps {
  activeTab: 'scan' | 'attendes';
  organizerId: string;
  onScanPress: () => void;
  onAttendeesPress: () => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  organizerId,
  onScanPress,
  onAttendeesPress,
}) => {
  const router = useRouter();

  const TAB_WIDTH = width * 0.65;
  const INDICATOR_WIDTH = TAB_WIDTH / 2 - 14; // 👈 narrower for margin
  const translateX = useSharedValue(activeTab === 'scan' ? 0 : TAB_WIDTH / 2);

  useEffect(() => {
    translateX.value = withTiming(activeTab === 'scan' ? 0 : TAB_WIDTH / 2, { duration: 250 });
  }, [activeTab]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className="absolute flex-row items-center justify-center gap-2"
      style={{ 
        bottom: Platform.OS === 'ios' ? 40 : 30,
        left: width * 0.1,
        right: width * 0.1,
      }}
    >
      {/* Tab Container */}
      <View
        className="bg-neutral-900 rounded-full flex-row justify-around items-center h-20 relative"
        style={{ width: TAB_WIDTH, overflow: 'hidden' }}
      >
        {/* Sliding Indicator with horizontal margin */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: '10%',
              height: '80%',
              width: INDICATOR_WIDTH,
              backgroundColor: '#000',
              borderRadius: 9999,
              zIndex: 0,
              marginHorizontal: 6, // 👈 creates the gap left & right
            },
            animatedIndicatorStyle,
          ]}
        />

        {/* Tab Buttons */}
        <TouchableOpacity
          className="flex-1 z-10 items-center justify-center"
          onPress={onScanPress}
        >
          <Text className={`font-semibold text-lg ${activeTab === 'scan' ? 'text-white' : 'text-white/60'}`}>
            Scan Ticket
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 z-10 items-center justify-center"
          onPress={onAttendeesPress}
        >
          <Text className={`font-semibold text-lg ${activeTab === 'attendes' ? 'text-white' : 'text-white/60'}`}>
            Attendees
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Button */}
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/org-profile",
            params: { organizerId },
          });
        }}
        style={{
          width: 68,
          height: 68,
          borderRadius: 38,
          backgroundColor: "#1E1E1E",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="person-circle" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabBar;
