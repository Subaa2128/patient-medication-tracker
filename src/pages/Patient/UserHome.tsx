import { View } from 'react-native';
import { useState } from 'react';
import ScrollableWeekCalendar from '../../components/ScrollableWeekCalender';
import MedicineSchedule from '../../components/MedicineSchedule';

const UserHome: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string >('');

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <View style={{backgroundColor:'#fff',flex:1}}>
      <ScrollableWeekCalendar onDateSelect={handleDateSelect} />      
      <MedicineSchedule  selectedDate={selectedDate}/>
    </View>
  );
};

export default UserHome;
