import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { userConnected } from '../../app/slices/User/thunks';
import { resolveProvider } from '../../lib/provider';
import Modal from './Modal';
import { waitFor } from '@testing-library/react';

const ConnectWallet = () => {
  const [showModal, setShowModal] = React.useState(false);
  const dispatch = useAppDispatch();

  const { isAuthenticated, wallet: { stxAddress, btcAddress } } = useAppSelector(state => state.user);


  const logout = () => {
    dispatch(userConnected({ isAuthenticated: false, wallet: { stxAddress: "", btcAddress: '' } }));
    window.location.reload();
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflowY = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflowY = 'auto';
  };

  const authenticate = async () => {
    if (isAuthenticated) {
      openModal();
    } else {
      const provider = resolveProvider();
      console.log({ provider });
      if (provider) {
        try {
          const response = await provider.request("getAddresses") as { result: { addresses: ({ symbol: "STX", address: string; publicKey: string } | { symbol: "BTC", address: string; type: string })[] } };
          console.log({ response });
          if (response.result?.addresses) {
            const stxAddress = response.result.addresses.find((address) => address.symbol === "STX");
            const btcAddress = response.result.addresses.find((address) => address.symbol === "BTC" && address.type === "p2wpkh");
            if (stxAddress && btcAddress) {
              dispatch(userConnected({ isAuthenticated: true, wallet: { stxAddress: stxAddress.address, btcAddress: btcAddress?.address, stxPublicKey: stxAddress.publicKey } }));
            }
          }
        } catch (error) {
          console.log((error as any).error);
        }
      }
    }
  }

  return (
    <>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="bg-[rgba(255,255,255,0.1)] px-6 py-3 rounded-full text-base font-light leading-6 border-special-black border-[1px] dark:border-none"
        type="button"
        onClick={authenticate}
      >
        {isAuthenticated ? `${stxAddress.slice(0, 5)}...${stxAddress.slice(-3)}` : 'Connect Wallet'}
      </button>
      <Modal showModal={showModal} handleConfirm={logout} handleClose={closeModal}>
        <p className="mx-auto">Do you want to logout?</p>
      </Modal>
    </>
  );
};

export default ConnectWallet;
