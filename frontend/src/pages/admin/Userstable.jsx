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
    <span className={`inline-block shrink-0 rounded-full px-3 py-1 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
function StatusBadge({ isActive }) {
  const style = isActive ? statusStyles.active : statusStyles.inactive;
  return (
    <span className={`inline-block shrink-0 rounded-full px-3 py-1 text-xs font-medium ${style}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}
function Avatar({ user }) {
  return user.avatar ? (
    <img
      src={`${BACKEND_URL}/uploads/${user.avatar}`}
      alt=""
      className="h-8 w-8 shrink-0 rounded-full object-cover"
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  ) : (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
      {(user.firstName?.[0] || '?').toUpperCase()}
    </div>
  );
}
function StateBox({ tone = 'default', children }) {
    const toneClass = tone === 'error' ? 'text-red-500' : 'text-slate-400';
    return (
        <div className={`rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 ${toneClass}`}>
            {children}
        </div>
    );
}

export default function UsersTable({ users, loading, error, onEditClick }) {
  if (loading) return <StateBox>Chargement...</StateBox>;
  if (error) return <StateBox tone="error">{error}</StateBox>;
  if (users.length === 0) return <StateBox>Aucun utilisateur trouvé.</StateBox>;

  return (
    <>
      {/* Table view - tablette & PC */}
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Role</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
              >
                <td className="flex items-center gap-3 px-6 py-4 text-sm text-slate-900 dark:text-white">
                  <Avatar user={user} />
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

      {/* Card view - mobile */}
      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <div
            key={user._id}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              <Avatar user={user} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()}
                </p>
                <div className="mt-1 flex gap-1.5">
                  <RoleBadge role={user.role} />
                  <StatusBadge isActive={user.isActive} />
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end border-t border-slate-50 pt-3 dark:border-slate-800/60">
              <button
                onClick={() => onEditClick(user)}
                className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}