import { View, Text, Pressable, TextInput, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Icon1 } from '@/assets/icons/SavedEventsIcons';
import { useState, useRef, useEffect } from 'react';
import Banner from '@/components/Banner';
import axios from 'axios';
import url from '@/constants/url';

export default function VerifyNumber() {
    const router = useRouter();
    const { phone } = useLocalSearchParams();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(0);
    const [showError, setShowError] = useState(false);
    const [showOrgError, setShowOrgError] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startCountdown = () => {
        setCountdown(43); // 43 seconds
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        setError(null);

        if (text.length === 1 && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (index === 5 && text.length === 1) {
            Keyboard.dismiss(); // Close keyboard when last digit is entered
            handleVerify(newOtp);
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace") {
            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const formatTime = (seconds: number) => {
        return `(${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')})`;
    };

    const handleVerify = async (updatedOtp: any[]) => {
        const otpCode = updatedOtp.join("");
        if (otpCode.length < 6) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${url}/auth/verify-otp`, {
                phone: "+1" + phone,
                otp: otpCode
            });

            const { success, organizer } = response.data;

            if (success) {
                if (organizer) {
                    router.replace({
                        pathname: "/scanner",
                        params: { organizerId: organizer._id },
                    });
                } else {
                    setShowOrgError(true);
                }
            } else {
                setShowError(true);
                // Focus on the last (6th) digit when OTP is invalid
                setTimeout(() => {
                    inputRefs.current[5]?.focus();
                }, 100);
            }
        } catch (error) {
            console.error("Verification failed:", error);
            setShowError(true);
            // Focus on the last (6th) digit when verification fails
            setTimeout(() => {
                inputRefs.current[5]?.focus();
            }, 100);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const firstEmptyIndex = otp.findIndex((digit) => digit === "");
        if (firstEmptyIndex !== -1) {
            setTimeout(() => {
                inputRefs.current[firstEmptyIndex]?.focus();
            }, 300);
        }
    }, []);

    const handleSendOtp = async () => {
        try {
            const response = await axios.post(`${url}/auth/send-otp`, { phone: "+1" + phone });
            setCountdown(43); // 43 seconds
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-black"
        >
            <Pressable className="flex-1" onPress={() => Keyboard.dismiss()}>
                <StatusBar style="light" />

                <View className="px-5 flex-1">
                    <View className="mt-20 mb-4 items-center">
                        <Icon1 color="#34B2DA" size={40} />
                    </View>

                    <Text className="text-white text-center text-[28px] font-medium mt-2">Enter confirmation code</Text>
                    <View>
                        <Text className="text-gray-400 text-center text-base mt-2">
                            Please enter verification code we've
                        </Text>
                        <Text className="text-gray-400 text-center text-base mt-1 mb-12">
                            sent on +1{phone}
                        </Text>
                    </View>

                    <View className="flex-row justify-center space-x-4 gap-3">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <View
                                key={index}
                                className={`w-16 h-14 rounded-full border border-white/10 items-center justify-center`}
                            >
                                <TextInput
                                    ref={(ref) => (inputRefs.current[index] = ref)}
                                    className="text-white text-2xl text-center w-full h-full"
                                    maxLength={1}
                                    keyboardType="number-pad"
                                    value={otp[index]}
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    placeholder="0"
                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                    onFocus={() => {
                                        const firstEmptyIndex = otp.findIndex((digit) => digit === "");
                                        if (firstEmptyIndex !== -1 && firstEmptyIndex !== index) {
                                            inputRefs.current[firstEmptyIndex]?.focus();
                                        }
                                    }}
                                />

                            </View>
                        ))}
                    </View>

                    {showError && (
                        <View className="mt-20">
                            <Banner
                                type="red"
                                text="Invalid OTP"
                                isExpired={true}
                            />
                        </View>
                    )}

                    {showOrgError && (
                        <View className="mt-20">
                            <Banner
                                type="red"
                                text="Only for organizers"
                                isExpired={true}
                            />
                        </View>
                    )}

                    {/* Resend Text */}
                    <View className="flex-row justify-center mt-8">
                        {countdown === 0 ? (
                            <Pressable onPress={handleSendOtp} className='flex-row items-center gap-1'>
                                <Text className="text-white/50 text-lg">Didn't get the code? </Text>
                                <Text className="text-white underline text-lg">Resend</Text>
                            </Pressable>
                        ) : (
                            <Text className="text-white/50 text-lg">
                                Resend code <Text className='text-white text-lg'>{formatTime(countdown)}</Text>
                            </Text>
                        )}
                    </View>
                </View>

                {/* Bottom Button */}
                <View className="px-5 pb-8">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-full border border-white/10 py-4 rounded-full flex-row items-center justify-center"
                    >
                        <Ionicons name="chevron-back" size={15} color="white" />
                        <Text className="text-white text-lg font-medium ml-2">Go back</Text>
                    </Pressable>
                </View>
            </Pressable>
        </KeyboardAvoidingView>
    );
}
