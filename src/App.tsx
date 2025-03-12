import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import 'antd/dist/reset.css';
import { TeamProvider } from './contexts/TeamContext';
import { migrateTeamData } from './utils/teamDataMigration';

const App: React.FC = () => {
  // 应用启动时执行数据迁移
  useEffect(() => {
    migrateTeamData();
  }, []);
  
  return (
    <TeamProvider>
      <RouterProvider router={router} />
    </TeamProvider>
  );
};

export default App;
