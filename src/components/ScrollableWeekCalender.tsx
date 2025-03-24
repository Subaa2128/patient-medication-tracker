import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import moment, { Moment } from 'moment';

interface ScrollableWeekCalendarProps {
  onDateSelect: (date: string) => void;
} 

const ScrollableWeekCalendar: React.FC<ScrollableWeekCalendarProps> = ({ onDateSelect }) => {
  const [currentWeek, setCurrentWeek] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    loadWeek(moment());
  }, []);

  const loadWeek = (date: Moment) => {
    const startOfWeek = date.clone().startOf('week').day(0); 
    const week: string[] = Array.from({ length: 7 }, (_, i) =>
      startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')
    );
    setCurrentWeek(week);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    if (onDateSelect) onDateSelect(date);
  };

  const handleScroll = (direction: number) => {
    const newDate = moment(currentWeek[0]).add(direction * 7, 'days');
    loadWeek(newDate);
  };

  const renderItem = ({ item }: { item: string }) => {
    const isToday = item === moment().format('YYYY-MM-DD');
    const isSelected = item === selectedDate;

    return (
      <TouchableOpacity
        onPress={() => handleDateSelect(item)}
        style={[
          styles.dateContainer,
          isToday && styles.today,
          isSelected && styles.selectedDate,
        ]}
      >
        <Text style={[styles.dateText, isToday && styles.todayText]}>
          {moment(item).format('DD')}
        </Text>
        <Text style={[styles.dayText, isToday && styles.todayText]}>
          {moment(item).format('dd')[0]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <TouchableOpacity onPress={() => handleScroll(-1)}>
          <Text style={styles.navText}>◀️</Text>
        </TouchableOpacity>
        <Text style={styles.weekRange}>
          {moment(currentWeek[0]).format('MMM DD')} - {moment(currentWeek[6]).format('MMM DD')}
        </Text>
        <TouchableOpacity onPress={() => handleScroll(1)}>
          <Text style={styles.navText}>▶️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentWeek}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.weekList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekRange: {
    fontSize: 16,
    fontWeight: '600',
  },
  weekList: {
    marginTop: 10,
  },
  dateContainer: {
    width: 50,
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
  today: {
    backgroundColor: '#4CAF50',
  },
  selectedDate: {
    backgroundColor: '#D3D3D3',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  todayText: {
    color: '#fff',
  },
  dayText: {
    fontSize: 14,
    color: '#555',
  },
});

export default ScrollableWeekCalendar;
