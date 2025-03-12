import { View, Text, TouchableOpacity, SafeAreaView, Image, Dimensions, Pressable, Platform, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import PlaceBottomSheet, { PlaceBottomSheetRef } from '@/components/EventBottomSheet';
import ScanBottomSheet, { ScanBottomSheetRef } from '@/components/ScanBottomSheet';
import { StatusBar } from "expo-status-bar";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const QrScan = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const placeBottomSheetRef = useRef<PlaceBottomSheetRef>(null);
  const scanBottomSheetRef = useRef<ScanBottomSheetRef>(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; name: string; flyer: string } | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanError, setScanError] = useState(false)
  const [scanData, setScanData] = useState({})

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`https://avenue.tickets/api/event/get-event-by-organizer-id/679485a16e216db10d26702e`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, ["679485a16e216db10d26702e"]);

  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent({ id: events[0]._id, name: events[0].event_name, flyer: events[0].flyer });
    }
  }, [events]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    try {
      const parsedData = JSON.parse(data);

      if (parsedData?.qrcode && parsedData.qrcode !== scannedData) {
        setScannedData(parsedData.qrcode);
        validateTicket(parsedData.qrcode);
      }
    } catch (error) {
      console.error("Invalid QR Code Format", error);
      setScanError(true);
      resetScanner();
    }
  };

  const validateTicket = async (qrcode: string) => {
    try {
      const response = await axios.post(`https://avenue.tickets/api/fetchDataByQRCode`, { qrcode_number: qrcode });

      if (response.data?.event?._id === selectedEvent?.id) {
        setScanError(false);
        setScanData(response.data);
        scanBottomSheetRef.current?.open();
      } else {
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
    }, 3000);
  };

  if (hasPermission === null) {
    return <Text className="text-white text-center mt-10">Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text className="text-red-500 text-center mt-10">No access to camera</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      <View className="flex-1 relative" style={{ marginTop: Platform.OS === "android" ? insets.top + 10 : 0 }}>
        <CameraView
          style={{ width: "100%", height: "100%", position: "absolute" }}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barCodeTypes: ["qr", "ean13", "code128"],
          }}
        />

        <Pressable onPress={() => placeBottomSheetRef.current?.open()} className="absolute top-0 left-0 right-0 flex-row items-center p-4">
          <Image
            source={{ uri: selectedEvent ? selectedEvent.flyer : "" }}
            style={{ width: width * 0.09, height: width * 0.09, borderRadius: 10 }}
          />
          <Text className="text-white text-lg ml-3 font-semibold">{selectedEvent ? selectedEvent.name : "Loading Event..."}</Text>
          <View className="ml-auto flex-row items-center space-x-3">
            <Ionicons name="chevron-down" size={width * 0.04} color="white" />
          </View>
        </Pressable>

        {/* Scanner Frame */}
        <View className="absolute w-full h-full justify-center items-center">
          <View
            style={{
              width: width * 0.7,
              height: height * 0.35,
              position: "absolute",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View className="flex-row justify-between w-full">
              <View className="w-16 h-16 border-l-4 border-t-4 rounded-t-md rounded-l-md border-white" />
              <View className="w-16 h-16 border-r-4 border-t-4 rounded-t-md rounded-r-md border-white" />
            </View>
            {
              scanError && (
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
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="warning" size={20} color="red" style={{ marginRight: 6 }} />
                    <Text className="text-white font-semibold text-lg">Invalid ticket</Text>
                  </View>
                  <Text className="text-white/50 text-base text-center mt-1">QR code is not recognized</Text>
                </View>
              )
            }
            {/* <View
              style={{
                backgroundColor: "rgba(249, 115, 22, 0.15)",
                borderWidth: 1,
                borderColor: "#F97316",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 12,
                width: "85%",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="warning" size={20} color="#F97316" style={{ marginRight: 6 }} />
                <Text className="text-white font-semibold text-lg">Wrong event</Text>
              </View>
              <Text className="text-white/50 text-base text-center mt-1">Ticket is for other event</Text>
            </View>
             */}
            <View className="flex-row justify-between w-full">
              <View className="w-16 h-16 border-l-4 border-b-4 rounded-b-md rounded-l-md border-white" />
              <View className="w-16 h-16 border-r-4 border-b-4 rounded-b-md rounded-r-md border-white" />
            </View>
          </View>
        </View>

        {/* Fixed Bottom Buttons */}
        <View
          style={{
            position: "absolute",
            bottom: Platform.OS === "ios" ? insets.bottom + 0 : insets.bottom + 40,
            width: "100%",
            paddingHorizontal: width * 0.15,
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
            >
              <Text className="text-white font-medium text-lg">Scan ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: height * 0.015,
                paddingHorizontal: width * 0.07,
              }}
              onPress={() => {
                if (selectedEvent) {
                  router.push({
                    pathname: "/(stack)/orders",
                    params: { eventId: selectedEvent.id },
                  });
                }
              }}
            >
              <Text className="text-white/50 font-medium text-lg">Attendees</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <PlaceBottomSheet ref={placeBottomSheetRef} events={events} onSelectEvent={setSelectedEvent} />
      <ScanBottomSheet ref={scanBottomSheetRef} selectedEvent={scanData} />
    </SafeAreaView>
  );
};

export default QrScan;
