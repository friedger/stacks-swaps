import { AppConfig } from '@stacks/auth';
import { Storage } from '@stacks/storage';
import { addressToString } from '@stacks/transactions';
import { getStacksAccount } from './lib/account';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const STX_JSON_PATH = 'stx.json';

function afterSTXAddressPublished() {
  console.log('STX address published');
  stxAddressSemaphore.putting = false;
}

const stxAddressSemaphore = { putting: false };
export function putStxAddress(userSession, address) {
  const storage = new Storage({ userSession });
  if (!stxAddressSemaphore.putting) {
    stxAddressSemaphore.putting = true;
    storage
      .putFile(STX_JSON_PATH, JSON.stringify({ address }), {
        encrypt: false,
      })
      .then(() => afterSTXAddressPublished())
      .catch(r => {
        console.log(r);
        console.log('STX address NOT published, retrying');
        storage.getFile(STX_JSON_PATH, { decrypt: false }).then(s => {
          userSession
            .putFile(STX_JSON_PATH, JSON.stringify({ address }), {
              encrypt: false,
            })
            .then(() => afterSTXAddressPublished())
            .catch(r => {
              console.log('STX address NOT published');
              console.log(r);
              stxAddressSemaphore.putting = false;
            });
        });
      });
  }
}

export const finished = onDidConnect => ({ userSession }) => {
  onDidConnect({ userSession });
  console.log(userSession.loadUserData());

  const userData = userSession.loadUserData();
  const { address } = getStacksAccount(userData.appPrivateKey);
  console.log(JSON.stringify({ address: addressToString(address) }));
  putStxAddress(userSession, addressToString(address));
};
