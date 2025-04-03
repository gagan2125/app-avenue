import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetProvider } from '@/context/BottomSheetContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { FilterProvider } from '@/context/FilterContext';
import { Host } from "react-native-portalize";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Host>
          <BottomSheetModalProvider>
            <BottomSheetProvider>
              <FilterProvider>
                <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(stack)" />
                </Stack>
              </FilterProvider>
            </BottomSheetProvider>
          </BottomSheetModalProvider>
        </Host>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
