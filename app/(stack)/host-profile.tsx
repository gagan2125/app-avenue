import { View, Text, TouchableOpacity, Image, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { EarthIcon, InstagramIcon, TwitterIcon } from '@/assets/icons/HostProfileIcons';
import { CalendarIcon } from '@/assets/icons/TicketIcons';

const events = [
    {
        id: 1,
        category: "ARTS & CULTURE",
        date: "28 DEC 22:00",
        image: require("@/assets/images/ticket/ticket1.png"),
        title: "Abstract Horizons",
        location: "Modern Arts Center",
        price: "$39+",
        isLive: true
    },
    {
        id: 2,
        category: "NIGHTLIFE",
        date: "28 DEC 22:00",
        image: require("@/assets/images/ticket/ticket2.png"),
        title: "After Hours Neon",
        location: "Cloud Nine Club",
        price: "Free",
        isLive: true
    },
    {
        id: 3,
        category: "MUSIC",
        date: "15 NOV 20:00",
        image: require("@/assets/images/ticket/ticket3.png"),
        title: "Electric Dreams Festival",
        location: "Haydar Aliyev Center",
        price: "$9+",
        isLive: false
    },
    {
        id: 4,
        category: "ARTS & CULTURE",
        date: "10 NOV 19:00",
        image: require("@/assets/images/ticket/ticket4.png"),
        title: "Modern Art Exhibition",
        location: "City Gallery",
        price: "$25",
        isLive: false
    },
    {
        id: 5,
        category: "MUSIC",
        date: "30 DEC 21:00",
        image: require("@/assets/images/ticket/ticket1.png"),
        title: "Jazz Night Special",
        location: "Blue Note Club",
        price: "$45+",
        isLive: true
    },
    {
        id: 6,
        category: "NIGHTLIFE",
        date: "31 DEC 23:00",
        image: require("@/assets/images/ticket/ticket2.png"),
        title: "New Year's Eve Party",
        location: "Skyline Lounge",
        price: "$99+",
        isLive: true
    },
    {
        id: 7,
        category: "ARTS & CULTURE",
        date: "05 OCT 19:00",
        image: require("@/assets/images/ticket/ticket3.png"),
        title: "Photography Exhibition",
        location: "Contemporary Gallery",
        price: "$15",
        isLive: false
    },
    {
        id: 8,
        category: "MUSIC",
        date: "29 DEC 20:00",
        image: require("@/assets/images/ticket/ticket4.png"),
        title: "Rock Band Live",
        location: "Stadium Arena",
        price: "$75+",
        isLive: true
    },
    {
        id: 9,
        category: "NIGHTLIFE",
        date: "01 SEP 22:00",
        image: require("@/assets/images/ticket/ticket1.png"),
        title: "Summer Closing Party",
        location: "Beach Club",
        price: "$30",
        isLive: false
    },
    {
        id: 10,
        category: "ARTS & CULTURE",
        date: "27 DEC 18:00",
        image: require("@/assets/images/ticket/ticket2.png"),
        title: "Digital Art Show",
        location: "Tech Museum",
        price: "$29+",
        isLive: true
    },
    {
        id: 11,
        category: "MUSIC",
        date: "15 AUG 20:00",
        image: require("@/assets/images/ticket/ticket3.png"),
        title: "Summer Music Festival",
        location: "Central Park",
        price: "$85",
        isLive: false
    },
    {
        id: 12,
        category: "NIGHTLIFE",
        date: "25 DEC 23:00",
        image: require("@/assets/images/ticket/ticket4.png"),
        title: "Christmas Special",
        location: "Winter Lodge",
        price: "$55+",
        isLive: true
    }
];

export default function HostProfile() {
    const router = useRouter();
    const [toggleTabs, setToggleTabs] = useState("live");
    const [bookmarkedEvents, setBookmarkedEvents] = useState<number[]>([]);

    const filteredEvents = events.filter(event =>
        toggleTabs === "live" ? event.isLive : !event.isLive
    );

    const toggleBookmark = (eventId: number) => {
        setBookmarkedEvents(prev =>
            prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        );
    };

    return (
        <View className="flex-1 bg-black">
            {/* Fixed Header */}
            <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between pt-14 px-5 pb-4 bg-black">
                <View className="flex-row items-center">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-white/10 rounded-full justify-center items-center"
                    >
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </Pressable>
                    <View className="w-12 h-12 bg-[#34b2da] rounded-full justify-center items-center ml-3">
                        <Text className="text-black text-xl font-semibold">RL</Text>
                    </View>
                </View>

                <View className="flex-row gap-4">
                    <Pressable className='border border-white/10 rounded-full p-4'>
                        <TwitterIcon color="white" size={20} />
                    </Pressable>
                    <Pressable className='border border-white/10 rounded-full p-4'>
                        <InstagramIcon color="white" size={20} />
                    </Pressable>
                    <Pressable className='border border-white/10 rounded-full p-4'>
                        <EarthIcon color="white" size={20} />
                    </Pressable>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                className="flex-1 mt-[116px]"
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Info */}
                <View className="px-5">
                    <Text className="text-white text-[28px] font-semibold">Rumba Latina</Text>
                    <Text className="text-white/50 mt-2"><CalendarIcon color="gray" size={12} /> Organizer since December 2024</Text>

                    {/* Stats */}
                    <View className="mt-6 flex-row justify-between bg-black rounded-3xl p-4 border border-white/10">
                        <View className="flex-1 flex-col items-center">
                            <Text className="text-sm text-gray-400">Live</Text>
                            <Text className="text-2xl mt-2 font-semibold text-white">
                                18
                            </Text>
                        </View>

                        <Text style={{ width: .1, backgroundColor: "white", opacity: .1 }} className="self-center h-full"></Text>

                        <View className="flex-1 flex-col items-center">
                            <Text className="text-sm text-gray-400">Past</Text>
                            <Text className="text-2xl mt-2 font-semibold text-white">
                                32
                            </Text>
                        </View>
                    </View>

                    {/* Toggle Tabs */}
                    <View className="h-16 flex-row items-center p-1 rounded-full bg-black mt-6 border border-white/10">
                        <Pressable
                            onPress={() => setToggleTabs("live")}
                            className={`flex-1 h-full rounded-full justify-center items-center ${toggleTabs === "live" ? "bg-[#141414]" : ""}`}
                        >
                            <Text className="text-white text-lg font-medium">Live events</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setToggleTabs("past")}
                            className={`flex-1 h-full rounded-full justify-center items-center ${toggleTabs === "past" ? "bg-[#141414]" : ""}`}
                        >
                            <Text className="text-white text-lg font-medium">Past events</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Events List */}
                <View className="p-5">
                    {filteredEvents.map((event) => (
                        <Pressable
                            key={event.id}
                            className="bg-[#0F0F0F] rounded-2xl p-4 mb-4"
                            onPress={() => {
                                router.push({
                                    pathname: "/(stack)/event-details",
                                    params: {
                                        id: event.id,
                                        title: event.title,
                                        category: event.category,
                                        location: event.location,
                                        date: event.date,
                                        price: event.price,
                                        image: event.image
                                    }
                                });
                            }}
                        >
                            <View className="flex-row justify-between">
                                <Text className="text-white font-medium">{event.category}</Text>
                                <Text className="text-white font-medium">{event.date}</Text>
                            </View>

                            <View className="flex-row justify-between items-center mt-4">
                                {Array(20).fill(0).map((_, index) => (
                                    <View
                                        key={index}
                                        className="w-2 h-1 bg-black/50 rounded-full mx-[1px]"
                                    />
                                ))}
                            </View>

                            <View className="mt-4 flex-row justify-between items-center">
                                <Image
                                    source={event.image}
                                    className="w-20 h-20 rounded-xl"
                                />
                                {event.isLive && (
                                    <Pressable
                                        className="w-14 h-14 border border-white/10 rounded-full items-center justify-center"
                                        onPress={() => toggleBookmark(event.id)}
                                    >
                                        <FontAwesome
                                            name={bookmarkedEvents.includes(event.id) ? "bookmark" : "bookmark-o"}
                                            size={20}
                                            color="gray"
                                        />
                                    </Pressable>
                                )}
                            </View>

                            <View className="mt-4 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-white text-xl font-semibold">
                                        {event.title}
                                    </Text>
                                    <View className="flex-row items-center mt-2">
                                        <Entypo name="location-pin" size={20} color="gray" />
                                        <Text className="text-gray-500 ml-1">
                                            {event.location}
                                        </Text>
                                    </View>
                                </View>
                                {event.isLive && (
                                    <Text className="text-white text-2xl font-semibold">
                                        {event.price}
                                    </Text>
                                )}
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
} 