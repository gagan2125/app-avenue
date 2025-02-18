import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Pressable, Dimensions, LayoutRectangle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
interface Country {
    code: string;
    name: string;
    flag: string;
    dialCode: string;
}
interface CountrySelectorProps {
    selectedCountry: Country;
    onSelect: (country: Country) => void;
    countries: Country[];
}
export default function CountrySelector({ selectedCountry, onSelect, countries }: CountrySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownLayout, setDropdownLayout] = useState<LayoutRectangle | null>(null);
    const [showAbove, setShowAbove] = useState(false);
    const triggerRef = useRef<View>(null);
    const { height: windowHeight } = Dimensions.get('window');
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            triggerRef.current.measure((x, y, width, height, pageX, pageY) => {
                const dropdownHeight = 300; // Maximum height of dropdown
                const spaceBelow = windowHeight - (pageY + height);
                const spaceAbove = pageY;
                setShowAbove(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
                setDropdownLayout({
                    x: pageX,
                    y: pageY,
                    width,
                    height
                });
            });
        }
    }, [isOpen]);
    return (
        <View>
            <View ref={triggerRef}>
                <Pressable
                    onPress={() => setIsOpen(!isOpen)}
                    className="flex-row items-center justify-between p-4 bg-white/10 rounded-3xl"
                >
                    <View className="flex-row items-center space-x-3">
                        <Image
                            source={{ uri: selectedCountry.flag }}
                            className="w-6 h-4 rounded"
                        />
                        <Text className="text-white text-base ml-2">{selectedCountry.name}</Text>
                    </View>
                    <MaterialIcons
                        name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={24}
                        color="white"
                    />
                </Pressable>
            </View>
            {isOpen && dropdownLayout && (
                <>
                    <Pressable
                        className="absolute inset-0 w-full h-full"
                        onPress={() => setIsOpen(false)}
                        style={{
                            position: 'absolute',
                            top: -dropdownLayout.y,
                            height: windowHeight,
                        }}
                    />
                    <View
                        className="absolute z-50 w-full bg-secondary rounded-3xl overflow-hidden border border-white/10"
                        style={{
                            top: showAbove ? undefined : dropdownLayout.height + 8,
                            bottom: showAbove ? dropdownLayout.height + 8 : undefined,
                            maxHeight: 300,
                        }}
                    >
                        <View className="p-4 border-b border-white/10">
                            <Text className="text-white text-lg font-semibold">Select Country</Text>
                        </View>
                        <ScrollView className="bg-secondary">
                            {countries.map((country) => (
                                <TouchableOpacity
                                    key={country.code}
                                    className={`flex-row items-center justify-between p-4 border-b border-white/10 ${selectedCountry.code === country.code ? 'bg-white/10' : ''}`}
                                    onPress={() => {
                                        onSelect(country);
                                        setIsOpen(false);
                                    }}
                                >
                                    <View className="flex-row items-center space-x-3">
                                        <Image
                                            source={{ uri: country.flag }}
                                            className="w-6 h-4 rounded"
                                        />
                                        <Text className="text-white text-base ml-2">{country.name}</Text>
                                    </View>
                                    {selectedCountry.code === country.code && (
                                        <MaterialIcons name="check" size={24} color="#3B82F6" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </>
            )}
        </View>
    );
} 