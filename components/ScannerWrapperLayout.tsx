// components/ScannerWrapperLayout.tsx
import { useRouter, useSegments, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { ReactNode, useEffect, useState } from 'react';
import ScannerBottom from './ScannerBottomNavigation';

type Props = {
  children: ReactNode;
};

export default function ScannerWrapperLayout({ children }: Props) {
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
      {children}

      <ScannerBottom
        activeTab={activeTab}
        organizerId={organizerId as string}
        onScanPress={() => {
          if (eventId) {
            router.replace({
              pathname: '/qr-scan',
              params: { organizerId, eventId },
            });
          }
        }}
        onAttendeesPress={() => {
          if (eventId) {
            router.replace({
              pathname: '/attendes',
              params: { organizerId, eventId },
            });
          }
        }}
      />
    </View>
  );
}
