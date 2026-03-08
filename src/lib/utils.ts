import clsx from 'clsx';

export function cn(...classes: Array<string | false | null | undefined>) {
  return clsx(classes);
}

export function formatDate(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}
