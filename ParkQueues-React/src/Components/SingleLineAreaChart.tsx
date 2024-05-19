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
  type TextStyle,
  View
} from 'react-native'
import {
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue
} from 'react-native-reanimated'
import { AnimatedText } from './AnimatedText'
import { styles } from '../styles'

const initChartPressState = { x: 0, y: { high: 0 } } as const

export default function SingleLineAreaChart ({ data, timezone }:
{ data: Array<{ date: number, high: number | undefined }>, timezone: string }): React.JSX.Element {
  const DATA = data
  const maxVal = Math.max(...data.map(o => o.high ?? 0))

  const isDark = false
  const colorPrefix = isDark ? 'dark' : 'light'
  const font = useFont('arial', 12)
  const textColor = isDark ? '#ffffff' : '#000000'
  const { state: firstTouch, isActive: isFirstPressActive } =
    useChartPressState(initChartPressState)
  const { state: secondTouch, isActive: isSecondPressActive } =
    useChartPressState(initChartPressState)

  // On activation of gesture, play haptic feedback
  React.useEffect(() => {
  }, [isFirstPressActive])
  React.useEffect(() => {
  }, [isSecondPressActive])

  // Active date display
  const activeDate = useDerivedValue(() => {
    if (!isFirstPressActive) return 'Press on the chart to view history:'

    // One-touch only
    if (!isSecondPressActive) {
      return new Date(firstTouch.x.value.value).toLocaleString(
        'en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          timeZone: timezone
        })
    }
    // Two-touch
    const early =
      firstTouch.x.value.value < secondTouch.x.value.value
        ? firstTouch
        : secondTouch
    const late = early === firstTouch ? secondTouch : firstTouch
    return `${new Date(early.x.value.value).toLocaleString(
      'en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: timezone
      })} - ${new Date(late.x.value.value).toLocaleString(
      'en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: timezone
      })}`
  })

  // Active high display
  const activeHigh = useDerivedValue(() => {
    if (!isFirstPressActive) return '—'

    // One-touch
    if (!isSecondPressActive) {
      const val = firstTouch.y.high.value.value.toFixed(0)
      switch (val) {
        case 'NaN':
          return 'Closed'
        case '1':
          return 'Open'
        default:
          return val
      }
      // return val === 'NaN' ? "Closed" : val;
    }

    // Two-touch
    const early =
      firstTouch.x.value.value < secondTouch.x.value.value
        ? firstTouch
        : secondTouch
    const late = early === firstTouch ? secondTouch : firstTouch

    return `${early.y.high.value.value.toFixed(
      0
    )} – ${late.y.high.value.value.toFixed(0)}`
  })

  // Determine if the selected range has a positive delta, which will be used to conditionally pick colors.
  const isDeltaPositive = useDerivedValue(() => {
    if (!isSecondPressActive) return true

    const early =
      firstTouch.x.value.value < secondTouch.x.value.value
        ? firstTouch
        : secondTouch
    const late = early === firstTouch ? secondTouch : firstTouch
    return early.y.high.value.value < late.y.high.value.value
  })

  // Color the active high display based on the delta
  const activeHighStyle = useAnimatedStyle<TextStyle>(() => {
    const s: TextStyle = styles.liveData2

    // One-touch
    if (!isSecondPressActive) return s
    s.color = 'black'

    return s
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
        <>
          <AnimatedText
            text={activeDate}
            style={{
              fontSize: 16,
              color: textColor,
              fontStyle: 'italic'
            }}
          />
          <AnimatedText text={activeHigh} style={activeHighStyle} />
        </>
      </View>
      <View style={{
        flex: 2,
        borderWidth: 1,
        borderColor: 'lightgray',
        marginBottom: 5,
        height: 150
      }}>
        <CartesianChart
          data={DATA}
          xKey="date"
          yKeys={['high']}
          chartPressState={[firstTouch, secondTouch]}
          curve="linear"
          domain={{ y: [0, Math.ceil((maxVal + 5) / 5) * 5] }}
          axisOptions={{
            font,
            tickCount: maxVal / 5,
            labelOffset: { x: 5, y: 8 },
            labelPosition: { x: 'inset', y: 'inset' },
            axisSide: { x: 'bottom', y: 'left' },
            // formatXLabel: (ms) => ms.toString(),
            // formatYLabel: (v) => `$${v}`,
            // tickValues: [1, 2, 3],
            lineColor: isDark ? '#71717a' : '#d4d4d8',
            labelColor: textColor
          }}
          renderOutside={({ chartBounds }) => (
            <>
              {isFirstPressActive && (
                <>
                  <ActiveValueIndicator
                    xPosition={firstTouch.x.position}
                    yPosition={firstTouch.y.high.position}
                    bottom={chartBounds.bottom}
                    top={chartBounds.top}
                    lineColor={isDark ? '#71717a' : '#d4d4d8'}
                  />
                </>
              )}
              {isSecondPressActive && (
                <>
                  <ActiveValueIndicator
                    xPosition={secondTouch.x.position}
                    yPosition={secondTouch.y.high.position}
                    bottom={chartBounds.bottom}
                    top={chartBounds.top}
                    lineColor={isDark ? '#71717a' : '#d4d4d8'}
                  />
                </>
              )}
            </>
          )}
        >
          {({ chartBounds, points }) => (
            <>
              <FillArea
                colorPrefix={colorPrefix}
                points={points.high}
                isWindowActive={isFirstPressActive && isSecondPressActive}
                isDeltaPositive={isDeltaPositive}
                startX={firstTouch.x.position}
                endX={secondTouch.x.position}
                {...chartBounds}
              />
            </>
          )}
        </CartesianChart>
      </View>
    </>
  )
}

/**
 * Show the line/area chart for the stock price, taking into account press state.
 */
const FillArea =
  ({
    points,
    top,
    bottom
  }: {
    colorPrefix: 'dark' | 'light'
    points: PointsArray
    isWindowActive: boolean
    isDeltaPositive: SharedValue<boolean>
    startX: SharedValue<number>
    endX: SharedValue<number>
  } & ChartBounds): React.JSX.Element => {
    const { path: areaPath } = useAreaPath(points, bottom)
    const { path: linePath } = useLinePath(points)

    return (
    <>
      <Path path={areaPath} style="fill">
        <LinearGradient
          start={vec(0, 0)}
          end={vec(top, bottom)}
          colors={['#00e1ff', '#effeff']}
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
    yPosition,
    top,
    bottom,
    lineColor
  }: {
    xPosition: SharedValue<number>
    yPosition: SharedValue<number>
    bottom: number
    top: number
    lineColor: string
  }): React.JSX.Element => {
    const start = useDerivedValue(() => vec(xPosition.value, bottom))
    const end = useDerivedValue(() => vec(xPosition.value, top))

    return (
    <>
      <SkiaLine p1={start} p2={end} color={lineColor} strokeWidth={1} />
      <Circle cx={xPosition} cy={yPosition} r={5} color={'blue'} />
    </>
    )
  }
