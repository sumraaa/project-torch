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
    // Request camera/flash permission on app mount if not granted
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleToggleTorch = async () => {
    if (isTorchOn) {
      // Turning OFF torch is always permitted and does not cost quota
      setIsTorchOn(false);
      return;
    }

    // Turning ON torch: Check session quota
    if (quota <= 0) {
      // Quota depleted! Lock activation and trigger darkness paywall modal
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {}
      setIsPaywallOpen(true);
      return;
    }

    // Quota available: Turn ON torch and decrement session quota by 1
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
        ' remaining\n• Dodo Payments Gateway Active',
      [{ text: 'Dismiss', style: 'default' }]
    );
  };

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.groundDark} />

      {/* Headless CameraView for Hardware Flash Flashlight Toggle */}
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
          {/* Header Bar */}
          <Header onNotificationPress={handleNotificationPress} />

          {/* Camera Permission Bar (if permission not yet granted) */}
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

          {/* Footer Quota System */}
          <FooterQuota
            quota={quota}
            maxQuota={10}
            onOpenPaywall={() => setIsPaywallOpen(true)}
          />
        </SafeAreaView>
      </LinearGradient>

      {/* Fintech Paywall Bottom-Sheet Modal */}
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
    justifyContent: 'space-between',
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
    backgroundColor: 'rgba(255, 180, 0, 0.15)',
    borderColor: 'rgba(255, 180, 0, 0.4)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 8,
  },
  permissionText: {
    color: '#ffc107',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
