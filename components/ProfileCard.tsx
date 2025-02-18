import { ThunderIcon, UploadIcon } from "@/assets/icons/ProfileIcons";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

interface ProfileCardProps {
  name: string;
  joinDate: string;
  purchasedTickets: number;
  savedTickets: number;
}

const ProfileCard = ({
  name,
  joinDate,
  purchasedTickets,
  savedTickets
}: ProfileCardProps) => {
  const router = useRouter();
  const [toggleTabs, setToggleTabs] = useState("attendee");
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
  const [profileImage, setProfileImage] = useState<boolean>(false);

  return (
    <View className="mt-6 w-80 bg-black text-white p-6 rounded-3xl border border-white/10">
      {/* Avatar */}
      <View className="mb-10">
        <Pressable
          onPress={() => setProfileImage((prev) => !prev)}
          style={{ backgroundColor: profileImage ? "#10B981" : "#0b1b16" }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
        >
          {profileImage ? (
            <Text className="text-4xl font-medium text-black">{initials}</Text>
          ) : (
            <UploadIcon color="#10B981" size={20} />
          )}
        </Pressable>
      </View>
      {/* Name */}
      <View className="mt-8">
        <Pressable
          onPress={() => router.push("/(stack)/sign-in")}
          className="active:opacity-70"
        >
          <Text className="text-4xl font-semibold text-white">
            {name}
          </Text>
        </Pressable>
      </View>

      {/* Join Date */}
      <View className="flex-row items-center mt-2 gap-2 ">
        <Entypo name="calendar" size={16} color="#9CA3AF" />
        <Text className="text-sm text-gray-400 ml-2">
          Joined on {joinDate}
        </Text>
      </View>

      <View className="h-16  flex-row items-center p-1 rounded-full mt-6 mb-1 bg-white/10">
        <Pressable
          onPress={() => setToggleTabs("attendee")}
          className={`${toggleTabs === "attendee"
            ? "bg-white/10"
            : "bg-transparent"} h-full w-1/2 rounded-full justify-center items-center flex-row`}
        >
          <Text
            className={`text-amber-500 text-2xl ${toggleTabs === "attendee"
              ? "opacity-100"
              : "opacity-50"}`}
          >
            <ThunderIcon color="#F97316" size={15} />
          </Text>
          <Text
            className={`font-medium ml-1 text-xl text-white ${toggleTabs ===
              "attendee"
              ? "opacity-100"
              : "opacity-50"}`}
          >
            Attendee
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setToggleTabs("creator")}
          className={`${toggleTabs === "creator"
            ? "bg-white/10"
            : "bg-transparent"} h-full w-1/2 rounded-full justify-center items-center`}
        >
          <Text
            className={`${toggleTabs === "creator"
              ? "opacity-100"
              : "opacity-50"} text-white font-medium text-xl`}
          >
            Creator
          </Text>
        </Pressable>
      </View>

      <View className="mt-4 flex-row justify-between bg-black rounded-3xl p-4 border border-white/10">
        <View className="flex-1 flex-col items-center">
          <Text className="text-sm text-gray-400">Purchased tickets</Text>
          <Text className="text-2xl mt-2 font-semibold text-white">
            {purchasedTickets}
          </Text>
        </View>

        <Text style={{ width: .1, backgroundColor: "white", opacity: .1 }} className="self-center h-full"></Text>

        <View className="flex-1 flex-col items-center">
          <Text className="text-sm text-gray-400">Saved tickets</Text>
          <Text className="text-2xl mt-2 font-semibold text-white">
            {savedTickets}
          </Text>
        </View>
      </View>


    </View>
  );
};

export default ProfileCard;
