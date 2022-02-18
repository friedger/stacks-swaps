import Price from './Price';
import Fees from './swap-form/Fees';
import FormButton from './swap-form/FormButton';
import TimeLock from './swap-form/TimeLock';
import User from './swap-form/User';
import Asset from './swap-form/Asset';

export default function SwapForm({
  atomicSwap,
  swapId,
  done,
  buyer,
  assetInEscrow,
  assetInEscrowUrl,
  seller,
  assetForSale,
  assetForSaleUrl,
  showPrice,
  when,
  blockHeight,
  showFees,
  feeOptions,
  feeId,
  feeReceiver,
  onFormUpdate,
  action,
  onAction,
  loading,
  status,
  ownerStxAddress,
}) {
  console.log({ assetForSale, assetInEscrow });
  return (
    <form>
      <div className="container">
        <div className="row align-items-center mt-5">
          <div className="col text-center">
            <User
              user={buyer}
              title="Buyer"
              isOwner={buyer.address === ownerStxAddress}
              addressProperty={atomicSwap ? 'buyerAddress' : 'buyerBtcAddress'}
              disabled={done || swapId || atomicSwap}
              onFormUpdate={onFormUpdate}
              inputOfBtcAddress={!atomicSwap}
            />
          </div>
          <div className="col text-center border-left">
            <div className="p-2 m-2">
              <Asset
                asset={assetForSale}
                assetUrl={assetForSaleUrl}
                numberProperty="amountOrIdForSale"
                onFormUpdate={onFormUpdate}
                readOnly={swapId}
              />
            </div>
            <div className="mb-5">
              <i className="bi bi-arrow-left"></i>
            </div>
          </div>
          <div className="col text-center border-left">
            <User
              user={seller}
              title="Seller"
              isOwner={seller.address === ownerStxAddress}
              addressProperty="sellerAddress"
              disabled={done || swapId}
              onFormUpdate={onFormUpdate}
              inputOfBtcAddress={false}
            />
          </div>
        </div>
      </div>
      <div className="row align-items-center mb-5">
        <div className="col text-right border-left">
          <i className="bi bi-arrow-down-right"></i>
        </div>
        <div className="col text-center border-left">
          {!assetForSale.isNFT && !assetInEscrow.isNFT && (
            <>
              <Price sell={assetForSale} buy={assetInEscrow} editablePrice={false} />
              <hr />
              <Price sell={assetInEscrow} buy={assetForSale} editablePrice={false} />
              <br />
            </>
          )}
          <div className="p-2 m-2">
            <Asset
              assetUrl={assetInEscrowUrl}
              asset={assetInEscrow}
              numberProperty="amountOrIdInEscrow"
              onFormUpdate={onFormUpdate}
              readOnly={swapId}
            />
            {when && blockHeight && !done && (
              <TimeLock startHeight={when} blockHeight={blockHeight} />
            )}
          </div>
        </div>
        <div className="col text-left border-left">
          <i className="bi bi-arrow-up-right"></i>
        </div>
      </div>

      {status && (
        <div className="row align-items-center">
          <div className="col text-center alert">{status}</div>
        </div>
      )}
      {showFees && (
        // fees
        <div className="row m-2">
          <div className="col" />
          <div className="col text-center">
            <Fees feeOptions={feeOptions} feeId={feeId} disabled={swapId} />
          </div>
          <div className="col" />
        </div>
      )}
      <div className="row m-2">
        <div className="col-12 text-center">
          <FormButton action={action} onAction={onAction} loading={loading} />
        </div>
      </div>
    </form>
  );
}
