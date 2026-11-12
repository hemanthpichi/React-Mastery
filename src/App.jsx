import { useState } from 'react';
import { WorkspaceContext } from './context/WorkspaceContext';
import ProjectCard from './components/ProjectCard';
import DashboardSection from './components/DashboardSection';

export default function App() {
  const [accentColor, setAccentColor] = useState('#00adb5');
  
  const targetDatabase = [
    { id: 'srv-01', title: "React Mastery Engine", version: "1.0.0", isProd: true },
    { id: 'srv-02', title: "Telemetry Analytics Module", version: "0.4.2", isProd: false }
  ];

  const globalConfig = {
    color: accentColor,
    accessRole: "System Administrator"
  };

  return (
    <WorkspaceContext.Provider value={globalConfig}>
      <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', color: '#fff', background: '#111', minHeight: '100vh' }}>
        <h1>Workspace Control Console</h1>
        <p>Active System Role: <strong style={{ color: accentColor }}>{globalConfig.accessRole}</strong></p>
        
        <button 
          onClick={() => setAccentColor(prev => prev === '#00adb5' ? '#ff4444' : '#00adb5')}
          style={{ padding: '8px 12px', cursor: 'pointer', marginBottom: '20px', background: accentColor, color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          🔄 Toggle Global System Theme
        </button>

        <DashboardSection sectionTitle="Active Microservices Core">
          {targetDatabase.map((project) => (
            <ProjectCard 
              key={project.id} 
              name={project.title} 
              version={project.version} 
              isProduction={project.isProd} 
            />
          ))}
        </DashboardSection>
      </div>
    </WorkspaceContext.Provider>
  );
}
