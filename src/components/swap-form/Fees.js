export default function Fees({ feeOptions, feeId, onFormUpdate, disabled }) {
  if (feeOptions) {
    return (
      <select
        className="form-select form-select-sm"
        value={feeId}
        onChange={e => onFormUpdate({ feeId: e.target.value })}
        disabled={disabled}
        aria-label="select fee model"
      >
        {feeOptions.map((feeOption, index) => (
          <option value={feeOption.type} key={index}>
            {feeOption.title}
          </option>
        ))}
      </select>
    );
  } else {
    return null;
  }
}
