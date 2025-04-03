import { LockIcon, LogoutIcon } from "@/assets/icons/ProfileIcons";
import { Icon1, Icon2 } from "@/assets/icons/SavedEventsIcons";
import LegalSection from "@/components/Legal";
import ProfileCard from "@/components/ProfileCard";
import ProfileDetailCard from "@/components/ProfileDetailCard";
import url from "@/constants/url";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { Dimensions, Platform, Pressable, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");


const OrgProfile = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { organizerId } = useLocalSearchParams();
    const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(false);

    // Fetch organizer data with React Query
    const { data: organizer, isLoading: isLoadingOrganizer } = useQuery({
        queryKey: ['organizer', organizerId],
        queryFn: async () => {
            const response = await axios.get(`${url}/get-organizer/${organizerId}`);
            return response.data;
        },
        enabled: !!organizerId,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Fetch events data with React Query
    const { data: events = [], isLoading: isLoadingEvents } = useQuery({
        queryKey: ['organizer-events', organizerId],
        queryFn: async () => {
            const response = await axios.get(`${url}/event/get-event-by-organizer-id/${organizerId}`);
            return response.data;
        },
        enabled: !!organizerId,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Filter events
    const { filteredEvents, filteredPastEvents } = useCallback(() => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const upcomingEvents = events.filter((event: any) => {
            const eventDate = new Date(event.start_date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= currentDate && event.explore === "YES";
        });

        const pastEvents = events.filter((event: any) => {
            const eventDate = new Date(event.start_date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate < currentDate && event.explore === "YES";
        });

        return { filteredEvents: upcomingEvents, filteredPastEvents: pastEvents };
    }, [events])();

    const formattedDate = organizer?.createdAt ? new Date(organizer.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
    }) : '';

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={{ position: 'absolute', top: insets.top + 10, left: 16, zIndex: 50 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="bg-black flex-1 px-4" style={{ marginTop: insets.top + 50 }}>
                {/* Profile Card */}
                <ProfileCard
                    name={organizer?.name || ''}
                    joinDate={formattedDate}
                    purchasedTickets={filteredEvents.length}
                    savedTickets={filteredPastEvents.length}
                    loading={isLoadingOrganizer || isLoadingEvents}
                />

                {/* Basic Details */}
                {/* <ProfileDetailCard /> */}

                {/* Privacy Section */}
                {/* <View className="border border-white/10 w-full bg-black overflow-hidden rounded-3xl mt-6 relative z-10">
                    <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }} className="bg-white/10 flex-row items-center p-4 border-b border-white/10">
                        <View className="w-8 h-8 items-center justify-center">
                            <LockIcon color="#FFFFFF" size={16} />
                        </View>
                        <Text className="text-white text-xl font-medium ml-2">Privacy</Text>
                    </View>

                    <View className="p-4">
                        <Text className="text-white text-xl font-medium">
                            Show me in event page
                        </Text>
                        <Text className="text-[#8E9196] text-base mt-2">
                            Allow others to see you're attending events
                        </Text>
                        <View className="mt-4 flex-row">
                            <Switch
                                value={isPrivacyEnabled}
                                onValueChange={setIsPrivacyEnabled}
                                trackColor={{ false: "#2C2C2E", true: "#2C2C2E" }}
                                thumbColor={isPrivacyEnabled ? "#34B2DA" : "#FFFFFF"}
                                ios_backgroundColor="#2C2C2E"
                                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                            />
                            <View style={{ flex: 1 }} />
                        </View>
                    </View>
                </View> */}

                {/* Legal Section */}
                {/* <LegalSection /> */}
                <View className="space-y-2">
                    {/* <Text className="text-xl font-normal text-white">Logout</Text>
                    <Text className="text-base text-[#8E9196] mt-2">
                        You will be logged out of your account
                    </Text> */}
                    <View className="flex-row justify-center my-4">
                        <Pressable
                            onPress={() => router.push('/')}
                            className="p-4 rounded-full mt-3 w-full flex-row items-center justify-center gap-2 px-6 py-4 bg-black border border-white/10"
                        >
                            <LogoutIcon color="#F43F5E" size={14} />
                            <Text style={{ color: "#F43F5E" }} className="text-md font-medium ml-2">
                                Logout
                            </Text>
                        </Pressable>
                    </View>

                </View>
                {/* Bottom Spacing */}
                <View className="h-32" />
            </ScrollView>

        </GestureHandlerRootView>
    );
};

export default OrgProfile;
