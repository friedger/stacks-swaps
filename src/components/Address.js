import React from 'react';
export function Address({ addr }) {
  return (
    <span title={addr}>
      {addr.substr(0, 5)}...{addr.substr(addr.length - 5)}
    </span>
  );
}
