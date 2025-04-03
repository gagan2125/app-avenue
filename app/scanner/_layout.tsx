// ScannerLayout.tsx (Shared layout for /scanner/* screens)
import { Stack, useRouter, useSegments } from 'expo-router';
import ScannerBottom from '@/components/ScannerBottomNavigation';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function ScannerLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { organizerId, eventId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'scan' | 'attendes'>('scan');

  useEffect(() => {
    if (segments.includes('attendes')) {
      setActiveTab('attendes');
    } else {
      setActiveTab('scan');
    }
  }, [segments]);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />

      <ScannerBottom
        activeTab={activeTab}
        organizerId={organizerId as string}
        onScanPress={() => {
          if (eventId) {
            router.replace({ pathname: '/scanner/qr-scan', params: { organizerId, eventId } });
          }
        }}
        onAttendeesPress={() => {
          if (eventId) {
            router.replace({ pathname: '/scanner/attendes', params: { organizerId, eventId } });
          }
        }}
      />
    </View>
  );
}
