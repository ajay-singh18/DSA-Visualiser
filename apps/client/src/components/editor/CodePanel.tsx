import Editor from '@monaco-editor/react';
import { useState } from 'react';

interface Props {
  languages?: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
  };
  currentLine?: number;
}

export default function CodePanel({ languages, currentLine }: Props) {
  const [lang, setLang] = useState<'cpp' | 'java' | 'python' | 'javascript'>('python');
  
  const code = languages ? languages[lang] : '// Select an algorithm and click Run';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="code-panel-tabs">
        <button className={`code-tab ${lang === 'cpp' ? 'active' : ''}`} onClick={() => setLang('cpp')}>
          C++
        </button>
        <button className={`code-tab ${lang === 'java' ? 'active' : ''}`} onClick={() => setLang('java')}>
          Java
        </button>
        <button className={`code-tab ${lang === 'python' ? 'active' : ''}`} onClick={() => setLang('python')}>
          Python
        </button>
        <button className={`code-tab ${lang === 'javascript' ? 'active' : ''}`} onClick={() => setLang('javascript')}>
          JavaScript
        </button>
      </div>
      <div className="code-editor-wrapper">
        <Editor
          height="100%"
          language={lang}
          value={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 22,
            padding: { top: 12 },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'none',
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
          onMount={(editor) => {
            if (currentLine) {
              editor.revealLineInCenter(currentLine);
              editor.deltaDecorations([], [
                {
                  range: { startLineNumber: currentLine, startColumn: 1, endLineNumber: currentLine, endColumn: 1 },
                  options: {
                    isWholeLine: true,
                    className: 'current-line-highlight',
                    glyphMarginClassName: 'current-line-glyph',
                  },
                },
              ]);
            }
          }}
        />
      </div>
    </div>
  );
}
