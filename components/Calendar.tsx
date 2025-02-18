import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { Theme, DateData } from 'react-native-calendars/src/types';

type CalendarProps = {
    onDayPress?: (day: DateData) => void;
    markedDates?: any;
    current?: string;
    onMonthChange?: (direction: 'prev' | 'next') => void;
};

type DayComponentProps = {
    date?: DateData;
    state?: 'selected' | 'disabled' | 'today' | '';
    marking?: {
        selected?: boolean;
        dots?: Array<{ color: string }>;
    };
};

const Calendar = ({ onDayPress, markedDates, current, onMonthChange }: CalendarProps) => {
    const theme: Theme = {
        backgroundColor: '#141414',
        calendarBackground: '#141414',
        textSectionTitleColor: 'rgba(255,255,255,0.5)',
        selectedDayBackgroundColor: 'transparent',
        selectedDayTextColor: '#FFFFFF',
        todayTextColor: '#FFFFFF',
        dayTextColor: '#FFFFFF',
        textDisabledColor: 'rgba(255,255,255,0.3)',
        dotColor: '#34B2DA',
        selectedDotColor: '#34B2DA',
        monthTextColor: '#FFFFFF',
        textMonthFontSize: 24,
        textDayFontSize: 16,
        textDayHeaderFontSize: 14,
        arrowColor: '#FFFFFF',
    };

    const customMarkedDates = {
        ...markedDates
    };

    const renderHeader = (date: any) => {
        const month = date.toString('MMMM yyyy');
        return (
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.sectionTitle}>Or select specific date(s)</Text>
                    <Text style={styles.monthText}>{month}</Text>
                </View>
                <View style={styles.arrowsContainer}>
                    <Pressable
                        style={[styles.arrowContainer, styles.arrowButton]}
                        onPress={() => onMonthChange?.('prev')}
                    >
                        <Text style={styles.arrowText}>‹</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.arrowContainer, styles.arrowButton]}
                        onPress={() => onMonthChange?.('next')}
                    >
                        <Text style={styles.arrowText}>›</Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <RNCalendar
                theme={{
                    ...theme,
                    'stylesheet.calendar.header': {
                        header: {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            paddingHorizontal: 16,
                            marginTop: 20,
                            marginBottom: 10,
                        },
                        dayHeader: {
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: 14,
                            fontWeight: '500',
                            width: 40,
                            textAlign: 'center',
                            paddingTop: 0,
                        },
                    }
                }}
                markingType="multi-dot"
                markedDates={customMarkedDates}
                onDayPress={onDayPress}
                enableSwipeMonths={true}
                hideExtraDays
                current={current}
                style={styles.calendar}
                renderHeader={renderHeader}
                hideArrows={true}
                firstDay={0}
                dayComponent={({ date, state, marking }: any) => {
                    const isSelected = marking?.selected;
                    return (
                        <Pressable
                            style={styles.dayContainer}
                            onPress={() => date && onDayPress?.(date)}
                        >
                            <Text style={[
                                styles.dayText,
                                state === 'disabled' && styles.disabledText
                            ]}>
                                {date?.day}
                            </Text>
                            {isSelected && <View style={styles.selectedLine} />}
                            {marking?.dots && (
                                <View style={styles.dotsContainer}>
                                    {marking.dots.map((dot: any, index: number) => (
                                        <View
                                            key={index}
                                            style={[styles.dot, { backgroundColor: dot.color }]}
                                        />
                                    ))}
                                </View>
                            )}
                        </Pressable>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#141414',
    },
    calendar: {
        backgroundColor: '#141414',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    headerLeft: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginBottom: 8,
    },
    monthText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'left',
    },
    arrowsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 24,
    },
    arrowContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowText: {
        color: '#FFFFFF',
        fontSize: 24,
        lineHeight: 28,
    },
    dayContainer: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 4,
    },
    disabledText: {
        color: 'rgba(255,255,255,0.3)',
    },
    selectedLine: {
        position: 'absolute',
        bottom: 14,
        width: '80%',
        height: 2,
        backgroundColor: '#FF0000',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 4,
        gap: 2,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#34B2DA',
    },
    arrowButton: {
        opacity: 1,
        backgroundColor: 'transparent',
    }
});

export default Calendar; 