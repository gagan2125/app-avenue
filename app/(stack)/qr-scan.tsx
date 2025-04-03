import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Platform, ActivityIndicator, Dimensions, AppState } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import PlaceBottomSheet, { PlaceBottomSheetRef } from "@/components/EventBottomSheet";
import ScanBottomSheet, { ScanBottomSheetRef } from '@/components/ScanBottomSheet';
import axios from "axios"
import url from '@/constants/url';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, CameraView, BarcodeScanningResult } from "expo-camera";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { IconSuccess, WarningIcon } from '@/assets/icons/SavedEventsIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get("window");

const QrScan = ({
    organizerId,
    setSelectedEventId,
    setIsBottomSheetOpen
}: {
    organizerId: string;
    setSelectedEventId: (id: string) => void;
    setIsBottomSheetOpen: (value: boolean) => void;
}) => {
    const router = useRouter();
    //const { organizerId } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState<'scan' | 'attendes'>('scan');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const placeBottomSheetRef = useRef<PlaceBottomSheetRef>(null);
    const scanBottomSheetRef = useRef<ScanBottomSheetRef>(null);
    const [readyBottomSheets, setReadyBottomSheets] = useState({
        place: false,
        scan: false
    });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<{ id: string; name: string; flyer: string } | null>(null);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [scanError, setScanError] = useState(false)
    const [scanData, setScanData] = useState({})
    const [isPlaceSheetOpen, setIsPlaceSheetOpen] = useState(false);
    const [isScanSheetOpen, setIsScanSheetOpen] = useState(false);
    const [focusMode, setFocusMode] = useState<'auto' | 'close' | 'far'>('auto');
    const cameraRef = useRef<CameraView>(null);
    const [isFocusing, setIsFocusing] = useState(false);
    const [lastFocusTime, setLastFocusTime] = useState(0);
    const [appState, setAppState] = useState(AppState.currentState);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [eventStats, setEventStats] = useState({});
    const [showAlreadyScanned, setShowAlreadyScanned] = useState(false);
    const rotateAnim = useSharedValue(0); // 0° initially


    useLayoutEffect(() => {
        // Use a small delay to ensure the component is fully mounted
        const timer = setTimeout(() => {
            setReadyBottomSheets({
                place: true,
                scan: true,
            });
        }, 200);

        return () => {
            clearTimeout(timer);
            // Close any open bottom sheets on unmount
            if (placeBottomSheetRef.current) {
                placeBottomSheetRef.current.close?.();
            }
        };
    }, []);

    useEffect(() => {
        (async () => {
            console.log('🔄 Initializing camera...');
            try {
                const { status } = await Camera.requestCameraPermissionsAsync();
                console.log('📱 Camera permission status:', status);

                if (status === 'granted') {
                    if (Platform.OS === 'ios') {
                        console.log('📱 iOS: Waiting for camera system initialization...');
                        await new Promise(resolve => setTimeout(resolve, 1500));

                        const { status: cameraStatus } = await Camera.getCameraPermissionsAsync();
                        console.log('📱 iOS: Camera system status:', cameraStatus);

                        if (cameraStatus === 'granted') {
                            console.log('✅ Camera ready on iOS');
                            setHasPermission(true);
                        } else {
                            console.error('❌ Camera permission mismatch on iOS');
                            setHasPermission(false);
                        }
                    } else {
                        console.log('✅ Camera ready on Android');
                        setHasPermission(true);
                    }
                } else {
                    console.error('❌ Camera permission denied');
                    setHasPermission(false);
                }
            } catch (error) {
                console.error('❌ Camera initialization error:', error);
                setHasPermission(false);
            }
        })();
    }, []);

    const openPlaceBottomSheet = useCallback(() => {
        // 👇 1. Animate scanner bottom out
        setIsBottomSheetOpen(true);

        // 👇 2. Wait for the animation to finish
        setTimeout(() => {
            // 👇 3. Then open the sheet
            placeBottomSheetRef.current?.open();
            fetchStats();
            setIsPlaceSheetOpen(true);
        }, 100); // match duration of slide animation
    }, []);

    const openDateBottomSheet = useCallback(() => {
        console.log('🔍 Attempting to open scan bottom sheet...');
        console.log('📱 Bottom sheet ref:', scanBottomSheetRef.current);
        console.log('📱 Ready state:', readyBottomSheets.scan);
        console.log('📱 Scan data:', scanData);

        if (scanBottomSheetRef.current?.open) {
            console.log('✅ Bottom sheet open method exists');
            scanBottomSheetRef.current.open();
            setIsScanSheetOpen(true);
            console.log('✅ Bottom sheet open method called');
        } else {
            console.error('❌ Bottom sheet ref or open method not available');
        }
    }, []);

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/event/get-event-by-organizer-id/${organizerId}`);
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [organizerId])

    useEffect(() => {
        if (events.length > 0 && !selectedEvent) {
            const now = new Date();

            const upcomingEvents = events.filter((event: any) => {
                const endDate = new Date(event.start_date);
                return endDate >= now && event.explore === 'YES';
            });

            if (upcomingEvents.length > 0) {
                const firstEvent: any = upcomingEvents[0];
                const selected = { id: firstEvent._id, name: firstEvent.event_name, flyer: firstEvent.flyer };
                setSelectedEvent(selected);
                setSelectedEventId(firstEvent._id); // ✅ set parent state
            }

        }
    }, [events, selectedEvent]);

    const handleBarcodeScanned = (scanResult: BarcodeScanningResult) => {
        // Don't scan if bottom sheet is open
        if (isScanSheetOpen) {
            console.log('⚠️ Scanning disabled - bottom sheet is open');
            return;
        }

        console.log('🔍 QR Code detected:', scanResult);
        const { data } = scanResult;
        try {
            console.log('📦 Attempting to parse QR data:', data);
            const parsedData = JSON.parse(data);
            console.log('✅ Parsed QR data:', parsedData);

            if (parsedData?.qrcode && parsedData.qrcode !== scannedData) {
                console.log('🎫 New QR code detected:', parsedData.qrcode);
                // Trigger haptic feedback
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setScannedData(parsedData.qrcode);
                validateTicket(parsedData.qrcode);
            } else {
                console.log('⚠️ Duplicate QR code or invalid format');
                // Trigger error haptic feedback
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        } catch (error) {
            console.error('❌ QR Code parsing error:', error);
            // Trigger error haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setScanError(true);
            resetScanner();
        }
    };

    const validateTicket = async (qrcode: string) => {
        console.log('🔍 Validating ticket:', qrcode);
        try {
            console.log('🌐 Making API request to:', `${url}/fetchDataByQRCode`);
            const response = await axios.post(`${url}/fetchDataByQRCode`, { qrcode_number: qrcode });
            console.log('✅ API Response:', response.data);

            if (response.data?.event?._id === selectedEvent?.id) {
                console.log('✅ Ticket validated successfully for event:', selectedEvent?.name);
                setScanError(false);
                setScanData(response.data);

                // If status is false, automatically call updateQRCodeStatus
                if (response.data?.payment?.qr_status === 'false') {
                    console.log('🔄 Auto-checking in ticket...');
                    await updateCheckinStatus(response.data?.payment?._id, response.data?.payment?.qr_status);
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                    }, 2000);
                } else {
                    // If status is true, open the bottom sheet
                    console.log('📱 Opening bottom sheet for checked-in ticket...');
                    // if (scanBottomSheetRef.current?.open) {
                    //     scanBottomSheetRef.current.open();
                    // }
                    setShowAlreadyScanned(true)
                    setTimeout(() => {
                        setShowAlreadyScanned(false)
                    }, 2000);
                }

                // Reset scanner after 3 seconds
                console.log('⏳ Resetting scanner in 3 seconds...');
                setTimeout(() => {
                    console.log('🔄 Scanner reset complete');
                    setScannedData(null);
                }, 3000);
            } else {
                console.error('❌ Invalid ticket for current event');
                console.log('Expected event ID:', selectedEvent?.id);
                console.log('Received event ID:', response.data?.event?._id);
                setScanError(true);
                resetScanner();
            }
        } catch (error) {
            console.error('❌ Ticket validation error:', error);
            setScanError(true);
            resetScanner();
        }
    };

    const resetScanner = () => {
        console.log('🔄 Resetting scanner...');
        setTimeout(() => {
            console.log('✅ Scanner reset complete');
            setScanError(false);
            setScannedData(null);
        }, 3000); // Updated to 3 seconds
    };

    const handleCameraPress = useCallback(() => {
        const now = Date.now();
        if (now - lastFocusTime < 500) return;

        console.log('📸 Triggering camera focus');
        setIsFocusing(true);
        setLastFocusTime(now);

        // Only show focus indicator for 500ms
        setTimeout(() => {
            setIsFocusing(false);
        }, 500);
    }, [lastFocusTime]);

    // Remove app state change handler since we don't need it
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            setAppState(nextAppState);
        });

        return () => {
            subscription.remove();
        };
    }, [appState]);

    const updateCheckinStatus = async (itemId: any, currentStatus: any) => {
        try {
            const endpoint = currentStatus === "true"
                ? `${url}/updateQRCodeStatusFalse`
                : `${url}/updateQRCodeStatus`;

            await axios.post(endpoint, { id: itemId });

            scanBottomSheetRef.current?.close();
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);

        } catch (error) {
            console.error("Error Updating", error);
        }
    };

    // Handle camera activation/deactivation based on screen focus
    useFocusEffect(
        useCallback(() => {
            // Screen is focused, activate camera
            setIsCameraActive(true);

            return () => {
                // Screen is unfocused, deactivate camera
                setIsCameraActive(false);
            };
        }, [])
    );

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${url}/organizer-event-stats/${organizerId}`);
            setEventStats(response.data?.data);
        } catch (error) {
            console.error("Error fetching event stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [organizerId]);

    useEffect(() => {
        rotateAnim.value = withTiming(isPlaceSheetOpen ? 180 : 0, { duration: 250 });
    }, [isPlaceSheetOpen]);

    const rotateStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${rotateAnim.value}deg`,
            },
        ],
    }));

    if (hasPermission === null) {
        return <Text className="text-white text-center mt-10">Requesting camera permission...</Text>;
    }

    if (hasPermission === false) {
        return <Text className="text-red-500 text-center mt-10">No access to camera</Text>;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <View className="flex-1 bg-black relative">
                    <View className="flex-1 relative" style={{ marginTop: Platform.OS === "android" ? insets.top + 0 : 0 }}>
                        {isCameraActive && (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={handleCameraPress}
                                style={{ width: "100%", height: "100%", position: "absolute" }}
                            >
                                <CameraView
                                    ref={cameraRef}
                                    style={{ width: "100%", height: "100%", position: "absolute" }}
                                    onBarcodeScanned={scannedData || isScanSheetOpen ? undefined : handleBarcodeScanned}
                                    barcodeScannerSettings={{
                                        barcodeTypes: ["qr"]
                                    }}
                                    autofocus="off"
                                />
                                {isFocusing && (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            width: 60,
                                            height: 60,
                                            marginLeft: -30,
                                            marginTop: -30,
                                            borderWidth: 2,
                                            borderColor: '#fff',
                                            borderRadius: 30,
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }}
                                    />
                                )}
                            </TouchableOpacity>
                        )}

                        {/* Camera Borders */}
                        <View
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height,
                                width,
                                justifyContent: "center",
                                alignItems: "center",
                                pointerEvents: "none",
                            }}
                        >
                            <View
                                style={{
                                    width: width * 0.7,
                                    height: height * 0.35,
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                {/* Corners */}
                                <View className="flex-row justify-between w-full">
                                    <View className="w-16 h-16 border-l-4 border-t-4 rounded-t-md rounded-l-md border-white" />
                                    <View className="w-16 h-16 border-r-4 border-t-4 rounded-t-md rounded-r-md border-white" />
                                </View>

                                {/* Error Box */}
                                {scanError && (
                                    <View
                                        style={{
                                            backgroundColor: "rgba(255, 0, 0, 0.15)",
                                            borderWidth: 1,
                                            borderColor: "#F43F5E",
                                            paddingVertical: 12,
                                            paddingHorizontal: 20,
                                            borderRadius: 12,
                                            width: "85%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Ionicons name="warning" size={20} color="red" style={{ marginRight: 6 }} />
                                            <Text className="text-white font-semibold text-lg">Invalid ticket</Text>
                                        </View>
                                        <Text className="text-white/50 text-base text-center mt-1">QR code is not valid</Text>
                                    </View>
                                )}

                                <View className="flex-row justify-between w-full">
                                    <View className="w-16 h-16 border-l-4 border-b-4 rounded-b-md rounded-l-md border-white" />
                                    <View className="w-16 h-16 border-r-4 border-b-4 rounded-b-md rounded-r-md border-white" />
                                </View>
                            </View>
                        </View>

                        {/* Scrollable Content */}
                        <View className="px-4 py-8 pb-40">
                            {
                                loading ? (
                                    <>
                                        <TouchableOpacity onPress={openPlaceBottomSheet} className="mt-10 flex-row flex-wrap justify-center gap-6">
                                            <Text className='text-white'>
                                                <ActivityIndicator />
                                            </Text>
                                        </TouchableOpacity>

                                    </>
                                ) : (
                                    <>
                                        <TouchableOpacity onPress={openPlaceBottomSheet} className="mt-10 flex-row flex-wrap justify-between gap-6">
                                            <View className="flex-row items-center">
                                                {selectedEvent?.flyer ? (
                                                    <Image
                                                        source={{ uri: selectedEvent?.flyer }}
                                                        className="w-10 h-10 rounded-lg"
                                                    />
                                                ) : (
                                                    <Image
                                                        source={require("@/assets/images/ticket/ticket3.png")}
                                                        className="w-10 h-10 rounded-lg"
                                                    />
                                                )}
                                                <Text className="text-lg font-medium text-white ml-5">
                                                    {selectedEvent?.name}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <Animated.View style={rotateStyle}>
                                                    <AntDesign name="down" size={16} color="white" />
                                                </Animated.View>
                                            </View>

                                        </TouchableOpacity>
                                    </>
                                )
                            }
                        </View>

                        {/* Fixed Bottom Buttons */}


                    </View>

                    {
                        readyBottomSheets.place && (
                            <PlaceBottomSheet
                                ref={placeBottomSheetRef}
                                events={events}
                                loading={loading}
                                eventStats={eventStats}
                                onSelectEvent={(event) => {
                                    setSelectedEvent(event);
                                    setSelectedEventId(event.id);
                                }}
                                onChange={(index) => {
                                    const isOpen = index !== -1;

                                    if (isOpen) {
                                        setIsBottomSheetOpen(true);
                                    } else {
                                        // 👇 Wait 100ms before sliding back up
                                        setTimeout(() => {
                                            setIsBottomSheetOpen(false);
                                        }, 0);
                                    }

                                    setIsPlaceSheetOpen(isOpen); // or setIsScanSheetOpen based on the sheet
                                }}


                            />
                        )
                    }

                    {
                        readyBottomSheets.scan && (
                            <ScanBottomSheet
                                ref={scanBottomSheetRef}
                                scanData={scanData}
                                onChange={(index) => {
                                    const isOpen = index !== -1;

                                    if (isOpen) {
                                        setIsScanSheetOpen(true);
                                    } else {
                                        // 👇 Wait 100ms before sliding back up
                                        setTimeout(() => {
                                            setIsScanSheetOpen(false);
                                        }, 0);
                                    }
                                }}
                                updateCheckinStatus={updateCheckinStatus}
                            />
                        )
                    }

                    {showSuccess && (
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                bottom: Platform.OS === "ios" ? insets.bottom + 90 : insets.bottom + 40,
                                width: "100%",
                                paddingHorizontal: width * 0.15,
                            }}
                            onPress={async () => {
                                if (!scannedData) return;

                                try {
                                    const response = await axios.post(`${url}/fetchDataByQRCode`, { qrcode_number: scannedData });

                                    if (response.data) {
                                        setScanData(response.data);
                                        if (scanBottomSheetRef.current?.open) {
                                            scanBottomSheetRef.current.open();
                                        }
                                    }
                                } catch (error) {
                                    console.error("Failed to refetch QR data:", error);
                                }
                            }}
                        >
                            <BlurView
                                intensity={55}
                                tint="dark"
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    paddingVertical: height * 0.012,
                                    paddingHorizontal: width * 0.05,
                                    overflow: "hidden",
                                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                                    borderWidth: 1,
                                    borderColor: "#10B981",
                                }}
                            >
                                <IconSuccess size={14} color="#10B981" />
                                <Text className="text-white ml-1" style={{ marginLeft: 6 }}>Check-in status updated</Text>
                                <TouchableOpacity
                                    style={{ marginLeft: 6 }}
                                >
                                    <Text className="text-white">
                                        <MaterialCommunityIcons name="chevron-double-up" size={20} />
                                    </Text>
                                </TouchableOpacity>

                            </BlurView>
                        </TouchableOpacity>
                    )}

                    {showAlreadyScanned && (
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                bottom: Platform.OS === "ios" ? insets.bottom + 90 : insets.bottom + 40,
                                width: "100%",
                                paddingHorizontal: width * 0.15,
                            }}
                            onPress={() => {
                                if (scanBottomSheetRef.current?.open) {
                                    scanBottomSheetRef.current.open();
                                }
                            }}
                        >
                            <BlurView
                                intensity={55}
                                tint="dark"
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    paddingVertical: height * 0.012,
                                    paddingHorizontal: width * 0.05,
                                    overflow: "hidden",
                                    backgroundColor: "rgba(249, 115, 22, 0.2)",
                                    borderWidth: 1,
                                    borderColor: "#F97316",
                                }}
                            >
                                <WarningIcon size={14} color="#F97316" />
                                <Text className="text-white ml-1" style={{ marginLeft: 6 }}>Ticket already scanned</Text>
                                <TouchableOpacity
                                    style={{ marginLeft: 6 }}
                                >
                                    <Text className="text-white">
                                        <MaterialCommunityIcons name="chevron-double-up" size={20} />
                                    </Text>
                                </TouchableOpacity>
                            </BlurView>
                        </TouchableOpacity>
                    )}

                </View >
            </BottomSheetModalProvider>
        </GestureHandlerRootView >
    );
};

export default QrScan;