import Cookies from 'js-cookie';

const safeParseBusinessRef = () => {
  try {
    const raw = Cookies.get('business');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return String(parsed?.businessBusinessRef || parsed?.businessName || '').trim();
  } catch {
    return '';
  }
};

export function getCurrentOfflineOwnerKey() {
  const userId = String(Cookies.get('userId') || '').trim() || 'anon';
  const businessRef = safeParseBusinessRef() || 'unknown-business';
  return `${businessRef}::${userId}`;
}

export function getCurrentBranchKey() {
  const branchId = String(Cookies.get('branch_id') || '').trim();
  return branchId || 'default-branch';
}
