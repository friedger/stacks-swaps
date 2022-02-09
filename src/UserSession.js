import { AppConfig } from 'micro-stacks/auth';
import { putFile, getFile } from 'micro-stacks/storage';
import { addressToString } from 'micro-stacks/clarity';
import { getStacksAccount } from './lib/account';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const STX_JSON_PATH = 'stx.json';

function afterSTXAddressPublished() {
  console.log('STX address published');
  stxAddressSemaphore.putting = false;
}

const stxAddressSemaphore = { putting: false };
export function putStxAddress(userSession, address) {
  if (!stxAddressSemaphore.putting) {
    stxAddressSemaphore.putting = true;
    putFile(STX_JSON_PATH, JSON.stringify({ address }), {
        encrypt: false,
      })
      .then(() => afterSTXAddressPublished())
      .catch(r => {
        console.log(r);
        console.log('STX address NOT published, retrying');
        getFile(STX_JSON_PATH, { decrypt: false }).then(s => {
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
