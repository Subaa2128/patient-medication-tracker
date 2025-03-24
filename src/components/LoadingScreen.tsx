import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4a90e2" />
      <Text style={styles.loadingText}>Loading your profile...</Text>
      <Text style={styles.loadingMessage}>Please wait a moment</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingMessage: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
});

export default LoadingScreen;
