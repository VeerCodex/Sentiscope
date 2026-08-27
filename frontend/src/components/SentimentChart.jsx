import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SentimentChart({ summary }) {
  const { theme } = useTheme();
  if (!summary) return null;

  const trends = summary.sentiment_trends || [];
  const { positive_count = 0, neutral_count = 0, negative_count = 0 } = summary;

  // Dynamic Theme Colors
  const isDark = theme === 'dark';
  const posColor = isDark ? '#81C995' : '#34A853';
  const neuColor = isDark ? '#FDD663' : '#FBBC05';
  const negColor = isDark ? '#F28B82' : '#EA4335';
  const textColor = isDark ? '#9AA0A6' : '#5F6368';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const tooltipBg = isDark ? '#303134' : '#FFFFFF';
  const tooltipText = isDark ? '#E8EAED' : '#202124';

  // 1. Line Chart Data (Sentiment Trends Over Time)
  const lineLabels = trends.map(t => t.date.slice(5)); // MM-DD
  const lineData = {
    labels: lineLabels.length > 0 ? lineLabels : ['No Data'],
    datasets: [
      {
        label: 'Positive',
        data: trends.map(t => t.positive),
        borderColor: posColor,
        backgroundColor: isDark ? 'rgba(129, 201, 149, 0.10)' : 'rgba(52, 168, 83, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: posColor,
        pointRadius: 3,
      },
      {
        label: 'Neutral',
        data: trends.map(t => t.neutral),
        borderColor: neuColor,
        backgroundColor: isDark ? 'rgba(253, 214, 99, 0.10)' : 'rgba(251, 188, 5, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: neuColor,
        pointRadius: 3,
      },
      {
        label: 'Negative',
        data: trends.map(t => t.negative),
        borderColor: negColor,
        backgroundColor: isDark ? 'rgba(242, 139, 130, 0.10)' : 'rgba(234, 67, 53, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: negColor,
        pointRadius: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          boxWidth: 12,
          usePointStyle: true,
          font: { family: 'Roboto Flex', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: textColor,
        borderColor: isDark ? '#3C4043' : '#E0E2E6',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { color: gridColor, drawBorder: false },
        ticks: { color: textColor, font: { family: 'Roboto Mono', size: 11 } }
      },
      y: {
        grid: { color: gridColor, drawBorder: false },
        ticks: { color: textColor, stepSize: 1, font: { family: 'Roboto Mono', size: 11 } },
        beginAtZero: true,
      }
    }
  };

  // 2. Doughnut Chart Data (Overall Distribution)
  const doughnutData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [positive_count, neutral_count, negative_count],
        backgroundColor: [posColor, neuColor, negColor],
        borderColor: isDark ? '#292A2D' : '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          boxWidth: 12,
          usePointStyle: true,
          font: { family: 'Roboto Flex', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: textColor,
        borderColor: isDark ? '#3C4043' : '#E0E2E6',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Sentiment Trend Timeline (2 Cols) */}
      <div className="lg:col-span-2 md-card p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand" />
              <h3 className="font-bold text-text-primary text-base font-display">Sentiment Trends Over Time</h3>
            </div>
            <p className="text-xs text-text-secondary mt-0.5 font-sans">Daily volume of positive, neutral, and negative feedback</p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-surface-variant text-text-secondary border border-border">
            Last 30 Days
          </span>
        </div>
        <div className="h-64 sm:h-72 w-full">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Sentiment Distribution Donut (1 Col) */}
      <div className="md-card p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-brand" />
              <h3 className="font-bold text-text-primary text-base font-display">Sentiment Share</h3>
            </div>
            <p className="text-xs text-text-secondary mt-0.5 font-sans">Overall category breakdown</p>
          </div>
        </div>
        
        <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          {/* Centered Total in Roboto Mono */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold font-mono text-text-primary">{summary.total_feedback}</span>
            <span className="text-[11px] text-text-tertiary font-sans">Total</span>
          </div>
        </div>
      </div>

    </div>
  );
}
