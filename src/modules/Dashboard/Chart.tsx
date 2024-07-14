import { Title } from './Title';

// Generate Usage Data
function createData(time: string, filesAccessed?: number): { time: string; filesAccessed: number | null } {
  return { time, filesAccessed: filesAccessed ?? null };
}

const data = [
  createData('00:00', 5),
  createData('03:00', 15),
  createData('06:00', 25),
  createData('09:00', 50),
  createData('12:00', 80),
  createData('15:00', 120),
  createData('18:00', 150),
  createData('21:00', 160),
  createData('24:00', 140),
];

// Function to normalize data points to fit the chart dimensions
const normalizeData = (data: { time: string; filesAccessed: number | null }[], width: number, height: number) => {
  const maxValue = Math.max(...data.map((d) => d.filesAccessed ?? 0));
  const minValue = Math.min(...data.map((d) => d.filesAccessed ?? 0));
  return data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d.filesAccessed ?? 0 - minValue) / (maxValue - minValue)) * height,
  }));
};

export const Chart = () => {
  const width = 600;
  const height = 300;
  const normalizedData = normalizeData(data, width, height);

  return (
    <div>
      <Title>File Manager Usage Today</Title>
      <svg width={'100%'} height={height} style={{ border: '1px solid grey' }}>
        <polyline
          fill="none"
          stroke="blue"
          strokeWidth="2"
          points={normalizedData.map((d) => `${d.x},${d.y}`).join(' ')}
        />
        {normalizedData.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="3" fill="red" />
        ))}
        {normalizedData.map((d, i) => (
          <text key={i} x={d.x} y={height - 5} fontSize="10" textAnchor="middle">
            {data[i].time}
          </text>
        ))}
        <text x="10" y="20" fontSize="14" fill="black">
          Files Accessed
        </text>
        {Array.from({ length: 5 }).map((_, i) => {
          const y = (i / 4) * height;
          const label = Math.round(((4 - i) / 4) * Math.max(...data.map((d) => d.filesAccessed ?? 0)));
          return (
            <g key={i}>
              <line x1="0" y1={y} x2="5" y2={y} stroke="black" />
              <text x="10" y={y + 5} fontSize="10" fill="black">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
