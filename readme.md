# Patient Medication Tracker

## Overview
The **Patient Medication Tracker** is a React Native app built with **Expo**. It helps users track their medication schedules and receive notifications for reminders.

## Tech Stack
- **React Native** – Frontend framework
- **Expo** – Development environment
- **Firebase** – Authentication & database
- **Async Storage** – Local storage
- **Expo Notifications** – Push notifications

## Features
- Firebase Authentication for secure login.
- Expo Notifications for reminder alerts.
- Adherence tracking to monitor medication intake.
- Intuitive UI for easy medication management.

## Screenshots

| Home Screen | Medication List | Notification Alert |
|------------|----------------|-------------------|
| ![Home](https://i.imgur.com/Kaqf81L.jpeg) | ![Medication List](https://i.imgur.com/PB0jMrn.jpeg) | ![Notification Alert](https://i.imgur.com/MNQNLb7.jpeg) |

| Reminder Settings | Profile Screen | Adherence Tracking |
|------------------|---------------|--------------------|
| ![Reminder Settings](https://i.imgur.com/fkdAqNi.jpeg) | ![Profile Screen](https://i.imgur.com/LN6HRTY.jpeg) | ![Adherence Tracking](https://i.imgur.com/D1EosHE.jpeg) |

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/suba2128/patient-medication-tracker.git
   cd patient-medication-tracker
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   expo start
   ```
   

## Notifications Setup
- **Expo Push Notifications** requires a physical device.
- Run `expo build:android` to generate an APK for testing.
- Follow [Expo Notification Setup](https://docs.expo.dev/versions/latest/sdk/notifications/) for configuration.

## Troubleshooting and Fixes

### 1. Notifications Not Working
- Ensure the device is not in **Battery Saver Mode**.
- Check if **Notification Permissions** are granted:
  ```js
  import * as Notifications from 'expo-notifications';
  
  async function checkPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  }
  ```
- Restart the Expo server and test with `expo start --clear`.

### 2. Expo Build Issues
- If running into Expo build errors, clear cache:
  ```sh
  expo start -c
  ```
- Ensure all dependencies are installed correctly:
  ```sh
  npm audit fix
  ```

## Contributing
Feel free to submit issues and pull requests! 🚀

## License
This project is licensed under the MIT License.
