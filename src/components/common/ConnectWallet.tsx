import React from 'react';
import Modal from './Modal';
import { showConnect } from '@stacks/connect';
import { userSession } from '../../lib/userSession';

const ConnectWallet = () => {
  const [showModal, setShowModal] = React.useState(false);
  const isAuthenticated = userSession.isUserSignedIn();
  const address = isAuthenticated
    ? (userSession.loadUserData().profile.stxAddress.mainnet as string)
    : '';

  const logout = () => {
    userSession.signUserOut('/');
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

  const authenticate = () => {
    if (isAuthenticated) {
      openModal();
    } else {
      showConnect({
        appDetails: {
          name: 'Stacks React Starter',
          icon: window.location.origin + '/logo512.png',
        },
        redirectTo: '/',
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      });
    }
  };

  return (
    <>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="bg-[rgba(255,255,255,0.1)] px-6 py-3 rounded-full text-base font-light leading-6 border-special-black border-[1px] dark:border-none"
        type="button"
        onClick={authenticate}
      >
        {isAuthenticated ? `${address.slice(0, 5)}...${address.slice(-3)}` : 'Connect Wallet'}
      </button>
      <Modal showModal={showModal} handleConfirm={logout} handleClose={closeModal}>
        <p className="mx-auto">Do you want to logout?</p>
      </Modal>
    </>
  );
};

export default ConnectWallet;
