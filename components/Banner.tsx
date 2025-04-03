import { OfferIcon, WarningIcon } from '@/assets/icons/TicketIcons';
import React from 'react';
import { View, Text } from 'react-native';

interface BannerProps {
    type: string | null;
    text: string;
    isExpired?: boolean;
}

export default function Banner({ type, text, isExpired = false }: BannerProps) {
    const getThemeColors = () => {
        switch (type) {
            case 'red':
                return {
                    backgroundColor: '#2c1a1d',
                    borderColor: '#452328',
                    lineColor: '#5c1e1e',
                    textColor: '#f43f5e',
                    Icon: WarningIcon
                };
            case 'cyan':
                return {
                    backgroundColor: '#192629',
                    borderColor: '#1a2d32',
                    lineColor: '#1a2d32',
                    textColor: '#33aed5',
                    Icon: OfferIcon
                };
            case 'orange':
                return {
                    backgroundColor: '#2d2115',
                    borderColor: '#372515',
                    lineColor: '#372515',
                    textColor: '#f97316',
                    Icon: WarningIcon
                };
            case 'yellow':
                return {
                    backgroundColor: '#222b17',
                    borderColor: '#283418',
                    lineColor: '#283418',
                    textColor: '#7fb32c',
                    Icon: OfferIcon
                };
            default:
                return {
                    backgroundColor: '#162721',
                    borderColor: '#142c24',
                    lineColor: '#142c24',
                    textColor: '#10b981',
                    Icon: OfferIcon
                };
        }
    };

    const { backgroundColor, borderColor, lineColor, textColor, Icon } = getThemeColors();

    return (
        <View
            style={{
                backgroundColor,
                borderWidth: 1,
                borderColor,
                borderRadius: 10,
            }}
            className="w-full h-14 justify-center overflow-hidden mx-4 my-2"
        >
            {/* Background lines */}
            <View className="absolute inset-0 flex-row justify-center items-center gap-6">
                {Array.from({ length: 20 }).map((_, index) => (
                    <View
                        key={index}
                        style={{ backgroundColor: lineColor, width: 2, transform: [{ rotate: '45deg' }] }}
                        className="rounded-full h-20 mx-1"
                    />
                ))}
            </View>
            {/* Centered Text */}
            <View className="flex-row items-center justify-center px-6 z-10">
                <Icon color={textColor} size={16} />
                <Text style={{ color: textColor }} className="text-sm font-medium ml-2">{text}</Text>
            </View>
        </View>
    );
}