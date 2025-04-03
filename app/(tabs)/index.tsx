import {
  View,
  Text,
  Pressable,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Icon1 } from "@/assets/icons/SavedEventsIcons";
import CountryDropdown from "@/components/CountryDropdown";
import { useState } from "react";
import Banner from "@/components/Banner";
import axios from "axios";
import url from "@/constants/url";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";


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
    dialCode: "+1",
  },
  {
    code: "IN",
    name: "India",
    flag: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
    dialCode: "+91",
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1200px-Flag_of_the_United-Kingdom.svg.png",
    dialCode: "+44",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1200px-Flag_of_Canada_%28Pantone%29.svg.png",
    dialCode: "+1",
  },
];

// Phone number regex per country (basic examples)
const phoneRegexByCountry: { [key: string]: RegExp } = {
  US: /^\d{10}$/,
  CA: /^\d{10}$/,
  IN: /^\d{10}$/,
  GB: /^\d{10,11}$/,
};

const fontFamily = Platform.select({
  ios: "SF Pro Rounded",
  android: "System",
});

export default function Index() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showError, setShowError] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [buttonText, setButtonText] = useState("Verify number");

  const validatePhoneNumber = (number: string, countryCode: string): boolean => {
    const cleaned = number.replace(/\D/g, "");
    const regex = phoneRegexByCountry[countryCode];
    return regex ? regex.test(cleaned) : cleaned.length > 5 && cleaned.length < 15;
  };

  const handlePhoneNumberChange = (text: string) => {
    const cleanedText = text.replace(/\D/g, "");
    setPhoneNumber(cleanedText);
    setShowError(cleanedText.length > 10 && !validatePhoneNumber(cleanedText, selectedCountry.code));
  };

  const handleVerify = async () => {
    const numberWithCode = selectedCountry.dialCode + phoneNumber;

    try {
      setIsSending(true);
      setButtonText("Sending OTP...");
      Keyboard.dismiss();

      const response = await axios.post(`${url}/auth/send-otp`, {
        phone: numberWithCode,
      });

      if (["sent", "delivered"].includes(response.data?.data?.status)) {
        setButtonText("Verify number");
        router.push({
          pathname: "/verify-number",
          params: { phone: phoneNumber },
        });
      } else {
        console.error("API returned failure:", response.data);
        setButtonText("Verify number");
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      setButtonText("Verify number");
    } finally {
      setIsSending(false);
    }
  };

  const isVerifyDisabled = !validatePhoneNumber(phoneNumber, selectedCountry.code) || isSending;

  useFocusEffect(() => {
    const onBackPress = () => true; // disables back action
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
  
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <Pressable className="flex-1" onPress={() => Keyboard.dismiss()}>
        <StatusBar style="light" />
        <View className="px-5 flex-1 justify-between">
          {/* Top content */}
          <View>
            <View className="mt-20 mb-4 items-center">
              <Icon1 color="#34B2DA" size={40} />
            </View>

            <Text
              className="text-white text-center font-medium font-sf"
              style={{
                fontSize: 32,
                lineHeight: 36,
                letterSpacing: -0.64,
              }}
            >
              Enter phone number
            </Text>
            <Text className="text-gray-400 text-center text-base  mt-2 mb-8"
              style={{
                letterSpacing: 0.24,
              }}>
              Let's check if you have an account
            </Text>

            {/* Input */}
            <View className="flex-col space-y-3">
              {/* Phone Input Row */}
              <View className="flex-row space-x-3 border border-white/10 rounded-full p-1">
                <View className="border-r border-white/10 min-w-[100px]">
                  <CountryDropdown
                    selectedCountry={selectedCountry}
                    onSelect={(country) => {
                      setSelectedCountry(country);
                      setShowError(
                        phoneNumber.length > 5 &&
                        !validatePhoneNumber(phoneNumber, country.code)
                      );
                    }}
                    countries={countries}
                  />
                </View>
                <View className="flex-1 rounded-full flex-row items-center">
                  <TextInput
                    className="flex-1 h-12 text-white px-4"
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    placeholder="(234) 567 8901"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </View>
              </View>

              {/* Error Banner Below Input */}
              {showError && (
                <View className="items-center mt-3">
                  <Banner
                    type="red"
                    text="Invalid phone number"
                    isExpired={true}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>

      {/* Bottom buttons */}
      <View className="px-5 pb-8 flex-row items-center gap-4">
        <Pressable
          onPress={() => setPhoneNumber("")}
          className="w-14 h-14 border border-white/10 rounded-full items-center justify-center"
        >
          <Entypo name="cross" size={24} color="white" />
        </Pressable>
        <Pressable
          className={`flex-1 py-4 rounded-full ${isVerifyDisabled ? "bg-white/50" : "bg-white"
            }`}
          onPress={handleVerify}
          disabled={isVerifyDisabled}
        >
          <Text className="text-black text-base font-medium text-center">
            {buttonText}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}