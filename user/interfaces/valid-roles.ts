export const ValidRoles = {
  tecnico: 'tecnico',
  admin: 'it',
  supervisor: 'supervisor',
  calidad: 'calidad',
  ingeniero: 'ingeniero',
  rrhh: 'recursos humanos',
} as const;

export type ValidRole = (typeof ValidRoles)[keyof typeof ValidRoles];
