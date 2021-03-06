import { STACK_API_URL, mainnet } from '../lib/constants';
export function Network() {
  return (
    <div
      className={`rounded border-secondary d-flex justify-content-around my-1 px-2 ${
        mainnet ? 'bg-primary' : 'bg-secondary'
      }`}
      title={STACK_API_URL}
    >
      mainnet
    </div>
  );
}
