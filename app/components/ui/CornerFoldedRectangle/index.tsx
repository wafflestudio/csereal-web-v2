import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './style.module.css';

type ColorTheme = 'orange' | 'lightGray' | 'black' | 'darkGray';
type Size = 'small' | 'large';
type Shadow = 'light' | 'medium';

interface CornerFoldedRectangleProps {
  colorTheme: ColorTheme;
  size?: Size;
  shadow?: Shadow;
  margin?: string;
  animationType?: 'folding' | 'unfolding';
  width?: string;
  children: ReactNode;
}

const colorThemeMap: Record<ColorTheme, { rect: string; triangle: string }> = {
  orange: { rect: styles.themeOrange, triangle: styles.triangleOrange },
  lightGray: {
    rect: styles.themeLightGray,
    triangle: styles.triangleLightGray,
  },
  black: { rect: styles.themeBlack, triangle: styles.triangleBlack },
  darkGray: { rect: styles.themeDarkGray, triangle: styles.triangleDarkGray },
};

const sizeMap: Record<Size, string> = {
  small: styles.triangleSizeSmall,
  large: styles.triangleSizeLarge,
};

const shadowMap: Record<Shadow, string> = {
  light: styles.shadowLight,
  medium: styles.shadowMedium,
};

export default function CornerFoldedRectangle({
  colorTheme,
  size = 'small',
  shadow = 'medium',
  margin,
  animationType,
  width = 'w-fit',
  children,
}: CornerFoldedRectangleProps) {
  const themeClasses = colorThemeMap[colorTheme];
  const sizeClass = sizeMap[size];
  const shadowClass = shadowMap[shadow];

  if (animationType) {
    return (
      <div
        className={clsx(
          'relative',
          width,
          margin,
          themeClasses.rect,
          styles.animated,
          styles[animationType],
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={clsx('relative', width, margin, themeClasses.rect)}>
      <div className={clsx(styles.triangle, styles.triangleWhite, sizeClass)} />
      <div
        className={clsx(
          styles.triangle,
          themeClasses.triangle,
          sizeClass,
          shadowClass,
        )}
      />
      {children}
    </div>
  );
}
