//@ts-nocheck

export const resolveProvider = () => {
  const providerName = localStorage.getItem("stacking-tracker-sign-provider");
  if (!providerName) return null;

  if (providerName === "xverse" && window.XverseProviders?.StacksProvider) {
    return window.XverseProviders?.StacksProvider;
  } else if (providerName === "asigna" && window.AsignaProvider) {
    return window.AsignaProvider;
  } else if (
    providerName === "okx" &&
    window.okxwallet &&
    window.okxwallet?.stacks
  ) {
    return window.okxwallet.stacks;
  } else if (window.LeatherProvider) {
    return window.LeatherProvider;
  } else if (window.HiroWalletProvider) {
    return window.HiroWalletProvider;
  } else {
    return window.StacksProvider;
  }
};
