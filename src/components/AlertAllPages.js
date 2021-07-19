import React from 'react';

export function AlertAllPages() {
  return (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      <p className="fw-bold">
        <i className="bi bi-exclamation-triangle fs-3"></i> The testnet was reset to a fresh
        chainstate on 2021/07/12.
      </p>
      <p>Mining will be unavailable until a new contract is deployed.</p>
      <p>
        Please watch the <code>#user-interface</code> channel in the{' '}
        <a href="https://chat.citycoins.co" target="_blank" rel="nofollow" className="alert-link">
          CityCoins Discord
        </a>{' '}
        for more information.
      </p>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}
