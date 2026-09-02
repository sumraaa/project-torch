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
  quotaRefillCount: number;
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
    } catch {}
    setSelectedPlanId(id);
  };

  const handlePayment = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    setIsProcessing(true);

    // Simulate fintech payment settlement latency
    setTimeout(async () => {
      setIsProcessing(false);
      setIsSuccess(true);

      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      setTimeout(() => {
        setIsSuccess(false);
        onPaymentSuccess(selectedPlan.quotaRefillCount);
        onClose();
      }, 1100);
    }, 1400);
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
          {/* Top Sheet Handle Pill */}
          <View style={styles.handlePillContainer}>
            <View style={styles.handlePill} />
          </View>

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
            <Text style={styles.subtitle}>
              Your session photonic quota has expired. Select a settlement tier to restore immediate flashlight capability.
            </Text>

            {/* Plan Tier Selection Cards */}
            <View style={styles.plansContainer}>
              {PLAN_TIERS.map((plan) => {
                const isSelected = plan.id === selectedPlanId;

                return (
                  <TouchableOpacity
                    key={plan.id}
                    activeOpacity={0.88}
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
                      {/* Active Lime Radio Circle Outline */}
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

            {/* Masked Card Detail Row */}
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

            {/* Trust Footer */}
            <View style={styles.trustFooter}>
              <MaterialCommunityIcons name="shield-check" size={16} color={COLORS.mintIndicator} />
              <Text style={styles.trustText}>
                Secured by Dodo Payments 256-Bit Photonic Encryption
              </Text>
            </View>
          </ScrollView>

          {/* Solid Lime Primary CTA Button */}
          <View style={styles.footerAction}>
            {isSuccess ? (
              <View style={styles.successStateBtn}>
                <Ionicons name="checkmark-circle" size={22} color={COLORS.textDark} />
                <Text style={styles.successStateText}>Quota Refilled (10 Uses)!</Text>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
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
    backgroundColor: 'rgba(4, 7, 14, 0.82)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#121c2e',
    borderTopLeftRadius: 32, // Sleek 32px rounded top corners
    borderTopRightRadius: 32,
    maxHeight: '90%',
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 25,
  },
  handlePillContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handlePill: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
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
    backgroundColor: '#1c2940',
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
    backgroundColor: '#18253b',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: COLORS.electricLime, // Active lime radio outline & card border
    backgroundColor: 'rgba(195, 242, 77, 0.06)',
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
    width: 22,
    height: 22,
    borderRadius: 11,
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
    backgroundColor: '#18253b',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    borderRadius: 12,
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
    paddingTop: 8,
  },
  payBtn: {
    backgroundColor: COLORS.electricLime, // Solid lime primary CTA button
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.electricLime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
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
    borderRadius: 18,
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
