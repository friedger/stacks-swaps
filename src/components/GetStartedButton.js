export function GetStartedButton({ handleSignIn, type }) {
  return (
    <button
      className={`btn btn-outline-primary ${type === 'small' ? '' : 'btn-lg mt-4'}`}
      type="button"
      onClick={handleSignIn}
    >
      Get Started
    </button>
  );
}
