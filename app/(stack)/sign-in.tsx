import {
    BookMarkIcon,
    CrossIcon,
    Icon1,
    PlaceIcon,
    PriceIcon
  } from "@/assets/icons/HomeIcons";
  import { BrushIcon, MusicIcon } from "@/assets/icons/SavedEventsIcons";
  import {
    CalendarIcon,
    MoonIcon,
    OfferIcon,
    RegularIcon
  } from "@/assets/icons/TicketIcons";
  import image1 from "@/assets/images/ticket/ticket1.png";
  import DateBottomSheet, {
    DateBottomSheetRef
  } from "@/components/DateBottomSheet";
  import PlaceBottomSheet, {
    PlaceBottomSheetRef
  } from "@/components/PlaceBottomSheet";
  import PriceBottomSheet, {
    PriceBottomSheetRef
  } from "@/components/PriceBottomSheet";
  import { useFilter } from "@/context/FilterContext";
  import { FontAwesome5, Ionicons } from "@expo/vector-icons";
  import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
  import { LinearGradient } from "expo-linear-gradient";
  import { useRouter } from "expo-router";
  import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
  import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
  } from "react-native";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
  
  const getTicketIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "arts & culture":
        return <BrushIcon color="#9bda33" size={13} />;
      case "music":
        return <MusicIcon color="#cd364f" size={16} />;
      case "sport":
        return <RegularIcon color="#34B2DA" size={16} />;
      case "tech":
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
      price: "$39+"
    },
    {
      id: 2,
      category: "Nightlife",
      date: "30 DEC 20:00",
      image: require("@/assets/images/ticket/ticket4.png"),
      title: "Rock Night",
      location: "Open Arena",
      price: "$50+"
    },
    {
      id: 3,
      category: "Music",
      date: "5 JAN 18:00",
      image: require("@/assets/images/ticket/ticket2.png"),
      title: "Championship Finals",
      location: "City Stadium",
      price: "$20+"
    },
    {
      id: 4,
      category: "Nightlife",
      date: "15 JAN 10:00",
      image: require("@/assets/images/ticket/ticket3.png"),
      title: "Tech Conference 2025",
      location: "Tech Park",
      price: "Free"
    }
  ];
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000000"
    },
    scrollView: {
      flex: 1,
      backgroundColor: "#000",
      paddingHorizontal: 16,
      paddingTop: 32,
      paddingBottom: 128
    },
    title: {
      color: "white",
      fontWeight: "500",
      fontSize: 36
    },
    categoriesContainer: {
      position: "relative",
      width: "100%",
      marginTop: 24
    },
    horizontalScroll: {
      width: "100%"
    },
    categoryButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 100,
      marginRight: 10,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row"
    },
    categoriesGradient: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 80,
      height: "100%",
      zIndex: 1
    },
    filterContainer: {
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 24,
      marginTop: 24,
      padding: 8
    },
    filterRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8
    },
    filterButton: {
      flex: 1,
      backgroundColor: "#141414",
      height: 80,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center"
    },
    filterButtonText: {
      color: "white",
      fontWeight: "500",
      fontSize: 18,
      marginTop: 4
    },
    clearFiltersButton: {
      padding: 16,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 100,
      marginTop: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    },
    clearFiltersText: {
      color: "white",
      fontSize: 18,
      fontWeight: "500",
      textAlign: "center"
    },
    cardsContainer: {
      marginTop: 32
    },
    eventCard: {
      backgroundColor: "#111111",
      borderRadius: 16,
      overflow: "hidden",
      padding: 16,
      marginBottom: 24
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between"
    },
    cardCategory: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
      marginRight: 16
    },
    cardCategoryText: {
      color: "rgba(255, 255, 255, 0.5)",
      fontWeight: "500",
      textTransform: "uppercase"
    },
    cardDate: {
      color: "white",
      fontWeight: "500"
    },
    cardDivider: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginTop: 16
    },
    dividerDot: {
      width: 8,
      height: 4,
      backgroundColor: "black",
      borderRadius: 100,
      marginHorizontal: 2
    },
    cardContent: {
      marginTop: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    cardImage: {
      height: 80,
      width: 80,
      borderRadius: 12,
      overflow: "hidden"
    },
    bookmarkButton: {
      width: 56,
      height: 56,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 100,
      alignItems: "center",
      justifyContent: "center"
    },
    cardFooter: {
      marginTop: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    eventTitle: {
      color: "white",
      fontWeight: "500",
      fontSize: 20
    },
    eventLocation: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8
    },
    locationText: {
      color: "rgba(255, 255, 255, 0.4)",
      fontWeight: "500",
      marginLeft: 4
    },
    eventPrice: {
      flexDirection: "row",
      alignItems: "flex-end"
    },
    priceCurrency: {
      color: "rgba(255, 255, 255, 0.5)",
      fontWeight: "500",
      fontSize: 30
    },
    priceValue: {
      color: "white",
      fontWeight: "500",
      fontSize: 30
    }
  });
  
  export default function SignIn() {
    const router = useRouter();
    const [bookmarkedEvents, setBookmarkedEvents] = useState<number[]>([]);
    const placeBottomSheetRef = useRef<PlaceBottomSheetRef>(null);
    const dateBottomSheetRef = useRef<DateBottomSheetRef>(null);
    const priceBottomSheetRef = useRef<PriceBottomSheetRef>(null);
    
    // Track which bottom sheet is ready to render
    const [readyBottomSheets, setReadyBottomSheets] = useState({
      place: false,
      date: false,
      price: false
    });
    
    // Initialize bottom sheets with useLayoutEffect for proper timing
    useLayoutEffect(() => {
      // Use a small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        setReadyBottomSheets({
          place: true,
          date: true,
          price: true
        });
      }, 200);
      
      return () => {
        clearTimeout(timer);
        // Close any open bottom sheets on unmount
        if (placeBottomSheetRef.current) {
          placeBottomSheetRef.current.close?.();
        }
        if (dateBottomSheetRef.current) {
          dateBottomSheetRef.current.close?.();
        }
        if (priceBottomSheetRef.current) {
          priceBottomSheetRef.current.close?.();
        }
      };
    }, []);
    
    // Safe open methods with proper timing
    const openPlaceBottomSheet = useCallback(() => {
      if (placeBottomSheetRef.current?.open) {
        placeBottomSheetRef.current.open();
      }
    }, []);
    
    const openDateBottomSheet = useCallback(() => {
      if (dateBottomSheetRef.current?.open) {
        dateBottomSheetRef.current.open();
      }
    }, []);
    
    const openPriceBottomSheet = useCallback(() => {
      if (priceBottomSheetRef.current?.open) {
        priceBottomSheetRef.current.open();
      }
    }, []);
    
    const {
      placeFilter,
      priceFilter,
      dateFilter,
      totalResults,
      clearAllFilters
    } = useFilter();
  
    const hasActiveFilters = placeFilter || priceFilter || dateFilter;
  
    const categories = [
      { id: "all", label: "All", icon: null, color: null },
      {
        id: "music",
        label: "Music",
        icon: "music",
        color: "red",
        IconComponent: FontAwesome5
      },
      {
        id: "nightlife",
        label: "Nightlife",
        icon: "moon",
        color: "purple",
        IconComponent: Ionicons
      },
      {
        id: "sport",
        label: "Sport",
        icon: "fire",
        color: "orange",
        IconComponent: FontAwesome5
      },
      {
        id: "theater",
        label: "Theater",
        icon: "theater-masks",
        color: "pink",
        IconComponent: FontAwesome5
      },
      {
        id: "art",
        label: "Art",
        icon: "paint-brush",
        color: "cyan",
        IconComponent: FontAwesome5
      },
      {
        id: "food",
        label: "Food",
        icon: "utensils",
        color: "yellow",
        IconComponent: FontAwesome5
      },
      {
        id: "education",
        label: "Education",
        icon: "graduation-cap",
        color: "green",
        IconComponent: FontAwesome5
      }
    ];
  
    const toggleBookmark = useCallback((eventId: number) => {
      setBookmarkedEvents(
        (prev) =>
          prev.includes(eventId)
            ? prev.filter((id) => id !== eventId) // Remove bookmark
            : [...prev, eventId] // Add bookmark
      );
    }, []);
  
    type EventType = {
      id: number;
      title: string;
      category: string;
      location: string;
      date: string;
      price: string;
      image: any;
    };
  
    const handleEventPress = useCallback(
      (event: EventType) => {
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
      },
      [router]
    );
  
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ScrollView className="bg-black h-full px-4 py-8 pb-32">
            <View style={styles.container}>
              <ScrollView style={styles.scrollView}>
                {hasActiveFilters ? (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={styles.title}>
                      {totalResults} results{"\n"}based on filters
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.title}>Explore Events</Text>
                )} 
  
                {/* Categories */}
               <View style={styles.categoriesContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                    contentContainerStyle={{ paddingRight: 100 }}
                  >
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryButton,
                          {
                            backgroundColor:
                              category.id === "all" ? "white" : "black",
                            borderWidth: category.id === "all" ? 0 : 1,
                            borderColor: "rgba(255, 255, 255, 0.1)"
                          }
                        ]}
                        activeOpacity={0.6}
                      >
                        {category.icon ? (
                          <View
                            style={{ flexDirection: "row", alignItems: "center" }}
                          >
                            <category.IconComponent
                              name={category.icon}
                              size={16}
                              color={category.color}
                            />
                            <Text
                              style={{
                                color: category.id === "all" ? "black" : "white",
                                fontWeight: "500",
                                marginLeft: 12
                              }}
                            >
                              {category.label}
                            </Text>
                          </View>
                        ) : (
                          <Text style={{ color: "black", fontWeight: "500" }}>
                            {category.label}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.categoriesGradient} pointerEvents="none">
                    <LinearGradient
                      colors={["transparent", "#000000"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                </View> 
  
                {/* Filters */}
                <View style={styles.filterContainer}>
                  <View style={styles.filterRow}>
                    <TouchableOpacity
                      style={styles.filterButton}
                      onPress={openPlaceBottomSheet}
                      activeOpacity={0.6}
                    >
                      <PlaceIcon color="white" size={20} />
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 4
                        }}
                      >
                        <Text style={styles.filterButtonText}>Place</Text>
                        {placeFilter && (
                          <View
                            style={{
                              backgroundColor: "#172428",
                              width: 20,
                              height: 20,
                              borderRadius: 6,
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Text
                              style={{
                                color: "#34b2da",
                                fontSize: 12,
                                fontWeight: "bold"
                              }}
                            >
                              2
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
  
                    <TouchableOpacity
                      style={styles.filterButton}
                      onPress={openPriceBottomSheet}
                      activeOpacity={0.6}
                    >
                      <PriceIcon color="white" size={20} />
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 4
                        }}
                      >
                        <Text style={styles.filterButtonText}>Price</Text>
                        {priceFilter && (
                          <View
                            style={{
                              backgroundColor: "#172428",
                              width: 20,
                              height: 20,
                              borderRadius: 6,
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Text
                              style={{
                                color: "#34b2da",
                                fontSize: 12,
                                fontWeight: "bold"
                              }}
                            >
                              2
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
  
                    <TouchableOpacity
                      style={styles.filterButton}
                      onPress={openDateBottomSheet}
                      activeOpacity={0.6}
                    >
                      <CalendarIcon color="gray" size={18} />
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 4
                        }}
                      >
                        <Text style={styles.filterButtonText}>Date</Text>
                        {dateFilter && dateFilter.length > 0 && (
                          <View
                            style={{
                              backgroundColor: "#172428",
                              width: 20,
                              height: 20,
                              borderRadius: 6,
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Text
                              style={{
                                color: "#34b2da",
                                fontSize: 12,
                                fontWeight: "bold"
                              }}
                            >
                              {dateFilter.length}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
  
                {/* Clear Filters */}
                {hasActiveFilters && (
                  <TouchableOpacity
                    style={styles.clearFiltersButton}
                    onPress={clearAllFilters}
                    activeOpacity={0.6}
                  >
                    <CrossIcon color="white" size={16} />
                    <Text style={styles.clearFiltersText}>Clear all filters</Text>
                  </TouchableOpacity>
                )}
  
                {/* Cards */}
                <View style={styles.cardsContainer}>
                  {events.map((event) => (
                    <TouchableOpacity
                      key={event.id}
                      style={styles.eventCard}
                      onPress={() => handleEventPress(event)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardHeader}>
                        <View style={styles.cardCategory}>
                          {getTicketIcon(event.category)}
                          <Text style={styles.cardCategoryText} numberOfLines={1}>
                            {event.category}
                          </Text>
                        </View>
                        <Text style={styles.cardDate}>{event.date}</Text>
                      </View>
  
                      <View style={styles.cardDivider}>
                        {Array(20)
                          .fill(0)
                          .map((_, index) => (
                            <View key={index} style={styles.dividerDot} />
                          ))}
                      </View>
  
                      <View style={styles.cardContent}>
                        <View style={styles.cardImage}>
                          <Image
                            source={event.image}
                            style={{ height: "100%", width: "100%" }}
                            resizeMode="cover"
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.bookmarkButton}
                          onPress={() => toggleBookmark(event.id)}
                          activeOpacity={0.6}
                        >
                          {bookmarkedEvents.includes(event.id) ? (
                            <Icon1 color="#6EE7B7" size={15} />
                          ) : (
                            <BookMarkIcon color="white" size={20} />
                          )}
                        </TouchableOpacity>
                      </View>
  
                      <View style={styles.cardFooter}>
                        <View>
                          <Text style={styles.eventTitle}>{event.title}</Text>
                          <View style={styles.eventLocation}>
                            <PlaceIcon color="white" size={16} />
                            <Text style={styles.locationText}>{event.location}</Text>
                          </View>
                        </View>
                        <View style={styles.eventPrice}>
                          {event.price.includes("$") ? (
                            <>
                              <Text style={styles.priceCurrency}>$</Text>
                              <Text style={styles.priceValue}>
                                {event.price.replace("$", "")}
                              </Text>
                            </>
                          ) : (
                            <Text style={styles.priceValue}>{event.price}</Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{ height: 128 }} />
              </ScrollView>
  
              {/* Conditionally render bottom sheets when ready */}
              {readyBottomSheets.place && (
                <PlaceBottomSheet 
                  ref={placeBottomSheetRef}
                />
              )}
              {readyBottomSheets.date && (
                <DateBottomSheet 
                  ref={dateBottomSheetRef}
                />
              )}
              {readyBottomSheets.price && (
                <PriceBottomSheet 
                  ref={priceBottomSheetRef}
                />
              )}
            </View>
          </ScrollView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  }
  