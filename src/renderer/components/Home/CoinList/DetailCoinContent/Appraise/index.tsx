import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.scss';

export interface AppraiseProps {
  data: number[];
}
const Appraise: React.FC<AppraiseProps> = ({ data }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        // backgroundColor: '#161627',
        title: {
          text: '',
          left: 'center',
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        tooltip: {
          trigger: 'item',
          confine: true,
        },
        radar: {
          indicator: [
            { name: 'coingecko', max: 100 },
            { name: '开发者', max: 100 },
            { name: '社区', max: 100 },
            { name: '流通性', max: 100 },
          ],
          shape: 'circle',
          splitNumber: 5,
          center: ['50%', '50%'],
          radius: '64%',
          name: {
            textStyle: {
              color: 'rgb(228, 167, 82)',
            },
          },
          splitLine: {
            lineStyle: {
              color: [
                'rgba(238, 197, 102, 0.3)',
                'rgba(238, 197, 102, 0.5)',
                'rgba(238, 197, 102, 0.7)',
                'rgba(238, 197, 102, 0.8)',
                'rgba(238, 197, 102, 0.9)',
                'rgba(238, 197, 102, 1)',
              ].reverse(),
            },
          },
          splitArea: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(238, 197, 102, 0.5)',
            },
          },
        },
        series: [
          {
            name: '能力评估',
            type: 'radar',
            lineStyle: { width: 1, opacity: 0.8 },
            data: [data],
            symbol: 'none',
            itemStyle: {
              color: '#F9713C',
            },
            areaStyle: {
              opacity: 0.5,
            },
          },
        ],
      });
    },
    chartInstance,
    [darkMode, data]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default Appraise;