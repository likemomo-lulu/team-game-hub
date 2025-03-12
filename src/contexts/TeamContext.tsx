import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Team {
  id: string;
  name: string;
  avatar: string;
  scores: {
    'guess-word': number;
    'add-word': number;
    [key: string]: number;
  };
}

interface TeamContextType {
  teams: Team[];
  addTeam: (team: Omit<Team, 'id' | 'scores'>) => void;
  removeTeam: (id: string) => void;
  updateTeamScore: (teamId: string, gameId: string, score: number) => void;
  incrementTeamScore: (teamId: string, gameId: string, increment: number) => void;
  resetTeams: () => void;
  getTotalScore: (team: Team) => number;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

interface TeamProviderProps {
  children: ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const getTotalScore = (team: Team): number => {
    return Object.values(team.scores).reduce((total, score) => total + score, 0);
  };

  const [teams, setTeams] = useState<Team[]>(() => {
    // 从localStorage加载初始数据
    const savedTeams = localStorage.getItem('teams');
    return savedTeams ? JSON.parse(savedTeams) : [];
  });

  const addTeam = (team: Omit<Team, 'id' | 'scores'>) => {
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
      scores: {
        'guess-word': 0,
        'add-word': 0,
      },
    };
    setTeams((prev) => [...prev, newTeam]);
  };

  const removeTeam = (id: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== id));
  };

  const updateTeamScore = (teamId: string, gameId: string, score: number) => {
    setTeams((prev) =>
      prev.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            scores: {
              ...team.scores,
              [gameId]: score,
            },
          };
        }
        return team;
      })
    );
  };

  const incrementTeamScore = (teamId: string, gameId: string, increment: number) => {
    setTeams((prev) =>
      prev.map((team) => {
        if (team.id === teamId) {
          const currentScore = team.scores[gameId] || 0;
          return {
            ...team,
            scores: {
              ...team.scores,
              [gameId]: currentScore + increment,
            },
          };
        }
        return team;
      })
    );
  };

  const resetTeams = () => {
    setTeams([]);
  };
  
  // 当teams状态变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  return (
    <TeamContext.Provider
      value={{
        teams,
        addTeam,
        removeTeam,
        updateTeamScore,
        incrementTeamScore,
        resetTeams,
        getTotalScore,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};