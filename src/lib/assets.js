import { contractPrincipalCV } from '@stacks/transactions';

/**
 *
 * @param  assetString identifier in the form address.name::assetName
 * @returns contract as CV and asset name
 */
export function splitAssetIdentifier(assetString) {
  const [contractAddress, tail] = assetString.split('.');
  const [contractName, assetName] = tail.split('::');
  const contractCV = contractPrincipalCV(contractAddress, contractName);
  return [contractCV, assetName, contractName, contractAddress];
}
