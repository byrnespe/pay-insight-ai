const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * Get the public URL for a brand asset stored in the brand-assets bucket
 * @param path - The path to the asset within the brand-assets bucket (e.g., 'logos/logo-icon.png')
 * @returns The full public URL to the asset
 */
export function getBrandAssetUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/brand-assets/${path}`;
}

/**
 * Pre-defined asset paths for type safety and consistency
 * Update these paths after uploading assets to the brand-assets bucket
 */
export const BRAND_ASSETS = {
  logo: 'logos/logo-icon.png',
  logoDark: 'logos/logo-dark.png',
  logoLight: 'logos/logo-light.png',
  ogImage: 'banners/og-image.png',
  heroBanner: 'banners/hero-banner.png',
} as const;

export type BrandAssetKey = keyof typeof BRAND_ASSETS;
