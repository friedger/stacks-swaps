export default function FormButton({ action, onAction, loading }) {
  return (
    <button
      className="btn btn-block btn-primary"
      type="button"
      disabled={!onAction}
      onClick={onAction}
    >
      <div
        role="status"
        className={`${
          loading ? '' : 'd-none'
        } spinner-border spinner-border-sm text-info align-text-top mr-2`}
      />
      {action}
    </button>
  );
}
