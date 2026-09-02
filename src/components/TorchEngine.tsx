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
  // Glow flare animation
  const glowAnim = useRef(new Animated.Value(isOn ? 1 : 0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const beamAnim = useRef(new Animated.Value(isOn ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(glowAnim, {
        toValue: isOn ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(beamAnim, {
        toValue: isOn ? 1 : 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    if (isOn) {
      // Gentle subtle pulse animation when torch is ON
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1200,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
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
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    // Provide heavy tactile haptic feedback on press
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Haptics fallback for platforms without hardware support
    }
    onToggle();
  };

  const auraOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.95],
  });

  const beamOpacity = beamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const beamScale = beamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={styles.container}>
      {/* 1. AMBIENT RADIAL GLOW (AURA) */}
      <Animated.View
        style={[
          styles.auraContainer,
          {
            opacity: auraOpacity,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={
            isOn
              ? ['rgba(195, 242, 77, 0.35)', 'rgba(87, 224, 168, 0.2)', 'rgba(10, 17, 32, 0)']
              : ['rgba(39, 56, 89, 0.2)', 'rgba(10, 17, 32, 0)']
          }
          style={styles.auraGradient}
        />
      </Animated.View>

      {/* 2. PHOTON BEAM RAYS (Visible when ON) */}
      <Animated.View
        style={[
          styles.beamContainer,
          {
            opacity: beamOpacity,
            transform: [{ scale: beamScale }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(195, 242, 77, 0.4)', 'rgba(195, 242, 77, 0.05)', 'transparent']}
          style={styles.beamCone}
        />
        {/* Ray Lines */}
        <View style={[styles.rayLine, { transform: [{ rotate: '-35deg' }] }]} />
        <View style={[styles.rayLine, { transform: [{ rotate: '-18deg' }] }]} />
        <View style={[styles.rayLine, { transform: [{ rotate: '0deg' }] }]} />
        <View style={[styles.rayLine, { transform: [{ rotate: '18deg' }] }]} />
        <View style={[styles.rayLine, { transform: [{ rotate: '35deg' }] }]} />
      </Animated.View>

      {/* 3. 3D SKEUOMORPHIC CIRCULAR BUTTON */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={isDisabled}
          style={styles.buttonWrapper}
        >
          {/* Outer Chamfer Rim */}
          <LinearGradient
            colors={
              isOn
                ? ['#c3f24d', '#57e0a8', '#17233c']
                : ['#324770', '#17233c', '#0f1828']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.outerRim,
              isOn && styles.outerRimOn,
            ]}
          >
            {/* Middle Bevel Ring */}
            <View style={styles.middleBevel}>
              {/* Inner Skeuomorphic Disk */}
              <LinearGradient
                colors={
                  isOn
                    ? ['#1f304d', '#142036']
                    : ['#192742', '#0e1727']
                }
                start={{ x: 0.3, y: 0 }}
                end={{ x: 0.7, y: 1 }}
                style={styles.innerDisk}
              >
                {/* Inner Ring Glow */}
                <View
                  style={[
                    styles.innerRingHighlight,
                    isOn && styles.innerRingHighlightOn,
                  ]}
                />

                {/* Torch Glyph Icon */}
                <View style={styles.iconContainer}>
                  {isOn ? (
                    <MaterialCommunityIcons
                      name="flashlight"
                      size={64}
                      color={COLORS.electricLime}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="flashlight-off"
                      size={64}
                      color={COLORS.textMuted}
                    />
                  )}
                </View>

                {/* Status Indicator Dot under Torch */}
                <View
                  style={[
                    styles.statusDot,
                    isOn ? styles.statusDotOn : styles.statusDotOff,
                  ]}
                />
              </LinearGradient>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* 4. UNDERNEATH LOW-OPACITY ELEVATED PILL BUTTON */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        disabled={isDisabled}
        style={[
          styles.pillButton,
          isOn ? styles.pillButtonOn : styles.pillButtonOff,
          isDisabled && styles.pillButtonDisabled,
        ]}
      >
        <Ionicons
          name={isOn ? 'power' : 'power-outline'}
          size={16}
          color={isOn ? COLORS.electricLime : COLORS.textSecondary}
          style={{ marginRight: 6 }}
        />
        <Text
          style={[
            styles.pillText,
            isOn ? styles.pillTextOn : styles.pillTextOff,
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
    marginVertical: 20,
    position: 'relative',
    width: '100%',
  },
  auraContainer: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  auraGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 160,
  },
  beamContainer: {
    position: 'absolute',
    top: -40,
    width: 240,
    height: 140,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1,
    pointerEvents: 'none',
  },
  beamCone: {
    width: 220,
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 110,
    borderBottomRightRadius: 110,
  },
  rayLine: {
    position: 'absolute',
    top: 20,
    width: 3,
    height: 80,
    backgroundColor: 'rgba(195, 242, 77, 0.4)',
    borderRadius: 2,
  },
  buttonWrapper: {
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 20,
  },
  outerRim: {
    width: 200,
    height: 200,
    borderRadius: 100,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRimOn: {
    shadowColor: COLORS.electricLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 24,
  },
  middleBevel: {
    width: '100%',
    height: '100%',
    borderRadius: 94,
    backgroundColor: '#0a1120',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDisk: {
    width: '100%',
    height: '100%',
    borderRadius: 89,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  innerRingHighlight: {
    position: 'absolute',
    top: 4,
    width: 150,
    height: 75,
    borderTopLeftRadius: 75,
    borderTopRightRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  innerRingHighlightOn: {
    backgroundColor: 'rgba(195, 242, 77, 0.12)',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 10,
  },
  statusDotOn: {
    backgroundColor: COLORS.electricLime,
    shadowColor: COLORS.electricLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  statusDotOff: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.4,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 28,
    borderWidth: 1,
    zIndex: 3,
  },
  pillButtonOff: {
    backgroundColor: 'rgba(23, 35, 60, 0.65)',
    borderColor: COLORS.cardBorder,
  },
  pillButtonOn: {
    backgroundColor: 'rgba(195, 242, 77, 0.15)',
    borderColor: COLORS.cardBorderLime,
  },
  pillButtonDisabled: {
    opacity: 0.5,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  pillTextOff: {
    color: COLORS.textSecondary,
  },
  pillTextOn: {
    color: COLORS.electricLime,
  },
});
