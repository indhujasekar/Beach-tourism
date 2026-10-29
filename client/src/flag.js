export const FLAG = {
  green: { label: 'Green flag: safe to swim', color: '#2E9E5B' },
  yellow: { label: 'Yellow flag: swim near the lifeguard', color: '#C99400' },
  red: { label: 'Red flag: no swimming today', color: '#D64545' },
};
export const CROWD = ['Quiet', 'Moderate', 'Busy'];
export const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
