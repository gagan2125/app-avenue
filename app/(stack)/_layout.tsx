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
        </Stack>
    );
} 