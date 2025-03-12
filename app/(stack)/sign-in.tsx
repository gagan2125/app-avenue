import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  FontAwesome5,
  Ionicons,
  Entypo,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useState, useRef } from "react";
import { BookMarkIcon, CrossIcon, Icon1, PlaceIcon, PriceIcon } from "@/assets/icons/HomeIcons";
import { useRouter } from 'expo-router';
import PlaceBottomSheet, { PlaceBottomSheetRef } from '@/components/PlaceBottomSheet';
import { CalendarIcon, RegularIcon, VipIcon, EarlyBirdIcon, OfferIcon, MoonIcon } from "@/assets/icons/TicketIcons";
import { BrushIcon, MusicIcon } from "@/assets/icons/SavedEventsIcons";
import { LinearGradient } from "expo-linear-gradient";
import DateBottomSheet, { DateBottomSheetRef } from '@/components/DateBottomSheet';
import PriceBottomSheet, { PriceBottomSheetRef } from '@/components/PriceBottomSheet';
import React from "react";
import { useFilter } from '@/context/FilterContext';
import image1 from "@/assets/images/ticket/ticket1.png"
import { StatusBar } from 'expo-status-bar';

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

const events = [
  {
    id: 1,
    category: "Arts & Culture",
    date: "28 DEC 22:00",
    image: image1,
    title: "Abstract Horizons",
    location: "Modern Arts Center",
    price: "$39+",
  },
  {
    id: 2,
    category: "Nightlife",
    date: "30 DEC 20:00",
    image: require("@/assets/images/ticket/ticket4.png"),
    title: "Rock Night",
    location: "Open Arena",
    price: "$50+",
  },
  {
    id: 3,
    category: "Music",
    date: "5 JAN 18:00",
    image: require("@/assets/images/ticket/ticket2.png"),
    title: "Championship Finals",
    location: "City Stadium",
    price: "$20+",
  },
  {
    id: 4,
    category: "Nightlife",
    date: "15 JAN 10:00",
    image: require("@/assets/images/ticket/ticket3.png"),
    title: "Tech Conference 2025",
    location: "Tech Park",
    price: "Free",
  },
];

