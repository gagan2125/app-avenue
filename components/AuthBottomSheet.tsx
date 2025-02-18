import React, { useCallback, useMemo, forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Platform, Pressable, KeyboardAvoidingView, StatusBar, Keyboard, TextInput } from 'react-native';
import BottomSheet, { BottomSheetBackdropProps, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useBottomSheet } from '@/context/BottomSheetContext';
import { BlurView } from 'expo-blur';
import Animated, { interpolate, useAnimatedStyle, Extrapolate } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import CountryDropdown from './CountryDropdown';
import Banner from './Banner';
import { Icon1 } from '@/assets/icons/SavedEventsIcons';

interface Country {
    code: string;
    name: string;
    flag: string;
    dialCode: string;
}

const countries: Country[] = [
    {
        code: "US",
        name: "United States",
        flag: "https://cdn.britannica.com/33/4833-050-F6E415FE/Flag-United-States-of-America.jpg",
        dialCode: "+1"
    },
    {
        code: "IN",
        name: "India",
        flag: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
        dialCode: "+91"
    },
    {
        code: "GB",
        name: "United Kingdom",
        flag: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1200px-Flag_of_the_United_Kingdom.svg.png",
        dialCode: "+44"
    },
    {
        code: "CA",
        name: "Canada",
        flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1200px-Flag_of_Canada_%28Pantone%29.svg.png",
        dialCode: "+1"
    }
];

