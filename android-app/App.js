import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';

export default function App() {
  const [assets, error] = useAssets([require('./assets/index.html')]);
  const [htmlContent, setHtmlContent] = useState(null);

  useEffect(() => {
    if (assets && assets[0]) {
      const asset = assets[0];
      
      // Load the asset localUri/uri. In Expo development mode, it might download the asset.
      const loadHtml = async () => {
        try {
          // ensure the asset is downloaded locally
          if (!asset.localUri) {
            await asset.downloadAsync();
          }
          const content = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
          setHtmlContent(content);
        } catch (err) {
          console.error("Error loading index.html asset:", err);
        }
      };
      loadHtml();
    }
  }, [assets]);

  if (!htmlContent) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ffffff" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 30, // standard offset for status bar height
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loading: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
