import React, { useState, ReactElement } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType, Pressable } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Banner from "./Banner";

interface EventCardProps {
  image: ImageSourcePropType | string;
  type: string;
  typeIcon: ReactElement;
  datetime: string;
  title: string;
  location: string;
  ticketLeft: number;
  price: string;
  isDiscount: boolean;
  discountPrice: string | null;
  special: string | null;
  specialText: string | null;
  isBanner?: boolean;
  disableNavigation?: boolean;
}

const EventCard = ({
  image,
  type,
  typeIcon,
  datetime,
  title,
  location,
  ticketLeft,
  price,
  isDiscount,
  discountPrice,
  special,
  specialText,
  isBanner,
  disableNavigation,
}: EventCardProps) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Format the datetime string to date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${hours}:${minutes}`;
  };

  // Handle image source based on type
  const getImageSource = (src: ImageSourcePropType | string) => {
    if (typeof src === 'string') {
      return { uri: src };
    }
    return src;
  };

  const getBannerType = () => {
    if (!isBanner || !special) return null;

    switch (special) {
      case 'red':
        return 'red' as const;
      case 'green':
        return 'green' as const;
      case 'yellow':
        return 'yellow' as const;
      case 'cyan':
        return 'cyan' as const;
      case 'orange':
        return 'orange' as const;
      default:
        return null;
    }
  };

  const renderPrice = () => {
    if (price === "Expired") {
      return (
        <Text style={styles.price} className="opacity-50">
          {price}
        </Text>
      );
    }

    if (price === "Free") {
      return (
        <Text style={styles.price}>
          {price}
        </Text>
      );
    }

    if (isDiscount && discountPrice) {
      return (
        <View className="items-end flex-row gap-2">
          <Text style={styles.price} className="flex-row items-center">
            <Text style={{ color: "gray" }}>$</Text>
            {price.replace('$', '')}
          </Text>
          <Text style={styles.strikethrough} className="text-[16px] ml-2 font-medium text-white opacity-50 line-through">
            {discountPrice}
          </Text>
        </View>
      );
    }

    // Regular dollar price
    return (
      <Text style={styles.price} className="flex-row items-center">
        <Text className="opacity-50">$</Text>
        {price.replace('$', '')}
      </Text>
    );
  };

  return (
    <Pressable
      onPress={() => !disableNavigation && router.push("/(stack)/creator-page")}
      className="bg-card rounded-3xl  mb-4"
    >
      {/* Header with time */}
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center gap-2">
          {typeIcon}
          <Text style={styles.headerText} className="ml-2">{type.toUpperCase()}</Text>
        </View>
        <Text style={styles.headerText}>{formatDateTime(datetime)}</Text>
      </View>

      {/* Image Section */}
      <View className="h-[350px] px-4 py-2">
        <View style={styles.imageContainer} className="relative h-full ">
          {!imageLoaded && <View style={styles.shimmer} />}
          <Image
            source={getImageSource(image)}
            style={[styles.image, { opacity: imageLoaded ? 1 : 0 }]}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Bookmark Button */}
          <Pressable
            onPress={() => setIsBookmarked(!isBookmarked)}
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
            <MaterialCommunityIcons
              name={isBookmarked ? "bookmark" : "bookmark-off"}
              size={24}
              color="gray"
            />
          </Pressable>
          {isBanner && specialText && getBannerType() && (
            <Banner
              type={getBannerType() || 'green'}
              text={specialText}
            />
          )}
        </View>
      </View>

      {/* Card content */}
      <View className="flex-row justify-between p-4">
        <View>
          <Text style={styles.title} className="text-[18px] leading-6 tracking-[-0.03em] text-white">{title}</Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="location-sharp" size={16} color="white" />
            <Text className="ml-1 font-normal text-[14px] leading-5 text-white opacity-50 flex-grow-0">
              {location}
            </Text>
          </View>
        </View>
        <View>
          {renderPrice()}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
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
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2A2A3D",
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
  venue: {
    marginLeft: 4,
    color: "#999",
    fontSize: 14,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    fontSize: 20,
    color: '#999',
    marginBottom: 4,
  },
  price: {
    fontSize: 30,
    fontWeight: "medium",
    color: "#fff",
    textAlign: 'right',
  },
});

export default EventCard;
