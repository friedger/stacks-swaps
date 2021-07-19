import React from 'react';
import { PoxLiteInfo } from './PoxLiteInfo';
import { CityCoinTxList } from './CityCoinTxList';

export function CityCoinDashboard() {
  return (
    <>
      <PoxLiteInfo />
      <hr />
      <CityCoinTxList />
    </>
  );
}