export type CheckoutBottomSheetRef = {
    open: () => void;
    close: () => void;
};

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
    if (Platform.OS === 'android') return null;

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolate.CLAMP),
    }));

    return (
        <TouchableWithoutFeedback>
            <Animated.View style={[style, { backgroundColor: "#00000099" }, containerAnimatedStyle]}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const CheckoutBottomSheet = forwardRef<CheckoutBottomSheetRef>((_, ref) => {
    const [state, setState] = useState<"verify-number" | "sign-in" | "sign-up">("verify-number");
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%'], []);
    const { setIsBottomSheetOpen } = useBottomSheet();
    const router = useRouter();
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showError, setShowError] = useState(false);

    const handlePhoneNumberChange = (text: string) => {
        const cleanedText = text.replace(/\D/g, '');
        setPhoneNumber(cleanedText);
        setShowError(cleanedText.length > 12);
    };

    const handleVerify = () => {
        if (phoneNumber === '0') {
            setState("sign-in");
        } else {
            setState("sign-up");
        }
    };

    const isVerifyDisabled = phoneNumber.length === 0 || showError;

    const handleSheetChanges = useCallback((index: number) => {
        setIsBottomSheetOpen(index !== -1);
    }, [setIsBottomSheetOpen]);

    const handleClose = useCallback(() => {
        setIsBottomSheetOpen(false);
        bottomSheetRef.current?.close();
    }, [setIsBottomSheetOpen]);

    const handleProceedToCheckout = () => {
        handleClose();
        router.push('/(stack)/checkout');
    };

    useImperativeHandle(ref, () => ({
        open: () => {
            setIsBottomSheetOpen(true);
            bottomSheetRef.current?.snapToIndex(0);
        },
        close: handleClose,
    }));


    const [otp, setOtp] = useState(['', '', '', '']);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (otp.every(num => num !== '' && num !== '0')) {
            handleProceedToCheckout();
        }
    }, [otp, router]);

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
        if (text.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);
            setShowError(false);

            // Move to next input if value is entered
            if (text.length === 1 && index < 3) {
                inputRefs.current[index + 1]?.focus();
            }

            // Check if all inputs are filled and validate
            if (text.length === 1 && index === 3) {
                const fullOtp = [...newOtp.slice(0, 3), text].join('');
                if (fullOtp === '0000') {
                    setShowError(true);
                }
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace') {
            const newOtp = [...otp];

            // If current input is empty and we're not at the first input, move to previous
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
                newOtp[index - 1] = '';
                setOtp(newOtp);
            } else {
                // Clear current input
                newOtp[index] = '';
                setOtp(newOtp);
            }
            setShowError(false);
        }
    };

    const formatTime = (seconds: number) => {
        return `(${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')})`;
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backdropComponent={(props) => <CustomBackdrop {...props} />}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
        >
            <BottomSheetScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                {/* Content here */}



                {
                    state === "verify-number" && (
                        <>
                            {/* Content */}
                            <View className="px-5 flex-1">
                                {/* Logo */}
                                <View className="mb-4 items-center">
                                    <Icon1 color="#34B2DA" size={40} />
                                </View>

                                {/* Heading */}
                                <Text className="text-white text-center text-[28px] font-medium mt-8">Enter phone number</Text>
                                <View className='flex-col items-center justify-center mt-4 mb-8'>
                                    <Text className="text-gray-400 text-center text-base mb-1">
                                        To continue with your checkout, please

                                    </Text>
                                    <Text className='text-gray-400 text-center text-base'>enter your phone number</Text>
                                </View>




                                {/* Phone Input */}
                                <View>
                                    <View className="flex-row border border-white/10 rounded-full p-1" style={{ zIndex: 999999 }}>
                                        <View className="border-r border-white/10 min-w-[100px]" style={{ zIndex: 999999 }}>
                                            <CountryDropdown
                                                selectedCountry={selectedCountry}
                                                onSelect={setSelectedCountry}
                                                countries={countries}
                                                isTop={true}
                                            />
                                        </View>
                                        <View className="flex-1 rounded-full flex-row items-center">
                                            <BottomSheetTextInput
                                                className="h-full text-white px-4 "
                                                value={phoneNumber}
                                                onChangeText={handlePhoneNumberChange}
                                                placeholder="(555) 987 654"
                                                placeholderTextColor="rgba(255,255,255,0.5)"
                                                keyboardType="number-pad"
                                            />
                                        </View>
                                    </View>

                                    {/* Error Banner */}
                                    {showError && (
                                        <View style={{ marginTop: 60 }} className=" w-full flex-row justify-center">
                                            <Banner
                                                type="red"
                                                text="NUMBER DOESN'T EXIST"
                                                isExpired={true}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Bottom Buttons */}
                            <View className="px-5  flex-row items-center gap-4 mt-6">
                                <Pressable
                                    className={`flex-1 py-4 rounded-full ${isVerifyDisabled ? 'bg-white/50' : 'bg-white'}`}
                                    onPress={handleVerify}
                                    disabled={isVerifyDisabled}
                                >
                                    <Text className="text-black text-base font-medium text-center">Verify number</Text>
                                </Pressable>
                            </View>
                        </>
                    )
                }

                {
                    state === "sign-up" && (
                        <>
                            {/* Content */}
                            <View className=" flex-1">
                                {/* Logo */}
                                <View className=" mb-4 items-center">
                                    <Icon1 color="#34B2DA" size={40} />
                                </View>

                                {/* Heading */}
                                <Text className="text-white/50 text-center text-4xl font-medium">Welcome back!</Text>
                                <Text className="text-white text-center text-[28px] font-medium mt-2">Enter confirmation code</Text>
                                <View>
                                    <Text className="text-gray-400 text-center text-base mt-2">
                                        Please enter verification code we've
                                    </Text>
                                    <Text className="text-gray-400 text-center text-base mt-1 mb-8">
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
                                            <BottomSheetTextInput
                                                ref={(ref) => (inputRefs.current[index] = ref)}
                                                className="text-white text-2xl text-center w-full h-full"
                                                style={{ fontSize: 24 }}
                                                maxLength={1}
                                                keyboardType="number-pad"
                                                value={otp[index]}
                                                onChangeText={(text) => handleOtpChange(text, index)}
                                                onKeyPress={(e) => handleKeyPress(e, index)}
                                                placeholder="0"
                                                placeholderTextColor="rgba(255,255,255,0.5)"
                                                autoFocus={index === 0}
                                                selectTextOnFocus={true}
                                            />
                                        </View>
                                    ))}
                                </View>

                                {/* Error Banner */}
                                {showError && (
                                    <View style={{ right: 12 }} className="mt-20 w-full relative">
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
                        </>
                    )
                }



                {
                    state === "sign-in" && (
                        <>
                            {/* Content */}
                            <View className="px-5 flex-1">
                                {/* Logo */}
                                <View className=" mb-4 items-center">
                                    <Icon1 color="#34B2DA" size={40} />
                                </View>

                                {/* Heading */}
                                <Text className="text-white/50 text-center text-4xl font-medium">Enter confirmation code</Text>
                                <Text className="text-white text-center text-[28px] font-medium mt-2">and create your account</Text>
                                <View>
                                    <Text className="text-gray-400 text-center text-base mt-2">
                                        Please enter verification code we've
                                    </Text>
                                    <Text className="text-gray-400 text-center text-base mt-1 mb-8">
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
                                            <BottomSheetTextInput
                                                ref={(ref) => (inputRefs.current[index] = ref)}
                                                className="text-white text-2xl text-center w-full h-full"
                                                style={{ fontSize: 24 }}
                                                maxLength={1}
                                                keyboardType="number-pad"
                                                value={otp[index]}
                                                onChangeText={(text) => handleOtpChange(text, index)}
                                                onKeyPress={(e) => handleKeyPress(e, index)}
                                                placeholder="0"
                                                placeholderTextColor="rgba(255,255,255,0.5)"
                                                autoFocus={index === 0}
                                                selectTextOnFocus={true}
                                            />
                                        </View>
                                    ))}
                                </View>

                                {/* Error Banner */}
                                {showError && (
                                    <View style={{ right: 12 }} className="mt-20 w-full relative">
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
                        </>
                    )
                }





            </BottomSheetScrollView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: '#141414',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    handleIndicator: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        width: 32,
        height: 4,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 90,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: 12,
        marginTop: 24,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 100,
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    proceedButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 100,
        paddingVertical: 16,
        alignItems: 'center',
    },
    proceedButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CheckoutBottomSheet; 