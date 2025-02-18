import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType, Pressable, Modal } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { MoonIcon, MusicIcon } from '@/assets/icons/SavedEventsIcons';
import { QrIcon, CalendarIcon, TicketIcon } from '@/assets/icons/TicketIcons';
import { BlurView } from 'expo-blur';
import Banner from './Banner';

interface PurchasedTicketCardProps {
    image: ImageSourcePropType;
    type: string;
    datetime: string;
    title: string;
    location: string;
    price: string;
    isExpired: boolean;
    isUsed?: boolean;
    isBanner?: boolean;
    special?: 'cyan' | 'orange' | 'yellow' | null;
    specialText?: string | null;
}

const PurchasedTicketCard = ({
    image,
    type,
    datetime,
    title,
    location,
    price,
    isExpired,
    isUsed = false,
    isBanner,
    special,
    specialText,
}: PurchasedTicketCardProps) => {
    const [showQRModal, setShowQRModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    // Format the datetime string to date and time
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day} ${month} ${hours}:${minutes}`;
    };

    const getTypeIcon = () => {
        switch (type.toLowerCase()) {
            case 'nightlife':
                return <MoonIcon color="#A855F7" size={12} />;
            case 'music':
                return <MusicIcon color="#832838" size={12} />;
            default:
                return null;
        }
    };

    const getBannerType = () => {
        if (!isBanner || !special) return null;
        return special;
    };

    const renderStatusModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showStatusModal}
            onRequestClose={() => setShowStatusModal(false)}
        >
            <BlurView
                intensity={30}
                tint="dark"
                style={StyleSheet.absoluteFill}
            />
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                <View style={styles.modalContent} className='bg-secondary'>
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-4">
                        <View className="flex-row items-center">
                            <TicketIcon size={16} color="white" />
                            <Text className="text-white text-base font-medium ml-2">TICKET PASS</Text>
                        </View>
                        <Pressable onPress={() => setShowStatusModal(false)}>
                            <Entypo name="cross" size={24} color="white" />
                        </Pressable>
                    </View>

                    {/* Dotted Line */}
                    <View className="px-4">
                        <View className="flex-row justify-between items-center w-full">
                            {Array(20).fill(0).map((_, index) => (
                                <View
                                    key={index}
                                    className="w-2 h-1 bg-white/10 rounded-full mx-[2px]"
                                />
                            ))}
                        </View>
                    </View>

                    {/* Content */}
                    <View className="p-4">
                        {/* Event Image */}
                        <View className="flex-row items-start gap-3 mb-4">
                            <Image
                                source={image}
                                style={styles.modalEventImage}
                            />
                        </View>

                        {/* Event Details */}
                        <Text className="text-white text-2xl font-medium">{formatDateTime(datetime)}</Text>
                        <View className='mt-2 flex-row items-center'>
                            <Text className="text-white/50 text-lg font-medium mt-1">{title}</Text>
                            <View style={{ backgroundColor: "#303030", height: 7, width: 7, borderRadius: 100, marginLeft: 10, marginRight: 10 }} />
                            <View className="flex-row items-center">
                                <Ionicons name="location-sharp" size={16} color="rgba(255,255,255,0.5)" />
                                <Text className="text-white/50 text-base ml-1">{location}</Text>
                            </View>
                        </View>

                        {/* Status Banner */}
                        <View style={{ marginTop: 70, right: 13 }} className="mt-6">
                            <Banner
                                type="orange"
                                text={isExpired ? "TICKET IS EXPIRED" : "TICKET HAS BEEN USED"}
                                isExpired={true}
                            />
                        </View>

                        {/* Buy Another One Button - Only for Used Tickets */}
                        {isUsed && (
                            <TouchableOpacity
                                className="bg-white mt-6 py-4 rounded-full items-center justify-center"
                                onPress={() => {
                                    setShowStatusModal(false);
                                    // Add navigation or action for buying another ticket
                                }}
                            >
                                <Text className="text-black font-medium text-base">Buy Another One</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <Pressable
            style={styles.card}
            className='bg-card'
            onPress={() => {
                if (isExpired || isUsed) {
                    setShowStatusModal(true);
                } else {
                    setShowQRModal(true);
                }
            }}
        >
            {/* Header with time */}
            <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-2">
                    {getTypeIcon()}
                    <Text style={styles.headerText} className="ml-2">{type}</Text>
                </View>
                <Text style={styles.headerText}>{formatDateTime(datetime)}</Text>
            </View>

            {/* Image Section */}
            <View className="h-[350px] px-4 py-2">
                <View style={styles.imageContainer} className="relative h-full">
                    <Image source={image} style={styles.image} />
                    {/* Share Button */}
                    <Pressable
                        onPress={() => { }}
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 20,
                            backgroundColor: "#222227",
                            borderRadius: 100,
                            padding: 10,
                        }}
                    >
                        <Entypo
                            name="share"
                            size={24}
                            color="gray"
                        />
                    </Pressable>
                    {isBanner && specialText && getBannerType() && (
                        <View >
                            <Banner
                                type={getBannerType() || 'cyan'}
                                text={specialText}
                            />
                        </View>
                    )}
                </View>
            </View>

            {/* Card content */}
            <View className="p-4">
                <View className='flex-row justify-between items-center'>
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        <View className="flex-row items-center mt-2">
                            <Ionicons name="location-sharp" size={16} color="white" />
                            <Text className="ml-1 font-normal text-[14px] leading-5 text-white opacity-50">
                                {location}
                            </Text>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.price}>{price}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                {!isExpired && !isUsed && (
                    <View className="mt-8 gap-2">
                        <TouchableOpacity
                            style={styles.button}
                            className="bg-white py-4 rounded-full flex-row items-center justify-center"
                            onPress={() => setShowQRModal(true)}
                        >
                            <QrIcon color="#000000" size={20} />
                            <Text className="text-black text-center font-medium ml-2">Show QR</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            className=" mt-4 border border-white/5 py-4 rounded-full flex-row items-center justify-center"
                        >
                            <CalendarIcon color="#FFFFFF" size={20} />
                            <Text className="text-white text-center font-medium ml-2">Add to Calendar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* QR Modal */}
            {!isExpired && !isUsed && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showQRModal}
                    onRequestClose={() => setShowQRModal(false)}
                >
                    <BlurView
                        intensity={30}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                        <View style={styles.modalContent} className='bg-secondary'>
                            {/* Header */}
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-row items-center">
                                    <TicketIcon size={16} color="white" />
                                    <Text className="text-white text-base font-medium ml-2">TICKET PASS</Text>
                                </View>
                                <Pressable onPress={() => setShowQRModal(false)}>
                                    <Entypo name="cross" size={24} color="white" />
                                </Pressable>
                            </View>

                            {/* Dotted Line */}
                            <View className="px-4">
                                <View className="flex-row justify-between items-center w-full">
                                    {Array(20).fill(0).map((_, index) => (
                                        <View
                                            key={index}
                                            className="w-2 h-1 bg-white/10 rounded-full mx-[2px]"
                                        />
                                    ))}
                                </View>
                            </View>

                            {/* Content */}
                            <View className="p-4">
                                {/* Event Image and Info */}
                                <View className="flex-row items-start gap-3 mb-4">
                                    <Image
                                        source={image}
                                        style={styles.modalEventImage}
                                    />
                                </View>
                                <Text className="text-white text-2xl font-medium">{formatDateTime(datetime)}</Text>
                                <View className='mt-2 flex-row items-center'>
                                    <Text className="text-white/50 text-lg font-medium mt-1">{title}</Text>
                                    <View style={{ backgroundColor: "#303030", height: 7, width: 7, borderRadius: 100, marginLeft: 10, marginRight: 10 }} ></View>
                                    <View className="flex-row items-center">
                                        <Ionicons name="location-sharp" size={16} color="rgba(255,255,255,0.5)" />
                                        <Text className="text-white/50 text-base ml-1">{location}</Text>
                                    </View>
                                </View>
                                {/* QR Code Section */}
                                <View style={{ height: 400 }} className="mt-6 bg-white/10 rounded-3xl overflow-hidden w-full flex-row items-end justify-center">
                                    {/* qrcode will be here */}
                                    {/* Banner below QR */}
                                    {isBanner && specialText && getBannerType() && (
                                        <View className="w-full mt-4">
                                            <Banner
                                                type={getBannerType() || 'cyan'}
                                                text={specialText}
                                                isExpired={false}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Status Modal for Expired or Used Tickets */}
            {(isExpired || isUsed) && renderStatusModal()}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 20,
    },
    imageContainer: {
        width: "100%",
        height: 350,
        overflow: "hidden",
        position: "relative",
        borderRadius: 20,
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    headerText: {
        color: "#fff",
        fontSize: 12,
        textTransform: "uppercase",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    price: {
        fontSize: 30,
        fontWeight: "500",
        color: "#fff",
        textAlign: 'right',
    },
    button: {
        width: '100%',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    modalEventImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
});

export default PurchasedTicketCard; 