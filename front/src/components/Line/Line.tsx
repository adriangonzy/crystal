import { ResponsiveLine } from '@nivo/line'

interface LineData {
  id: string
  color: string
  data: { x: string; y: number }[]
}

interface LineProps {
  data: LineData[]
}

export const Line: React.FunctionComponent<LineProps> = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 10, right: 30, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: false,
      reverse: false,
    }}
    axisBottom={{
      tickSize: 0,
      tickRotation: -25,
    }}
    axisLeft={{
      tickSize: 0,
    }}
    enableGridX={false}
    enableGridY={false}
    colors={data.map((line) => line.color)}
  />
)
