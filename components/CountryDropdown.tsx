import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  UIManager,
  findNodeHandle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Portal } from "react-native-portalize";

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
  isTop = false,
}: CountryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0, width: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const handle = findNodeHandle(triggerRef.current);
      if (handle) {
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
          setDropdownPos({ x: pageX, y: pageY + height, width });
        });
      }
    }
  }, [isOpen]);

  return (
    <View ref={triggerRef} className="relative z-50">
      <Pressable
        onPress={() => setIsOpen((prev) => !prev)}
        className="h-12 flex-row items-center justify-between bg-transparent"
      >
        <View
          className="flex-row items-center"
          style={{ width: 100, paddingHorizontal: 12 }}
        >
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
        <Portal>
          <>
            {/* Dismiss overlay */}
            <Pressable
              className="absolute inset-0"
              style={{ zIndex: 999998 }}
              onPress={() => setIsOpen(false)}
            />

            {/* Dropdown itself */}
            <View
              className="bg-secondary rounded-2xl border border-white/10 overflow-hidden"
              style={{
                position: "absolute",
                top: dropdownPos.y,
                left: dropdownPos.x,
                width: 280,
                zIndex: 999999,
              }}
            >
              <ScrollView className="max-h-64">
                {countries.map((country) => (
                  <Pressable
                    key={country.code}
                    className={`flex-row items-center justify-between p-3 border-b border-white/10 ${selectedCountry.code === country.code
                        ? "bg-white/10"
                        : ""
                      }`}
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
                      <Text className="text-white ml-2 min-w-[40px]">
                        {country.dialCode}
                      </Text>
                      <Text
                        className="text-white ml-2 text-sm opacity-50 flex-1"
                        numberOfLines={1}
                      >
                        {country.name}
                      </Text>
                    </View>
                    {selectedCountry.code === country.code && (
                      <MaterialIcons
                        name="check"
                        size={16}
                        color="#34B2DA"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </>
        </Portal>
      )}
    </View>
  );
};

export default CountryDropdown;