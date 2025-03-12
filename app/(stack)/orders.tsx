import { Dimensions, Image, Pressable, ScrollView, Text, TouchableOpacity, View, Platform, ActivityIndicator, TextInput, StyleSheet } from "react-native";
import { useState, useRef, useEffect } from "react";
import { BookMarkIcon, CrossIcon, Icon1, PlaceIcon, PriceIcon } from "@/assets/icons/HomeIcons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CalendarIcon, RegularIcon, VipIcon, EarlyBirdIcon, OfferIcon, MoonIcon } from "@/assets/icons/TicketIcons";
import { BrushIcon, MusicIcon, IconSuccess } from "@/assets/icons/SavedEventsIcons";
import React from "react";
import image1 from "@/assets/images/ticket/ticket1.png"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlaceBottomSheet, { PlaceBottomSheetRef } from '@/components/TicketBottomSheet';
import axios from "axios";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const getTicketIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'arts & culture':
            return <BrushIcon color="#9bda33" size={13} />;
        case 'music':
            return <MusicIcon color="#cd364f" size={16} />;
        case 'sport':
            return <RegularIcon color="#34B2DA" size={16} />;
        case 'tech':
            return <OfferIcon color="#A855F7" size={16} />;
        case "nightlife":
            return <MoonIcon color="#A855F7" size={16} />;
        default:
            return <RegularIcon color="#a855f7" size={16} />;
    }
};
const { width, height } = Dimensions.get("window");

const Orders = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [bookmarkedEvents, setBookmarkedEvents] = useState<number[]>([]);
    const placeBottomSheetRef = useRef<PlaceBottomSheetRef>(null);
    const { eventId } = useLocalSearchParams();
    const [book, setBook] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState<{ data: object } | null>(null);
    const [loading, setLoading] = useState(false)
    const [filteredBook, setFilteredBook] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const toggleBookmark = (eventId: number) => {
        setBookmarkedEvents(
            (prev) =>
                prev.includes(eventId)
                    ? prev.filter((id) => id !== eventId)
                    : [...prev, eventId]
        );
    };

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

    const updateCheckinStatus = async (itemId, currentStatus) => {
        try {
            const endpoint = currentStatus === "true"
                ? "https://avenue.tickets/api/updateQRCodeStatusFalse"
                : "https://avenue.tickets/api/updateQRCodeStatus";

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

            // Close Bottom Sheet
            placeBottomSheetRef.current?.close();

            // Show Success Message
            setShowSuccess(true);

            // Hide after 2 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);

        } catch (error) {
            console.error("Error Updating", error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredBook(book);
        } else {
            const lowercasedQuery = query.toLowerCase();
            const filteredResults = book.filter((event) => {
                const formattedAmount = Math.abs(((event.amount / 100) - 0.89) / 1.09)
                    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const formattedDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
                    .format(new Date(event.date))
                    .toLowerCase();

                return (
                    event.firstName?.toLowerCase().includes(lowercasedQuery) ||
                    event.email?.toLowerCase().includes(lowercasedQuery) ||
                    event.user_id?.phoneNumber?.includes(lowercasedQuery) ||
                    formattedAmount.includes(lowercasedQuery) ||
                    formattedDate.includes(lowercasedQuery)
                );
            });

            setFilteredBook(filteredResults);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <ScrollView className="px-4 py-8">
                <Text className="text-white font-medium text-4xl" style={{ marginTop: Platform.OS === "android" ? insets.top + 10 : 40 }}>Attendees</Text>
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
                {
                    loading ? (
                        <ActivityIndicator />
                    ) : (
                        <View className="mt-4 mb-36">
                            {filteredBook.slice().reverse().map((event) => (
                                <Pressable
                                    key={event._id}
                                    className="bg-card rounded-2xl overflow-hidden p-4 mb-6"
                                    onPress={() => {
                                        setSelectedEvent(event);
                                        placeBottomSheetRef.current?.open()
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
                                                    {event.amount < 0
                                                        ? `-${(Math.abs((event.amount / 100) - 0.89) / 1.09).toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}`
                                                        : `${(Math.abs((event.amount / 100) - 0.89) / 1.09).toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}`}
                                                </Text>
                                            </View>
                                        </View>
                                        {
                                            event.qr_status === 'true' ? (
                                                <TouchableOpacity
                                                    className="flex-row items-center"
                                                    onPress={() => {
                                                        setSelectedEvent(event);
                                                        placeBottomSheetRef.current?.open();
                                                    }}
                                                >
                                                    <View className="flex-row items-center space-x-2">
                                                        <IconSuccess size={20} color="#10B981" />
                                                        <Text className="text-white/50 ml-1 font-medium text-md">Checked in</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity className="flex-row items-end" onPress={() => updateCheckinStatus(event._id, event.qr_status)}>

                                                    <Text
                                                        className="text-black font-medium text-md bg-white rounded-full px-3 py-2"
                                                    >
                                                        Check in
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        }
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    )
                }
            </ScrollView >
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
                        <Text className="text-white ml-1">Status changed successfully!</Text>
                    </BlurView>
                </View>
            )}

            <View
                style={{
                    position: "absolute",
                    bottom: Platform.OS === "ios" ? insets.bottom + 0 : insets.bottom + 40,
                    width: "100%",
                    paddingHorizontal: width * 0.15,
                }}
            >
                {/* Blur Background */}
                <BlurView
                    intensity={55} // Adjust for stronger or lighter blur
                    tint="dark"
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 50,
                        paddingVertical: height * 0.012,
                        paddingHorizontal: width * 0.05,
                        overflow: "hidden",
                    }}
                >
                    {/* Scan Ticket Button */}
                    <TouchableOpacity
                        style={{
                            paddingVertical: height * 0.015,
                            paddingHorizontal: width * 0.07,
                        }}
                        onPress={() => router.push("/(stack)/qr-scan")}
                    >
                        <Text className="text-white/60 font-medium text-lg">Scan ticket</Text>
                    </TouchableOpacity>

                    {/* Attendees Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: "black",
                            paddingVertical: height * 0.015,
                            paddingHorizontal: width * 0.07,
                            borderRadius: 999,
                        }}
                        onPress={() =>
                            router.push({
                                pathname: "/(stack)/orders",
                                params: { eventId: selectedEvent?.id },
                            })
                        }
                    >
                        <Text className="text-white font-medium text-lg">Attendees</Text>
                    </TouchableOpacity>
                </BlurView>
            </View>
            <PlaceBottomSheet ref={placeBottomSheetRef} selectedEvent={selectedEvent} setBook={setBook} setFilteredBook={setFilteredBook} updateCheckinStatus={updateCheckinStatus} />
        </View >
    )
}

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

export default Orders