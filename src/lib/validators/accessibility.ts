import type { ThemeSpec } from '../schemas/theme-spec';
import { contrastRatio } from './design-token-validator';

export interface AccessibilityCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  details: string;
  score: number; // 0-100 contribution
}

export interface AccessibilityScore {
  overall: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  checks: AccessibilityCheck[];
}

/**
 * Score a Theme Spec for WCAG accessibility compliance.
 */
export function scoreAccessibility(spec: ThemeSpec): AccessibilityScore {
  const checks: AccessibilityCheck[] = [];

  // ── 1. Text on background contrast (WCAG AA: 4.5:1) ──
  const colorMap = new Map(spec.designTokens.colors.map((c) => [c.role, c]));
  const base = colorMap.get('base');
  const contrast = colorMap.get('contrast');
  const primary = colorMap.get('primary');
  const accent = colorMap.get('accent');
  const surface = colorMap.get('surface');

  if (base && contrast) {
    const ratio = contrastRatio(contrast.hex, base.hex);
    checks.push({
      name: 'Text contrast (body text on background)',
      status: ratio >= 4.5 ? 'pass' : ratio >= 3 ? 'warn' : 'fail',
      details: `${ratio.toFixed(1)}:1 ratio (WCAG AA requires 4.5:1)`,
      score: ratio >= 4.5 ? 20 : ratio >= 3 ? 10 : 0,
    });
  }

  if (base && primary) {
    const ratio = contrastRatio(primary.hex, base.hex);
    checks.push({
      name: 'Heading contrast (headings on background)',
      status: ratio >= 4.5 ? 'pass' : ratio >= 3 ? 'warn' : 'fail',
      details: `${ratio.toFixed(1)}:1 ratio`,
      score: ratio >= 4.5 ? 15 : ratio >= 3 ? 8 : 0,
    });
  }

  if (base && accent) {
    const ratio = contrastRatio(accent.hex, base.hex);
    checks.push({
      name: 'Interactive element contrast (buttons/links on background)',
      status: ratio >= 3 ? 'pass' : 'fail',
      details: `${ratio.toFixed(1)}:1 ratio (minimum 3:1 for large text/UI)`,
      score: ratio >= 4.5 ? 15 : ratio >= 3 ? 10 : 0,
    });
  }

  if (surface && contrast) {
    const ratio = contrastRatio(contrast.hex, surface.hex);
    checks.push({
      name: 'Text on surface sections',
      status: ratio >= 4.5 ? 'pass' : ratio >= 3 ? 'warn' : 'fail',
      details: `${ratio.toFixed(1)}:1 ratio`,
      score: ratio >= 4.5 ? 10 : ratio >= 3 ? 5 : 0,
    });
  }

  // ── 2. Font size minimums ──
  const fontSizes = spec.designTokens.typography.fontSizes;
  const smallestSize = fontSizes[0];
  const pxMatch = smallestSize?.size.match(/^([\d.]+)(px|rem|em)$/);
  let smallestPx = 16;
  if (pxMatch) {
    smallestPx = pxMatch[2] === 'px' ? parseFloat(pxMatch[1]) : parseFloat(pxMatch[1]) * 16;
  }

  checks.push({
    name: 'Minimum font size',
    status: smallestPx >= 14 ? 'pass' : smallestPx >= 12 ? 'warn' : 'fail',
    details: `Smallest size: ${smallestSize?.size} (~${smallestPx.toFixed(0)}px)`,
    score: smallestPx >= 14 ? 10 : smallestPx >= 12 ? 5 : 0,
  });

  // ── 3. Font size scale (enough range for hierarchy) ──
  const hasFiveSizes = fontSizes.length >= 5;
  checks.push({
    name: 'Typography scale depth',
    status: hasFiveSizes ? 'pass' : 'warn',
    details: `${fontSizes.length} sizes defined (5+ recommended for clear hierarchy)`,
    score: hasFiveSizes ? 10 : 5,
  });

  // ── 4. Fluid typography (responsive text) ──
  const fluidCount = fontSizes.filter((f) => f.fluid).length;
  checks.push({
    name: 'Responsive fluid typography',
    status: fluidCount >= 2 ? 'pass' : fluidCount >= 1 ? 'warn' : 'fail',
    details: `${fluidCount}/${fontSizes.length} sizes use fluid scaling`,
    score: fluidCount >= 2 ? 10 : fluidCount >= 1 ? 5 : 0,
  });

  // ── 5. Sufficient spacing scale ──
  const spacingSteps = spec.designTokens.spacing.length;
  checks.push({
    name: 'Spacing scale for touch targets',
    status: spacingSteps >= 7 ? 'pass' : spacingSteps >= 5 ? 'warn' : 'fail',
    details: `${spacingSteps} spacing steps (7+ ensures adequate touch target spacing)`,
    score: spacingSteps >= 7 ? 10 : spacingSteps >= 5 ? 5 : 0,
  });

  // Calculate overall
  const maxScore = 100;
  const rawScore = checks.reduce((sum, c) => sum + c.score, 0);
  const overall = Math.min(Math.round((rawScore / maxScore) * 100), 100);

  let grade: AccessibilityScore['grade'];
  if (overall >= 90) grade = 'A';
  else if (overall >= 75) grade = 'B';
  else if (overall >= 60) grade = 'C';
  else if (overall >= 40) grade = 'D';
  else grade = 'F';

  return { overall, grade, checks };
}
