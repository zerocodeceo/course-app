// Calculate days passed since a reference date
const getDaysPassed = (referenceDate: string = '2024-11-25') => {
  const start = new Date(referenceDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Generate a consistent random number for a specific date
const getRandomForDate = (min: number, max: number, seed: number) => {
  // Simple seeded random number generator
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return Math.floor(random * (max - min + 1)) + min;
};

type ChartDataPoint = {
  time: string;
  members: number;
}

export const calculateStats = (baseStats: {
  totalVisitors: number;
  totalMembers: number;
  totalRevenue: number;
  memberGrowth?: {
    labels: string[];
    data: number[];
  };
}) => {
  const daysPassed = getDaysPassed();
  
  // Calculate daily increases using the day number as seed
  let additionalVisitors = 0;
  let additionalMembers = 0;
  
  // Store daily member counts for the chart
  const dailyGrowth: ChartDataPoint[] = [];
  
  // For the chart, start from a lower number and grow linearly
  const initialMembers = 5; // Start with 5 members
  const daysToShow = 30;
  const startDay = Math.max(1, daysPassed - daysToShow);
  
  // Calculate total growth for real stats
  for (let day = 1; day <= daysPassed; day++) {
    const dailyVisitors = getRandomForDate(3, 13, day);
    const dailyMembers = getRandomForDate(1, 3, day);
    additionalVisitors += dailyVisitors;
    additionalMembers += dailyMembers;
  }

  // Generate chart data separately with linear growth
  for (let day = 1; day <= daysPassed; day++) {
    if (day > startDay) {
      const date = new Date('2024-11-25');
      date.setDate(date.getDate() + day - 1);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      // Calculate a smooth progression from initial members to total members
      const progress = (day - 1) / daysPassed;
      const currentMembers = Math.round(
        initialMembers + (baseStats.totalMembers + additionalMembers - initialMembers) * progress
      );
      
      dailyGrowth.push({
        time: formattedDate,
        members: currentMembers
      });
    }
  }

  const baseVisitors = baseStats.totalVisitors + 251;
  const totalVisitors = baseVisitors + additionalVisitors;
  const totalMembers = baseStats.totalMembers + additionalMembers;
  const totalRevenue = totalMembers * 29.99;

  return {
    totalVisitors,
    totalMembers,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    chartData: dailyGrowth
  };
}; 