import { Stack } from 'expo-router';

export default function StackLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="sign-in"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="verify-number"
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name="create-account"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="event-details"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="host-profile"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="checkout"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ticket-selection"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="creator-page"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="bottom-tab"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="qr-scan"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="attendes"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="scanner"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="org-profile"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
} 