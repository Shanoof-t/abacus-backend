export interface IBudget {
  user_id: string;
  budget_name: string;
  category_name: string;
  amount_limit: number;
  budget_start_date: string;
  budget_end_date: string;
  notification_status?: boolean;
  progress: number;
  id?: string;
  budget_note?: string;
  alert_threshold?: number;
  total_spent?: number;
}
