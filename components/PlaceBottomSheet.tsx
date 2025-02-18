import React, { useCallback, useMemo, forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Pressable } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdropProps, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useBottomSheet } from '@/context/BottomSheetContext';
import { BlurView } from 'expo-blur';
import Animated, { interpolate, useAnimatedStyle, Extrapolate } from 'react-native-reanimated';
import { useFilter } from '@/context/FilterContext';
import { ClockIcon } from '@/assets/icons/HomeIcons';

interface Place {
    id: number;
    name: string;
    area: string;
    distance: string;
}

const recentPlaces: Place[] = [
    {
        id: 1,
        name: "Modern Arts Center",
        area: "Downtown district",
        distance: "2.5 km away"
    },
    {
        id: 2,
        name: "Cloud Nine Club",
        area: "Nightlife district",
        distance: "1.8 km away"
    },
    {
        id: 3,
        name: "Central Concert Hall",
        area: "Music quarter",
        distance: "3.1 km away"
    }
];

export type PlaceBottomSheetRef = {
    open: () => void;
    close: () => void;
};

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
    if (Platform.OS === 'android') {
        return null;
    }

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animatedIndex.value,
            [-1, 0],
            [0, 1],
            Extrapolate.CLAMP
        ),
    }));

    const containerStyle = useMemo(
        () => [
            style,
            {
                backgroundColor: "#00000099",
            },
            containerAnimatedStyle,
        ],
        [style, containerAnimatedStyle]
    );

    return (
        <TouchableWithoutFeedback>
            <Animated.View style={containerStyle}>
                <BlurView
                    intensity={20}
                    tint="dark"
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const PlaceBottomSheet = forwardRef<PlaceBottomSheetRef>((_, ref) => {
    const [searchQuery, setSearchQuery] = useState('');
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '90%'], []);
    const { setIsBottomSheetOpen } = useBottomSheet();
    const { setPlaceFilter, setTotalResults } = useFilter();

    const handleSheetChanges = useCallback((index: number) => {
        setIsBottomSheetOpen(index !== -1);
        if (index === -1) {
            Keyboard.dismiss();
        }
    }, [setIsBottomSheetOpen]);

    const handleClose = useCallback(() => {
        setSearchQuery('');
        setIsBottomSheetOpen(false);
        Keyboard.dismiss();
        bottomSheetRef.current?.close();
    }, [setIsBottomSheetOpen]);

    const handleOutsidePress = useCallback(() => {
        Keyboard.dismiss();
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const handleTextInputFocus = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(1);
    }, []);

    const handlePlaceSelect = (place: Place) => {
        setPlaceFilter(place.name);
        setTotalResults(256); // This would normally be calculated based on actual filtered results
        handleClose();
    };

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <TouchableWithoutFeedback onPress={handleClose}>
                <CustomBackdrop {...props} />
            </TouchableWithoutFeedback>
        ),
        [handleClose]
    );

    const filteredPlaces = recentPlaces.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useImperativeHandle(ref, () => ({
        open: () => {
            setIsBottomSheetOpen(true);
            bottomSheetRef.current?.snapToIndex(0);
        },
        close: handleClose,
    }));

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            style={styles.bottomSheet}
            keyboardBehavior="fillParent"
            android_keyboardInputMode="adjustResize"
        >
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.keyboardAvoidingView}
                >
                    <BottomSheetScrollView
                        style={styles.container}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <Text style={styles.title}>Select place</Text>
                        <Text style={styles.subtitle}>Find places hosting events</Text>

                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Type and select from list..."
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onFocus={handleTextInputFocus}
                            />
                        </View>

                        {!searchQuery && (
                            <Text style={styles.sectionTitle}>RECENT RESULTS</Text>
                        )}

                        {searchQuery && filteredPlaces.length > 0 && (
                            <Text style={styles.sectionTitle}>RESULTS</Text>
                        )}

                        <View style={styles.listContainer}>
                            {(searchQuery ? filteredPlaces : recentPlaces).map((place) => (
                                <Pressable
                                    key={place.id}
                                    style={styles.placeItem}
                                    onPress={() => handlePlaceSelect(place)}
                                >
                                    <View style={styles.placeIcon}>
                                        <ClockIcon color="white" size={20} />
                                    </View>
                                    <View style={styles.placeInfo}>
                                        <Text style={styles.placeName}>{place.name}</Text>
                                        <Text style={styles.placeArea}>{place.area} • {place.distance}</Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </BottomSheetScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: '#141414',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    handleIndicator: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        width: 32,
        height: 4,
    },
    container: {
        flex: 1,
        backgroundColor: '#141414',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: Platform.OS === 'ios' ? 120 : 90,
        minHeight: '100%',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
        minHeight: 48,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        paddingVertical: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 16,
        letterSpacing: 1,
    },
    listContainer: {
        flex: 1,
    },
    placeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    placeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    placeInfo: {
        flex: 1,
    },
    placeName: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    placeArea: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    bottomSheet: {
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        zIndex: 9999,
    },
});

export default PlaceBottomSheet;