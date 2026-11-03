import { IconStar } from './Icons';

function ratingLabel(score: number): string {
  if (score >= 4.8) return 'Tuyệt hảo';
  if (score >= 4.5) return 'Rất tốt';
  if (score >= 4) return 'Tốt';
  return 'Khá';
}

export default function Rating({ score, count, size = 'sm' }: { score: number; count?: number; size?: 'sm' | 'lg' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
      <span className="inline-flex items-center gap-1 rounded-md bg-brand-700 px-1.5 py-0.5 font-semibold text-white">
        <IconStar className="text-amber-300" />
        {score.toFixed(1)}
      </span>
      <span className="font-medium text-slate-800">{ratingLabel(score)}</span>
      {count !== undefined && <span className="text-slate-600">({count.toLocaleString('vi-VN')} đánh giá)</span>}
    </span>
  );
}
