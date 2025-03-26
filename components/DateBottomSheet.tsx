import { useBottomSheet } from '@/context/BottomSheetContext';
import { useFilter } from '@/context/FilterContext';
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { DateData } from 'react-native-calendars/src/types';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Calendar from './Calendar';

export type DateBottomSheetRef = {
    open: () => void;
    close: () => void;
};

type DateBottomSheetProps = {};

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
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
        <Animated.View style={containerStyle} />
    );
};

const DateBottomSheet = forwardRef<DateBottomSheetRef, DateBottomSheetProps>((_, ref) => {
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['85%'], []);
    const { setIsBottomSheetOpen } = useBottomSheet();
    const { setDateFilter, setTotalResults } = useFilter();
    
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({
        '2025-02-01': { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da' }] },
        '2025-02-03': { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da' }] },
        '2025-02-05': { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da' }] },
        '2025-02-07': { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da', key: 'vacation' }, { color: '#34b2da', key: 'workout' }] },
        '2025-02-09': { selected: true, selectedColor: '#FF0000', dots: [{ color: '#34b2da' }] },
        '2025-02-12': { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da' }, { color: '#34b2da' }] },
        '2025-02-15': { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da' }] },
        '2025-02-18': { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da' }] },
        '2025-02-22': { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da' }] },
        '2025-02-28': { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da' }] }
    });

    const [showButtons, setShowButtons] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [isTodaySelected, setIsTodaySelected] = useState(false);

    const handleSheetChanges = useCallback((index: number) => {
        setIsBottomSheetOpen(index !== -1);
    }, [setIsBottomSheetOpen]);

    const handleClose = useCallback(() => {
        setIsBottomSheetOpen(false);
        bottomSheetRef.current?.dismiss();
    }, [setIsBottomSheetOpen]);

    const handleDayPress = (day: DateData) => {
        const { dateString } = day;
        const updatedDates = { ...selectedDates };

        if (updatedDates[dateString]) {
            delete updatedDates[dateString];
        } else {
            updatedDates[dateString] = { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da' }] };
        }

        setSelectedDates(updatedDates);
        setShowButtons(Object.keys(updatedDates).length > 0);
        setIsTodaySelected(false);

        // Update filter context
        setDateFilter(Object.keys(updatedDates));
        setTotalResults(256);
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        const date = new Date(currentDate);
        if (direction === 'prev') {
            date.setMonth(date.getMonth() - 1);
        } else {
            date.setMonth(date.getMonth() + 1);
        }
        setCurrentDate(date.toISOString().split('T')[0]);
    };

    const handleTodayPress = () => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDates({ [today]: { selected: true, selectedColor: '#34b2da', dots: [{ color: '#34b2da' }] } });
        setShowButtons(true);
        setCurrentDate(today);
        setIsTodaySelected(true);
    };

    const handleShowTodayEvents = () => {
        const today = new Date().toISOString().split('T')[0];
        // Update filter context
        setDateFilter([today]);
        setTotalResults(256);
        handleClose();
    };

    const handleClearSelection = () => {
        setSelectedDates({});
        setShowButtons(false);
        setDateFilter(null);
        setTotalResults(0);
        setIsTodaySelected(false);
    };

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <TouchableWithoutFeedback onPress={handleClose}>
                <CustomBackdrop {...props} />
            </TouchableWithoutFeedback>
        ),
        [handleClose]
    );

    useImperativeHandle(ref, () => ({
        open: () => {
            setIsBottomSheetOpen(true);
            bottomSheetRef.current?.present();
        },
        close: handleClose,
    }));

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            style={styles.bottomSheet}
        >
            <BottomSheetScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.title}>Select date</Text>
                <Text style={styles.subtitle}>When do you want to go?</Text>
                <View className="flex flex-wrap flex-row justify-between gap-2 mb-8">
                    <View className="flex-row justify-between w-full mb-2 gap-2">
                        <Pressable
                            className={`${isTodaySelected ? 'bg-white' : 'bg-transparent'} border border-white/10 rounded-full p-4 flex-1 mx-1`}
                            onPress={handleTodayPress}
                        >
                            <Text className={`${isTodaySelected ? 'text-black' : 'text-white'} text-lg font-medium text-center`}>Today</Text>
                        </Pressable>
                        <Pressable className="bg-transparent border border-white/10 rounded-full p-4 flex-1 mx-1">
                            <Text className="text-white text-lg font-medium text-center">Tomorrow</Text>
                        </Pressable>
                    </View>
                    <View className="flex-row justify-between w-full gap-2">
                        <Pressable className="bg-transparent border border-white/10 rounded-full p-4 flex-1 mx-1">
                            <Text className="text-white text-lg font-medium text-center">This weekend</Text>
                        </Pressable>
                        <Pressable className="bg-transparent border border-white/10 rounded-full p-4 flex-1 mx-1">
                            <Text className="text-white text-lg font-medium text-center">Next week</Text>
                        </Pressable>
                    </View>
                </View>

                <Calendar
                    onDayPress={handleDayPress}
                    markedDates={selectedDates}
                    current={currentDate}
                    onMonthChange={handleMonthChange}
                />

                {showButtons && (
                    <View className="mt-6">
                        <Pressable
                            className="bg-white rounded-full p-4 mb-3"
                            onPress={handleShowTodayEvents}
                        >
                            <Text className="text-black text-lg font-semibold text-center">Show today's events</Text>
                        </Pressable>
                        <Pressable
                            className="p-4 border border-white/10 rounded-full mt-4"
                            onPress={handleClearSelection}
                        >
                            <Text className="text-white/50 text-lg font-medium text-center">Clear all selected</Text>
                        </Pressable>
                    </View>
                )}
            </BottomSheetScrollView>
        </BottomSheetModal>
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

export default DateBottomSheet; 