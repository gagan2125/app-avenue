import { View, Text, Pressable, TextInput, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Icon1 } from '@/assets/icons/SavedEventsIcons';
import { useState, useRef, useEffect } from 'react';
import Banner from '@/components/Banner';
import axios from 'axios';

export default function VerifyNumber() {
    const { phone } = useLocalSearchParams();
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showError, setShowError] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);
    const verificationTimerRef = useRef<NodeJS.Timeout | null>(null);
    const resendTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [verificationCountdown, setVerificationCountdown] = useState(3);
    const [resendCountdown, setResendCountdown] = useState(43);

    useEffect(() => {
        return () => {
            if (verificationTimerRef.current) clearInterval(verificationTimerRef.current);
            if (resendTimerRef.current) clearInterval(resendTimerRef.current);
        };
    }, []);
    const [loginSuccess, setLoginSuccess] = useState(false)

    const startVerificationCountdown = () => {
        setVerificationCountdown(3);
        if (verificationTimerRef.current) {
            clearInterval(verificationTimerRef.current);
        }
        verificationTimerRef.current = setInterval(() => {
            setVerificationCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(verificationTimerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const startResendCountdown = () => {
        setResendCountdown(43);
        if (resendTimerRef.current) {
            clearInterval(resendTimerRef.current);
        }
        resendTimerRef.current = setInterval(() => {
            setResendCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(resendTimerRef.current!);
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
            handleVerify(newOtp);
        }
    };

    const handleVerify = async (updatedOtp: any[]) => {
        const otpCode = updatedOtp.join("");
        if (otpCode.length < 6) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`https://avenue.tickets/api/auth/verify-otp`, {
                phone: "+1" + phone,
                otp: otpCode
            });

            if (response.data.success) {
                setSuccess(true);
                setLoginSuccess(true)
                setError(null);
                setLoading(false);
                startVerificationCountdown(3);

                verificationTimerRef.current = setInterval(() => {
                    setVerificationCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(verificationTimerRef.current!);
                            setSuccess(false);
                            router.replace("/(stack)/qr-scan");
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setError("Invalid OTP");
                setLoading(false);
            }
        } catch (error) {
            console.error("Verification failed:", error);
            setError("Invalid OTP");
            setLoading(false);
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const formatTime = (seconds: number) => {
        return `(${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')})`;
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
                    <Text className="text-white/50 text-center text-4xl font-medium">Welcome back!</Text>
                    <View>
                        <Text className="text-gray-400 text-center text-base mt-2">
                            Please enter verification code we've
                        </Text>
                        <Text className="text-gray-400 text-center text-base mt-1 mb-12">
                            sent on +1 {phone}
                        </Text>
                    </View>
                    <View className="flex-row justify-center space-x-4 gap-3">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <View key={index} className="w-14 h-14 rounded-full border border-white/10 items-center justify-center">
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
                                />
                            </View>
                        ))}
                    </View>
                    {success && (
                        <View className="mt-10 bg-[#10B981]/50 border border-[#10B981] p-2 rounded-lg items-center">
                            <Text className="text-white text-lg">Login successful! ({verificationCountdown}s)</Text>
                        </View>
                    )}
                    {showError && (
                        <View className="mt-20">
                            <Banner type="red" text="WRONG CODE, PLEASE TRY AGAIN" isExpired={true} />
                        </View>
                    )}
                    {/* <View className="flex-row justify-center mt-8">
                        {resendCountdown === 0 ? (
                            <Pressable onPress={startResendCountdown} className='flex-row items-center gap-1'>
                                <Text className="text-white/50 text-lg">Didn't get the code? </Text>
                                <Text className="text-white underline text-lg">Resend</Text>
                            </Pressable>
                        ) : (
                            <Text className="text-white/50 text-lg">
                                Resend code <Text className='text-white text-lg'>{formatTime(resendCountdown)}</Text>
                            </Text>
                        )}
                    </View> */}
                </View>
                <View className="px-5 pb-8">
                    <Pressable onPress={() => router.back()} className="w-full border border-white/10 py-4 rounded-full flex-row items-center justify-center">
                        <Ionicons name="chevron-back" size={15} color="white" />
                        <Text className="text-white text-lg font-medium ml-2">Go back</Text>
                    </Pressable>
                </View>
            </Pressable>
        </KeyboardAvoidingView>
    );
}
