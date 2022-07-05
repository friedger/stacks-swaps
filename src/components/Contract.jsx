export function Contract({ ctr }) {
  return (
    <span title={ctr.name}>
      {ctr.address.substr(0, 5)}...{ctr.address.substr(ctr.address.length - 5)}.{ctr.name}
    </span>
  );
}
