import { API_ORIGIN } from '../src/api/axios';

export function getAvatarUrl(user) {
    const fullName = `${user?.firstName || 'Utilisateur'} ${user?.lastName || ''}`.trim();
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName
    )}&background=e0e7ff&color=4338ca&bold=true`;

    if (!user?.avatar) return fallback;

    return `${API_ORIGIN}/uploads/${user.avatar}`;
}