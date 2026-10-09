import artImagesData from './artImageUrls.json';

export interface ArtImageMeta {
  wikiTitle?: string;
  imageUrl?: string;
  fullImageUrl?: string;
  extract?: string | null;
}

export const ART_IMAGES_MAP: Record<string, ArtImageMeta> = artImagesData as unknown as Record<string, ArtImageMeta>;

export function getArtImage(id: string): ArtImageMeta | undefined {
  return ART_IMAGES_MAP[id];
}
