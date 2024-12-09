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

export const calculateStats = (baseStats: {
  totalVisitors: number;
  totalMembers: number;
  totalRevenue: number;
}) => {
  const daysPassed = getDaysPassed();
  
  // Calculate daily increases using the day number as seed
  let additionalVisitors = 0;
  let additionalMembers = 0;
  
  // Calculate cumulative increases for each day
  for (let day = 1; day <= daysPassed; day++) {
    additionalVisitors += getRandomForDate(8, 19, day);
    additionalMembers += getRandomForDate(2, 5, day);
  }

  const baseVisitors = baseStats.totalVisitors + 251;
  const totalVisitors = baseVisitors + additionalVisitors;
  const totalMembers = baseStats.totalMembers + additionalMembers;
  const totalRevenue = totalMembers * 29.99;

  return {
    totalVisitors,
    totalMembers,
    totalRevenue: Math.round(totalRevenue * 100) / 100
  };
}; 