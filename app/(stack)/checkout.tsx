import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { Icon1, Icon2, TickIcon } from "@/assets/icons/SavedEventsIcons";
import { useRouter } from 'expo-router';
import CountryDropdown from '@/components/CountryDropdown';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { EarlyBirdIcon, MoonIcon, PlusIcon, RegularIcon, VipIcon } from '@/assets/icons/TicketIcons';
import CountrySelector from '@/components/CountrySelector';
import { BlurView } from 'expo-blur';

const countries = [
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
    }
];

export default function Checkout() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
    });
    const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(true);
    const [tickets, setTickets] = useState([
        { id: 'regular', type: 'REGULAR', price: 39, quantity: 2, icon: <RegularIcon color="#34B2DA" size={13} /> },
        { id: 'early-bird', type: 'EARLY BIRD', price: 19, quantity: 1, icon: <EarlyBirdIcon color="#F97316" size={13} /> },
        { id: 'vip', type: 'VIP', price: 199, quantity: 0, icon: <VipIcon color="#A3E635" size={13} /> },
    ]);

    const totalAmount = tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateTicketQuantity = (ticketId: string, increment: boolean) => {
        setTickets(tickets.map(ticket => {
            if (ticket.id === ticketId) {
                return {
                    ...ticket,
                    quantity: increment ? ticket.quantity + 1 : Math.max(0, ticket.quantity - 1)
                };
            }
            return ticket;
        }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-black"
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            {/* Header */}
            <View className="flex-row gap-6 p-5 pt-[60px]">
                <View className="flex-row items-center">
                    <Icon1 color="#34B2DA" size={25} />
                    <Text className="text-2xl font-normal text-white ml-2">
                        Avenue
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Icon2 color="#F97316" size={25} />
                    <Text className="text-2xl font-normal text-white ml-2">
                        Attendee
                    </Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1 px-5 pb-32"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Order Summary for Step 2 */}
                {step === 2 && (
                    <>
                        <View className="bg-black/40 rounded-3xl mb-4 ">
                            <Pressable
                                className="flex-row justify-between items-center p-4 border mb-2 rounded-3xl border-white/10"
                                onPress={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
                            >
                                <View className="flex-row items-center space-x-2">
                                    <Text className="text-white text-lg font-semibold">ORDER SUMMARY</Text>
                                    <MaterialIcons
                                        name={isOrderSummaryOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                        size={24}
                                        color="white"
                                    />
                                </View>
                                <Text className="text-white text-2xl font-semibold"><Text className="text-white/50">$</Text>{totalAmount}</Text>
                            </Pressable>

                            {isOrderSummaryOpen && (
                                <View className="bg-secondary rounded-3xl border border-white/10 p-3">
                                    {/* Selected Tickets Section */}
                                    {tickets.some(ticket => ticket.quantity > 0) && (
                                        <View className=" bg-black rounded-3xl border border-white/10">
                                            {tickets.filter(ticket => ticket.quantity > 0).map((ticket, index, filteredArray) => (
                                                <View
                                                    key={ticket.id}
                                                    className={`p-4 ${index !== filteredArray.length - 1 ? 'border-b border-white/10' : ''}`}
                                                >
                                                    <View className="flex-row justify-between items-center">
                                                        <View className="flex-row items-center space-x-3">

                                                            <View>
                                                                <View className="flex-row items-center space-x-2" ><Text className="text-2xl">{ticket.icon}</Text><Text className="text-white/50 text-sm ml-2">{ticket.type}</Text></View>
                                                                <Text className="text-white text-2xl mt-2 font-medium">
                                                                    <Text className="text-white/50">$</Text>{ticket.price} x {ticket.quantity}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View className="flex-row items-center bg-black rounded-full border border-white/10 p-1">
                                                            <Pressable
                                                                className="w-12 h-12 items-center justify-center bg-secondary rounded-full"
                                                                onPress={() => updateTicketQuantity(ticket.id, false)}
                                                            >
                                                                <Text className="text-white text-xl">-</Text>
                                                            </Pressable>
                                                            <Text className="text-white text-base w-10 text-center">{ticket.quantity}</Text>
                                                            <Pressable
                                                                className="w-12 h-12 items-center justify-center bg-secondary rounded-full"
                                                                onPress={() => updateTicketQuantity(ticket.id, true)}
                                                            >
                                                                <Text className="text-white text-xl">+</Text>
                                                            </Pressable>
                                                        </View>


                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}

                                    <View className="h-4"></View>

                                    {/* Not Added Section */}
                                    {tickets.some(ticket => ticket.quantity === 0) && (
                                        <View className=" bg-black rounded-3xl border border-white/10 mt-4 overflow-hidden">
                                            <View className="">
                                                <View className="bg-secondary border-b border-white/10 p-4">
                                                    <Text className="text-white text-md font-medium">
                                                        NOT ADDED
                                                    </Text>
                                                </View>
                                                {tickets.filter(ticket => ticket.quantity === 0).map((ticket, index, filteredArray) => (
                                                    <View
                                                        key={ticket.id}
                                                        className={`p-4 ${index !== filteredArray.length - 1 ? 'border-b border-white/10' : ''}`}
                                                    >
                                                        <View className="flex-row justify-between items-center">
                                                            <View className="flex-col">
                                                                <View className="flex-row items-center space-x-2">
                                                                    <Text className="text-2xl">{ticket.icon}</Text>
                                                                    <Text className="text-white/50 text-sm ml-2">{ticket.type}</Text>
                                                                </View>
                                                                <Text className="text-white text-2xl mt-2">
                                                                    <Text className="text-white/50">$</Text>{ticket.price}
                                                                </Text>
                                                            </View>
                                                            <Pressable
                                                                className=" flex-row bg-secondary/580 items-center  rounded-full px-4 py-3 border border-white/10"
                                                                onPress={() => updateTicketQuantity(ticket.id, true)}
                                                            >
                                                                <PlusIcon color="white" size={13} />
                                                                <Text className="text-white ml-2">Add to cart</Text>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}

                                </View>
                            )}
                        </View>
                        {/* Ticket Card */}
                        <View className=" rounded-3xl border border-white/10 p-4 mb-4 bg-secondary">
                            {/* Header */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center space-x-2">
                                    <MoonIcon color="#A855F7" size={13} />
                                    <Text className="text-white/50 text-sm ml-2 font-medium">NIGHTLIFE</Text>
                                </View>
                                <Text className="text-white/50 text-sm font-medium">28 DEC 22:00</Text>
                            </View>

                            {/* Dotted Line */}
                            <View className="flex-row justify-between items-center w-full my-4">
                                {Array(20).fill(0).map((_, index) => (
                                    <View
                                        key={index}
                                        className="w-2 h-[2px] bg-black rounded-full mx-[2px]"
                                    />
                                ))}
                            </View>

                            {/* Content */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1">
                                    <Text className="text-white text-xl font-medium mb-2">
                                        After Hours Neon
                                    </Text>
                                    <View className="flex-row items-center">
                                        <Entypo name="location-pin" size={20} color="gray" />
                                        <Text className="text-gray-400 ml-1">
                                            Cloud Nine Club
                                        </Text>
                                    </View>
                                </View>
                                <View className="h-20 w-20 bg-black/40 rounded-2xl overflow-hidden ml-4">
                                    <Image
                                        source={{ uri: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a" }}
                                        className="h-full w-full"
                                        resizeMode="cover"
                                    />
                                </View>
                            </View>
                        </View>
                    </>
                )}

                <View className="flex-1 border border-white/10 rounded-3xl overflow-hidden">
                    {/* Header */}
                    <View className="bg-secondary border-b border-white/10 p-5">
                        <Text className="text-white text-xl font-semibold">
                            Checkout
                        </Text>
                    </View>

                    {/* Progress Bar */}
                    <View className="flex-row items-center mt-6 mb-8 px-5">
                        <View className="flex-1 items-center">
                            <View className={`w-6 h-6 rounded-full items-center justify-center ${step >= 1 ? 'bg-[#34B2DA]' : 'bg-white/10'}`}>
                                {step > 1 ? (
                                    <MaterialIcons name="check" size={16} color="black" />
                                ) : (
                                    step === 1 && <View className="w-2 h-2 rounded-full bg-black" />
                                )}
                            </View>
                            <Text className="text-white mt-2 text-xs">Basic</Text>
                        </View>
                        <View className={`flex-1 h-[1px] ${step >= 2 ? 'bg-[#34B2DA]' : 'bg-white/10'}`} />
                        <View className="flex-1 items-center">
                            <View className={`w-6 h-6 rounded-full items-center justify-center ${step >= 2 ? 'bg-[#34B2DA]' : 'bg-white/10'}`}>
                                {step > 2 ? (
                                    <MaterialIcons name="check" size={16} color="black" />
                                ) : (
                                    step === 2 && <View className="w-2 h-2 rounded-full bg-black" />
                                )}
                            </View>
                            <Text className="text-white mt-2 text-xs">Payment info</Text>
                        </View>
                        <View className={`flex-1 h-[1px] ${step >= 3 ? 'bg-[#34B2DA]' : 'bg-white/10'}`} />
                        <View className="flex-1 items-center">
                            <View className={`w-6 h-6 rounded-full items-center justify-center ${step >= 3 ? 'bg-[#34B2DA]' : 'bg-white/10'}`}>
                                {step === 3 && <View className="w-2 h-2 rounded-full bg-black" />}
                            </View>
                            <Text className="text-white mt-2 text-xs">Success</Text>
                        </View>
                    </View>
                    <View className="border-b border-white/10 -mt-2" />

                    {/* Step Content */}
                    {step === 1 && (
                        <View className="flex-1 p-5">
                            <View className="mb-6">
                                <Text className="text-white text-base mb-2">Full name</Text>
                                <View className="flex-row space-x-3 border border-white/10 rounded-full p-1">
                                    <View className="flex-1 rounded-full flex-row items-center ">
                                        <TextInput
                                            className="flex-1 h-12 text-white p-4"
                                            defaultValue="Ali Mamedgasanov"
                                            placeholderTextColor="#666666"
                                            value={formData.fullName}
                                            onChangeText={(text) => handleInputChange('fullName', text)}
                                            placeholder="Enter your full name"
                                        />
                                    </View>
                                </View>
                            </View>
                            <View className="mb-6">
                                <Text className="text-white text-base mb-2">Email address</Text>
                                <View className="flex-row space-x-3 border border-white/10 rounded-full p-1">
                                    <View className="flex-1 rounded-full flex-row items-center px-4">
                                        <Entypo name="mail" size={16} color="#666666" className="mr-2" />
                                        <TextInput
                                            className="flex-1 h-12 text-white p-4"
                                            defaultValue="alihey@gmail.com"
                                            placeholderTextColor="#666666"
                                            value={formData.email}
                                            onChangeText={(text) => handleInputChange('email', text)}
                                            placeholder="Enter your email address"
                                        />
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                className="bg-white rounded-3xl p-4 items-center mt-auto"
                                onPress={() => setStep(2)}
                            >
                                <Text className="text-black text-base font-semibold">
                                    Continue to payment
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {step === 2 && (
                        <>
                            <View className="flex-1 p-5">


                                {/* Card Details */}
                                <View className="mb-6">
                                    <Text className="text-white text-base mb-2">Card number</Text>
                                    <TextInput
                                        className="bg-white/10 rounded-3xl h-14 px-4 text-white text-base"
                                        placeholder="4000 0000 0000 0000"
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                        keyboardType="numeric"
                                        value={formData.cardNumber}
                                        onChangeText={(text) => handleInputChange('cardNumber', text)}
                                    />
                                </View>

                                <View className="flex-row mb-6">
                                    <View className="flex-1 mr-3">
                                        <Text className="text-white text-base mb-2">Expiration date</Text>
                                        <TextInput
                                            className="bg-white/10 rounded-3xl h-14 px-4 text-white text-base"
                                            placeholder="MM/YY"
                                            placeholderTextColor="rgba(255,255,255,0.5)"
                                            value={formData.expirationDate}
                                            onChangeText={(text) => handleInputChange('expirationDate', text)}
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white text-base mb-2">CVV</Text>
                                        <TextInput
                                            className="bg-white/10 rounded-3xl h-14 px-4 text-white text-base"
                                            placeholder="000"
                                            placeholderTextColor="rgba(255,255,255,0.5)"
                                            keyboardType="numeric"
                                            value={formData.cvv}
                                            onChangeText={(text) => handleInputChange('cvv', text)}
                                        />
                                    </View>
                                </View>

                                <View className="mb-6">
                                    <Text className="text-white text-base mb-2">Country</Text>
                                    <CountrySelector
                                        selectedCountry={selectedCountry}
                                        onSelect={setSelectedCountry}
                                        countries={countries}
                                    />
                                </View>
                            </View>
                        </>
                    )}



                    {step === 3 && (
                        <View className="flex-1 items-center justify-center p-5 mt-5 py-32">
                            <View className="w-16 h-16 rounded-full bg-emerald-500 items-center justify-center mb-6">
                                <MaterialIcons name="check" size={32} color="white" />
                            </View>

                            <Text className="text-white text-2xl font-semibold mb-2 text-center">
                                Payment successful!
                            </Text>

                            <View className="mb-8 items-center">
                                <Text className="text-center">
                                    <Text className="text-white/50">
                                        Tickets ready. Charged $97 to credit card. {'\n'}
                                        View tickets below or check{' '}
                                    </Text>
                                    <Text className="text-white underline">
                                        ali@gmail.com
                                    </Text>
                                </Text>
                            </View>

                            <Pressable
                                className="bg-white rounded-full py-4 px-8 items-center self-center"
                                onPress={() => router.push('/(tabs)')}
                            >
                                <Text className="text-black text-base font-semibold">
                                    View my tickets
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </View>
                {step === 2 && (
                    <View className="pb-40"></View>
                )}
            </ScrollView>

            {/* Bottom Bar */}
            {step === 2 && (
                <BlurView
                    intensity={50}
                    tint="dark"
                    className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/50"
                >
                    <View className="px-5 pb-8 pt-5">
                        <TouchableOpacity
                            className="bg-white w-full rounded-3xl p-4 items-center"
                            onPress={() => setStep(3)}
                        >
                            <Text className="text-black text-base font-semibold">
                                Pay ${totalAmount}.00 now
                            </Text>
                        </TouchableOpacity>

                        <Text className="text-white/50 text-center mt-3">
                            Your data is encrypted
                        </Text>
                    </View>
                </BlurView>
            )}
        </KeyboardAvoidingView>
    );
} 