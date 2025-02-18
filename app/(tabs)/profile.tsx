import { LockIcon } from "@/assets/icons/ProfileIcons";
import { Icon1, Icon2 } from "@/assets/icons/SavedEventsIcons";
import LegalSection from "@/components/Legal";
import ProfileCard from "@/components/ProfileCard";
import ProfileDetailCard from "@/components/ProfileDetailCard";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";

const Profile = () => {
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(false);

  return (
    <ScrollView className="bg-black flex-1 px-4 py-8 pb-32">
      {/* Header */}
      <View className="flex-row gap-6">
        <View className="flex-row items-center">
          <Icon1 color="#34B2DA" size={25} />
          <Text className="text-2xl font-medium text-white ml-2">Avenue</Text>
        </View>
        <View className="flex-row items-center">
          <Icon2 color="#F97316" size={25} />
          <Text className="text-2xl font-medium text-white ml-2">Attendee</Text>
        </View>
      </View>

      {/* Profile Card */}
      <ProfileCard
        name="Ali Mamedgasanov"
        joinDate="December 2025"
        purchasedTickets={18}
        savedTickets={32}
      />

      {/* Basic Details */}
      <ProfileDetailCard />

      {/* Privacy Section */}
      <View className="border border-white/10 w-full bg-black overflow-hidden rounded-3xl mt-6 relative z-10">
        <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }} className="bg-white/10 flex-row items-center p-4 border-b border-white/10">
          <View className="w-8 h-8 items-center justify-center">
            <LockIcon color="#FFFFFF" size={16} />
          </View>
          <Text className="text-white text-xl font-medium ml-2">Privacy</Text>
        </View>

        <View className="p-4">
          <Text className="text-white text-xl font-medium">
            Show me in event page
          </Text>
          <Text className="text-[#8E9196] text-base mt-2">
            Allow others to see you're attending events
          </Text>
          <View className="mt-4 flex-row">
            <Switch
              value={isPrivacyEnabled}
              onValueChange={setIsPrivacyEnabled}
              trackColor={{ false: "#2C2C2E", true: "#2C2C2E" }}
              thumbColor={isPrivacyEnabled ? "#34B2DA" : "#FFFFFF"}
              ios_backgroundColor="#2C2C2E"
              style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            />
            <View style={{ flex: 1 }} />
          </View>
        </View>
      </View>

      {/* Legal Section */}
      <LegalSection />

      {/* Bottom Spacing */}
      <View className="h-32" />
    </ScrollView>
  );
};

export default Profile;
