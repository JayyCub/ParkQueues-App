import React, { useState } from 'react'
import { VictoryChart, VictoryArea, VictoryVoronoiContainer, VictoryLine } from 'victory'
import { View, Text } from 'react-native'
import { styles } from '../styles'

export default function WebSingleLineAreaChart ({ data, timezone }:
{ data: Array<{ high: number | undefined, date: number }>, timezone: string }): React.JSX.Element {
  const maxVal = Math.max(...data.map(o => o.high ?? 0))
  const [hoverVal, setHoverVal] = useState({ x: -1, y: -1 })

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' /* height: 400 */ }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{
          fontSize: 16,
          color: '#000000',
          fontStyle: 'italic'
        }}>
          {new Date(hoverVal.x).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: timezone
          })}</Text>
        <Text style={styles.liveData2}>{hoverVal.y}</Text>
      </View>
      <View style={{ height: 400 }}>
        <VictoryChart
          domain={{ y: [0, Math.ceil((maxVal + 10) / 5) * 5] }}
          padding={{ top: 40, bottom: 40, left: 40, right: 10 }}
          containerComponent={
            <VictoryVoronoiContainer
              onActivated={(points) => {
                if (points.length > 0) {
                  const point = points[0]
                  setHoverVal({ x: point.x, y: point.y })
                }
              }}
            />
          }
        >
          <VictoryArea
            data={data.map(d => ({ x: new Date(d.date), y: d.high ?? 1 }))}
            style={{ data: { fill: '#97c9e5', stroke: '#0a90da', strokeWidth: 2 } }} // Add stroke properties
            interpolation="linear"
            standalone={false}
          />
          <VictoryLine
            data={[{ x: hoverVal.x, y: 0 }, { x: hoverVal.x, y: maxVal + 10 }]} // Vertical line from 0 to maxVal at the hover x value
            style={{ data: { stroke: 'red', strokeWidth: 2 } }} // Style the line
          />
        </VictoryChart>
      </View>
    </View>
  )
}
