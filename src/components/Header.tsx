import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface HeaderProps {
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNotificationPress }) => {
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Left side: Circular "PT" monogram with hairline mint border next to "Project Torch" */}
      <View style={styles.leftSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>PT</Text>
        </View>
        <Text style={styles.appTitle}>Project Torch</Text>
      </View>

      {/* Right side: Elevated circular notification bell with bright lime badge dot */}
      <TouchableOpacity
        style={styles.bellButton}
        activeOpacity={0.75}
        onPress={onNotificationPress}
        accessibilityLabel="Notifications"
        accessibilityRole="button"
      >
        <Ionicons name="notifications-outline" size={20} color={COLORS.textPrimary} />
        <View style={styles.activeDot} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingBottom: 12,
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.cardBackgroundElevated,
    borderWidth: 1.5,
    borderColor: COLORS.mintIndicator, // hairline mint border
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.mintIndicator,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: COLORS.mintIndicator,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appTitle: {
    color: COLORS.textPrimary, // bold, crisp white #f2f6ff
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.cardBackgroundElevated,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  activeDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.electricLime, // bright lime notification badge dot
    borderWidth: 1.5,
    borderColor: COLORS.cardBackgroundElevated,
  },
});
