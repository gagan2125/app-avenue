import React, { useCallback, useMemo, forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Pressable, Image, Dimensions, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdropProps, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useBottomSheet } from '@/context/BottomSheetContext';
import { BlurView } from 'expo-blur';
import Animated, { interpolate, useAnimatedStyle, Extrapolate } from 'react-native-reanimated';
import { useFilter } from '@/context/FilterContext';
import { ClockIcon } from '@/assets/icons/HomeIcons';
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';
import url from '@/constants/url';

interface Place {
    id: number;
    name: string;
    area: string;
    distance: string;
}

const recentPlaces: Place[] = [
    {
        id: 1,
        name: "Modern Arts Center",
        area: "Downtown district",
        distance: "2.5 km away"
    },
    {
        id: 2,
        name: "Cloud Nine Club",
        area: "Nightlife district",
        distance: "1.8 km away"
    },
    {
        id: 3,
        name: "Central Concert Hall",
        area: "Music quarter",
        distance: "3.1 km away"
    },
    {
        id: 4,
        name: "Central Concert Hall",
        area: "Music quarter",
        distance: "3.1 km away"
    },
    {
        id: 5,
        name: "Central Concert Hall",
        area: "Music quarter",
        distance: "3.1 km away"
    }
];

const { width, height } = Dimensions.get("window");

export type PlaceBottomSheetRef = {
    open: () => void;
    close: () => void;
};

interface PlaceBottomSheetProps {
    selectedEvent: any;
    updateCheckinStatus: any;
    scanData: any;
    onChange?: (index: number) => void;
}

interface PaymentDetail {
    paymentIntent?: {
        payment_method_types: string;
    };
}

// const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
//     if (Platform.OS === 'android') {
//         return null;
//     }

//     const containerAnimatedStyle = useAnimatedStyle(() => ({
//         opacity: interpolate(
//             animatedIndex.value,
//             [-1, 0],
//             [0, 1],
//             Extrapolate.CLAMP
//         ),
//     }));

//     const containerStyle = useMemo(
//         () => [
//             style,
//             {
//                 backgroundColor: "#00000099",
//             },
//             containerAnimatedStyle,
//         ],
//         [style, containerAnimatedStyle]
//     );

//     return (
//         <TouchableWithoutFeedback>
//             <Animated.View style={containerStyle}>
//                 <BlurView
//                     intensity={20}
//                     tint="dark"
//                     style={StyleSheet.absoluteFill}
//                 />
//             </Animated.View>
//         </TouchableWithoutFeedback>
//     );
// };

const CustomBackdrop = (props: BottomSheetBackdropProps) => {
    return (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
        />
    );
};

