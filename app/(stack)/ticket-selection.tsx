import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { EarlyBirdIcon, PlusIcon, RegularIcon, VipIcon } from '@/assets/icons/TicketIcons';
import Banner from '@/components/Banner';
import React from 'react';
import CheckoutBottomSheet, { CheckoutBottomSheetRef } from '@/components/AuthBottomSheet';

interface Ticket {
  id: string;
  type: string;
  price: number;
  discountPrice?: number;
  description: string;
  icon: React.ReactNode;
  quantity: number;
  remainingTickets?: number;
}

export default function TicketSelection() {
  const router = useRouter();
  const checkoutBottomSheetRef = useRef<CheckoutBottomSheetRef>(null);
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'regular',
      type: 'REGULAR',
      price: 39,
      description: 'Standard admission after 11 PM',
      icon: <RegularIcon color='#34b2da' size={16} />,
      quantity: 2,
      remainingTickets: 45
    },
    {
      id: 'early-bird',
      type: 'EARLY BIRD',
      price: 19,
      discountPrice: 29,
      description: 'Entry before 11 PM',
      icon: <EarlyBirdIcon color='#f97316' size={16} />,
      quantity: 0,
      remainingTickets: 15
    },
    {
      id: 'vip',
      type: 'VIP',
      price: 199,
      description: 'Table service, priority entry, 4 person minimum',
      icon: <VipIcon color='#a3e635' size={16} />,
      quantity: 0,
      remainingTickets: 20
    },
  ]);

  const totalAmount = tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);
  const hasItemsInCart = tickets.some(ticket => ticket.quantity > 0);

  const updateQuantity = (ticketId: string, increment: boolean) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          const newQuantity = increment ? ticket.quantity + 1 : Math.max(0, ticket.quantity - 1);
          return { ...ticket, quantity: newQuantity };
        }
        return ticket;
      })
    );
  };

  const TicketCard = ({ ticket }: { ticket: Ticket }) => {
    const isLowTickets = ticket.remainingTickets && ticket.remainingTickets <= 10;
    const hasDiscount = ticket.discountPrice && ticket.discountPrice > ticket.price;

    const getBannerContent = () => {
      if (isLowTickets) {
        return {
          type: "red" as const,
          text: `Only ${ticket.remainingTickets} tickets left`
        };
      }
      if (hasDiscount && ticket.discountPrice) {
        return {
          type: "green" as const,
          text: `Save $${ticket.discountPrice - ticket.price} on this ticket`
        };
      }
      return null;
    };

    const bannerContent = getBannerContent();

    return (
      <View className="bg-secondary rounded-2xl mb-4 relative overflow-hidden">
        <View className="flex-row items-center mb-1 p-4">
          <View className="mr-2">{ticket.icon}</View>
          <Text className="text-white/50 text-sm font-medium uppercase tracking-wide">
            {ticket.type}
          </Text>
        </View>

        <View className="flex-row justify-between items-center w-full">
          {Array(20).fill(0).map((_, index) => (
            <View
              key={index}
              className="w-2 h-1 bg-black rounded-full mx-[2px]"
            />
          ))}
        </View>

        <View className='p-4'>
          <View className="flex-row items-baseline mt-2">
            {hasDiscount ? (
              <View className="items-end flex-row gap-2">
                <View className="flex-row items-baseline">
                  <Text className="text-white/50 text-4xl font-semibold">$</Text>
                  <Text className="text-white text-4xl font-semibold">
                    {ticket.price}
                  </Text>
                </View>
                <Text className="text-[16px] ml-2 font-medium text-white/50 line-through">
                  ${ticket.discountPrice}
                </Text>
              </View>
            ) : (
              <>
                <Text className="text-white/50 text-4xl font-semibold">$</Text>
                <Text className="text-white text-4xl font-semibold">
                  {ticket.price}
                </Text>
              </>
            )}
            {ticket.quantity > 0 && (
              <Text className="text-white text-4xl font-semibold ml-2">
                x {ticket.quantity}
              </Text>
            )}
          </View>

          <Text className="text-white/50 text-[13px] mt-1 mb-4">
            {ticket.description}
          </Text>

          {ticket.quantity === 0 ? (
            <Pressable
              className="bg-black rounded-full py-5 px-6 self-start active:opacity-80 flex-row items-center gap-2"
              onPress={() => updateQuantity(ticket.id, true)}
            >
              <PlusIcon color='white' size={12} />
              <Text className="text-white font-medium">Add to cart</Text>
            </Pressable>
          ) : (
            <View className="self-start flex-row items-center justify-between bg-black rounded-full py-2 px-3">
              <Pressable
                onPress={() => updateQuantity(ticket.id, false)}
                className="w-10 h-10 bg-[#141414] rounded-full items-center justify-center active:opacity-80"
              >
                <Text className="text-white text-2xl font-semibold">-</Text>
              </Pressable>

              <Text className="text-white text-base mx-4">
                {ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'}
              </Text>

              <Pressable
                onPress={() => updateQuantity(ticket.id, true)}
                className="w-10 h-10 bg-[#141414] rounded-full items-center justify-center active:opacity-80"
              >
                <Text className="text-white text-2xl font-semibold">+</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Single Banner with Priority */}
        {bannerContent && (
          <View className='mt-14'>
            <Banner
              type={bannerContent.type}
              text={bannerContent.text}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center pt-14 px-5 pb-4">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10rounded-full items-center justify-center active:opacity-80"
        >
          <Ionicons name="chevron-back" size={24} color="gray" />
        </Pressable>
        <Text className="text-white text-2xl font-semibold ml-3">
          Select ticket and amount
        </Text>
      </View>

      {/* Tickets List */}
      <ScrollView className="flex-1 px-5 pt-2">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </ScrollView>

      {/* Cart Summary */}
      {hasItemsInCart && (
        <View className="px-5 pt-5 pb-8 border-t border-white/10 flex-row justify-between">
          <View className="flex-col justify-between">
            <Text className="text-white/50 text-xs font-medium uppercase tracking-wide">
              TOTAL AMOUNT
            </Text>
            <Text className="text-white text-[28px] font-semibold mt-2">
              ${totalAmount}
            </Text>
          </View>

          <Pressable
            className="bg-white rounded-full flex-row items-center justify-center py-4 px-6 active:opacity-90"
            onPress={() => checkoutBottomSheetRef.current?.open()}
          >
            <Text className="text-black text-base font-semibold text-center">
              Go to checkout
            </Text>
          </Pressable>
        </View>
      )}
      <CheckoutBottomSheet ref={checkoutBottomSheetRef} />
    </View>
  );
} 