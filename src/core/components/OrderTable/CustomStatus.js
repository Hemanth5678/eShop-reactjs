import classNames from 'classnames';

const CustomStatus = ({ value }) => {
  const status = value ? value.toLowerCase() : 'unknown';
  return (
    <span
      className={classNames(
        'px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm',
        status.startsWith('paid') || status.startsWith('delivered') ? 'bg-green-200 text-green-700' : null,
        status.startsWith('unpaid') || status.startsWith('undelivered') ? 'bg-yellow-200 text-yellow-700' : null,
        status.startsWith('cancelled') ? 'bg-red-200 text-red-700' : null,
      )}
    >
      {status}
    </span>
  );
};

export default CustomStatus;
