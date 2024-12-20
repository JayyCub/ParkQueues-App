import React from 'react'
import {
  CartesianChart,
  type ChartBounds,
  type PointsArray,
  useAreaPath,
  useChartPressState,
  useLinePath
} from 'victory-native'
import {
  Circle,
  Line as SkiaLine,
  LinearGradient,
  Path,
  useFont,
  vec
} from '@shopify/react-native-skia'
import {
  View
} from 'react-native'
import {
  type SharedValue, useDerivedValue
} from 'react-native-reanimated'
import { AnimatedText } from './AnimatedText'
import { styles } from '../../styles'

const initChartPressState = { x: 0, y: { end: 0, start: 0 } } as const
export interface DataItem {
  start: number | undefined
  end: number | undefined
  date: number
}

export default function TwoLineAreaChart ({ data, timezone }: { data: DataItem[], timezone: string }): React.JSX.Element {
  const maxVal = Math.max(...data.map(o => o.end ?? 0))

  const isDark = false
  const font = useFont('arial', 12)
  const textColor = isDark ? '#ffffff' : '#000000'
  const { state: chartPressState, isActive: isChartPressActive } = useChartPressState(initChartPressState)

  // Active date display
  const activeDate = useDerivedValue(() => {
    if (!isChartPressActive) return 'Press to view a point in time:'
    return 'at ' + new Date(chartPressState.x.value.value).toLocaleString(
      'en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: timezone
      }) + ':'
  })

  // Active high display
  const activeNums = useDerivedValue(() => {
    if (!isChartPressActive) return '—'
    let start = chartPressState.y.start.value.value.toFixed(0)
    let end = chartPressState.y.end.value.value.toFixed(0)

    if (start === 'NaN') start = 'Closed'
    if (end === 'NaN') end = 'Closed'

    return `${start} - ${end}`
  })

  return (
    <>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <AnimatedText
          text={activeDate}
          style={{
            fontSize: 16,
            color: textColor,
            fontStyle: 'italic'
          }}
        />
        <AnimatedText text={activeNums} style={styles.liveData2} />
      </View>

      <View style={{
        flex: 2,
        borderWidth: 1,
        borderColor: 'lightgray',
        marginBottom: 5,
        height: 150
      }}>
        <CartesianChart
          // @ts-expect-error Lint doesn't like custom components
          data={data}
          // @ts-expect-error Lint doesn't like custom components
          xKey="date"
          // @ts-expect-error Lint doesn't like custom components
          yKeys={['start', 'end']}
          // @ts-expect-error Lint doesn't like custom components
          chartPressState={chartPressState}
          curve="linear"
          domain={{ y: [0, Math.ceil((maxVal + 5) / 5) * 5] }}
          axisOptions={{
            font,
            tickCount: maxVal / 5,
            labelOffset: { x: 5, y: 8 },
            labelPosition: { x: 'inset', y: 'inset' },
            axisSide: { x: 'bottom', y: 'left' },
            lineColor: isDark ? '#71717a' : '#d4d4d8',
            labelColor: textColor
          }}
          renderOutside={({ chartBounds }) => (
            <>
              {isChartPressActive && (
                <>
                  <ActiveValueIndicator
                    xPosition={chartPressState.x.position}
                    y1Position={chartPressState.y.end.position}
                    y2Position={chartPressState.y.start.position}
                    bottom={chartBounds.bottom}
                    top={chartBounds.top}
                    lineColor={'#0a90da'} // Line color for indicator
                  />
                </>
              )}
            </>
          )}
        >
          {({ chartBounds, points }) => (
            <>
              <LineArea
                lineVal={true}
                // @ts-expect-error Lint doesn't like custom components
                points={points.end}
                {...chartBounds} />
              <LineArea
                lineVal={false}
                // @ts-expect-error Lint doesn't like custom components
                points={points.start}
                {...chartBounds}
              />
            </>
          )}
        </CartesianChart>
      </View>
    </>
  )
}

const LineArea =
  ({ points, top, bottom, lineVal }: { points: PointsArray, lineVal: boolean } & ChartBounds): React.JSX.Element => {
    const { path: areaPath } = useAreaPath(points, bottom)
    const { path: linePath } = useLinePath(points)

    return (
    <>
      <Path path={areaPath} style="fill">
        <LinearGradient
          start={vec(0, 0)}
          end={vec(top, bottom)}
          colors={lineVal
            ? ['#63eeff', '#effeff']
            : ['#2d9ff1', '#effeff']}
        />
      </Path>
      <Path
        path={linePath}
        style="stroke"
        strokeWidth={2}
        color={'#0a90da'}
      />
    </>
    )
  }

const ActiveValueIndicator =
  ({
    xPosition,
    y1Position,
    y2Position,
    top,
    bottom,
    lineColor
  }: {
    xPosition: SharedValue<number>
    y1Position: SharedValue<number>
    y2Position: SharedValue<number>
    bottom: number
    top: number
    lineColor: string
  }): React.JSX.Element => {
    const start = useDerivedValue(() => vec(xPosition.value, bottom))
    const end = useDerivedValue(() => vec(xPosition.value, top))

    return (
    <>
      <SkiaLine p1={start} p2={end} color={lineColor} strokeWidth={1} />
      <Circle cx={xPosition} cy={y1Position} r={3} color="blue" />
      <Circle cx={xPosition} cy={y2Position} r={3} color="blue" />
    </>
    )
  }
