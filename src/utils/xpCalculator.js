/**
 * XP Calculator Utility
 * Formula: level = floor(0.1 × √xp)
 */

const calculateLevel = (xp) => {
    if (xp < 0) return 0;
    return Math.floor(0.1 * Math.sqrt(xp));
};

const getXpForLevel = (level) => {
    if (level <= 0) return 0;
    return Math.pow(level / 0.1, 2);
};

const getXpProgress = (xp) => {
    const currentLevel = calculateLevel(xp);
    const currentLevelXp = getXpForLevel(currentLevel);
    const nextLevelXp = getXpForLevel(currentLevel + 1);
    
    const xpInCurrentLevel = xp - currentLevelXp;
    const xpNeededForNext = nextLevelXp - currentLevelXp;
    const progressPercent = Math.round((xpInCurrentLevel / xpNeededForNext) * 100);
    
    return {
        currentLevel,
        currentXp: xp,
        xpInCurrentLevel: Math.round(xpInCurrentLevel),
        xpNeededForNext: Math.round(xpNeededForNext),
        progressPercent: Math.min(progressPercent, 100),
        nextLevelXp: Math.round(nextLevelXp)
    };
};

const getLevelTitle = (level) => {
    const titles = [
        'Newbie',
        'Apprentice',
        'Junior',
        'Developer',
        'Senior',
        'Expert',
        'Master',
        'Grandmaster',
        'Legend',
        'Mythic'
    ];
    
    if (level >= titles.length) {
        return `Mythic ${level - titles.length + 1}`;
    }
    return titles[level];
};

module.exports = {
    calculateLevel,
    getXpForLevel,
    getXpProgress,
    getLevelTitle
};
