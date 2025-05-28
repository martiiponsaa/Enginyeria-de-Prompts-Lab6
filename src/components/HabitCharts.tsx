import React, { useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { formatDistance, subDays, format } from 'date-fns';
import { Habit } from '../models/Habit';
import { UserProgress, HabitStats } from '../models/Progress';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface HabitChartsProps {
  habits: Habit[];
  userProgress: UserProgress;
  selectedHabitId?: string;
  period?: 'week' | 'month' | 'year';
}

const HabitCharts: React.FC<HabitChartsProps> = ({ 
  habits, 
  userProgress, 
  selectedHabitId = 'all', 
  period = 'week' 
}) => {
  // Generate dates for the selected period
  const getDatesForPeriod = (): Date[] => {
    const dates = [];
    const today = new Date();
    
    let daysToShow = 7; // default for week
    if (period === 'month') daysToShow = 30;
    if (period === 'year') daysToShow = 365;
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      dates.push(subDays(today, i));
    }
    
    return dates;
  };
  
  const dates = getDatesForPeriod();
  
  // Prepare data for streak chart (line chart)
  const getStreakChartData = () => {
    if (selectedHabitId === 'all') {
      // For all habits, show average streak
      const data = dates.map(date => {
        const dateString = format(date, 'yyyy-MM-dd');
        const avgStreak = habits.reduce((acc, habit) => {
          const stat = userProgress.habitStats[habit.id];
          if (!stat) return acc;
          
          return acc + (stat.streak || 0);
        }, 0) / (habits.length || 1);
        
        return { date, value: Number(avgStreak.toFixed(1)) };
      });
      
      return {
        labels: data.map(d => format(d.date, 'MMM d')),
        datasets: [
          {
            label: 'Average Streak',
            data: data.map(d => d.value),
            fill: false,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }
        ]
      };
    } else {
      // For a specific habit
      const habitStat = userProgress.habitStats[selectedHabitId];
      if (!habitStat) return { labels: [], datasets: [] };
      
      const habitName = habits.find(h => h.id === selectedHabitId)?.name || 'Selected Habit';
      
      return {
        labels: dates.map(date => format(date, 'MMM d')),
        datasets: [
          {
            label: `${habitName} Streak`,
            data: dates.map(() => habitStat.streak || 0), // Show current streak for all dates
            fill: false,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }
        ]
      };
    }
  };
  
  // Prepare data for completions chart (bar chart)
  const getCompletionsChartData = () => {
    if (selectedHabitId === 'all') {
      // For all habits, show completions per day
      const data = dates.map(date => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        
        // Count completions on this date across all habits
        let completions = 0;
        
        Object.values(userProgress.habitStats).forEach(stat => {
          stat.completionDates.forEach(completionDate => {
            const formattedCompletionDate = format(completionDate, 'yyyy-MM-dd');
            if (formattedCompletionDate === formattedDate) {
              completions += 1;
            }
          });
        });
        
        return { date, completions };
      });
      
      return {
        labels: data.map(d => format(d.date, 'MMM d')),
        datasets: [
          {
            label: 'Daily Completions',
            data: data.map(d => d.completions),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      };
    } else {
      // For a specific habit
      const habitStat = userProgress.habitStats[selectedHabitId];
      if (!habitStat) return { labels: [], datasets: [] };
      
      const habitName = habits.find(h => h.id === selectedHabitId)?.name || 'Selected Habit';
      
      const data = dates.map(date => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        
        // Count completions on this date for this habit
        const completions = habitStat.completionDates.filter(completionDate => {
          const formattedCompletionDate = format(completionDate, 'yyyy-MM-dd');
          return formattedCompletionDate === formattedDate;
        }).length;
        
        return { date, completions };
      });
      
      return {
        labels: data.map(d => format(d.date, 'MMM d')),
        datasets: [
          {
            label: `${habitName} Completions`,
            data: data.map(d => d.completions),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      };
    }
  };
  
  // Prepare data for habit distribution chart (pie chart)
  const getHabitDistributionData = () => {
    const habitData = habits.map(habit => {
      const habitStat = userProgress.habitStats[habit.id] || { totalCompletions: 0 };
      return {
        name: habit.name,
        completions: habitStat.totalCompletions || 0,
        color: habit.color || '#4CAF50'
      };
    }).sort((a, b) => b.completions - a.completions);
    
    return {
      labels: habitData.map(h => h.name),
      datasets: [
        {
          data: habitData.map(h => h.completions),
          backgroundColor: habitData.map(h => h.color),
          borderColor: habitData.map(h => h.color),
          borderWidth: 1
        }
      ]
    };
  };
  
  const streakChartData = getStreakChartData();
  const completionsChartData = getCompletionsChartData();
  const distributionChartData = getHabitDistributionData();
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  // Only show Habit Distribution chart when viewing all habits
  return (
    <div className="habit-charts">
      <div className="chart-container streak-chart">
        <h3>Streak Progress</h3>
        {streakChartData.labels.length > 0 ? (
          <div className="chart-wrapper">
            <Line data={streakChartData} options={chartOptions} />
          </div>
        ) : (
          <p className="no-data">No streak data available.</p>
        )}
      </div>
      
      <div className="chart-container completions-chart">
        <h3>Completion History</h3>
        {completionsChartData.labels.length > 0 ? (
          <div className="chart-wrapper">
            <Bar data={completionsChartData} options={chartOptions} />
          </div>
        ) : (
          <p className="no-data">No completion data available.</p>
        )}
      </div>
      
      {selectedHabitId === 'all' && (
        <div className="chart-container distribution-chart">
          <h3>Habit Distribution</h3>
          {distributionChartData.labels.length > 0 && distributionChartData.datasets[0].data.some(d => d > 0) ? (
            <div className="chart-wrapper pie-wrapper">
              <Pie data={distributionChartData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    position: 'right' as const
                  }
                }
              }} />
            </div>
          ) : (
            <p className="no-data">No habit data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HabitCharts;
