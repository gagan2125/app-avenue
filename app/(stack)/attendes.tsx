import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Platform, TextInput, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PriceIcon } from '@/assets/icons/HomeIcons';
import axios from 'axios';
import url from '@/constants/url';
import { BlurView } from 'expo-blur';
import PlaceBottomSheet, { PlaceBottomSheetRef } from "@/components/TicketBottomSheet";
import { IconSuccess, SuccessIcon } from '@/assets/icons/SavedEventsIcons';

const { width, height } = Dimensions.get("window");

const Attendes = ({ eventId, organizerId, setIsBottomSheetOpen }: { eventId: string; organizerId: string; setIsBottomSheetOpen: (value: boolean) => void; }) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState<'scan' | 'attendes'>('attendes');
    //const { eventId, organizerId } = useLocalSearchParams();
    const [loading, setLoading] = useState(false)
    const [book, setBook] = useState([]);
    const [filteredBook, setFilteredBook] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const placeBottomSheetRef = useRef<PlaceBottomSheetRef>(null);
    const [selectedEvent, setSelectedEvent] = useState<{ data: object } | null>(null);

    const fetchBook = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`https://avenue.tickets/api/get-event-payment-list/${eventId}`);
            setBook(response.data);
            setFilteredBook(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBook()
    }, [eventId])

    const handleSearch = (query: any) => {
        setSearchQuery(query);

        if (!query) {
            setFilteredBook(book);
            return;
        }

        const lowercasedQuery = query.toLowerCase();

        const filteredResults = book.filter((event: any) => {
            const amount =
                typeof event.amount === 'number'
                    ? Math.abs(((event.amount / 100) - 0.89) / 1.09)
                        .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })
                    : "";

            let formattedDate = "";
            if (event.date) {
                const date = new Date(event.date);
                if (!isNaN(date.getTime())) {
                    formattedDate = new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                    })
                        .format(date)
                        .toLowerCase();
                }
            }

            return (
                event.firstName?.toLowerCase().includes(lowercasedQuery) ||
                event.email?.toLowerCase().includes(lowercasedQuery) ||
                event.user_id?.phoneNumber?.includes(lowercasedQuery) ||
                amount.includes(lowercasedQuery) ||
                formattedDate.includes(lowercasedQuery)
            );
        });

        setFilteredBook(filteredResults);
    };

    const updateCheckinStatus = async (itemId: any, currentStatus: any) => {
        try {
            const endpoint = currentStatus === "true"
                ? `${url}/updateQRCodeStatusFalse`
                : `${url}/updateQRCodeStatus`;

            await axios.post(endpoint, { id: itemId });

            setBook(prevBook =>
                prevBook.map(item =>
                    item._id === itemId
                        ? { ...item, qr_status: currentStatus === "true" ? "false" : "true" }
                        : item
                )
            );
            setFilteredBook(prevBook =>
                prevBook.map(item =>
                    item._id === itemId
                        ? { ...item, qr_status: currentStatus === "true" ? "false" : "true" }
                        : item
                )
            );

            placeBottomSheetRef.current?.close();
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);

        } catch (error) {
            console.error("Error Updating", error);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <View className="flex-1 bg-black relative">
                    {/* Scrollable Content */}
                    <ScrollView className="px-4 py-8 pb-40">
                        <View className="gap-6">
                            <View>
                                <Text className="text-white font-medium text-2xl" style={{ marginTop: Platform.OS === "android" ? insets.top + 10 : 40 }}>Attendees</Text>
                                <View style={styles.searchContainer}>
                                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" style={styles.searchIcon} />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search"
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                        value={searchQuery}
                                        onChangeText={handleSearch}
                                    />
                                </View>
                            </View>
                        </View>
                        {
                            loading ? (
                                <>
                                    <ActivityIndicator />
                                </>
                            ) : (
                                <View className="mt-4 mb-36">
                                    {
                                        filteredBook.slice().reverse().map((event: any) => (
                                            <Pressable
                                                className="bg-card rounded-2xl overflow-hidden p-4 mb-6"
                                                onPress={() => {
                                                    setIsBottomSheetOpen(true)
                                                    setTimeout(() => {
                                                        placeBottomSheetRef.current?.open()
                                                        setSelectedEvent(event)
                                                    }, 100);
                                                }}
                                            >
                                                <View className="flex-row justify-between">
                                                    <View className="flex-row items-center gap-2 flex-1 mr-4">
                                                        <Text className="text-white/50 font-medium uppercase flex-shrink-0" numberOfLines={1}>
                                                            {event?.tickets?.ticket_name ? event?.tickets?.ticket_name : "Free"} x {event.count}
                                                        </Text>
                                                    </View>
                                                    <Text className="text-white font-medium flex-shrink-0">
                                                        {(() => {
                                                            const dateObj = new Date(event.date);
                                                            const formattedDate = dateObj.toLocaleString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                            });
                                                            const formattedTime = dateObj.toLocaleString("en-US", {
                                                                hour: "numeric",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            });
                                                            return `${formattedDate} at ${formattedTime}`;
                                                        })()}
                                                    </Text>
                                                </View>

                                                <View className="flex-row justify-between items-center w-full mt-4">
                                                    {Array(20)
                                                        .fill(0)
                                                        .map((_, index) => (
                                                            <View
                                                                key={index}
                                                                className="w-2 h-1 bg-black rounded-full mx-[2px]"
                                                            />
                                                        ))}
                                                </View>

                                                <View className="mt-4 flex-row justify-between items-center">
                                                    <View>
                                                        <Text className="text-white font-medium text-xl">
                                                            {event.firstName ? event.firstName : event.email}
                                                        </Text>
                                                        <View className="flex-row items-center mt-2">
                                                            <PriceIcon color="white" size={16} />
                                                            <Text className="text-gray-400 font-medium text-md ml-1">
                                                                {!event.transaction_id
                                                                    ? "Comp"
                                                                    : event.amount < 0
                                                                        ? `-${(Math.abs((event.amount / 100 - 0.89) / 1.09)).toLocaleString("en-US", {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        })}`
                                                                        : `${(Math.abs((event.amount / 100 - 0.89) / 1.09)).toLocaleString("en-US", {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        })}`
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                                    {
                                                        event.qr_status === 'true' ? (
                                                            <TouchableOpacity
                                                                className="flex-row items-center"
                                                            >
                                                                <View className="flex-row items-center space-x-2">
                                                                    <IconSuccess size={20} color="#10B981" />
                                                                    <Text className="text-white/50 ml-1 font-medium text-md">Checked in</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        ) : (
                                                            <TouchableOpacity onPress={() => updateCheckinStatus(event._id, event.qr_status)} className="flex-row items-end bg-white rounded-full px-3 py-2">
                                                                <Text className="text-black font-medium text-md">
                                                                    Check in
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )
                                                    }
                                                </View>
                                            </Pressable>
                                        ))
                                    }
                                </View>
                            )
                        }
                    </ScrollView>

                    {/* Fixed Bottom Buttons */}


                    {/* Success Notification */}
                    {showSuccess && (
                        <View
                            style={{
                                position: "absolute",
                                bottom: Platform.OS === "ios" ? insets.bottom + 90 : insets.bottom + 40,
                                width: "100%",
                                paddingHorizontal: width * 0.15,
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
                                <IconSuccess size={16} color="#10B981" />
                                <Text className="text-white ml-1">Check-in status updated</Text>
                            </BlurView>
                        </View>
                    )}

                    <PlaceBottomSheet
                        ref={placeBottomSheetRef}
                        selectedEvent={selectedEvent}
                        setBook={setBook}
                        setFilteredBook={setFilteredBook}
                        updateCheckinStatus={updateCheckinStatus}
                        onChange={(index) => {
                            const isOpen = index !== -1;

                            if (isOpen) {
                                setIsBottomSheetOpen(true); // 👈 hide bottom nav
                            } else {
                                // 👇 wait for sheet to close (around 300ms), then show bottom nav again
                                setTimeout(() => {
                                    setIsBottomSheetOpen(false); // 👈 show bottom nav
                                }, 0);
                            }
                        }}
                    />

                </View>
            </BottomSheetModalProvider >
        </GestureHandlerRootView >
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 10,
        minHeight: 48,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginTop: 20,
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
});

export default Attendes;