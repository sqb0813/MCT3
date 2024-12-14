// 计算匹配度的函数
export const calculateMatch = async (req, res) => {
  try {
    const { name1, name2, birthDate1, birthDate2 } = req.body;

    // 简单的匹配算法示例
    const matchScore = Math.floor(Math.random() * 100) + 1; // 1-100的随机数

    // 构造响应数据
    const result = {
      score: matchScore,
      names: {
        person1: name1,
        person2: name2
      },
      birthDates: {
        person1: birthDate1,
        person2: birthDate2
      },
      message: getMatchMessage(matchScore)
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: '计算匹配度时发生错误',
      details: error.message 
    });
  }
};

// 根据分数返回不同的匹配信息
function getMatchMessage(score) {
  if (score >= 90) {
    return "天生一对！你们的缘分简直是天注定的！";
  } else if (score >= 80) {
    return "非常般配！这段关系充满了美好的可能！";
  } else if (score >= 70) {
    return "很有潜力的一对！继续培养感情吧！";
  } else if (score >= 60) {
    return "还不错哦，可以多多了解对方！";
  } else if (score >= 40) {
    return "互相了解的过程可能需要更多耐心。";
  } else {
    return "缘分是可以培养的，不要轻易放弃！";
  }
} 