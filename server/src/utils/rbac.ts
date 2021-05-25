export function createRole(namespace: string, action: string) {
  return `${namespace}_${action}`;
}

export function splitRole(role: string): [string, string] {
  return role.split('_') as [string, string];
}
