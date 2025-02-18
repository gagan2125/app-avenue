import { ChatIcon, LegalIcon, LogoutIcon } from "@/assets/icons/ProfileIcons";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const ArrowIcon = () =>
  <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.275151 9.725C0.0995883 9.54922 0.000976562 9.31094 0.000976562 9.0625C0.000976562 8.81406 0.0995883 8.57578 0.275151 8.4L6.80015 1.875H2.18765C1.93901 1.875 1.70055 1.77623 1.52474 1.60041C1.34892 1.4246 1.25015 1.18614 1.25015 0.9375C1.25015 0.68886 1.34892 0.450403 1.52474 0.274587C1.70055 0.0987719 1.93901 0 2.18765 0H9.06265C9.31129 0 9.54975 0.0987719 9.72556 0.274587C9.90138 0.450403 10.0002 0.68886 10.0002 0.9375V7.8125C10.0002 8.06114 9.90138 8.2996 9.72556 8.47541C9.54975 8.65123 9.31129 8.75 9.06265 8.75C8.81401 8.75 8.57555 8.65123 8.39974 8.47541C8.22392 8.2996 8.12515 8.06114 8.12515 7.8125V3.2L1.60015 9.725C1.42437 9.90056 1.18609 9.99918 0.937652 9.99918C0.689213 9.99918 0.450933 9.90056 0.275151 9.725Z"
      fill="white"
      fillOpacity={0.4}
    />
  </Svg>;

const LegalSection = () => {
  return (
    <View className="w-full max-w-md overflow-hidden rounded-3xl bg-black border border-white/10 mt-6">
      {/* Header */}
      <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }} className="bg-white/10 flex-row items-center space-x-3 p-4 border-b border-white/10">
        <View className="w-8 h-8 items-center justify-center">
          <LegalIcon color="#FFFFFF" size={16} />
        </View>
        <Text className="text-white text-xl font-medium ml-2">Legal</Text>
      </View>

      <View className="p-4 space-y-6">
        {/* Contact Support Section */}
        <View className="space-y-2">
          <Text className="text-xl font-normal text-white">
            Contact support
          </Text>
          <Text className="text-base text-[#8E9196] mt-2">
            Need help? We're here for you
          </Text>
          <View className="flex-row items-center gap-2 my-4">
            <Pressable className=" w-40 p-4 rounded-full mt-3 flex-row items-center gap-2 px-6 py-4 bg-black border border-white/10">
              <ChatIcon color="white" size={20} />
              <Text className="text-white text-md font-medium ml-2">
                Chat with support
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Terms and Privacy Section */}
        <View className="space-y-2">
          <Text className="text-xl font-normal text-white">
            Terms and Privacy
          </Text>
          <Text className="text-base text-[#8E9196] mt-2">View legal documents</Text>
          <View className="flex-row items-center gap-2 my-4 w-1/2">
            <Pressable className="p-4 rounded-full w-full mt-3 flex-row items-center justify-between px-6 py-4 bg-black border border-white/10">
              <Text className="text-white text-md font-medium mr-4">
                Terms & Privacy
              </Text>
              <View style={{ marginLeft: 10 }}>
                <ArrowIcon />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Logout Section */}
        <View className="space-y-2">
          <Text className="text-xl font-normal text-white">Logout</Text>
          <Text className="text-base text-[#8E9196] mt-2">
            You will be logged out of your account
          </Text>
          <View className="flex-row items-center gap-2 my-4 w-1/2 ">
            <Pressable className="w-full p-4 rounded-full mt-3 flex-row items-center gap-2 px-6 py-4 bg-black border border-white/10">
              <LogoutIcon color="#F43F5E" size={14} />
              <Text
                style={{ color: "#F43F5E" }}
                className="text-md font-medium ml-2 "
              >
                Logout of Account
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LegalSection;
