import { ClockIcon } from '@/assets/icons/HomeIcons';
import url from '@/constants/url';
import { useBottomSheet } from '@/context/BottomSheetContext';
import { useFilter } from '@/context/FilterContext';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import axios from 'axios';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

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
    events: Event[];
    loading: boolean;
    eventStats: any;
    onSelectEvent: any;
    onChange?: (index: number) => void; // ✅ add this
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

const PlaceBottomSheet = forwardRef<PlaceBottomSheetRef, PlaceBottomSheetProps>(({ events, loading, eventStats, onSelectEvent, onChange }, ref) => {
    const [searchQuery, setSearchQuery] = useState('');
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['50%', '90%'], []);
    const { setIsBottomSheetOpen } = useBottomSheet();
    const { setPlaceFilter, setTotalResults } = useFilter();
    const [soldTickets, setSoldTickets] = useState(0);
    const [remainCount, setRemainCount] = useState(0);
    const [checkedIn, setCheckedIn] = useState(0);
    const [isloading, setIsLoading] = useState(false)

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

    const eventList = Object.values(eventStats || {}); // ensure fallback to empty object

    const upcomingEvents = eventList.filter(event =>
        (searchQuery === '' || event.event_name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        event.status === 'live'
    );

    const pastEvents = eventList.filter(event =>
        (searchQuery === '' || event.event_name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        event.status === 'past'
    );

    useEffect(() => {
        const fetchEarnings = async () => {
            for (const event of events) {
                await fetchRemainEvent(event._id);
            }
        };
        fetchEarnings();
    }, [events]);

    const fetchRemainEvent = async (id: any) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${url}/remain-tickets/${id}`);

            if (response.data) {
                const sold = response.data.reduce((acc: any, event: any) => acc + Number(event.tickets_sold), 0);
                const remaining = response.data.reduce((acc: any, event: any) => acc + Number(event.remaining_tickets), 0);
                const checkedin = response.data.reduce((acc: any, event: any) => acc + Number(event.checked_in_count), 0);

                setSoldTickets((prev) => ({ ...prev, [id]: sold }));
                setRemainCount((prev) => ({ ...prev, [id]: remaining }));
                setCheckedIn((prev) => ({ ...prev, [id]: checkedin }));
            }
        } catch (error) {
            console.error(`Error fetching remain events for id: ${id}`, error);
        } finally {
            setIsLoading(false)
        }
    };

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
            keyboardBehavior={Platform.OS === "ios" ? "interactive" : "extend"}
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
                        <Text style={styles.title}>Select Event</Text>
                        <Text style={styles.subtitle}>Find live events to scan</Text>

                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Type and select from list..."
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onFocus={handleTextInputFocus}
                            />
                        </View>

                        {!searchQuery && (
                            <Text style={styles.sectionTitle}>LIVE EVENTS</Text>
                        )}

                        {searchQuery && upcomingEvents.length > 0 && (
                            <Text style={styles.sectionTitle}>RESULTS</Text>
                        )}

                        {
                            loading ? (
                                <ActivityIndicator />
                            ) : (
                                <View style={styles.listContainer}>
                                    {upcomingEvents.length > 0 && (
                                        <>
                                            {upcomingEvents.filter((event: any) => event.status === 'live').map((event: any) => {
                                                return (
                                                    <Pressable
                                                        key={event._id}
                                                        style={styles.placeItem}
                                                        onPress={() => {
                                                            onSelectEvent({ id: event.event_id, name: event.event_name, flyer: event.event_flyer });
                                                            bottomSheetRef.current?.close();
                                                        }}
                                                    >
                                                        <View style={styles.placeIcon}>
                                                            <Image source={{ uri: event.event_flyer }} className="w-10 h-10 rounded-lg" />
                                                        </View>
                                                        <View style={styles.placeInfo}>
                                                            <Text style={styles.placeName}>{event.event_name}</Text>
                                                            <Text style={styles.placeArea}>
                                                                {event.total_sold || 0} sold * {event.total_checked_in || 0} checked in
                                                            </Text>
                                                        </View>
                                                    </Pressable>
                                                );
                                            })}
                                        </>
                                    )}

                                    {pastEvents.length > 0 && (
                                        <>
                                            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>PAST EVENTS</Text>
                                            {pastEvents.filter((event: any) => event.status === 'past').map((event) => {
                                                return (
                                                    <Pressable
                                                        key={event._id}
                                                        style={styles.placeItem}
                                                        onPress={() => {
                                                            onSelectEvent({ id: event.event_id, name: event.event_name, flyer: event.event_flyer });
                                                            bottomSheetRef.current?.close();
                                                        }}
                                                    >
                                                        <View style={styles.placeIcon}>
                                                            <Image source={{ uri: event.event_flyer }} className="w-10 h-10 rounded-lg" />
                                                        </View>
                                                        <View style={styles.placeInfo}>
                                                            <Text style={styles.placeName}>{event.event_name}</Text>
                                                            <Text style={styles.placeArea}>
                                                                {event.total_sold || 0} sold * {event.total_checked_in || 0} checked in
                                                            </Text>
                                                        </View>
                                                    </Pressable>
                                                );
                                            })}
                                        </>
                                    )}
                                    {upcomingEvents.length === 0 && pastEvents.length === 0 && (
                                        <View style={styles.noResultsContainer}>
                                            <Text style={styles.noResultsText}>No events found</Text>
                                        </View>
                                    )}
                                </View>

                            )
                        }
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
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 24,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
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
    noResultsContainer: {
        paddingVertical: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noResultsText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
    },

});

export default PlaceBottomSheet;