export default function Index() {
  const router = useRouter();
  const [bookmarkedEvents, setBookmarkedEvents] = useState<number[]>([]);
  const placeBottomSheetRef = useRef<PlaceBottomSheetRef>(null);
  const dateBottomSheetRef = useRef<DateBottomSheetRef>(null);
  const priceBottomSheetRef = useRef<PriceBottomSheetRef>(null);
  const { placeFilter, priceFilter, dateFilter, totalResults, clearAllFilters } = useFilter();

  const hasActiveFilters = placeFilter || priceFilter || dateFilter;

  const categories = [
    { id: 'all', label: 'All', icon: null, color: null },
    { id: 'music', label: 'Music', icon: 'music', color: 'red', IconComponent: FontAwesome5 },
    { id: 'nightlife', label: 'Nightlife', icon: 'moon', color: 'purple', IconComponent: Ionicons },
    { id: 'sport', label: 'Sport', icon: 'fire', color: 'orange', IconComponent: FontAwesome5 },
    { id: 'theater', label: 'Theater', icon: 'theater-masks', color: 'pink', IconComponent: FontAwesome5 },
    { id: 'art', label: 'Art', icon: 'paint-brush', color: 'cyan', IconComponent: FontAwesome5 },
    { id: 'food', label: 'Food', icon: 'utensils', color: 'yellow', IconComponent: FontAwesome5 },
    { id: 'education', label: 'Education', icon: 'graduation-cap', color: 'green', IconComponent: FontAwesome5 },
  ];

  const toggleBookmark = (eventId: number) => {
    setBookmarkedEvents(
      (prev) =>
        prev.includes(eventId)
          ? prev.filter((id) => id !== eventId) // Remove bookmark
          : [...prev, eventId] // Add bookmark
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar style="light" />
      <ScrollView className="px-4 py-8 mt-5">
        {hasActiveFilters ? (
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-medium text-4xl">{totalResults} results{'\n'}based on filters</Text>

          </View>
        ) : (
          <Text className="text-white font-medium text-4xl">Explore Events</Text>
        )}

        {/* Section 1 */}
        <View className="relative w-full">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="w-full mt-6"
            contentContainerStyle={{ gap: 10, paddingRight: 100 }}
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                className={`${category.id === 'all' ? 'bg-white' : 'bg-black border border-white/10'
                  } rounded-full px-6 py-3 flex items-center justify-center`}
              >
                {category.icon ? (
                  <View className="flex-row items-center">
                    <category.IconComponent name={category.icon} size={16} color={category.color} />
                    <Text className={`${category.id === 'all' ? 'text-black' : 'text-white'
                      } font-medium ml-3`}>{category.label}</Text>
                  </View>
                ) : (
                  <Text className="text-black font-medium">{category.label}</Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
          <LinearGradient
            colors={["transparent", "#00000082"]}
            start={{ x: 0.7, y: 0 }}
            end={{ x: 0.9, y: 0 }}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 200,
              height: '100%',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        </View>

        {/* Section 2 */}
        <View className="border  border-white/10 rounded-3xl mt-6 p-2">
          <View className="flex-row justify-between gap-2">
            <Pressable
              className="flex-1 bg-[#141414] h-20 rounded-2xl items-center justify-center relative"
              onPress={() => placeBottomSheetRef.current?.open()}
            >
              <View className="flex-col items-center">
                <PlaceIcon color="white" size={20} />
                <View className="flex-row items-center gap-1 mt-1">
                  <Text className="text-white font-medium text-lg">Place</Text>
                  {placeFilter && (
                    <View className=" bg-[#172428] w-5 h-5 rounded-md items-center justify-center">
                      <Text className="text-[#34b2da] text-xs font-bold">2</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
            <Pressable
              className="flex-1 bg-[#141414] h-20 rounded-2xl items-center justify-center relative"
              onPress={() => priceBottomSheetRef.current?.open()}
            >
              <View className="flex-col items-center">
                <PriceIcon color="white" size={20} />
                {
                  <View className="flex-row items-center gap-1 mt-1">
                    <Text className="text-white font-medium text-lg">Price</Text>
                    {priceFilter && (
                      <View className=" bg-[#172428] w-5 h-5 rounded-md items-center justify-center">
                        <Text className="text-[#34b2da] text-xs font-bold">2</Text>
                      </View>
                    )}
                  </View>
                }
              </View>
            </Pressable>
            <Pressable
              className="flex-1 bg-[#141414] h-20 rounded-2xl items-center justify-center relative"
              onPress={() => dateBottomSheetRef.current?.open()}
            >
              <View className="flex-col items-center">
                <CalendarIcon color="gray" size={18} />
                <View className="flex-row items-center gap-1 mt-1">
                  <Text className="text-white font-medium text-lg">Date</Text>
                  {dateFilter && dateFilter.length > 0 && (
                    <View className=" bg-[#172428] w-5 h-5 rounded-md items-center justify-center">
                      <Text className="text-[#34b2da] text-xs font-bold">{dateFilter.length}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          </View>
        </View>


        {/* clear all filters */}
        {
          hasActiveFilters && (<Pressable
            className="p-4 border border-white/10 rounded-full mt-4 flex-row items-center gap-2 justify-center"
            onPress={clearAllFilters}
          >
            <CrossIcon color="white" size={16} />
            <Text className="text-white text-lg font-medium text-center">Clear all filters</Text>
          </Pressable>)
        }

        {/* Card Section */}
        <View className="mt-8">
          {events.map((event) => (
            <Pressable
              key={event.id}
              className="bg-card rounded-2xl overflow-hidden p-4 mb-6"
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
                <View className="flex-row items-center gap-2 flex-1 mr-4">
                  {getTicketIcon(event.category)}
                  <Text className="text-white/50 font-medium uppercase flex-shrink-0" numberOfLines={1}>
                    {event.category}
                  </Text>
                </View>
                <Text className="text-white font-medium flex-shrink-0">{event.date}</Text>
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
                <TouchableOpacity className="h-20 w-20 rounded-xl overflow-hidden">
                  <Image
                    source={event.image}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <Pressable
                  className="w-14 flex items-center justify-center h-14 border border-white/10 rounded-full p-2"
                  onPress={() => toggleBookmark(event.id)}
                >
                  {bookmarkedEvents.includes(event.id) ? (
                    <Icon1 color="#6EE7B7" size={15} />
                  ) : (
                    <BookMarkIcon color="white" size={20} />
                  )}
                </Pressable>
              </View>

              <View className="mt-4 flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-medium text-xl">
                    {event.title}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <PlaceIcon color="white" size={16} />
                    <Text className="text-gray-400 font-medium text-md ml-1">
                      {event.location}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-end">
                  {
                    event.price.includes('$') ? (
                      <>
                        <Text className="text-white/50 font-medium text-3xl">
                          $
                        </Text>
                        <Text className="text-white font-medium text-3xl">
                          {event.price.replace('$', '')}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-white font-medium text-3xl">
                        {event.price}
                      </Text>
                    )
                  }
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        <View className="h-32"></View>
      </ScrollView >
      <PlaceBottomSheet ref={placeBottomSheetRef} />
      <DateBottomSheet ref={dateBottomSheetRef} />
      <PriceBottomSheet ref={priceBottomSheetRef} />
    </View >
  );
}
