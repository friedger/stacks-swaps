import Price from './Price';
import AssetFT from './swap-form/AssetFT';
import AssetNFT from './swap-form/AssetNFT';
import Fees from './swap-form/Fees';
import FormButton from './swap-form/FormButton';
import TimeLock from './swap-form/TimeLock';
import User from './swap-form/User';

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
  return (
    <form>
      <div className="container">
        <div className="row align-items-center mt-5">
          <div className="col text-center">
            <User
              user={buyer}
              title="Buyer"
              addressProperty="btcRecipient"
              disabled={done || swapId}
              onChange={onFormUpdate}
              inputOfBtcAddress={!atomicSwap}
            />
          </div>
          <div className="col text-center border-left">
            <div className="border border-5 p-2 m-2 rounded">
              {assetForSale.isNFT ? (
                <AssetNFT
                  asset={assetForSale}
                  assetUrl={assetForSaleUrl}
                  nftIdProperty="nftId"
                  onFormUpdate={onFormUpdate}
                />
              ) : (
                <AssetFT asset={assetForSale} amountProperty="amount" onFormUpdate={onFormUpdate} />
              )}
            </div>
            <div className="mb-5">
              <i className="bi bi-arrow-left"></i>
            </div>
          </div>
          <div className="col text-center border-left">
            <User
              user={seller}
              inputOfBtcAddress={false}
              title="Seller"
              addressProperty="btcRecipient"
              disabled={done || swapId}
              onChange={onFormUpdate}
            />
          </div>
        </div>
      </div>
      <div className="row align-items-center mb-5">
        <div className="col text-right border-left">
          <i className="bi bi-arrow-down-right"></i>
        </div>
        <div className="col text-center border-left">
          {showPrice && (
            <>
              <br />
              <Price sell={{ assetForSale }} buy={{ assetInEscrow }} editablePrice={false} />
              <br />
              <br />
            </>
          )}
          <div className="border border-5 p-2 m-2 rounded">
            {assetInEscrow.isNFT ? (
              <AssetNFT
                assetUrl={assetInEscrowUrl}
                asset={assetInEscrow}
                nftIdProperty="amountSats"
                onFormUpdate={onFormUpdate}
              />
            ) : (
              <AssetFT
                asset={assetInEscrow}
                amountProperty="amountSats"
                onFormUpdate={onFormUpdate}
              />
            )}
            {when && blockHeight && <TimeLock startHeight={when} blockHeight={blockHeight} />}
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
            <Fees feeOptions={feeOptions} feeId={feeId} disabled={done} />
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
