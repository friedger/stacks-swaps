import React from 'react';
export function Address({ addr }) {
  if (addr) {
    return (
      <span title={addr}>
        {addr.substr(0, 5)}...{addr.substr(addr.length - 5)}
      </span>
    );
  } else {
    return null;
  }
}
