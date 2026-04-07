interface Props {
  currentIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  isFinished: boolean;
  speed: number;
  description: string;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEEDS = [0.5, 1, 2, 4];

export default function PlaybackBar({
  currentIndex,
  totalSteps,
  isPlaying,
  isFinished,
  speed,
  description,
  onPlay,
  onPause,
  onReplay,
  onStepForward,
  onStepBackward,
  onSpeedChange,
}: Props) {
  const progress = totalSteps > 1 ? (currentIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div>
      <div className="step-description">{description || 'Ready to start...'}</div>
      <div className="playback-bar">
        <button className="playback-btn" onClick={onStepBackward} title="Step Backward">
          ⏮
        </button>

        {isFinished ? (
          <button className="playback-btn" onClick={onReplay} title="Replay">
            ↺
          </button>
        ) : isPlaying ? (
          <button className="playback-btn" onClick={onPause} title="Pause">
            ⏸
          </button>
        ) : (
          <button className="playback-btn" onClick={onPlay} title="Play">
            ▶
          </button>
        )}

        <button className="playback-btn" onClick={onStepForward} title="Step Forward">
          ⏭
        </button>

        <div className="playback-progress">
          <div className="playback-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <span className="playback-step-info">
          Step {currentIndex + 1} of {totalSteps}
        </span>

        <div className="speed-selector">
          {SPEEDS.map((s) => (
            <button
              key={s}
              className={`speed-btn ${speed === s ? 'active' : ''}`}
              onClick={() => onSpeedChange(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
