export function Price({ sell, buy, editablePrice, onChange }) {
  const buyAsset = buy.asset === 'BTC' ? 'SATS' : buy.asset;
  const buyFactor = buy.asset === 'BTC' ? Math.pow(10, 8) : 1;
  const sellFactor = Math.pow(10, sell.decimals);
  const priceOrNaN = (parseFloat(buy.amount) * buyFactor) / (parseFloat(sell.amount) * sellFactor);
  const price = isNaN(priceOrNaN)
    ? 0
    : priceOrNaN.toLocaleString(undefined, {
        style: 'decimal',
        maximumFractionDigits: buy.decimals,
      });
  const priceLabel = `${buyAsset} / ${sell.asset}`;

  return (
    <>
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
    </>
  );
}
