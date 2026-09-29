export function RollingLabel({ children }: { children: string }) {
  return <span className="rolling-label" aria-label={children}>
    <span aria-hidden="true">{children}</span>
    <span aria-hidden="true">{children}</span>
  </span>;
}
