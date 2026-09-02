import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Header } from './src/components/Header';
import { TorchEngine } from './src/components/TorchEngine';
import { FooterQuota } from './src/components/FooterQuota';
import { PaywallModal } from './src/components/PaywallModal';
import { COLORS } from './src/constants/theme';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [quota, setQuota] = useState<number>(10);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  useEffect(() => {
    // Gracefully request camera permission on mount if available
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleToggleTorch = async () => {
    if (isTorchOn) {
      // Turning OFF torch is free
      setIsTorchOn(false);
      return;
    }

    // Turning ON torch: check quota
    if (quota <= 0) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {}
      setIsPaywallOpen(true);
      return;
    }

    // Quota available: turn ON and decrement count
    setIsTorchOn(true);
    setQuota((prev) => prev - 1);
  };

  const handlePaymentSuccess = (refillAmount: number) => {
    setQuota(refillAmount);
  };

  const handleNotificationPress = () => {
    Alert.alert(
      'System Notifications',
      '• Photonic Emission Engine v2.4 initialized\n• Session quota: ' +
        quota +
        ' uses remaining\n• Dodo Payments Gateway Active',
      [{ text: 'Dismiss', style: 'default' }]
    );
  };

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.groundDark} translucent />

      {/* Headless CameraView for real device hardware torch toggle */}
      {permission?.granted && (
        <CameraView
          style={styles.headlessCamera}
          enableTorch={isTorchOn}
          facing="back"
        />
      )}

      {/* Deep Ink-Navy Background Gradient */}
      <LinearGradient
        colors={[COLORS.groundDark, COLORS.groundLight, COLORS.groundDark]}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header with status bar collision fix */}
          <Header onNotificationPress={handleNotificationPress} />

          {/* Camera Permission Banner if not yet granted */}
          {permission && !permission.granted && (
            <TouchableOpacity
              style={styles.permissionBanner}
              onPress={requestPermission}
            >
              <Text style={styles.permissionText}>
                ⚠️ Flashlight hardware requires camera permission. Tap to grant.
              </Text>
            </TouchableOpacity>
          )}

          {/* Center Stage 3D Torch Engine */}
          <View style={styles.centerStage}>
            <TorchEngine
              isOn={isTorchOn}
              onToggle={handleToggleTorch}
            />
          </View>

          {/* Footer Quota Pill */}
          <FooterQuota
            quota={quota}
            onOpenPaywall={() => setIsPaywallOpen(true)}
          />
        </SafeAreaView>
      </LinearGradient>

      {/* Darkness Settlement Paywall Modal */}
      <PaywallModal
        visible={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.groundDark,
  },
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between', // Balanced flex spacing
    alignItems: 'center',
  },
  headlessCamera: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    zIndex: -1,
  },
  centerStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  permissionBanner: {
    backgroundColor: 'rgba(255, 180, 0, 0.14)',
    borderColor: 'rgba(255, 180, 0, 0.4)',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 22,
    marginTop: 4,
  },
  permissionText: {
    color: '#ffc107',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
