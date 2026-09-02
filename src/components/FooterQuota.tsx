import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/theme';

interface FooterQuotaProps {
  quota: number;
  maxQuota?: number;
  onOpenPaywall: () => void;
}

export const FooterQuota: React.FC<FooterQuotaProps> = ({
  quota,
  maxQuota = 10,
  onOpenPaywall,
}) => {
  const isDepleted = quota <= 0;

  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics fallback
    }
    onOpenPaywall();
  };

  if (isDepleted) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={styles.alertPillContainer}
        >
          <View style={styles.alertHeader}>
            <View style={styles.alertIconBadge}>
              <Ionicons name="warning" size={18} color={COLORS.alertRed} />
            </View>
            <Text style={styles.alertTitle}>VIEW PLANS TO CONTINUE</Text>
          </View>
          <View style={styles.alertActionRow}>
            <Text style={styles.alertSubtitle}>0 photonic toggles remaining in current session</Text>
            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Click to view plans</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.electricLime} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate percentage remaining for progress bar
  const progressPercent = Math.max(0, Math.min(100, (quota / maxQuota) * 100));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={styles.quotaContainer}
      >
        <View style={styles.quotaHeaderRow}>
          <View style={styles.quotaTitleBadge}>
            <MaterialIcons name="bolt" size={16} color={COLORS.electricLime} />
            <Text style={styles.quotaLabel}>Session Quota</Text>
          </View>

          <Text style={styles.quotaValueText}>
            Times you can use : <Text style={styles.quotaNumber}>{quota}</Text>
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              { width: `${progressPercent}%` },
              quota <= 3 && { backgroundColor: COLORS.alertRed },
            ]}
          />
        </View>

        <View style={styles.subtextRow}>
          <Text style={styles.subtext}>Resets on cold app restart</Text>
          <Text style={styles.topUpLink}>Top up plan</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    width: '100%',
  },
  quotaContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  quotaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quotaTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quotaLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quotaValueText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  quotaNumber: {
    color: COLORS.electricLime,
    fontWeight: '800',
    fontSize: 15,
  },
  progressTrack: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.electricLime,
    borderRadius: 3,
  },
  subtextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtext: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  topUpLink: {
    color: COLORS.mintIndicator,
    fontSize: 12,
    fontWeight: '600',
  },

  // Alert Pill state (When quota depleted)
  alertPillContainer: {
    backgroundColor: COLORS.alertRedBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.alertRedBorder,
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 77, 109, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    color: COLORS.alertRed,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  alertActionRow: {
    flexDirection: 'column',
    gap: 10,
  },
  alertSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(195, 242, 77, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorderLime,
  },
  actionBtnText: {
    color: COLORS.electricLime,
    fontSize: 13,
    fontWeight: '700',
  },
});
