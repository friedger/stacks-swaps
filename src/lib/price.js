import { atom } from 'jotai';

export const STX_USD = atom({ value: 0, loading: false });

export async function refreshPrice(update) {
  try {
    update(v => {
      return { value: v.value, loading: true };
    });
    const result = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=USD&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false'
    )
    const resultJson = await result.json()
    update(v => {
      return { value: resultJson?.blockstack?.usd, loading: false };
    });
  } catch (e) {
    console.log(e);
    update(v => {
      return { value: v.value, loading: false };
    });
  }
}
