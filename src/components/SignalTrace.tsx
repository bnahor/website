type SignalTraceProps = {
  values: number[];
};

export function SignalTrace({ values }: SignalTraceProps) {
  const width = 180;
  const height = 44;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const last = values[values.length - 1] ?? 0;
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - 4 - ((value - min) / range) * (height - 8);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="signal-trace" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={`M0 ${height - 1}H${width}`} />
      <polyline points={points} />
      <circle
        cx={width}
        cy={height - 4 - ((last - min) / range) * (height - 8)}
        r="2.5"
      />
    </svg>
  );
}
