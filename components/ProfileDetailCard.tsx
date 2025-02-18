import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import CountryDropdown from "./CountryDropdown";
import { ContactIcon } from "@/assets/icons/ProfileIcons";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  {
    code: "US",
    name: "United States",
    flag: "https://cdn.britannica.com/33/4833-050-F6E415FE/Flag-United-States-of-America.jpg",
    dialCode: "+1"
  },
  {
    code: "IN",
    name: "India",
    flag: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
    dialCode: "+91"
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1200px-Flag_of_the_United_Kingdom.svg.png",
    dialCode: "+44"
  },
  {
    code: "CA",
    name: "Canada",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1200px-Flag_of_Canada_%28Pantone%29.svg.png",
    dialCode: "+1"
  }
];

const ProfileDetailCard = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);
  const [email, setEmail] = useState("alihey@gmail.com");
  const [phone, setPhone] = useState("(555) 987 654");
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);

  const handleEmailChange = () => {
    if (isEmailEditable) {
      setEmail(tempEmail);
      setIsEmailEditable(false);
    } else {
      setTempEmail(email);
      setIsEmailEditable(true);
    }
  };

  const handlePhoneChange = () => {
    if (isPhoneEditable) {
      setPhone(tempPhone);
      setIsPhoneEditable(false);
    } else {
      setTempPhone(phone);
      setIsPhoneEditable(true);
    }
  };

  return (
    <View className="border border-white/10 w-full bg-black rounded-3xl mt-6">
      {/* Header */}
      <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }} className="bg-white/10 flex-row items-center p-4 border-b border-white/10">
        <View className="w-8 h-8 items-center justify-center">
          <ContactIcon color="#FFFFFF" size={18} />
        </View>
        <Text className="text-white text-xl font-medium ml-2">
          Basic details
        </Text>
      </View>

      {/* Name Section */}
      <View className="p-4">
        <Text className="text-white text-xl font-medium">Name</Text>
        <Text className="text-[#8E9196] text-base mt-2">
          This is how others will see you
        </Text>
        <TextInput
          className="bg-black h-14 px-4 mt-4 rounded-full text-white border border-white/10"
          placeholder="Enter your name"
          placeholderTextColor="rgba(255,255,255,0.5)"
          defaultValue="Ali Mamedgasanov"
        />
      </View>

      {/* Email Section */}
      <View className="p-4 border-t border-white/10">
        <Text className="text-white text-xl font-medium">Email</Text>
        <Text className="text-[#8E9196] text-base mt-2">
          Your email for notifications and updates
        </Text>
        <View className="flex-row space-x-3 mt-4 border border-white/10 rounded-full p-1">
          <View className="flex-1 rounded-full flex-row items-center px-4">
            <Entypo name="mail" size={16} color="rgba(255,255,255,0.5)" />
            <TextInput
              className="flex-1 h-12 text-white ml-3"
              value={isEmailEditable ? tempEmail : email}
              onChangeText={setTempEmail}
              placeholderTextColor="rgba(255,255,255,0.5)"
              editable={isEmailEditable}
            />
          </View>
          <Pressable
            className="bg-white/10 px-6 rounded-full items-center justify-center"
            onPress={handleEmailChange}
          >
            <Text className="text-white text-base">
              {isEmailEditable ? "Save" : "Change"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Phone Number Section */}
      <View className="p-4 border-t border-white/10">
        <Text className="text-white text-xl font-medium">Phone number</Text>
        <Text className="text-[#8E9196] text-base mt-2">
          Your verified phone number
        </Text>
        <View className="flex-row space-x-3 mt-4 border border-white/10 rounded-full p-1" style={{ zIndex: 999999 }}>
          <View className="border-r border-white/10 min-w-[100px]" style={{ zIndex: 999999 }}>
            <CountryDropdown
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
              countries={countries}
            />
          </View>
          <View className="flex-1 rounded-full flex-row items-center">
            <TextInput
              className="flex-1 h-12 text-white px-4"
              value={isPhoneEditable ? tempPhone : phone}
              onChangeText={setTempPhone}
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="phone-pad"
              editable={isPhoneEditable}
            />
          </View>
          <Pressable
            className="bg-white/10 px-6 rounded-full items-center justify-center"
            onPress={handlePhoneChange}
          >
            <Text className="text-white text-base">
              {isPhoneEditable ? "Save" : "Change"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileDetailCard;
