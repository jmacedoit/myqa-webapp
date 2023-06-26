
/*
 * Notification type.
 */

export type NotificationMessage = {
  id?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
};
