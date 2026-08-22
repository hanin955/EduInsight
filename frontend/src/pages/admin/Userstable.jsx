const BACKEND_URL = 'http://localhost:5000';
const roleStyles = {
  admin: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  teacher: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
};
const statusStyles = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  inactive: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};
function RoleBadge({ role }) {
  const style = roleStyles[role?.toLowerCase()] || roleStyles.admin;
  const label = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown';
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
function StatusBadge({ isActive }) {
  const style = isActive ? statusStyles.active : statusStyles.inactive;
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${style}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}
export default function UsersTable({ users, loading, error, onEditClick }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Name</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Role</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                Chargement...
              </td>
            </tr>
          )}
          {!loading && error && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-red-500">
                {error}
              </td>
            </tr>
          )}
          {!loading && !error && users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
          {!loading &&
            !error &&
            users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
              >
                <td className="flex items-center gap-3 px-6 py-4 text-sm text-slate-900 dark:text-white">
                  {user.avatar ? (
                    <img
                      src={`${BACKEND_URL}/uploads/${user.avatar}`}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                      {(user.firstName?.[0] || '?').toUpperCase()}
                    </div>
                  )}
                  {`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()}
                </td>
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge isActive={user.isActive} />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onEditClick(user)}
                    className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}