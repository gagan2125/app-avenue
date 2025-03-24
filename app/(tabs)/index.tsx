import { View, Text, Pressable, TextInput, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Icon1 } from '@/assets/icons/SavedEventsIcons';
import CountryDropdown from '@/components/CountryDropdown';
import { useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import Banner from '@/components/Banner';
import axios from 'axios';
import { url } from '@/constants/url';

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

export default function Index() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSending, setIsSending] = useState(false); // State for button loading
  const [buttonText, setButtonText] = useState("Verify number");

  const handlePhoneNumberChange = (text: string) => {
    const cleanedText = text.replace(/\D/g, '');
    setPhoneNumber(cleanedText);
    setShowError(cleanedText.length > 12);
  };

  const handleVerify = async () => {
    const numberWithCode = selectedCountry.dialCode + phoneNumber;

    try {
      setIsSending(true);
      setButtonText("Sending OTP...");

      const response = await axios.post(
        `${url}/auth/send-otp`,
        { phone: numberWithCode }
      );
      if (response.data?.data?.status === "sent") {
        setButtonText("Verify number");
        router.push({
          pathname: "/verify-number",
          params: { phone: phoneNumber },
        });
      } else {
        console.error("API returned failure:", response.data);
        setButtonText("Verify number");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setButtonText("Verify number");
    } finally {
      setIsSending(false);
    }
  };

  const isVerifyDisabled = phoneNumber.length === 0 || showError;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
    >
      <Pressable className="flex-1" onPress={() => Keyboard.dismiss()}>
        <StatusBar style="light" />

        {/* Content */}
        <View className="px-5 flex-1">
          {/* Logo */}
          <View className="mt-20 mb-4 items-center">
            <Icon1 color="#34B2DA" size={40} />
          </View>

          {/* Heading */}
          <Text className="text-white text-center text-[28px] font-medium">Enter phone</Text>
          <Text className="text-gray-400 text-center text-base mt-2 mb-8">Let's check if you have an account</Text>

          {/* Phone Input */}
          <View>
            <View className="flex-row space-x-3 border border-white/10 rounded-full p-1" style={{ zIndex: 999999 }}>
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
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  placeholder="(555) 987 6543"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
            </View>

            {/* Error Banner */}
            {showError && (
              <View className="mt-20 w-full flex-row justify-center">
                <Banner
                  type="red"
                  text="NUMBER DOESN'T EXIST"
                  isExpired={true}
                />
              </View>
            )}
          </View>
        </View>

        {/* Bottom Buttons */}
        <View className="px-5 pb-8 flex-row items-center gap-4">
          <Pressable
            onPress={() => router.back()}
            className="w-14 h-14 border border-white/10 rounded-full items-center justify-center"
          >
            <Entypo name="cross" size={24} color="white" />
          </Pressable>
          <Pressable
            className={`flex-1 py-4 rounded-full ${isSending || isVerifyDisabled ? 'bg-white/50' : 'bg-white'}`}
            onPress={handleVerify}
            disabled={isSending || isVerifyDisabled}
          >
            <Text className="text-black text-base font-medium text-center">
              {buttonText}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}