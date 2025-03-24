import { View, Text, TouchableOpacity, SafeAreaView, Image, Dimensions, Pressable, Platform, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import PlaceBottomSheet from '@/components/EventBottomSheet';
import ScanBottomSheet from '@/components/ScanBottomSheet';
import { StatusBar } from "expo-status-bar";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const QrScan = () => {
  const router = useRouter();
  const { organizerId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState(null);
  const placeBottomSheetRef = useRef(null);
  const scanBottomSheetRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [scanError, setScanError] = useState(false);
  const [scanData, setScanData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (organizerId) fetchEvent();
  }, [organizerId]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`https://avenue.tickets/api/event/get-event-by-organizer-id/${organizerId}`);
      if (response.data && Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        console.error("Invalid event data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      Alert.alert("Error", "Failed to fetch events. Please try again.");
    }
  };

  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      const now = new Date();
      const upcomingEvents = events.filter((event) => {
        const startDate = new Date(event.start_date);
        return startDate >= now && event.explore === 'YES';
      });

      if (upcomingEvents.length > 0) {
        const firstEvent = upcomingEvents[0];
        setSelectedEvent({ id: firstEvent._id, name: firstEvent.event_name, flyer: firstEvent.flyer });
      }
    }
  }, [events, selectedEvent]);

  const handleBarcodeScanned = ({ data }) => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const parsedData = JSON.parse(data);
      if (parsedData?.qrcode && parsedData.qrcode !== scannedData) {
        setScannedData(parsedData.qrcode);
        validateTicket(parsedData.qrcode);
      } else {
        setScanError(true);
        resetScanner();
      }
    } catch (error) {
      console.error("Invalid QR Code Format", error);
      setScanError(true);
      resetScanner();
    }
  };

  const validateTicket = async (qrcode) => {
    try {
      const response = await axios.post(`https://avenue.tickets/api/fetchDataByQRCode`, { qrcode_number: qrcode });
      if (response.data?.event?._id === selectedEvent?.id) {
        setScanError(false);
        setScanData(response.data);
        setTimeout(() => {
          scanBottomSheetRef.current?.open();
        }, 500);
      } else {
        console.log("Event mismatch or invalid data");
        setScanError(true);
        resetScanner();
      }
    } catch (error) {
      console.error("Ticket Validation Error:", error);
      setScanError(true);
      resetScanner();
    }
  };

  const resetScanner = () => {
    setTimeout(() => {
      setScanError(false);
      setScannedData(null);
      setIsProcessing(false);
    }, 3000);
  };

  const navigateToAttendees = () => {
    if (selectedEvent) {
      router.push({
        pathname: "/(stack)/orders",
        params: { eventId: selectedEvent.id },
      });
    } else {
      Alert.alert("No Event Selected", "Please select an event first.");
    }
  };

  if (hasPermission === null) {
    return <Text className="text-white text-center mt-10">Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text className="text-red-500 text-center mt-10">No access to camera</Text>;
  }

  return (
    <SafeAreaView className="bg-black flex-1">
      <StatusBar style="light" />
      <View className="flex-1 relative bg-black">
        {/* Camera background */}
        <CameraView
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 0,
          }}
          onBarcodeScanned={isProcessing ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barCodeTypes: ["qr", "ean13", "code128"],
          }}
        />

        {/* Header */}
        <Pressable
          onPress={() => placeBottomSheetRef.current?.open()}
          className="absolute top-0 left-0 right-0 flex-row items-center p-4"
          style={{ zIndex: 10 }}
        >
          <Image
            source={{ uri: selectedEvent?.flyer ?? "" }}
            style={{ width: width * 0.09, height: width * 0.09, borderRadius: 10 }}
          />
          <Text className="text-white text-lg ml-3 font-semibold">
            {selectedEvent?.name ?? "Loading Event..."}
          </Text>
          <View className="ml-auto">
            <Ionicons name="chevron-down" size={24} color="white" />
          </View>
        </Pressable>

        {/* Scanner frame */}
        <View className="absolute w-full h-full justify-center items-center" pointerEvents="box-none">
          <View
            style={{
              width: width * 0.7,
              height: height * 0.35,
              justifyContent: "space-between",
              alignItems: "center",
            }}
            pointerEvents="box-none"
          >
            <View className="flex-row justify-between w-full" pointerEvents="none">
              <View className="w-16 h-16 border-l-4 border-t-4 border-white rounded-t-md rounded-l-md" />
              <View className="w-16 h-16 border-r-4 border-t-4 border-white rounded-t-md rounded-r-md" />
            </View>

            {scanError && (
              <View
                style={{
                  backgroundColor: "rgba(255, 0, 0, 0.15)",
                  borderWidth: 1,
                  borderColor: "#F43F5E",
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  width: "85%",
                  alignItems: "center",
                }}
                pointerEvents="none"
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="warning" size={20} color="red" style={{ marginRight: 6 }} />
                  <Text className="text-white font-semibold text-lg">Invalid ticket</Text>
                </View>
                <Text className="text-white/50 text-base text-center mt-1">
                  QR code is not recognized
                </Text>
              </View>
            )}

            <View className="flex-row justify-between w-full" pointerEvents="none">
              <View className="w-16 h-16 border-l-4 border-b-4 border-white rounded-b-md rounded-l-md" />
              <View className="w-16 h-16 border-r-4 border-b-4 border-white rounded-b-md rounded-r-md" />
            </View>
          </View>
        </View>

        {/* Bottom Tabs */}
        <View
          style={{
            position: "absolute",
            bottom: Platform.OS === "ios" ? insets.bottom + 0 : insets.bottom + 40,
            width: "100%",
            paddingHorizontal: width * 0.15,
            zIndex: 10,
          }}
        >
          <View className="flex-row justify-center items-center bg-white/10 rounded-full py-2 px-3">
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                paddingVertical: height * 0.015,
                paddingHorizontal: width * 0.07,
                borderRadius: 999,
              }}
              onPress={() => {
                setScanError(false);
                setScannedData(null);
                setIsProcessing(false);
              }}
            >
              <Text className="text-white font-medium text-lg">Scan ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: height * 0.015,
                paddingHorizontal: width * 0.07,
              }}
              onPress={navigateToAttendees}
            >
              <Text className="text-white/50 font-medium text-lg">Attendees</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Sheets */}
      <PlaceBottomSheet ref={placeBottomSheetRef} events={events} onSelectEvent={setSelectedEvent} />
      <ScanBottomSheet ref={scanBottomSheetRef} selectedEvent={scanData} />
    </SafeAreaView>
  );
};

export default QrScan;
