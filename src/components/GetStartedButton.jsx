export default function GetStartedButton({ openAuthRequest, type }) {
  return (
    <button
      className={`btn btn-outline-primary ${type === 'small' ? '' : 'btn-lg mt-4'}`}
      type="button"
      onClick={openAuthRequest}
    >
      Get Started
    </button>
  );
}
