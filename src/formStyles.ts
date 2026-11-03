/** Lớp CSS dùng chung cho ô nhập liệu của form. */
export function inputClass(hasError: boolean): string {
  return `block w-full rounded-xl border bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
    hasError ? 'border-red-600 focus:ring-red-200' : 'border-slate-300 focus:border-brand-700 focus:ring-brand-100'
  }`;
}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
