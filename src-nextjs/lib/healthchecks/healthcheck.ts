export interface HealthCheck {
  startup(): Promise<boolean>
  ready(): Promise<boolean>
  alive(): Promise<boolean>
}
