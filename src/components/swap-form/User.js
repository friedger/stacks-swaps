import { Address } from '../Address';

export default function User({
  user,
  isOwner,
  title,
  readOnly,
  inputOfBtcAddress,
  onFormUpdate,
  addressProperty,
}) {
  const label = inputOfBtcAddress
    ? 'Bitcoin recipient address (must start with 1)'
    : 'Stacks address or name (optional)';

  return (
    <>
      <i className="bi bi-person" style={{ fontSize: '4rem' }}></i>
      {readOnly ? (
        <>
          {title}
          {isOwner ? ' (You)' : null}
          <br />
          <Address addr={user.address} />
        </>
      ) : (
        <>
          <br />
          {title} {isOwner ? ' (You)' : ''}
          <br />
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              defaultValue={user.address}
              onChange={e => onFormUpdate({ property: addressProperty, value: e.target.value })}
              aria-label={label}
              placeholder={label}
              required
              max="40"
              minLength="1"
            />
          </div>
        </>
      )}
    </>
  );
}
