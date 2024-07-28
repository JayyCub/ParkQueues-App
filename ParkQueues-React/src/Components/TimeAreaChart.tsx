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
import { styles } from '../styles'

const initChartPressState = { x: 0, y: { returnTime: 0, histTime: 0 } } as const
export interface ReturnDataItem {
  histTime: number | undefined
  returnTime: number | undefined
  date: number
}

export default function TimeAreaChart ({ data, timezone }: { data: ReturnDataItem[], timezone: string }): React.JSX.Element {
  const validHighValues = data
    .map(o => o.histTime)
    .filter(value => value !== undefined && value !== null)

  const maxVal = Math.max(...data.map(o => o.returnTime ?? 0))
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const minVal = Math.min(...validHighValues)

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
    let returnTime = new Date(parseFloat(chartPressState.y.returnTime.value.value.toFixed(0))).toLocaleString('en-US',
      { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: timezone })

    if (returnTime === 'Invalid Date') returnTime = 'Unavailable'

    return returnTime
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
          yKeys={['histTime', 'returnTime']}
          // @ts-expect-error Lint doesn't like custom components
          chartPressState={chartPressState}
          curve="linear"
          domain={{ y: [minVal, maxVal] }}
          axisOptions={{
            font,
            tickCount: 10,
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
                    y1Position={chartPressState.y.returnTime.position}
                    y2Position={chartPressState.y.histTime.position}
                    bottom={chartBounds.bottom}
                    top={chartBounds.top}
                    lineColor={'#6226be'} // Line color for indicator
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
                points={points.returnTime}
                {...chartBounds} />
              <LineArea
                lineVal={false}
                // @ts-expect-error Lint doesn't like custom components
                points={points.histTime}
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
              ? ['#7050ff', '#effeff']
              : ['rgba(209,209,209,0.5)', 'rgba(209,209,209,0.5)']}
          />
        </Path>
        {lineVal
          ? <Path
          path={linePath}
          style="stroke"
          strokeWidth={2}
          color={lineVal ? '#5633bc' : '#dfdfdf'}
        />
          : null}
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
        <Circle cx={xPosition} cy={y1Position} r={3} color='#3d1082' />
        <Circle cx={xPosition} cy={y2Position} r={3} color="gray" />
      </>
    )
  }
