export default function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] font-extrabold tracking-[0.18em] uppercase text-brand mb-5 ${className}`}
    >
      {children}
    </p>
  );
}
