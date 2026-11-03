import { useState, type ImgHTMLAttributes } from 'react';
import fallback from '../assets/fallback.svg';
import { photoSrcSet, photoUrl } from '../images';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> {
  photoId: string;
  /** Ảnh Unsplash thay thế nếu ảnh chính lỗi (trước khi dùng ảnh minh họa SVG) */
  fallbackPhotoId?: string;
  alt: string;
  width: number;
  height: number;
  /** Các kích thước sinh srcset */
  widths?: number[];
}

/** Ảnh Unsplash có srcset, lazy-load và ảnh dự phòng khi link lỗi. */
export default function SmartImage({
  photoId,
  fallbackPhotoId,
  alt,
  width,
  height,
  widths = [400, 640, 960],
  className = '',
  ...rest
}: Props) {
  // 0 = ảnh chính, 1 = ảnh Unsplash thay thế, 2 = ảnh minh họa SVG
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const id = stage === 0 ? photoId : fallbackPhotoId;
  const useSvg = stage === 2 || !id;
  return (
    <img
      src={useSvg ? fallback : photoUrl(id, width)}
      srcSet={useSvg ? undefined : photoSrcSet(id, widths)}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      onError={() => setStage((s) => (s === 0 && fallbackPhotoId ? 1 : 2))}
      onLoad={() => setLoaded(true)}
      className={`bg-brand-100 transition-opacity duration-500 ${loaded || useSvg ? 'opacity-100' : 'opacity-0'} ${className}`}
      {...rest}
    />
  );
}
