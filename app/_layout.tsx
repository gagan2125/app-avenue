import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetProvider } from '@/context/BottomSheetContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { FilterProvider } from '@/context/FilterContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <BottomSheetProvider>
          <FilterProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(stack)" />
            </Stack>
          </FilterProvider>
        </BottomSheetProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
