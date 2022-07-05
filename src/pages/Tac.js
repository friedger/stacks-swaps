import React from 'react';
export default function Tac() {
  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          <h1>Terms and Conditions</h1>
          <p className="h5">
            The website provides a user interface to interact with several smart contracts to
            exchange digital assets between users. The website does not provide any tools to find
            exchange partners or determine a price for an asset.
          </p>
          <p className="h5">The website does not create or sign Stacks transactions for users.</p>
          <p className="h5">The website is in development and not production ready.</p>
          <p className="h5">
            The website is run by OpenIntents UG (haftungsbeschränkt), Suarezstr 41, 14057 Berlin,
            Germany.
          </p>
          <p className="h5">
            The user of the website agrees to
            <ul>
              <li>
                carefully ready the warning about potential loss of digital assets and only use the
                website if the user understands the warnings.
              </li>
              <li>
                not hold the website owner responsible for any loss due to unexpected outcome of
                smart contract transactions.
              </li>
              <li> acknowledge that the website is not production-ready.</li>
            </ul>
          </p>
          <img src="/oi_imprint.gif" alt="contact details" />
        </div>
      </div>
    </div>
  );
}
