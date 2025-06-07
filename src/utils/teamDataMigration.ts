/**
 * 团队数据迁移工具
 * 用于修复localStorage中可能存在的团队数据结构问题
 */

export const migrateTeamData = (): void => {
  try {
    // 从localStorage获取团队数据
    const teamsJson = localStorage.getItem('teams');
    if (!teamsJson) return;
    
    const teams = JSON.parse(teamsJson);
    if (!Array.isArray(teams)) return;
    
    // 检查每个团队对象，确保scores对象存在且包含必要的游戏分数属性
    const migratedTeams = teams.map(team => {
      // 确保team是一个对象
      if (typeof team !== 'object' || team === null) {
        return {
          id: Date.now().toString(),
          name: '未命名团队',
          avatar: `https://source.unsplash.com/random/100x100/?team&sig=${Date.now()}`,
          scores: {}
        };
      }
      
      // 确保scores对象存在
      if (!team.scores || typeof team.scores !== 'object') {
        team.scores = {};
      }
      
      return team;
    });
    
    // 将修复后的数据保存回localStorage
    localStorage.setItem('teams', JSON.stringify(migratedTeams));
    console.log('团队数据迁移完成');
  } catch (error) {
    console.error('团队数据迁移失败:', error);
  }
};