import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/theme';

interface FooterQuotaProps {
  quota: number;
  onOpenPaywall: () => void;
}

export const FooterQuota: React.FC<FooterQuotaProps> = ({ quota, onOpenPaywall }) => {
  const isDepleted = quota <= 0;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isDepleted) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isDepleted]);

  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics fallback
    }
    onOpenPaywall();
  };

  return (
    <View style={styles.outerContainer}>
      <Animated.View
        style={[
          styles.animatedPillWrapper,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={[
            styles.singleQuotaPill,
            isDepleted ? styles.quotaPillDepleted : styles.quotaPillNormal,
          ]}
        >
          <View style={styles.textRow}>
            {/* Display "Times you can use : {quota}" */}
            <Text style={styles.labelPrefix}>Times you can use : </Text>
            <Text
              style={[
                styles.quotaNumberText,
                isDepleted ? styles.quotaNumberDepleted : styles.quotaNumberNormal,
              ]}
            >
              {quota}
            </Text>
          </View>

          {/* When quota == 0: show "Click to view plans →" link button */}
          {isDepleted ? (
            <View style={styles.viewPlansBadge}>
              <Text style={styles.viewPlansText}>Click to view plans</Text>
              <Ionicons name="arrow-forward-sharp" size={14} color={COLORS.electricLime} />
            </View>
          ) : (
            <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 22,
    paddingBottom: 28,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedPillWrapper: {
    width: '100%',
  },
  singleQuotaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 30, // Wide 3D-elevated pill container
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  quotaPillNormal: {
    backgroundColor: '#152238',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quotaPillDepleted: {
    backgroundColor: '#1a2336',
    borderColor: COLORS.electricLime, // Pulsing accent border
    shadowColor: COLORS.electricLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelPrefix: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  quotaNumberText: {
    fontSize: 17,
    fontWeight: '900',
  },
  quotaNumberNormal: {
    color: COLORS.mintIndicator, // Crisp mint #57e0a8
  },
  quotaNumberDepleted: {
    color: '#ff5555',
  },
  viewPlansBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(195, 242, 77, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorderLime,
  },
  viewPlansText: {
    color: COLORS.electricLime,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
