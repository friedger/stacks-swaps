import { GridOfSwaps } from '../pages/Intro';

export function SwapPathNotFound({ swapPath, trait }) {
  return (
    <>
      <div>
        <img className="rounded mx-auto d-block" src="/404.png" alt="not found" />
      </div>
      <div className="mx-auto text-center">
        <b>{swapPath}</b> is not supported. Try some of the following:
      </div>
      <GridOfSwaps />
    </>
  );
}
