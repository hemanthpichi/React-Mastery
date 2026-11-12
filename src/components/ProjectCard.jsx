import { useState, useEffect, useRef, useContext, useReducer, useMemo, useCallback } from 'react';
import { WorkspaceContext } from '../context/WorkspaceContext';
import { useToggle } from '../hooks/useToggle';


function buildReducer(currentBuilds, action) {
  if (action.type === 'RUN_BUILD') {
    return currentBuilds + action.payload;
  }
  if (action.type === 'RESET_BUILDS') {
    return 0;
  }
  return currentBuilds;
}


export default function ProjectCard({ name, version, isProduction }) {
  // Hook 1: Local State Snapshots
  const [isPinned, setIsPinned] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [inputName, setInputName] = useState('Default Operator');

  // Hook 2: Network Sync State
  const [apiAsset, setApiAsset] = useState("Awaiting stream synchronization...");

  // Hook 3: Global Context Consumer Injection
  const config = useContext(WorkspaceContext);

  // Hook 4: Bypassing the Render Engine (Invisible interaction counter)
  const clickTracker = useRef(0);

  const [buildCount, dispatch] = useReducer(buildReducer, 0);

  // 1. useMemo: Only recalculates healthScore when buildCount changes
  const healthScore = useMemo(() => {
    console.log(`Calculating health score for ${name}...`);
    return Math.min(100, 70 + buildCount * 5);
  }, [buildCount, name]);

  // 2. useCallback: Remembers this function between re-renders
  const handleQuickBuild = useCallback(() => {
    dispatch({ type: 'RUN_BUILD', payload: 1 });
  }, []);

  const [showDetails, toggleDetails] = useToggle(false);

  // Hook 5: Asynchronous Synchronization Boundary
  useEffect(() => {
    fetch('https://fakestoreapi.com/products/1')
      .then(res => res.json())
      .then(data => {
        setApiAsset(data.title); // Updates the local view state block
      });

    return () => {
      console.log(`🧹 Tearing down sync socket channel for: ${name}`);
    };
  }, []);

  function handleClickBtn() {
    clickTracker.current += 1; // Direct mutation: No rendering cascade triggered!
    setEditing((prev) => !prev);
  }

  function handleInputBtn(event) {
    setInputName(event.target.value);
  }

  return (
    <div style={{ border: `1px solid ${config.color}`, padding: '15px', borderRadius: '6px', background: '#222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Project Cluster: {name}</h3>

        <button
          onClick={() => setIsPinned(prev => !prev)}
          style={{ background: isPinned ? config.color : 'transparent', color: '#fff', border: `1px solid ${config.color}`, padding: '4px 8px', cursor: 'pointer', borderRadius: '4px' }}
        >
          {isPinned ? '📌 Pinned Core' : '📍 Pin Core'}
        </button>
      </div>

      <p style={{ margin: '5px 0', fontSize: '14px', color: '#aaa' }}>Version Branch: {version} ({isProduction ? "Prod" : "Dev"})</p>
      <p style={{ margin: '5px 0', fontSize: '13px', color: '#4caf50' }}>📶 Live API Data Sync: <strong>{apiAsset}</strong></p>

      {/* Two-Way Data Controlled Loop Element */}
      <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isEditing ? (
          <input type='text' value={inputName} onChange={handleInputBtn} style={{ padding: '4px', background: '#333', color: '#fff', border: '1px solid #555' }} />
        ) : (
          <label style={{ fontSize: '14px' }}>Assigned To: <strong style={{ color: config.color }}>{inputName}</strong></label>
        )}

        <button type='button' onClick={handleClickBtn} style={{ cursor: 'pointer', padding: '4px 8px' }}>
          {isEditing ? 'Save Metrics' : 'Edit Manager'}
        </button>
      </div>

      <p style={{ fontSize: '11px', color: '#666', marginTop: '10px', marginBottom: '0' }}>
        ℹ️ Interaction Changes Logged (useRef Variable): {clickTracker.current}
      </p>

      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #333' }}>
        <span style={{ fontSize: '13px', marginRight: '10px' }}>
          🛠️ Builds: <strong>{buildCount}</strong> | 💚 Health: <strong>{healthScore}%</strong>
        </span>
        <button
          type="button"
          onClick={handleQuickBuild}
          style={{ marginRight: '6px', cursor: 'pointer', padding: '2px 8px' }}
        >
          +1 Build
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'RESET_BUILDS' })}
          style={{ cursor: 'pointer', padding: '2px 8px' }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginTop: '8px' }}>
        <button
          type="button"
          onClick={toggleDetails}
          style={{ cursor: 'pointer', padding: '2px 8px', fontSize: '12px' }}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && (
          <p style={{ fontSize: '12px', marginTop: '6px', color: '#aaa' }}>
            Environment: Production | Auto-deploy enabled
          </p>
        )}
      </div>

    </div>
  );
}
