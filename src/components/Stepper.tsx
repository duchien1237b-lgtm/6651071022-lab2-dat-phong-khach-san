import { IconCheck } from './Icons';

interface StepperProps {
  steps: string[];
  current: number;
}

/** Thanh tiến trình cho form nhiều bước. */
export default function Stepper({ steps, current }: StepperProps) {
  return (
    <nav aria-label="Tiến trình đặt phòng">
      <p className="mb-3 text-sm font-medium text-slate-600 tablet:hidden">
        Bước {current + 1}/{steps.length}: <span className="text-slate-900">{steps[current]}</span>
      </p>
      <ol className="flex items-center gap-2">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex flex-1 items-center gap-2" aria-current={active ? 'step' : undefined}>
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors ${
                  done ? 'bg-brand-700 text-white' : active ? 'bg-brand-700 text-white ring-4 ring-brand-100' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {done ? <IconCheck /> : i + 1}
                <span className="sr-only">{done ? ' (đã xong)' : active ? ' (đang thực hiện)' : ''}</span>
              </span>
              <span className={`hidden text-sm font-medium tablet:inline ${active ? 'text-slate-900' : 'text-slate-600'}`}>{label}</span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className={`h-1 flex-1 rounded-full ${done ? 'bg-brand-600' : 'bg-slate-200'}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
