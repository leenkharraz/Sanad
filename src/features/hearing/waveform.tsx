const BAR_HEIGHTS = [10, 18, 26, 16, 22, 12, 20, 28, 14, 18, 10, 24];

export function Waveform({ active }: { active: boolean }) {
  return (
    <div aria-hidden="true" className="flex h-8 items-center gap-1">
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className={`w-1 rounded-full bg-danger ${active ? "animate-wave" : ""}`}
          style={{
            height: active ? `${height}px` : "4px",
            animationDelay: `${index * 90}ms`,
          }}
        />
      ))}
    </div>
  );
}
