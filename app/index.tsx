import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";

export default function RedirectToSignIn() {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.replace("/(tabs)");
        }, 50);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white" }}>
                <ActivityIndicator />
            </Text>
        </View>
    );
}
