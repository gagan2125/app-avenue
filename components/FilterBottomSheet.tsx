import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';

interface FilterBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  snapPoints: string[];
  handleSheetChanges: (index: number) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedDates: string[];
  setSelectedDates: (dates: string[]) => void;
  dismissKeyboard: () => void;
}

const categories = [
  'Music', 'Sports', 'Food & Drink', 'Arts', 'Nightlife',
  'Business', 'Comedy', 'Fashion', 'Film', 'Health'
];

const dates = [
  'Today', 'Tomorrow', 'This Week', 'This Weekend', 'Next Week'
];

export default function FilterBottomSheet({
  bottomSheetRef,
  snapPoints,
  handleSheetChanges,
  selectedCategories,
  setSelectedCategories,
  selectedDates,
  setSelectedDates,
  dismissKeyboard,
}: FilterBottomSheetProps) {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleDate = (date: string) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter(d => d !== date));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      android_keyboardInputMode="adjustResize"
      style={styles.bottomSheet}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity 
            onPress={() => bottomSheetRef.current?.close()}
            style={styles.closeButton}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={styles.scrollView}
        >
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.chipContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.chip,
                  selectedCategories.includes(category) && styles.chipSelected
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text style={[
                  styles.chipText,
                  selectedCategories.includes(category) && styles.chipTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Date</Text>
          <View style={styles.chipContainer}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.chip,
                  selectedDates.includes(date) && styles.chipSelected
                ]}
                onPress={() => toggleDate(date)}
              >
                <Text style={[
                  styles.chipText,
                  selectedDates.includes(date) && styles.chipTextSelected
                ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => bottomSheetRef.current?.close()}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  bottomSheetBackground: {
    backgroundColor: '#1A1A1A',
  },
  handleIndicator: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 40,
    height: 4,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#6EE7B7',
  },
  chipText: {
    color: 'white',
    fontSize: 14,
  },
  chipTextSelected: {
    color: 'black',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#6EE7B7',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
}); 