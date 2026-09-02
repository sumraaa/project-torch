import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/theme';

interface TorchEngineProps {
  isOn: boolean;
  onToggle: () => void;
  isDisabled?: boolean;
}

export const TorchEngine: React.FC<TorchEngineProps> = ({ isOn, onToggle, isDisabled = false }) => {
  const glowAnim = useRef(new Animated.Value(isOn ? 1 : 0)).current;
  const beamAnim = useRef(new Animated.Value(isOn ? 1 : 0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(glowAnim, {
        toValue: isOn ? 1 : 0,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(beamAnim, {
        toValue: isOn ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    if (isOn) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1400,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isOn]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93, // Physical tactile depression
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 16,
      bounciness: 6,
    }).start();
  };

  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Haptics fallback
    }
    onToggle();
  };

  const auraOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.95],
  });

  const auraScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.15],
  });

  const beamOpacity = beamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const beamScale = beamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <View style={styles.container}>
      {/* LAYER 1: AMBIENT RADIAL GLOW & DROP SHADOW */}
      <Animated.View
        style={[
          styles.auraContainer,
          {
            opacity: auraOpacity,
            transform: [
              { scale: Animated.multiply(auraScale, pulseAnim) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={
            isOn
              ? ['rgba(195, 242, 77, 0.45)', 'rgba(87, 224, 168, 0.25)', 'rgba(10, 17, 32, 0)']
              : ['rgba(35, 52, 84, 0.25)', 'rgba(10, 17, 32, 0)']
          }
          style={styles.auraGradient}
        />
      </Animated.View>

      {/* 3D PUSH BUTTON CORE */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={isDisabled}
          style={styles.buttonTouchWrapper}
        >
          {/* LAYER 2: OUTER RAISED BEZEL with Top-Left Highlight & Bottom-Right Dark Shadow */}
          <LinearGradient
            colors={
              isOn
                ? ['rgba(195, 242, 77, 0.95)', 'rgba(87, 224, 168, 0.6)', 'rgba(10, 17, 32, 0.9)']
                : ['rgba(255, 255, 255, 0.18)', '#1c2a44', 'rgba(0, 0, 0, 0.85)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.outerRaisedBezel,
              isOn && styles.outerRaisedBezelOn,
            ]}
          >
            {/* Middle Bevel Gap */}
            <View style={styles.middleGapRing}>
              {/* LAYER 3: INNER CONCAVE BASIN (#141e33 to #0b1322) */}
              <LinearGradient
                colors={[COLORS.basinStart, COLORS.basinEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.innerConcaveBasin}
              >
                {/* Concave Inner Lip Shadow Overlay */}
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.6)', 'transparent', 'rgba(255, 255, 255, 0.04)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />

                {/* LAYER 4: FLASHLIGHT GLYPH & LIGHT BEAM RAYS */}
                <View style={styles.glyphCenterContainer}>
                  {/* 3 Glowing Angled Light Beam Rays projecting outward from top when ON */}
                  <Animated.View
                    style={[
                      styles.beamRaysContainer,
                      {
                        opacity: beamOpacity,
                        transform: [{ scale: beamScale }],
                      },
                    ]}
                  >
                    {/* Ray 1 (Angled Left -25 deg) */}
                    <View style={[styles.beamRay, styles.beamRayLeft]}>
                      <LinearGradient
                        colors={['#c3f24d', 'rgba(195, 242, 77, 0)']}
                        style={styles.beamRayGradient}
                      />
                    </View>

                    {/* Ray 2 (Center Straight 0 deg) */}
                    <View style={[styles.beamRay, styles.beamRayCenter]}>
                      <LinearGradient
                        colors={['#c3f24d', 'rgba(195, 242, 77, 0)']}
                        style={styles.beamRayGradient}
                      />
                    </View>

                    {/* Ray 3 (Angled Right +25 deg) */}
                    <View style={[styles.beamRay, styles.beamRayRight]}>
                      <LinearGradient
                        colors={['#c3f24d', 'rgba(195, 242, 77, 0)']}
                        style={styles.beamRayGradient}
                      />
                    </View>
                  </Animated.View>

                  {/* Solid Vertical Flashlight Icon */}
                  <Ionicons
                    name="flashlight"
                    size={68}
                    color={isOn ? COLORS.electricLime : COLORS.textSecondary}
                    style={isOn ? styles.flashlightIconOn : styles.flashlightIconOff}
                  />

                  {/* Active Indicator Micro Dot */}
                  <View
                    style={[
                      styles.indicatorDot,
                      isOn ? styles.indicatorDotOn : styles.indicatorDotOff,
                    ]}
                  />
                </View>
              </LinearGradient>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* ELEVATED TACTILE SUB-BUTTON (Positioned directly below 3D circle with clean 28px gap) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={isDisabled}
        style={[
          styles.elevatedSubPill,
          isOn ? styles.elevatedSubPillOn : styles.elevatedSubPillOff,
          isDisabled && styles.subPillDisabled,
        ]}
      >
        <Ionicons
          name="power-sharp"
          size={16}
          color={isOn ? COLORS.electricLime : COLORS.textSubtlePill}
          style={{ marginRight: 8 }}
        />
        <Text
          style={[
            styles.subPillText,
            isOn ? styles.subPillTextOn : styles.subPillTextOff,
          ]}
        >
          {isOn ? 'Click to turn off torch' : 'Click to turn on torch'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },

  // LAYER 1: AMBIENT RADIAL GLOW
  auraContainer: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  auraGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 170,
  },

  // 3D PUSH BUTTON
  buttonTouchWrapper: {
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.75,
    shadowRadius: 26,
    elevation: 22,
  },
  outerRaisedBezel: {
    width: 216,
    height: 216,
    borderRadius: 108,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRaisedBezelOn: {
    shadowColor: COLORS.electricLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 24,
    elevation: 25,
  },
  middleGapRing: {
    width: '100%',
    height: '100%',
    borderRadius: 101,
    backgroundColor: '#070c18',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerConcaveBasin: {
    width: '100%',
    height: '100%',
    borderRadius: 95,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  // LAYER 4: FLASHLIGHT GLYPH & BEAM RAYS
  glyphCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  beamRaysContainer: {
    position: 'absolute',
    top: -46,
    width: 100,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  beamRay: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  beamRayLeft: {
    transform: [{ rotate: '-24deg' }, { translateY: -4 }],
  },
  beamRayCenter: {
    height: 42,
    transform: [{ rotate: '0deg' }, { translateY: -8 }],
  },
  beamRayRight: {
    transform: [{ rotate: '24deg' }, { translateY: -4 }],
  },
  beamRayGradient: {
    width: '100%',
    height: '100%',
  },

  flashlightIconOn: {
    shadowColor: COLORS.electricLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
  },
  flashlightIconOff: {
    opacity: 0.85,
  },
  indicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 8,
  },
  indicatorDotOn: {
    backgroundColor: COLORS.electricLime,
    shadowColor: COLORS.electricLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  indicatorDotOff: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.35,
  },

  // ELEVATED TACTILE SUB-BUTTON (Clean 28px gap below 3D circle)
  elevatedSubPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 28, // Clean 28px gap
    borderWidth: 1,
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  elevatedSubPillOff: {
    backgroundColor: '#152136',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  elevatedSubPillOn: {
    backgroundColor: 'rgba(195, 242, 77, 0.12)',
    borderColor: COLORS.cardBorderLime,
    shadowColor: COLORS.electricLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  subPillDisabled: {
    opacity: 0.5,
  },
  subPillText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subPillTextOff: {
    color: COLORS.textSubtlePill, // Muted near-white #d8e2f0
  },
  subPillTextOn: {
    color: COLORS.electricLime, // Mint glow / lime text #c3f24d
  },
});
