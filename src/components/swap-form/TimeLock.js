export default function TimeLock({ startHeight, blockHeight }) {
  const endHeight = startHeight + 100;
  const now = Math.min(endHeight, blockHeight);

  return (
    <div className="mt-4">
      <div className="progress">
        <div
          className={`progress-bar ${blockHeight > startHeight + 100 ? 'bg-danger' : ''}`}
          role="progressbar"
          style={{
            width: `${(now * 100) / endHeight}%`,
          }}
          aria-valuenow={now}
          aria-valuemin={startHeight}
          aria-valuemax={endHeight}
        ></div>
      </div>
      <small>swap cancelable after 100 blocks</small>
    </div>
  );
}