const ScanBottomSheet = forwardRef<PlaceBottomSheetRef, PlaceBottomSheetProps>(({ onChange, scanData, selectedEvent, updateCheckinStatus }, ref) => {
    //console.log(selectedEvent)
    const [searchQuery, setSearchQuery] = useState('');
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['80%'], []);
    const { setIsBottomSheetOpen } = useBottomSheet();
    const { setPlaceFilter, setTotalResults } = useFilter();
    const [paymentDetail, setPaymentDetail] = useState<PaymentDetail>({});
    const paymentid = selectedEvent?.transaction_id.split('_secret')[0]
    const [isLoadingCheckinTime, setIsLoadingCheckinTime] = useState(false);
    const [checkinTime, setCheckinTime] = useState<string | null>(null);

    const handleSheetChanges = useCallback((index: number) => {
        setIsBottomSheetOpen(index !== -1);
        if (index === -1) {
            Keyboard.dismiss();
        }
    }, [setIsBottomSheetOpen]);

    const handleClose = useCallback(() => {
        setSearchQuery('');
        setIsBottomSheetOpen(false);
        Keyboard.dismiss();
        bottomSheetRef.current?.close();
    }, [setIsBottomSheetOpen]);

    const handleOutsidePress = useCallback(() => {
        Keyboard.dismiss();
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const handleTextInputFocus = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(1);
    }, []);

    const handlePlaceSelect = (place: Place) => {
        setPlaceFilter(place.name);
        setTotalResults(256);
        handleClose();
    };

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <TouchableWithoutFeedback onPress={handleClose}>
                <CustomBackdrop {...props} />
            </TouchableWithoutFeedback>
        ),
        [handleClose]
    );

    const filteredPlaces = recentPlaces.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fetchDetail = async () => {
        try {
            if (!paymentid) {
                console.log('No payment ID available');
                return;
            }
            const response = await axios.get(`${url}/payment-detail/${paymentid}`);
            if (response.data) {
                setPaymentDetail(response.data);
            }
        } catch (error) {
            console.error('Error fetching payment details:', error);
            // Set default payment detail structure to prevent undefined errors
            setPaymentDetail({
                paymentIntent: {
                    payment_method_types: selectedEvent?.transaction_id ? selectedEvent.transaction_id.split('_secret')[0] : "-"
                }
            });
        }
    }

    useEffect(() => {
        fetchDetail()
    }, [paymentid])

    useImperativeHandle(ref, () => ({
        open: () => {
            setIsBottomSheetOpen(true);
            bottomSheetRef.current?.snapToIndex(0);
        },
        close: handleClose,
    }));

    const fetchCheckinTime = async () => {
        if (!selectedEvent?._id) return;

        setIsLoadingCheckinTime(true);
        try {
            const response = await axios.get(`${url}/fetch-latest-checkin-time/${selectedEvent._id}`);
            if (response.data?.checkin_time) {
                setCheckinTime(response.data.checkin_time);
            }
        } catch (error) {
            console.error('Error fetching check-in time:', error);
        } finally {
            setIsLoadingCheckinTime(false);
        }
    }

    const handleCheckinStatusUpdate = async (itemId: string, currentStatus: string) => {
        try {
            // Optimistic update
            const currentTime = new Date().toISOString();
            setCheckinTime(currentStatus === 'true' ? null : currentTime);

            await updateCheckinStatus(itemId, currentStatus);
            // Refresh the check-in time after successful update
            await fetchCheckinTime();


        } catch (error: any) {
            // Revert optimistic update on error
            setCheckinTime(null);
            console.error('Error updating check-in status:', error);

        }
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={(index) => {
                handleSheetChanges(index);
                onChange?.(index);
            }}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            style={styles.bottomSheet}
            keyboardBehavior="fillParent"
            android_keyboardInputMode="adjustResize"
        >
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.keyboardAvoidingView}
                >
                    <BottomSheetScrollView
                        style={styles.container}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                            <Image
                                source={{ uri: scanData?.event?.flyer }}
                                style={{
                                    width: width * 0.12,
                                    height: width * 0.12,
                                    borderRadius: 10,
                                    alignSelf: "center",
                                    bottom: 10
                                }}
                            />
                        </View>
                        <Text style={styles.title}>{scanData?.event?.event_name}</Text>
                        <Text style={styles.subtitle}>Purchased ticket by {scanData?.payment?.firstName}</Text>
                        <View style={styles.listContainer}>
                            <Pressable
                                style={styles.placeItem}
                            >
                                <View style={styles.placeDetails}>
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.totalCount}>Attendee</Text>
                                        <Text style={styles.checkedInCount}>{scanData?.payment?.firstName}</Text>
                                    </View>
                                </View>

                                {/* Circular Profile Icon with First 2 Letters */}
                                <View style={styles.placeIcon}>
                                    {scanData?.payment?.firstName ? (
                                        <View style={styles.initialsCircle}>
                                            <Text style={styles.initialsText}>
                                                {scanData?.payment?.firstName.slice(0, 2).toUpperCase()}
                                            </Text>
                                        </View>
                                    ) : (
                                        <Image
                                            source={{ uri: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg" }}
                                            style={styles.profileImage}
                                        />
                                    )}
                                </View>
                            </Pressable>
                            <Pressable
                                style={styles.placeItem}
                            >
                                <View style={styles.placeDetails}>
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.totalCount}>Ticket Type x Count</Text>
                                        <Text style={styles.checkedInCount}>{scanData?.payment?.tickets?.ticket_name ? scanData?.payment?.tickets?.ticket_name : "Free"} x {scanData?.payment?.count}</Text>
                                    </View>
                                </View>
                                <View style={styles.placeIcon}>
                                    <Image
                                        source={require("@/assets/images/Ticket.png")}
                                        style={{ width: width * 0.1, height: width * 0.1, borderRadius: 6 }}
                                    />
                                </View>
                            </Pressable>
                            <Pressable
                                style={styles.placeItem}
                            >
                                <View style={styles.placeDetails}>
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.totalCount}>Check in Time</Text>
                                        <Text style={styles.checkedInCount}>
                                            {
                                                selectedEvent?.qr_status === 'false' ?
                                                    (
                                                        "-"
                                                    ) : (
                                                        `${new Date(scanData?.payment?.checkin_time).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })} at ${new Date(scanData?.payment?.checkin_time).toLocaleString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                            hour12: true
                                                        })}`
                                                    )
                                            }
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.placeIcon}>
                                    <Image
                                        source={require("@/assets/images/Frame.png")}
                                        style={{ width: width * 0.1, height: width * 0.1, borderRadius: 6 }}
                                    />
                                </View>
                            </Pressable>
                            <Pressable
                                style={styles.placeItem}
                            >
                                <View style={styles.placeDetails}>
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.totalCount}>Purchased Amount</Text>
                                        <Text style={styles.checkedInCount}>
                                            {!scanData?.payment?.transaction_id
                                                ? "Free"
                                                : `${scanData?.payment?.amount < 0 ? "-" : ""}$${(
                                                    Math.abs((scanData?.payment?.amount / 100 - 0.89) / 1.09)
                                                ).toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}`}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.placeIcon}>
                                    <Image
                                        source={require("@/assets/images/Amount.png")}
                                        style={{ width: width * 0.1, height: width * 0.1, borderRadius: 6 }}
                                    />
                                </View>
                            </Pressable>
                            <Pressable
                                style={styles.placeItem}
                            >
                                <View style={styles.placeDetails}>
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.totalCount}>Payment Method</Text>
                                        <Text style={styles.checkedInCount}>{
                                            selectedEvent?.transaction_id ? paymentDetail?.paymentIntent?.payment_method_types : "-"
                                        }
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.placeIcon}>
                                    <Image
                                        source={require("@/assets/images/Card.png")}
                                        style={{ width: width * 0.1, height: width * 0.1, borderRadius: 6 }}
                                    />
                                </View>
                            </Pressable>
                            {
                                scanData?.payment?.qr_status === 'true' ?
                                    (
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity style={styles.confirmCheckInButton} onPress={() => updateCheckinStatus(scanData?.payment?._id, scanData?.payment?.qr_status)}>
                                                <Text style={styles.confirmCheckInText}>Undo check-in</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity style={[styles.confirmCheckInButton, { backgroundColor: "white" }]} onPress={() => updateCheckinStatus(scanData?.payment?._id, scanData?.payment?.qr_status)}>
                                                <Text style={[styles.confirmCheckInText, { color: "black" }]}>Check in</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                            }
                        </View>
                    </BottomSheetScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: '#141414',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    handleIndicator: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        width: 32,
        height: 4,
    },
    container: {
        flex: 1,
        backgroundColor: '#141414',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: Platform.OS === 'ios' ? 120 : 90,
        minHeight: '100%',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 24,
        textAlign: "center"
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
        minHeight: 48,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        paddingVertical: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 16,
        letterSpacing: 1,
    },
    listContainer: {
        flex: 1,
    },
    placeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    placeIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    placeInfo: {
        flex: 1,
    },
    placeName: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    placeArea: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    bottomSheet: {
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        zIndex: 9999,
    },
    placeDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    rightContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 5
    },
    eventTime: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    checkedInCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    totalCount: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 20 : 10,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 0,
        zIndex: 10,
    },
    confirmCheckInButton: {
        width: "100%", // Adapts to different screen sizes
        backgroundColor: '#F43F5E',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Android shadow
    },
    confirmCheckInText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    initialsCircle: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: 10,
        backgroundColor: "rgba(109, 225, 240, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    initialsText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});

export default ScanBottomSheet;



