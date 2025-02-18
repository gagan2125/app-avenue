import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Icon1, Icon2 } from '@/assets/icons/SavedEventsIcons'
import { Pressable } from 'react-native'
import PurchasedTicketCard from '@/components/PurchasedTicketCard'

// Demo data for purchased tickets
const purchasedTickets = [
  {
    id: 1,
    image: require("@/assets/images/ticket/ticket1.png"),
    type: "NIGHTLIFE",
    datetime: "2024-12-28T22:00:00",
    title: "After Hours Neon",
    location: "Cloud Nine Club",
    price: "$39",
    isExpired: false,
    isBanner: true,
    special: "cyan" as const,
    specialText: "EVENT STARTS IN 2 DAYS"
  },
  {
    id: 2,
    image: require("@/assets/images/ticket/ticket2.png"),
    type: "MUSIC",
    datetime: "2023-12-20T20:00:00",
    title: "Summer Music Festival",
    location: "Central Park",
    price: "$89",
    isExpired: true,
    isBanner: true,
    special: "orange" as const,
    specialText: "EVENT EXPIRED"
  },
  {
    id: 3,
    image: require("@/assets/images/ticket/ticket3.png"),
    type: "NIGHTLIFE",
    datetime: "2024-12-31T23:00:00",
    title: "New Year's Eve Party",
    location: "Skyline Lounge",
    price: "$149",
    isExpired: false,
    isBanner: true,
    special: "yellow" as const,
    specialText: "VIP ACCESS INCLUDED"
  },
  {
    id: 4,
    image: require("@/assets/images/ticket/ticket1.png"),
    type: "MUSIC",
    datetime: "2024-01-15T20:00:00",
    title: "Jazz Night Live",
    location: "Blue Note Club",
    price: "$59",
    isExpired: false,
    isUsed: true,
    isBanner: true,
    special: "orange" as const,
    specialText: "TICKET HAS BEEN USED"
  }
];

const PurchasedTickets = () => {
  const [toggleTabs, setToggleTabs] = useState("upcoming-events");

  const filteredTickets = toggleTabs === "upcoming-events"
    ? purchasedTickets.filter(ticket => !ticket.isExpired && !ticket.isUsed)
    : purchasedTickets.filter(ticket => ticket.isExpired || ticket.isUsed);

  return (
    <ScrollView className="bg-black h-full px-4 py-8 pb-32">
      {/* Section 1: Logos */}
      <View className="flex-row gap-6">
        <View className="flex-row items-center">
          <Icon1 color="#34B2DA" size={25} />
          <Text className="text-2xl font-medium text-white ml-2">Avenue</Text>
        </View>
        <View className="flex-row items-center">
          <Icon2 color="#F97316" size={25} />
          <Text className="text-2xl font-medium text-white ml-2">Attendee</Text>
        </View>
      </View>

      {/* Section 2: Purchased Tickets Header */}
      <View className="border-white/10 border-[1px] p-6 rounded-2xl mt-6">
        <Text className="text-white text-2xl font-medium leading-9 -tracking-[0.03em]">Purchased Tickets</Text>
        <Text className="text-white/50 text-base font-normal leading-6">
          Here you can see all of your purchased tickets
        </Text>
      </View>

      {/* Section 3: Toggle Tabs */}
      <View className="h-16 flex-row items-center border-white/20 border-[1px] p-1 rounded-full mt-6 mb-1 bg-white/5">
        <Pressable
          onPress={() => setToggleTabs("upcoming-events")}
          className={`${toggleTabs === "upcoming-events" ? "bg-white/10" : "bg-transparent"
            } h-full w-1/2 rounded-full justify-center items-center`}
        >
          <Text className="text-white text-[16px] font-medium leading-[20px]">Upcoming events</Text>
        </Pressable>

        <Pressable
          onPress={() => setToggleTabs("expired-events")}
          className={`${toggleTabs === "expired-events" ? "bg-white/10" : "bg-transparent"
            } h-full w-1/2 rounded-full justify-center items-center`}
        >
          <Text className="text-white text-[16px] font-medium leading-[20px]">Expired events</Text>
        </Pressable>
      </View>

      {/* Section 4: Tickets List */}
      <ScrollView
        contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 6 }}
      >
        {filteredTickets.map((ticket) => (
          <PurchasedTicketCard key={ticket.id} {...ticket} />
        ))}
      </ScrollView>
      <View className="h-32"></View>
    </ScrollView>
  );
};

export default PurchasedTickets;
