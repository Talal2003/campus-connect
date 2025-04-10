export default function StatusBadge({ status }) {
  let badgeClass = 'badge ';
  let label = status;
  
  switch (status) {
    case 'found':
      badgeClass += 'badge-info';
      label = 'Available for Pickup';
      break;
    case 'claimed':
      badgeClass += 'badge-success';
      label = 'Claimed by Owner';
      break;
    case 'delivered':
      badgeClass += 'badge-info';
      label = 'Returned to Owner';
      break;
    case 'pending':
      if (document.location.pathname.includes('/found')) {
        badgeClass += 'badge-warning';
        label = 'Recently Found';
      } else {
        badgeClass += 'badge-danger';
        label = 'Still Lost';
      }
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