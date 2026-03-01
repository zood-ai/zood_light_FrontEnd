import { sidelinks } from '@/data/sidelinks';

export function getFirstAccessibleLink(userPermissions: string[] = []): string {
  for (const link of sidelinks) {
    if (link.sub?.length) {
      for (const subLink of link.sub) {
        const hasPermission =
          !subLink.authorities?.length ||
          subLink.authorities.every((p) => userPermissions.includes(p));

        if (hasPermission) return subLink.href;
      }
      continue;
    }

    const hasPermission =
      link.authorities?.length > 0
        ? link.authorities.every((permission) =>
            userPermissions?.includes(permission)
          )
        : true;

    if (hasPermission) return link.href;
  }

  return '/401';
}
