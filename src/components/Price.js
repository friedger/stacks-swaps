export default function Price({ sell, buy, editablePrice, onChange }) {
  const buyAmount = buy.amount || buy.amountOrId;
  const sellAmount = sell.amount || sell.amountOrId;
  const buyAsset = buy.asset === 'BTC' ? 'SATS' : buy.asset;
  const buyFactor = buy.asset === 'BTC' ? Math.pow(10, 8) : 1;
  const sellFactor = 1;
  const priceOrNaN = (parseFloat(buyAmount) * buyFactor) / (parseFloat(sellAmount) * sellFactor);
  const price = isNaN(priceOrNaN)
    ? 0
    : priceOrNaN.toLocaleString(undefined, {
        style: 'decimal',
        maximumFractionDigits: buy.decimals,
      });
  const priceLabel = `${buyAsset} / ${sell.asset}`;

  return (
    <p className="m-1 fw-lighter">
      {editablePrice ? (
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={onChange}
          aria-label="Price"
          placeholder="Price"
          required
          minLength="1"
        />
      ) : (
        <>
          {price}
          <br />
        </>
      )}
      {priceLabel}
    </p>
  );
}
