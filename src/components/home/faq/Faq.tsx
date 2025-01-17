import FaqItem from './FaqItem';

const Faq = () => {
  return (
    <div className="w-full mt-[120px] mb-[184px]">
      <h1 className="text-[28px] leading-[33px] font-medium text-center">FAQ</h1>
      <div className="mt-10 w-full flex flex-col gap-3">
        <FaqItem title="What can go wrong with catamaran swaps (BTC - sBTC)?">
          Even with fast bitcoin blocks (flash blocks), the catamaran swaps can be verified on the
          Stacks blockchain. However, bitcoin transactions with more than 8 inputs or 8 outputs
          can't be verified.
        </FaqItem>
        <FaqItem title="Where can I find more details about the used smart contracts?">
          The smart contracts are open source and contains several tests. You find the git repo at{' '}
          <a href="https://github.com/friedger/clarity-catamaranswaps" className="text-blue-500">
            github.com/friedger/clarity-catamaranswaps
          </a>
          .
        </FaqItem>
        <FaqItem title="What was the first swap?">
          Read about the first swap of an NFT on Stacks for Bitcoins{' '}
          <a
            href="https://app.sigle.io/friedger.id/A-l0d8h0Bq7uEGTWl004B"
            className="text-blue-500"
          >
            here.
          </a>
        </FaqItem>
      </div>
    </div>
  );
};

export default Faq;
