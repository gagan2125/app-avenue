import React, { useEffect, useState } from 'react';
import { View, Animated as RNAnimated, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QrScan from './qr-scan';
import Attendes from './attendes';
import ScannerBottom from '@/components/ScannerBottomNavigation';

// 👇 import reanimated
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ScannerUnified() {
    const { organizerId, eventId } = useLocalSearchParams();
    const [selectedEventId, setSelectedEventId] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'scan' | 'attendes'>('scan');
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    const slideAnim = new RNAnimated.Value(activeTab === 'scan' ? 0 : -width);

    // 👇 animate horizontal view when switching tabs
    const handleTabSwitch = (tab: 'scan' | 'attendes') => {
        setActiveTab(tab);
        RNAnimated.timing(slideAnim, {
            toValue: tab === 'scan' ? 0 : -width,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    // 👇 shared value for Y-position of bottom nav
    const bottomBarTranslateY = useSharedValue(0);

    useEffect(() => {
        bottomBarTranslateY.value = withTiming(isBottomSheetOpen ? 100 : 0, {
            duration: 50,
        });
    }, [isBottomSheetOpen]);

    // 👇 animated style to slide down
    const animatedBottomStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: bottomBarTranslateY.value }],
    }));

    return (
        <View style={{ flex: 1 }}>
            <RNAnimated.View
                style={{
                    flex: 1,
                    width: width * 2,
                    flexDirection: 'row',
                    transform: [{ translateX: slideAnim }],
                }}
            >
                <View style={{ width }}>
                    <QrScan
                        organizerId={organizerId}
                        eventId={selectedEventId}
                        setSelectedEventId={setSelectedEventId}
                        setIsBottomSheetOpen={setIsBottomSheetOpen}
                        triggerOpenPlaceSheet={() => {
                            // passed from parent
                            placeBottomSheetRef.current?.open();
                        }}
                    />

                </View>
                <View style={{ width }}>
                    <Attendes
                        organizerId={organizerId}
                        eventId={selectedEventId}
                        setIsBottomSheetOpen={setIsBottomSheetOpen}
                    />

                </View>
            </RNAnimated.View>

            {/* 👇 animated bottom tab that slides down/up */}
            <Animated.View style={[animatedBottomStyle]}>
                <ScannerBottom
                    activeTab={activeTab}
                    organizerId={organizerId as string}
                    onScanPress={() => handleTabSwitch('scan')}
                    onAttendeesPress={() => handleTabSwitch('attendes')}
                />
            </Animated.View>
        </View>
    );
}
