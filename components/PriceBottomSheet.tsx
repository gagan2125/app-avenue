import React, { useCallback, useMemo, forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetBackdropProps, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useBottomSheet } from '@/context/BottomSheetContext';
import { BlurView } from 'expo-blur';
import Animated, { interpolate, useAnimatedStyle, Extrapolate } from 'react-native-reanimated';
import RangeSlider from 'rn-range-slider';
import { useFilter } from '@/context/FilterContext';

export type PriceBottomSheetRef = {
    open: () => void;
    close: () => void;
};

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
    if (Platform.OS === 'android') return null;

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolate.CLAMP),
    }));

    return (
        <TouchableWithoutFeedback>
            <Animated.View style={[style, { backgroundColor: "#00000099" }, containerAnimatedStyle]}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const PriceBottomSheet = forwardRef<PriceBottomSheetRef>((_, ref) => {
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%'], []);
    const { setIsBottomSheetOpen } = useBottomSheet();
    const { setPriceFilter, setTotalResults } = useFilter();
    const [fromPrice, setFromPrice] = useState('0');
    const [toPrice, setToPrice] = useState('1000');
    const [showFreeOnly, setShowFreeOnly] = useState(false);

    const handleSheetChanges = useCallback((index: number) => {
        setIsBottomSheetOpen(index !== -1);
    }, [setIsBottomSheetOpen]);

    const handleClose = useCallback(() => {
        setIsBottomSheetOpen(false);
        bottomSheetRef.current?.close();
    }, [setIsBottomSheetOpen]);

    const handleApply = () => {
        setPriceFilter(showFreeOnly ? { min: 0, max: 0 } : { min: parseInt(fromPrice), max: parseInt(toPrice) });
        setTotalResults(197); // Replace with dynamic count
        handleClose();
    };

    const handleClear = () => {
        setFromPrice('0');
        setToPrice('1000');
        setShowFreeOnly(false);
    };

    useImperativeHandle(ref, () => ({
        open: () => {
            setIsBottomSheetOpen(true);
            bottomSheetRef.current?.snapToIndex(0);
        },
        close: handleClose,
    }));

    const handleValueChange = useCallback((low: number, high: number) => {
        if (!showFreeOnly) {
            setFromPrice(low.toString());
            setToPrice(high.toString());
        }
    }, [showFreeOnly]);

    const handleFromPriceChange = (text: string) => {
        if (!showFreeOnly) {
            const cleanedText = text.replace(/[^0-9]/g, '');
            setFromPrice(cleanedText === '' ? '0' : cleanedText);
        }
    };

    const handleFreeOnlyToggle = (value: boolean) => {
        setShowFreeOnly(value);
        if (value) {
            setFromPrice('0');
            setToPrice('0');
        }
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backdropComponent={(props) => <CustomBackdrop {...props} />}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
        >
            <BottomSheetScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Price range</Text>
                <Text style={styles.subtitle}>Show events within your budget</Text>

                <View style={[styles.rangeSliderContainer, showFreeOnly && styles.disabledContainer]}>
                    <RangeSlider
                        min={0}
                        max={1000}
                        step={1}
                        renderThumb={() => (
                            <View style={[styles.thumb, showFreeOnly && styles.disabledThumb]}>
                                <View style={styles.thumbInner} />
                            </View>
                        )}
                        renderRail={() => <View style={[styles.rail, showFreeOnly && styles.disabledRail]} />}
                        renderRailSelected={() => <View style={[styles.railSelected, showFreeOnly && styles.disabledRailSelected]} />}
                        low={parseInt(fromPrice)}
                        high={parseInt(toPrice)}
                        onValueChanged={showFreeOnly ? undefined : handleValueChange}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>From</Text>
                        <BottomSheetTextInput
                            style={[styles.input, showFreeOnly && styles.disabledInput]}
                            value={fromPrice}
                            onChangeText={handleFromPriceChange}
                            keyboardType="numeric"
                            editable={!showFreeOnly}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>To</Text>
                        <BottomSheetTextInput
                            style={[styles.input, showFreeOnly && styles.disabledInput]}
                            value={toPrice}
                            onChangeText={(text) => !showFreeOnly && setToPrice(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            editable={!showFreeOnly}
                        />
                    </View>
                </View>

                <View style={styles.switchContainer}>
                    <Switch
                        value={showFreeOnly}
                        onValueChange={handleFreeOnlyToggle}
                        trackColor={{ true: '#34b2da', false: '#434343' }}
                        thumbColor={showFreeOnly ? '#FFFFFF' : '#FFFFFF'}
                    />
                    <Text style={styles.switchLabel}>Show free events only</Text>
                </View>

                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={styles.applyButtonText}>See 197 matching events</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                    <Text style={styles.clearButtonText}>Clear all selected</Text>
                </TouchableOpacity>
            </BottomSheetScrollView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    bottomSheetBackground: { backgroundColor: '#141414', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    handleIndicator: { backgroundColor: 'rgba(255,255,255,0.3)', width: 32, height: 4 },
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 90 },
    title: { fontSize: 24, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
    rangeSliderContainer: { marginVertical: 24, height: 40 },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#34b2da',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbInner: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: 'black',
    },
    rail: { flex: 1, height: 8, borderRadius: 100, backgroundColor: '#172428' },
    railSelected: { flex: 1, height: 8, backgroundColor: '#34b2da', borderRadius: 2 },
    inputContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
    inputWrapper: { width: '45%' },
    inputLabel: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 8 },
    input: { backgroundColor: 'transparent', borderRadius: 15, paddingHorizontal: 16, paddingVertical: 18, color: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    switchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
    switchLabel: { color: '#FFFFFF', fontSize: 16, marginLeft: 12 },
    applyButton: { backgroundColor: '#FFFFFF', borderRadius: 100, paddingVertical: 16, alignItems: 'center' },
    clearButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
    clearButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    applyButtonText: { color: '#000000', fontSize: 16, fontWeight: '600' },
    disabledContainer: {
        opacity: 0.5,
    },
    disabledThumb: {
        backgroundColor: '#434343',
    },
    disabledRail: {
        backgroundColor: '#434343',
    },
    disabledRailSelected: {
        backgroundColor: '#434343',
    },
    disabledInput: {
        backgroundColor: '#000000',
        color: 'rgba(255,255,255,0.5)',
    },
});

export default PriceBottomSheet;