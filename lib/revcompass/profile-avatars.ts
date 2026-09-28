export const PROFILE_AVATARS: Record<string, string> = {
  'steph-curry': '/assets/steph-curry.jpg',
  'klay-thompson': '/assets/klay-thompson.jpg',
  'draymond-green': '/assets/draymond-green.jpg',
  'steve-kerr': '/assets/steve-kerr.jpg',
}

export function getProfileAvatar(profileId: string): string | undefined {
  return PROFILE_AVATARS[profileId]
}

export function initialsFromName(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
