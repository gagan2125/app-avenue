import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Pressable, Text, View, ScrollView } from "react-native";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

interface CountryDropdownProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
  countries: Country[];
  isTop?: boolean;
}

const CountryDropdown = ({
  selectedCountry,
  onSelect,
  countries,
  isTop = false
}: CountryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="relative" style={{ zIndex: 999999 }}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="h-12 flex-row items-center justify-between bg-transparent"
      >
        <View className="flex-row items-center justify-between" style={{ width: 100, paddingHorizontal: 12 }}>
          <Image
            source={{ uri: selectedCountry.flag }}
            className="w-6 h-6 rounded-full object-cover"
          />
          <Text className="text-white ml-2" numberOfLines={1}>
            {selectedCountry.dialCode}
          </Text>
          <MaterialIcons
            name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={20}
            color="white"
          />
        </View>
      </Pressable>

      {isOpen && (
        <>
          <Pressable
            className="absolute inset-0 w-screen h-screen"
            onPress={() => setIsOpen(false)}
            style={{ top: -50, left: -20, zIndex: 999998 }}
          />
          <View
            className="absolute bg-secondary rounded-2xl border border-white/10 overflow-hidden"
            style={{
              zIndex: 999999,
              width: 280,
              [isTop ? 'bottom' : 'top']: '100%',
              left: 0,
              marginTop: isTop ? 0 : 4,
              marginBottom: isTop ? 4 : 0
            }}
          >
            <ScrollView className="max-h-64">
              {countries.map((country) => (
                <Pressable
                  key={country.code}
                  className={`flex-row items-center justify-between p-3 border-b border-white/10 ${selectedCountry.code === country.code ? "bg-white/10" : ""}`}
                  onPress={() => {
                    onSelect(country);
                    setIsOpen(false);
                  }}
                >
                  <View className="flex-row items-center flex-1 mr-2">
                    <Image
                      source={{ uri: country.flag }}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <Text className="text-white ml-2 min-w-[40px]">{country.dialCode}</Text>
                    <Text className="text-white ml-2 text-sm opacity-50 flex-1" numberOfLines={1}>
                      {country.name}
                    </Text>
                  </View>
                  {selectedCountry.code === country.code && (
                    <MaterialIcons name="check" size={16} color="#34B2DA" style={{ marginLeft: 8 }} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

export default CountryDropdown;
