import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/theme';

export interface PlanTier {
  id: string;
  name: string;
  price: number;
  description: string;
  badge?: string;
  quotaRefillCount: number; // 10 for full refill, 3 for micro-lease, 1 for one sachet
}

const PLAN_TIERS: PlanTier[] = [
  {
    id: 'torch_pro',
    name: 'Torch Pro™ Enterprise',
    price: 1999,
    description: 'Unlimited photonic emissions with quantum-grade beam acceleration',
    badge: 'POPULAR',
    quotaRefillCount: 10,
  },
  {
    id: 'darkness_sachet',
    name: 'Darkness - One Sachet',
    price: 999,
    description: 'Permits turning off the light precisely once under darkness protocol',
    quotaRefillCount: 10,
  },
  {
    id: 'photon_lease',
    name: 'Photon Micro-Lease',
    price: 499,
    description: '3 additional toggles allocated for immediate tactical deployment',
    quotaRefillCount: 10,
  },
];

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPaymentSuccess: (refillCount: number) => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  visible,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('torch_pro');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const selectedPlan = PLAN_TIERS.find((p) => p.id === selectedPlanId) || PLAN_TIERS[0];

  const handleSelectPlan = async (id: string) => {
    try {
      await Haptics.selectionAsync();
    } catch {
      // Haptics fallback
    }
    setSelectedPlanId(id);
  };

  const handlePayment = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    setIsProcessing(true);

    // Simulate fintech payment settlement network latency (1.5 seconds)
    setTimeout(async () => {
      setIsProcessing(false);
      setIsSuccess(true);

      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      // After displaying success for 1 second, refill quota and close modal
      setTimeout(() => {
        setIsSuccess(false);
        onPaymentSuccess(selectedPlan.quotaRefillCount);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.fintechBadge}>
                <Text style={styles.fintechBadgeText}>SETTLEMENT TIER</Text>
              </View>
              <Text style={styles.title}>Darkness Tier Settlement</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {/* Introductory subtitle */}
            <Text style={styles.subtitle}>
              Your session photonic quota has expired. Choose a luxury tier to unlock instant flashlight emissions.
            </Text>

            {/* Plan Tier Selection Cards */}
            <View style={styles.plansContainer}>
              {PLAN_TIERS.map((plan) => {
                const isSelected = plan.id === selectedPlanId;

                return (
                  <TouchableOpacity
                    key={plan.id}
                    activeOpacity={0.85}
                    onPress={() => handleSelectPlan(plan.id)}
                    style={[
                      styles.planCard,
                      isSelected && styles.planCardSelected,
                    ]}
                  >
                    {plan.badge && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>{plan.badge}</Text>
                      </View>
                    )}

                    <View style={styles.planCardHeader}>
                      {/* Radio Circle */}
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInnerDot} />}
                      </View>

                      <View style={styles.planInfo}>
                        <Text style={styles.planName}>{plan.name}</Text>
                        <Text style={styles.planDescription}>{plan.description}</Text>
                      </View>

                      <Text style={styles.planPrice}>
                        ${plan.price.toLocaleString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Card Field Simulation */}
            <View style={styles.cardFieldContainer}>
              <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
              <View style={styles.cardInputRow}>
                <FontAwesome5 name="cc-visa" size={24} color="#1A1F71" style={styles.visaIcon} />
                <View style={styles.cardTextGroup}>
                  <Text style={styles.cardNumberText}>•••• •••• •••• 4291</Text>
                  <Text style={styles.cardMetaText}>Expires 08/29 • Neobank Black Card</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.mintIndicator} />
              </View>
            </View>

            {/* Dodo Payments Trust Footer */}
            <View style={styles.trustFooter}>
              <MaterialCommunityIcons name="shield-check" size={16} color={COLORS.mintIndicator} />
              <Text style={styles.trustText}>
                Secured by Dodo Payments 256-Bit Photonic Encryption
              </Text>
            </View>
          </ScrollView>

          {/* Pay Button / Processing State */}
          <View style={styles.footerAction}>
            {isSuccess ? (
              <View style={styles.successStateBtn}>
                <Ionicons name="checkmark-circle-outline" size={22} color={COLORS.textDark} />
                <Text style={styles.successStateText}>Quota Refilled (10 Uses)!</Text>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePayment}
                disabled={isProcessing}
                style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
              >
                {isProcessing ? (
                  <View style={styles.processingRow}>
                    <ActivityIndicator size="small" color={COLORS.textDark} />
                    <Text style={styles.payBtnText}>Processing Settlement...</Text>
                  </View>
                ) : (
                  <Text style={styles.payBtnText}>
                    Pay ${selectedPlan.price.toLocaleString()} with Dodo Payments
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 16, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  headerTitleGroup: {
    gap: 2,
  },
  fintechBadge: {
    backgroundColor: 'rgba(195, 242, 77, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  fintechBadgeText: {
    color: COLORS.electricLime,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentScroll: {
    paddingHorizontal: 22,
    paddingTop: 16,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
  },
  plansContainer: {
    gap: 12,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: COLORS.cardBackgroundElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: COLORS.electricLime,
    backgroundColor: 'rgba(195, 242, 77, 0.05)',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: COLORS.electricLime,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularBadgeText: {
    color: COLORS.textDark,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioCircleSelected: {
    borderColor: COLORS.electricLime,
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.electricLime,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  planDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  planPrice: {
    color: COLORS.electricLime,
    fontSize: 18,
    fontWeight: '800',
  },
  cardFieldContainer: {
    backgroundColor: COLORS.cardBackgroundElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  cardInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  visaIcon: {
    marginRight: 4,
  },
  cardTextGroup: {
    flex: 1,
  },
  cardNumberText: {
    color: '#0e1626',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardMetaText: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '500',
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  trustText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  footerAction: {
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  payBtn: {
    backgroundColor: COLORS.electricLime,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.electricLime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  payBtnDisabled: {
    opacity: 0.8,
  },
  payBtnText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  successStateBtn: {
    backgroundColor: COLORS.mintIndicator,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successStateText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: '800',
  },
});
