export default function StatusBadge({ status }) {
  let badgeClass = 'badge ';
  let label = status;
  
  switch (status) {
    case 'found':
      badgeClass += 'badge-success';
      break;
    case 'claimed':
      badgeClass += 'badge-success';
      break;
    case 'delivered':
      badgeClass += 'badge-info';
      label = 'At UTPD';
      break;
    case 'pending':
      badgeClass += 'badge-warning';
      break;
    case 'lost':
      badgeClass += 'badge-danger';
      break;
    default:
      badgeClass += 'badge-info';
  }
  
  return (
    <span className={badgeClass}>
      {label}
    </span>
  );
} 