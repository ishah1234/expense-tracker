export default function TrendChart({ expenses }) {
  if (expenses.length === 0) return null;

  const totalsByDate = expenses.reduce((map, expense) => {
    map[expense.date] = (map[expense.date] || 0) + expense.amount;
    return map;
  }, {});

  const points = Object.entries(totalsByDate)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, total]) => ({ date, total }));

  const width = 600;
  const height = 180;
  const padding = 16;
  const maxY = Math.max(...points.map((p) => p.total), 1);

  const chartPoints = points.map((point, index) => {
    const x =
      points.length === 1
        ? width / 2
        : padding + (index * (width - padding * 2)) / (points.length - 1);
    const y = height - padding - (point.total / maxY) * (height - padding * 2);
    return { ...point, x, y };
  });

  const polyline = chartPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="card" style={{ marginTop: "1.5rem" }}>
      <h2 className="section-title">Spending Trend</h2>
      <div className="trend-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="trend-svg"
          role="img"
          aria-label="Spending trend chart"
        >
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            className="trend-axis"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            className="trend-axis"
          />

          <polyline points={polyline} fill="none" className="trend-line" />

          {chartPoints.map((point) => (
            <circle
              key={point.date}
              cx={point.x}
              cy={point.y}
              r="3"
              className="trend-point"
            >
              <title>
                {point.date}: ${point.total.toLocaleString()}
              </title>
            </circle>
          ))}
        </svg>
      </div>

      <div className="trend-footnote">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}
