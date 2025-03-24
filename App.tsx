import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Profile from './src/pages/Patient/Profile';
import HomeIcon from './src/assets/icons/HomeIcon';
import AccountIcon from './src/assets/icons/AccountIcon';
import LoginModal from './src/screens/Login';
import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './src/store/authStore';
import UserHome from './src/pages/Patient/UserHome';
import Home from './src/pages/Doctor/Home';
import DoctorProfile from './src/pages/Doctor/DoctorProfile';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './src/utils/firebase';
import moment from 'moment';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';

const timestamps = [
  Date.now() + 10 * 1000,
  Date.now() + 20 * 1000,
  Date.now() + 30 * 1000,
  Date.now() + 40 * 1000,
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerNotificationCategories() {
  await Notifications.setNotificationCategoryAsync('reminder', [
    { identifier: 'snooze', buttonTitle: 'Snooze' },
    { identifier: 'taken', buttonTitle: 'Taken' },
    { identifier: 'skip', buttonTitle: 'Skip' },
  ]);
}

async function scheduleNotifications(timestamps: number[]) {
  for (let timestamp of timestamps) {
    const triggerTime = new Date(timestamp);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: "It's time for your task!",
        categoryIdentifier: 'reminder',
      },
      trigger: {
        date: triggerTime, 
      }as any,
    });

    console.log(`Notification scheduled for: ${triggerTime.toLocaleString()}`);
  }
}

Notifications.addNotificationResponseReceivedListener(async (response) => {
  const actionId = response.actionIdentifier;
  console.log('Notification action pressed:', actionId);

  if (actionId === 'snooze') {
    const newTriggerDate = new Date(Date.now() + 15 * 60 * 1000);
    console.log('Snooze pressed; rescheduling for:', newTriggerDate.toLocaleString());

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: 'Snoozed: It\'s time for your task!',
        categoryIdentifier: 'reminder',
      },
      trigger: {
        date: newTriggerDate,
      }as any,
    });
  }
});

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  console.log('Running background task...');
  await scheduleNotifications(timestamps);
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundTask() {
  const status = await BackgroundFetch.getStatusAsync();
  if (status === BackgroundFetch.BackgroundFetchStatus.Restricted || status === BackgroundFetch.BackgroundFetchStatus.Denied) {
    console.log('Background execution is disabled');
    return;
  }

  await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
    minimumInterval: 60 * 15,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

const TabNavigator = () => {
  const { userType } = useAuthStore();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <View style={{ backgroundColor: 'white', borderRadius: 50 }}>
                <HomeIcon color={color} width={40} height={40} />
              </View>
            ) : (
              <HomeIcon color={color} width={40} height={40} />
            ),
          headerShown: true,
        }}
        component={userType === 'patients' ? UserHome : Home}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <View style={{ backgroundColor: 'white', borderRadius: 50 }}>
                <AccountIcon color={color} width={40} height={40} />
              </View>
            ) : (
              <AccountIcon color={color} width={40} height={40} />
            ),
          headerShown: true,
        }}
        component={userType === 'patients' ? Profile : DoctorProfile}
      />
    </Tab.Navigator>
  );
};

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Stack"
        options={{
          headerShown: false,
        }}
        component={TabNavigator}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const { isLoggedIn, setIsLoggedIn,setUserType } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
useEffect(() => {
  const fetchProfile = async () => {
    const storedProfile = await AsyncStorage.getItem('loggedInUser');
    if (storedProfile) {
      const data = JSON.parse(storedProfile)
      setProfileData(JSON.parse(storedProfile));
      setIsLoggedIn(true)
      if(data.username){
        setUserType('patients')
      }else{
        setUserType('doctors')
      }
    }
    if (storedProfile) {
      const  data  = JSON.parse(storedProfile);
      const usertype= data.username?'patients':'doctors'
      const userDoc = await getDoc(doc(db, usertype, data.username?data.username:data.doctorId));

      if (userDoc.exists()) {
        const userProfile = userDoc.data() as any;
        setProfileData(userProfile);
setUserType(usertype)
      }
    }
  };

  fetchProfile();
}, []);

useEffect(() => {
  const requestPermissions = async () => {
    if (Device.isDevice) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    }
  };

  requestPermissions();
  registerNotificationCategories();
  registerBackgroundTask();

  if (profileData !== null) {
    profileData.medicines.forEach((medicine: any) => {
      const startDate = new Date(medicine.startDate);
      const endDate = new Date(medicine.endDate);
      const today = new Date();

      for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        if (
          currentDate.getDate() === today.getDate() &&
          currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear()
        ) {
          const scheduleTimes = medicine.schedule.map((timeObj: { time: any; }) => {
            const scheduleTime = timeObj.time;
            const date = moment(currentDate).format('YYYY-MM-DD');
            const dateTime = new Date(`${date}T${scheduleTime}`);

            const now = new Date();
            if (dateTime <= now) {
              return dateTime;
            }
            return null; 
          }).filter((dateTime: Date | null) => dateTime !== null); 

          if (scheduleTimes.length > 0) {
            console.log(`Scheduling notifications for: ${medicine.name} at times: ${scheduleTimes}`);
            scheduleNotifications(scheduleTimes);
          }
        }
      }
    });
  }
}, []);

  return (
    <NavigationContainer>
      {!isLoggedIn || profileData === null ? (
        <LoginModal
          isVisible={!isLoggedIn}
          onClose={() => setIsLoggedIn(true)}
          onLoginSuccess={() => {}}
        />
      ) : (
        <StackNavigator />
      )}
    </NavigationContainer>
  );
}
