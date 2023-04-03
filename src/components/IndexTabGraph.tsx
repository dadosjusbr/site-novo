import { useRef, useEffect } from 'react';
import * as Plot from '@observablehq/plot';
import styled from 'styled-components';
import { useMediaQuery } from '@mui/material';
import { formatAgency } from '../functions/format';

export default function IndexTabGraph({ plotData }) {
  const ref = useRef(null);
  const isMobile = useMediaQuery('(max-width: 900px)');

  useEffect(() => {
    const data = plotData.map((item: any) => ({
      nome: formatAgency(item.id_orgao).toUpperCase(),
      facilidade: item.agregado.indice_facilidade,
      completude: item.agregado.indice_completude,
      transparencia: item.agregado.indice_transparencia,
    }));

    const barChart = Plot.plot({
      grid: true,
      width: 1000,
      height: !isMobile ? 800 : 1300,
      margin: !isMobile ? 55 : 65,
      y: {
        label: '',
      },
      x: {
        label: 'PONTUAÇÃO',
        domain: [0, 1],
        tickFormat: d => `${d}`.replace('.', ','),
      },
      style: {
        color: '#3e5363',
        background: '#f5f5f5',
        fontSize: !isMobile ? '14px' : '20px',
        fontWeight: 'bold',
        fontFamily: 'Roboto Condensed, sans-serif',
      },
      marks: [
        Plot.link(data, {
          x1: 'facilidade',
          x2: 'completude',
          y: 'nome',
        }),
        Plot.dot(data, {
          x: 'completude',
          y: 'nome',
          r: !isMobile ? 6 : 10,
          fill: '#f2ca4b',
          stroke: '#3e5363',
          strokeWidth: 1,
        }),
        Plot.dot(data, {
          x: 'facilidade',
          y: 'nome',
          r: !isMobile ? 6 : 10,
          fill: '#7f3d8b',
          stroke: '#3e5363',
          strokeWidth: 1,
        }),
        Plot.dot(data, {
          x: 'transparencia',
          y: 'nome',
          r: 1.5,
          fill: 'black',
        }),
        Plot.dot(data, {
          x: 'transparencia',
          y: 'nome',
          r: !isMobile ? 10 : 16,
          fill: '#3edbb1',
          opacity: 0.65,
        }),
      ],
    });

    ref.current.append(barChart);

    return () => barChart.remove();
  }, []);

  return <Div ref={ref} />;
}

const Div = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;