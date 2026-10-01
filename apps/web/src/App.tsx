import { useState } from 'react';
import { KnowledgeScreen } from './ui/KnowledgeScreen';
import { MissionScreen } from './ui/MissionScreen';

type View = 'mission' | 'law';

/**
 * Two views for now: the mission and the legislation behind it. The mission stays mounted
 * while you read the law, so checking an article mid-mission never loses your place.
 */
export function App() {
  const [view, setView] = useState<View>('mission');
  const [focusStage, setFocusStage] = useState<string | undefined>();

  return (
    <>
      <nav className="nav" aria-label="Main">
        <span className="nav__brand">Public Service Academy</span>
        <button
          type="button"
          className="nav__tab"
          aria-current={view === 'mission' ? 'page' : undefined}
          onClick={() => setView('mission')}
        >
          Mission
        </button>
        <button
          type="button"
          className="nav__tab"
          aria-current={view === 'law' ? 'page' : undefined}
          onClick={() => {
            setFocusStage(undefined);
            setView('law');
          }}
        >
          Legislation &amp; process
        </button>
      </nav>

      <div hidden={view !== 'mission'}>
        <MissionScreen
          onOpenStage={(stageId) => {
            setFocusStage(stageId);
            setView('law');
          }}
        />
      </div>
      {view === 'law' && <KnowledgeScreen focusStage={focusStage} />}
    </>
  );
}
