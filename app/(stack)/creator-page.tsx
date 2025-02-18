import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Icon1, Icon2 } from "@/assets/icons/SavedEventsIcons";
import { EarthIcon, InstagramIcon, TwitterIcon } from "@/assets/icons/HostProfileIcons";
import { CalendarIcon } from "@/assets/icons/TicketIcons";
import { MoonIcon, MusicIcon } from "@/assets/icons/SavedEventsIcons";
import EventCard from "@/components/EventCard";

const events = [
    {
        image: require("@/assets/images/ticket/ticket1.png"),
        type: "NIGHTLIFE",
        typeIcon: <MoonIcon color="#A855F7" size={12} />,
        datetime: "2025-02-20T18:00:00",
        title: "After Hours Neon",
        location: "Cloud Nine Club",
        ticketLeft: 5,
        price: "Free",
        isDiscount: false,
        discountPrice: null,
        isBanner: true,
        special: "red",
        specialText: "ONLY 5 TICKETS LEFT",
        isAvailable: true,
    },
    {
        image: require("@/assets/images/ticket/ticket2.png"),
        type: "MUSIC",
        typeIcon: <MusicIcon color="#832838" size={12} />,
        datetime: "2025-02-18T10:00:00",
        title: "After Hours Neon",
        location: "Los Angeles, USA",
        ticketLeft: 20,
        price: "Expired",
        isDiscount: false,
        discountPrice: null,
        isBanner: false,
        special: null,
        specialText: null,
        isAvailable: false,
    },
];

const CreatorPage = () => {
    const router = useRouter();
    const [toggleTabs, setToggleTabs] = useState("live-events");

    const filteredEvents = toggleTabs === "live-events"
        ? events.filter(event => event.isAvailable)
        : events.filter(event => !event.isAvailable);

    return (
        <View className="flex-1 bg-black">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Main Content Container */}
                <View className="p-4">
                    {/* Avenue Section */}
                    <View className="flex-row gap-6 mt-8 mb-8">
                        <View className="flex-row items-center">
                            <Icon1 color="#34B2DA" size={25} />
                            <Text className="text-2xl font-medium text-white ml-2">Avenue</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Icon2 color="#F97316" size={25} />
                            <Text className="text-2xl font-medium text-white ml-2">Attendee</Text>
                        </View>
                    </View>

                    {/* Profile Container */}
                    <View className="p-4 border border-white/5 rounded-3xl">
                        {/* Profile Section */}
                        <View className="items-start">
                            <View className="w-20 h-20 bg-[#34b2da] rounded-full justify-center items-center">
                                <Text className="text-black text-3xl font-semibold">RL</Text>
                            </View>
                            <Text className="text-white text-2xl font-semibold mt-4">Rumba Latina</Text>
                            <Text className="text-white/50 mt-2 flex-row items-center">
                                <CalendarIcon color="gray" size={12} /> Organizer since December 2024
                            </Text>
                        </View>

                        {/* Stats Section */}
                        <View className="mt-6 bg-black rounded-3xl border border-white/5">
                            <View className="flex-row justify-between py-4">
                                <View className="flex-1 items-center">
                                    <Text className="text-sm text-gray-400">Live</Text>
                                    <Text className="text-2xl mt-2 font-semibold text-white">18</Text>
                                </View>

                                <View className="w-[1px] bg-white/5 h-12 self-center" />

                                <View className="flex-1 items-center">
                                    <Text className="text-sm text-gray-400">Past</Text>
                                    <Text className="text-2xl mt-2 font-semibold text-white">6</Text>
                                </View>
                            </View>
                        </View>

                        {/* Social Media Icons */}
                        <View className="flex-row justify-between mt-6">
                            <Pressable className="flex-1 border border-white/5 rounded-full py-4 mx-1 items-center">
                                <TwitterIcon color="white" size={20} />
                            </Pressable>
                            <Pressable className="flex-1 border border-white/5 rounded-full py-4 mx-1 items-center">
                                <InstagramIcon color="white" size={20} />
                            </Pressable>
                            <Pressable className="flex-1 border border-white/5 rounded-full py-4 mx-1 items-center">
                                <EarthIcon color="white" size={20} />
                            </Pressable>
                        </View>
                    </View>

                    {/* Tab Switch */}
                    <View className="h-16 flex-row items-center border-white/5 border p-1 rounded-full mt-6 mb-1">
                        <Pressable
                            onPress={() => setToggleTabs("live-events")}
                            className={`${toggleTabs === "live-events" ? "bg-white/5" : "bg-transparent"} h-full w-1/2 rounded-full justify-center items-center`}
                        >
                            <Text className="text-white text-[16px] font-medium leading-[20px]">Live Events</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setToggleTabs("past-events")}
                            className={`${toggleTabs === "past-events" ? "bg-white/5" : "bg-transparent"} h-full w-1/2 rounded-full justify-center items-center`}
                        >
                            <Text className="text-white text-[16px] font-medium leading-[20px]">Past Events</Text>
                        </Pressable>
                    </View>

                    {/* Events List */}
                    <View className="mt-4">
                        {filteredEvents.map((event, index) => (
                            <EventCard key={index} {...event} disableNavigation={true} />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default CreatorPage; 