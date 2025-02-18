import { View, Text, Pressable, TextInput, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Icon1 } from '@/assets/icons/SavedEventsIcons';
import { useState, useRef, useEffect } from 'react';
import Banner from '@/components/Banner';

export default function CreateAccount() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [countdown, setCountdown] = useState(0);
    const [showError, setShowError] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startCountdown = () => {
        setCountdown(43); // 43 seconds
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
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
        setShowError(false);

        // Check if all inputs are filled and validate
        if (text.length === 1 && index === 3) {
            if (newOtp.join('') === '0000') {
                setShowError(true);
            }
        }

        // Move to next input if value is entered
        if (text.length === 1 && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Move to previous input on backspace if current input is empty
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

                {/* Content */}
                <View className="px-5 flex-1">
                    {/* Logo */}
                    <View className="mt-20 mb-4 items-center">
                        <Icon1 color="#34B2DA" size={40} />
                    </View>

                    {/* Heading */}
                    <Text className="text-white text-center text-4xl font-medium">Enter confirmation code</Text>
                    <Text className="text-white/50 text-center text-4xl mt-2 font-medium">and create your account</Text>
                    <View>
                        <Text className="text-gray-400 text-center text-base mt-2">
                            Please enter verification code we've
                        </Text>
                        <Text className="text-gray-400 text-center text-base mt-1 mb-12">
                            sent on +1 (555) 987 654
                        </Text>
                    </View>

                    {/* OTP Input */}
                    <View className="flex-row justify-center space-x-4 gap-3">
                        {[0, 1, 2, 3].map((index) => (
                            <View
                                key={index}
                                className={`w-20 h-14 rounded-full border border-white/10 items-center justify-center`}
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
                                />
                            </View>
                        ))}
                    </View>

                    {/* Error Banner */}
                    {showError && (
                        <View className="mt-20">
                            <Banner
                                type="red"
                                text="WRONG CODE, PLEASE TRY AGAIN"
                                isExpired={true}
                            />
                        </View>
                    )}

                    {/* Resend Text */}
                    <View className="flex-row justify-center mt-8">

                        {countdown === 0 ? (
                            <Pressable onPress={startCountdown} className='flex-row items-center gap-1'>
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