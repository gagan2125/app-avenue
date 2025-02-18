import { View, Text, ScrollView, TextInput } from "react-native";
import React, { useState } from "react";
import { BrushIcon, FireIcon, Icon1, Icon2, MoonIcon, MusicIcon, SearchIcon } from "@/assets/icons/SavedEventsIcons";
import { AntDesign } from "@expo/vector-icons";
import { Pressable } from "react-native";
import EventCard from "@/components/EventCard";
import { Platform } from "react-native";

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
  {
    image: require("@/assets/images/ticket/ticket3.png"),
    type: "ART & CULTURE",
    typeIcon: <BrushIcon color="#a3e635" size={12} />,
    datetime: "2025-03-05T15:00:00",
    title: "Spring Fest 2025",
    location: "Chicago, USA",
    ticketLeft: 50,
    price: "$99+",
    isDiscount: false,
    discountPrice: null,
    isBanner: false,
    special: null,
    specialText: null,
    isAvailable: false,
  },
  {
    image: require("@/assets/images/ticket/ticket4.png"),
    type: "MUSIC",
    typeIcon: <MusicIcon color="#832838" size={12} />,
    datetime: "2025-02-25T20:00:00",
    title: "After Hours Neon",
    location: "San Francisco, USA",
    ticketLeft: 0,
    price: "$31,20",
    isDiscount: true,
    discountPrice: "$79",
    isBanner: true,
    special: "green",
    specialText: "20% OFF ENDS IN 2 HOURS",
    isAvailable: true,
  },
  {
    image: require("@/assets/images/ticket/ticket5.png"),
    type: "MUSIC",
    typeIcon: <MusicIcon color="#832838" size={12} />,
    datetime: "2025-02-25T20:00:00",
    title: "After Hours Neon",
    location: "San Francisco, USA",
    ticketLeft: 0,
    price: "$20",
    isDiscount: false,
    discountPrice: null,
    isBanner: false,
    special: null,
    specialText: null,
    isAvailable: true,
  },
];

const SavedEvents = () => {
  const [toggleTabs, setToggleTabs] = useState("all-events");

  const filteredEvents = toggleTabs === "all-events"
    ? events
    : events.filter(event => event.isAvailable);

  return (
    <ScrollView className="bg-black h-full px-4 py-8 pb-32">
      {/* Section 1 */}
      <View className="flex-row gap-6">
        <View className="flex-row items-center">
          <Icon1 color="#34B2DA" size={25} />
          <Text className="text-2xl font-medium text-white ml-2">Avenue</Text>
        </View>
        <View className="flex-row items-center">
          <Icon2 color="#F97316" size={25} />
          <Text className="text-2xl font-medium text-white ml-2">Avenue</Text>
        </View>
      </View>
      {/* section 2 */}
      <View className="border-white/10 border-[1px] p-6 rounded-2xl mt-6">
        <Text className="text-white text-2xl font-medium leading-9 -tracking-[0.03em]">Saved Events</Text>
        <Text className="text-white/50 text-base font-normal leading-6">
          Here you can see all of your purchased tickets
        </Text>
      </View>


      <View className="flex-row items-center border-white/20 border-[1px] rounded-full mt-6  px-4 h-14">
        <SearchIcon color="#FFFFFF" size={20} />
        <TextInput
          className="flex-1 text-base text-white ml-3 relative h-full"
          placeholder="Search for saved events..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          defaultValue=""
          style={{ fontSize: Platform.OS === 'ios' ? 16 : 14 }}
        />
      </View>


      {/* section 4 */}

      <View className="h-16 flex-row items-center border-white/20 border-[1px] p-1 rounded-full mt-6 mb-1 bg-white/5">
        <Pressable
          onPress={() => setToggleTabs("all-events")}
          className={`${toggleTabs === "all-events" ? "bg-white/10" : "bg-transparent"
            } h-full w-1/2 rounded-full justify-center items-center`}
        >
          <Text className="text-white text-[16px] font-medium leading-[20px]">All Events</Text>
        </Pressable>

        <Pressable
          onPress={() => setToggleTabs("only-available")}
          className={`${toggleTabs === "only-available" ? "bg-white/10" : "bg-transparent"
            } h-full w-1/2 rounded-full justify-center items-center`}
        >
          <Text className="text-white text-[16px] font-medium leading-[20px]">Only Available</Text>
        </Pressable>
      </View>

      {/* section 5 */}
      <ScrollView
        contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 6 }}
      >
        {filteredEvents.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </ScrollView>
      <View className="h-32"></View>
    </ScrollView>
  );
};

export default SavedEvents;
