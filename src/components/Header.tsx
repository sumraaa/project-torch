import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface HeaderProps {
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNotificationPress }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {/* Circular Monogram Avatar */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>PT</Text>
        </View>

        {/* Greeting & Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.appTitle}>Project Torch</Text>
        </View>
      </View>

      {/* Notification Bell with Active Lime Dot */}
      <TouchableOpacity
        style={styles.bellButton}
        activeOpacity={0.7}
        onPress={onNotificationPress}
        accessibilityLabel="Notifications"
        accessibilityRole="button"
      >
        <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardBackgroundElevated,
    borderWidth: 1.5,
    borderColor: COLORS.electricLime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.electricLime,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: COLORS.electricLime,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  appTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.electricLime,
    borderWidth: 1.5,
    borderColor: COLORS.cardBackground,
  },
});
