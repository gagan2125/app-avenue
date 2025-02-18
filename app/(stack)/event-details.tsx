import { View, Text, Image, ScrollView, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome5, MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import { CalendarIcon, TicketIcon } from '@/assets/icons/TicketIcons';
import { InfoIcon, LocationIcon } from '@/assets/icons/HostProfileIcons';
import { useState } from 'react';
import { TickIcon } from '@/assets/icons/SavedEventsIcons';

// Demo coordinates for Luna Lounge (Buffalo, NY area)
const DEMO_COORDINATES = {
    latitude: 42.8864,
    longitude: -78.8784,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

const guestList = [
    { id: 1, name: 'Club VIP', abbr: 'CV', color: '#34B2DA' },
    { id: 2, name: 'Sarah & Co.', abbr: 'SC', color: '#F97316' },
    { id: 3, name: "Alex's List", abbr: 'AL', color: '#A855F7' },
];

const relatedEvents = [
    {
        id: 1,
        category: "ARTS & CULTURE",
        date: "28 DEC 22:00",
        image: require("@/assets/images/ticket/ticket1.png"),
        title: "Abstract Horizons",
        location: "Modern Arts Center",
        price: "$39+",
    },
    {
        id: 2,
        category: "NIGHTLIFE",
        date: "28 DEC 22:00",
        image: require("@/assets/images/ticket/ticket2.png"),
        title: "After Hours Neon",
        location: "Cloud Nine Club",
        price: "Free",
    },
    {
        id: 3,
        category: "MUSIC",
        date: "28 DEC 22:00",
        image: require("@/assets/images/ticket/ticket3.png"),
        title: "Jazz Night",
        location: "Luna Lounge",
        price: "$39+",
    },
];

export default function EventDetails() {
    const [isSaved, setIsSaved] = useState(false);
    const router = useRouter();
    const params = useLocalSearchParams();
    const { title, category, location, date, price, image } = params;

    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" />

            {/* Header Buttons */}
            <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between pt-14 px-5">
                <Pressable
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-black/50 rounded-full items-center justify-center"
                >
                    <Ionicons name="chevron-back" size={20} color="white" />
                </Pressable>
                <Pressable className="w-12 h-12 bg-black/50 rounded-full items-center justify-center">
                    <Ionicons name="share-outline" size={20} color="white" />
                </Pressable>
            </View>

            {/* Scrollable Content */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Background Image */}
                <View className="px-5 pt-5">
                    <Image
                        source={typeof image === 'string' ? require("@/assets/images/ticket/ticket1.png") : image}
                        className="w-full h-[400px] rounded-3xl"
                        style={{ resizeMode: 'cover' }}
                    />
                </View>

                <View className="px-5 mt-6">
                    {/* Category and Title */}
                    <View className="mb-4">
                        <View className="flex-row items-center mb-2 border border-white/10 rounded-full self-start px-4 py-2 ">
                            <FontAwesome5 name="music" size={16} color="#FF0000" />
                            <Text className="text-white ml-2 text-base">{category as string}</Text>
                        </View>
                        <Text className="text-white text-[28px] font-medium mt-4">{title as string}</Text>
                    </View>

                    {/* Location and Time */}
                    <View className="flex-row items-center mb-8">
                        <View className="flex-row items-center">
                            <Ionicons name="location-outline" size={20} color="gray" />
                            <Text className="text-gray-400 ml-2">{location as string}</Text>
                        </View>
                        <Text className="text-gray-400 text-4xl px-2">•</Text>
                        <View className="flex-row items-center">
                            <CalendarIcon size={15} color="gray" />
                            <Text className="text-gray-400 ml-2">{date as string}</Text>
                        </View>
                    </View>

                    {/* Host Button */}
                    <Pressable
                        className="flex-row items-center bg-[#0F0F0F] p-4 rounded-2xl mb-8"
                        onPress={() => router.push('/(stack)/host-profile')}
                    >
                        <View className="w-12 h-12 bg-[#34b2da] rounded-full items-center justify-center">
                            <Text className="text-black text-xl font-semibold">RL</Text>
                        </View>
                        <View className="flex-1 ml-4">
                            <Text className="text-white text-lg font-semibold">Rumba Latina</Text>
                            <Text className="text-gray-400 text-sm">4 Live events</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="gray" />
                    </Pressable>
                    {/* About Section */}
                    <View className="mb-8 border-white/10 py-4" style={{ borderTopWidth: 1, borderBottomWidth: 1 }}>
                        <Text className="text-white/50 text-xl font-semibold mb-4">About</Text>
                        {/* Duration and Age */}
                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-1 flex-row items-center border border-white/10 p-4 rounded-2xl">
                                <MaterialIcons name="timer" size={20} color="gray" />
                                <Text className="text-white ml-2">Duration: 90m</Text>
                            </View>
                            <View className="flex-1 flex-row items-center border border-white/10 p-4 rounded-2xl">
                                <MaterialIcons name="person-outline" size={20} color="gray" />
                                <Text className="text-white ml-2">Age: 12+</Text>
                            </View>
                        </View>
                        <Text className="text-gray-400 leading-6 mb-4">
                            Experience a groundbreaking multimedia exhibition where light, sound, and space converge. Abstract Horizons transforms the Modern Arts Center into an immersive journey through abstract landscapes and dynamic visual compositions.
                        </Text>
                    </View>

                    {/* Guest List Section */}
                    <View className="mb-8">
                        <Text className="text-white/50 text-base uppercase tracking-wider mb-4">Guest List</Text>
                        <View className="flex-row flex-wrap gap-3">
                            {guestList.map((guest) => (
                                <Pressable
                                    key={guest.id}
                                    className="flex-row items-center bg-[#141414] py-2 pl-2 pr-4 rounded-full"
                                >
                                    <View
                                        className="w-8 h-8 rounded-full items-center justify-center"
                                        style={{ backgroundColor: guest.color }}
                                    >
                                        <Text className="text-black text-sm font-medium">{guest.abbr}</Text>
                                    </View>
                                    <Text className="text-white text-base ml-2">{guest.name}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <Pressable className="bg-black border border-white/10 py-3.5 rounded-full mt-6">
                            <Text className="text-white text-lg font-medium text-center">Contact host</Text>
                        </Pressable>
                        <View className='flex-row items-center gap-2 justify-center mt-4'>
                            <InfoIcon color="white" size={18} />
                            <Text className="text-gray-400 text-md text-center">
                                To get on the guest list, contact the host
                            </Text>
                        </View>
                    </View>

                    {/* Location Section */}
                    <View style={styles.locationSection}>
                        <Text style={styles.sectionTitle} >Location</Text>
                        <Text style={styles.addressText} className='text-4xl font-medium'>Luna Lounge</Text>
                        <Text style={styles.subAddressText}>603 Dingens Street, Buffalo NY 14206</Text>

                        {/* Map Card */}
                        <View style={styles.mapCard}>
                            {/* Map View */}
                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={DEMO_COORDINATES}
                                    mapType="standard"
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: DEMO_COORDINATES.latitude,
                                            longitude: DEMO_COORDINATES.longitude,
                                        }}
                                    />
                                </MapView>
                            </View>

                            {/* Time and Directions */}
                            <View style={styles.mapContent}>
                                <View style={styles.mapLeft}>
                                    <Text style={styles.opensText}>Opens at</Text>
                                    <Text style={styles.timeText}>6 PM</Text>
                                </View>
                                <TouchableOpacity style={styles.directionsButton} className='bg-transparent border border-white/10 flex-row items-center gap-2'>
                                    <LocationIcon color="white" size={20} />
                                    <Text style={styles.directionsButtonText} className='text-white'>Get directions</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Related Events Section */}
                    <View className="mb-8">
                        <Text className="text-white text-xl font-semibold mb-4">Related Events</Text>
                        {relatedEvents.map((event) => (
                            <Pressable
                                key={event.id}
                                className="bg-[#141414] rounded-2xl p-4 mb-4"
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
                                <View className="flex-row justify-between items-center mb-4">
                                    <Text className="text-white font-medium">{event.category}</Text>
                                    <Text className="text-white font-medium">{event.date}</Text>
                                </View>

                                <View className="flex-row justify-between items-center">
                                    {Array(20).fill(0).map((_, index) => (
                                        <View
                                            key={index}
                                            className="w-2 h-1 bg-black/50 rounded-full mx-[1px]"
                                        />
                                    ))}
                                </View>

                                <View className="flex-row justify-between items-center mt-4">
                                    <Image
                                        source={event.image}
                                        className="w-20 h-20 rounded-xl"
                                    />
                                    <Pressable className="w-14 h-14 border border-white/10 rounded-full items-center justify-center">
                                        <FontAwesome name="bookmark-o" size={20} color="gray" />
                                    </Pressable>
                                </View>

                                <View className="flex-row justify-between items-center mt-4">
                                    <View>
                                        <Text className="text-white text-xl font-semibold mb-2">{event.title}</Text>
                                        <View className="flex-row items-center">
                                            <Entypo name="location-pin" size={20} color="gray" />
                                            <Text className="text-gray-400 ml-2">{event.location}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-white text-2xl font-semibold">{event.price}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>

                    {/* Bottom Spacing */}
                    <View className="h-24" />
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <BlurView intensity={50} tint="dark" className="absolute bottom-0 left-0 right-0 flex-row justify-between items-center px-5 pb-8 pt-5">
                <View>
                    <Text className="text-gray-400 text-sm">Price</Text>
                    <Text className="text-white text-2xl font-bold mt-1">{price as string}</Text>
                </View>
                <View className="flex-row items-center gap-4">
                    {isSaved ? (
                        <Pressable
                            onPress={() => setIsSaved(false)}
                            className="h-14 px-5 border border-white/10 rounded-full flex-row items-center gap-1"
                        >
                            <TickIcon color="#6ee7b7" size={17} />
                            <Text className="text-white text-base font-medium">Saved</Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={() => setIsSaved(true)}
                            className="w-14 h-14 border border-white/10 rounded-full items-center justify-center"
                        >
                            <FontAwesome
                                name="bookmark"
                                size={24}
                                color="gray"
                            />
                        </Pressable>
                    )}
                    <Pressable
                        className="bg-white px-8 py-4 rounded-full flex-row items-center gap-2"
                        onPress={() => router.push("/ticket-selection")}
                    >
                        <Text className="text-black text-base font-semibold">Buy now</Text>
                    </Pressable>
                </View>
            </BlurView>
        </View>
    );
}

const darkMapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];

const styles = StyleSheet.create({
    locationSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
    },
    addressText: {
        color: 'white',
        marginBottom: 5,
    },
    subAddressText: {
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 15,
    },
    mapCard: {
        borderRadius: 15,
        overflow: 'hidden',
    },
    mapContainer: {
        height: 200,
        borderRadius: 15,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    mapContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    mapLeft: {
    },
    opensText: {
        color: 'gray',
        marginBottom: 5,
    },
    timeText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    directionsButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    directionsButtonText: {
        color: 'white',
        fontWeight: '600',
    },
}); 