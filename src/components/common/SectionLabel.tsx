interface SectionLabelProps {
  children: React.ReactNode
  hint?: React.ReactNode
}

/** Small in-page zone divider for hub/overview pages with multiple sections. */
export function SectionLabel({ children, hint }: SectionLabelProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">{children}</h2>
      {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
    </div>
  )
}
