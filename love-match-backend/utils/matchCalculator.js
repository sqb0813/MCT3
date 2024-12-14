exports.calculateMatchScore = (person1, person2) => {
  let score = 0;
  let analysis = [];
  let suggestions = [];
  
  // 1. 年龄差异评分 (30分)
  const ageDiff = Math.abs(person1.age - person2.age);
  if (ageDiff <= 5) {
    score += 30;
    analysis.push('你们的年龄非常般配');
  } else if (ageDiff <= 10) {
    score += 20;
    analysis.push('你们的年龄差距适中');
  } else {
    score += 10;
    analysis.push('你们的年龄差距较大，需要更多理解和包容');
  }
  
  // 2. 性格互补评分 (40分)
  const p1Personalities = new Set(person1.personality);
  const p2Personalities = new Set(person2.personality);
  
  // 计算性格重合度
  const commonPersonalities = [...p1Personalities].filter(x => p2Personalities.has(x));
  const complementaryScore = calculateComplementaryScore(person1.personality, person2.personality);
  score += complementaryScore;
  
  if (complementaryScore >= 30) {
    analysis.push('你们的性格高度互补，能够很好地互相理解和支持');
  } else if (complementaryScore >= 20) {
    analysis.push('你们的性格基本互补，有一定的默契度');
  } else {
    analysis.push('你们的性格差异较大，需要更多的沟通和理解');
    suggestions.push('建议多进行深入交流，了解对方的想法和需求');
  }
  
  // 3. 兴趣爱好匹配 (20分)
  const commonHobbies = person1.hobbies.filter(h => person2.hobbies.includes(h));
  const hobbyScore = Math.min(commonHobbies.length * 5, 20);
  score += hobbyScore;
  
  if (hobbyScore >= 15) {
    analysis.push('你们有很多共同的兴趣爱好，可以一起享受美好时光');
  } else if (hobbyScore >= 10) {
    analysis.push('你们有一些共同的兴趣，可以一起发展新的爱好');
  } else {
    analysis.push('你们的兴趣爱好较少重叠，可以互相学习对方的兴趣');
    suggestions.push('建议尝试体验对方的兴趣爱好，扩展共同话题');
  }
  
  // 4. 价值观匹配 (10分)
  if (person1.values === person2.values) {
    score += 10;
    analysis.push('你们的价值观非常一致，这是维系长久关系的重要基础');
  } else if (
    (person1.values === 'balance' && person2.values !== 'balance') ||
    (person2.values === 'balance' && person1.values !== 'balance')
  ) {
    score += 5;
    analysis.push('你们的价值观有一定差异，但都可以相互理解和调和');
    suggestions.push('建议就未来规划进行更多沟通，找到���衡点');
  } else {
    analysis.push('你们在价值观方面存在较大差异，需要更多的包容和理解');
    suggestions.push('建议深入交流彼此的人生规划，寻找共同发展的方向');
  }
  
  return {
    score,
    analysis: analysis.join('。'),
    suggestions: suggestions.join('。')
  };
};

function calculateComplementaryScore(p1Personality, p2Personality) {
  let score = 0;
  
  // 外向+内向配对
  if (
    (p1Personality.includes('outgoing') && p2Personality.includes('introvert')) ||
    (p1Personality.includes('introvert') && p2Personality.includes('outgoing'))
  ) {
    score += 15;
  }
  
  // 理性+感性配对
  if (
    (p1Personality.includes('rational') && p2Personality.includes('emotional')) ||
    (p1Personality.includes('emotional') && p2Personality.includes('rational'))
  ) {
    score += 15;
  }
  
  // 条理性+灵活性配对
  if (
    (p1Personality.includes('organized') && p2Personality.includes('flexible')) ||
    (p1Personality.includes('flexible') && p2Personality.includes('organized'))
  ) {
    score += 10;
  }
  
  return score;
} 