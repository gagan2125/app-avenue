import { ClockIcon } from '@/assets/icons/HomeIcons';
import { useBottomSheet } from '@/context/BottomSheetContext';
import { useFilter } from '@/context/FilterContext';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import axios from 'axios';
import url from '@/constants/url';


const { width, height } = Dimensions.get("window");

interface Place {
    id: number;
    name: string;
    area: string;
    distance: string;
}

export interface Event {
    _id: string;
    event_name: string;
    explore: string;
    venue_name: string;
    flyer: string;
    end_date: string;
    end_time: string;
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
    }
];

export type PlaceBottomSheetRef = {
    open: () => void;
    close: () => void;
};

interface PlaceBottomSheetProps {
    setBook: any;
    setFilteredBook: any;
    selectedEvent: any;
    updateCheckinStatus: any;
    onChange?: (index: number) => void;
}

interface PaymentDetail {
    paymentIntent?: {
        payment_method_types: string;
    };
}

// const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
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
//         <Animated.View style={containerStyle} />
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

const PlaceBottomSheet = forwardRef<PlaceBottomSheetRef, PlaceBottomSheetProps>(({ onChange, selectedEvent, setBook, setFilteredBook, updateCheckinStatus }, ref) => {
    const [searchQuery, setSearchQuery] = useState('');
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['75%'], []);
    const { setIsBottomSheetOpen } = useBottomSheet();
    const { setPlaceFilter, setTotalResults } = useFilter();
    const [paymentDetail, setPaymentDetail] = useState<PaymentDetail>({});
    const [checkinTime, setCheckinTime] = useState<string | null>(null);
    const [isLoadingCheckinTime, setIsLoadingCheckinTime] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    const paymentid = selectedEvent?.transaction_id.split('_secret')[0]

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
            
            setShowNotification(true);
            setNotificationMessage('Check-in status updated successfully!');
            setNotificationType('success');
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
        } catch (error: any) {
            // Revert optimistic update on error
            setCheckinTime(null);
            console.error('Error updating check-in status:', error);
            setShowNotification(true);
            setNotificationMessage(error.response?.data?.message || 'Error updating check-in status');
            setNotificationType('error');
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
        }
    };

    const handleSheetChanges = useCallback((index: number) => {
        setIsBottomSheetOpen(index !== -1);
        if (index !== -1) {
            fetchCheckinTime();
        }
        if (index === -1) {
            Keyboard.dismiss();
        }
    }, [setIsBottomSheetOpen, fetchCheckinTime]);

    const handleClose = useCallback(() => {
        setSearchQuery('');
        setIsBottomSheetOpen(false);
        Keyboard.dismiss();
        bottomSheetRef.current?.dismiss();
    }, [setIsBottomSheetOpen]);

    const handleOutsidePress = useCallback(() => {
        Keyboard.dismiss();
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const handleTextInputFocus = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(1);
    }, []);

    const handlePlaceSelect = (event: Event) => {
        setPlaceFilter(event.event_name);
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

    const to24HourTime = (time12h: string): string => {
        const [time, modifier] = time12h.trim().split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const isUpcoming = (event: Event): boolean => {
        try {
            const endDateUTC = new Date(event.end_date);
            const time24 = to24HourTime(event.end_time);
            const [hours, minutes] = time24.split(':').map(Number);

            endDateUTC.setUTCHours(hours + 10);
            endDateUTC.setUTCMinutes(minutes);
            endDateUTC.setUTCSeconds(0);
            endDateUTC.setUTCMilliseconds(0);

            return endDateUTC > new Date();
        } catch {
            return false;
        }
    };

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
            bottomSheetRef.current?.present();
        },
        close: handleClose,
    }));

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
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
            keyboardBehavior="interactive"
            android_keyboardInputMode="adjustResize"
            enableDynamicSizing={true}
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
                                source={{ uri: selectedEvent?.party_id?.flyer }}
                                style={{
                                    width: width * 0.12,
                                    height: width * 0.12,
                                    borderRadius: 10,
                                    alignSelf: "center",
                                    bottom: 10
                                }}
                            />
                        </View>
                        <Text style={styles.title}>{selectedEvent?.party_id?.event_name}</Text>
                        <Text style={styles.subtitle}>Purchased ticket by {selectedEvent?.firstName}</Text>
                        <View style={styles.listContainer}>
                            <Pressable
                                style={styles.placeItem}
                            >
                                <View style={styles.placeDetails}>
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.totalCount}>Attendee</Text>
                                        <Text style={styles.checkedInCount}>{selectedEvent?.firstName ? selectedEvent?.firstName : selectedEvent?.email}</Text>
                                    </View>
                                </View>

                                {/* Circular Profile Icon with First 2 Letters */}
                                <View style={styles.placeIcon}>
                                    {selectedEvent?.firstName ? (
                                        <View style={styles.initialsCircle}>
                                            <Text style={styles.initialsText}>
                                                {selectedEvent.firstName.slice(0, 2).toUpperCase()}
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
                                        <Text style={styles.checkedInCount}>{selectedEvent?.tickets?.ticket_name ? selectedEvent?.tickets?.ticket_name : "Free"} x {selectedEvent?.count}</Text>
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
                                                        isLoadingCheckinTime ? (
                                                            <ActivityIndicator size="small" color="#fff" />
                                                        ) : (
                                                            checkinTime &&
                                                            `${new Date(checkinTime).toLocaleString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })} at ${new Date(checkinTime).toLocaleString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: true
                                                            })}`
                                                        )
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
                                            {!selectedEvent?.transaction_id
                                                ? "Free"
                                                : `${selectedEvent?.amount < 0 ? "-" : ""}$${(
                                                    Math.abs((selectedEvent.amount / 100 - 0.89) / 1.09)
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
                                selectedEvent?.qr_status === 'true' ?
                                    (
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity style={styles.confirmCheckInButton} onPress={() => handleCheckinStatusUpdate(selectedEvent._id, selectedEvent.qr_status)}>
                                                <Text style={styles.confirmCheckInText}>Undo check-in</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity style={[styles.confirmCheckInButton, { backgroundColor: "white" }]} onPress={() => handleCheckinStatusUpdate(selectedEvent._id, selectedEvent.qr_status)}>
                                                <Text style={[styles.confirmCheckInText, { color: "black" }]}>Check in</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                            }
                            <TouchableOpacity>
                                <Text className='text-white font-medium text-center'>
                                    View activity
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheetScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </BottomSheetModal>
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
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 8,
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
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 0,
        marginTop: 16,
        marginBottom: Platform.OS === 'ios' ? 24 : 8,
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

export default PlaceBottomSheet;