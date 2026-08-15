import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [errorDetails, setErrorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleReload = () => {
    setErrorDetails(null);
    setIsLoading(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />
      {errorDetails ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorText}>{errorDetails.description || 'Failed to load the website.'}</Text>
          <Text style={styles.errorSubText}>URL: {errorDetails.url}</Text>
          <Text style={styles.errorSubText}>Code: {errorDetails.code}</Text>
          <TouchableOpacity style={styles.button} onPress={handleReload}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          source={{ uri: 'https://crazyfish.vercel.app' }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setErrorDetails(nativeEvent);
          }}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4757',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 11,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
  },
});
