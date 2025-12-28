import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientSets, palette } from '@/theme';

type SurfaceCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  accent?: 'accent' | 'hero';
  borderless?: boolean;
};

export const SurfaceCard: React.FC<SurfaceCardProps> = ({ children, style, accent = 'accent', borderless }) => {
  const gradient = accent === 'hero' ? gradientSets.hero : gradientSets.accent;
  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.outer, style]}>
      <View style={[styles.inner, borderless && styles.innerBorderless]}>
        {children}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: 16,
    padding: 1,
  },
  inner: {
    backgroundColor: palette.card,
    borderRadius: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  innerBorderless: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});

export default SurfaceCard;
