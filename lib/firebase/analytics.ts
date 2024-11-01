import {
  logEvent as _logEvent,
  Analytics,
  AnalyticsCallOptions,
} from "firebase/analytics";

export function logEvent(
  analyticsInstance: Analytics | null,
  eventName: string,
  eventParams?: { [key: string]: any },
  options?: AnalyticsCallOptions,
): void {
  if (analyticsInstance) {
    _logEvent(analyticsInstance, eventName, eventParams);
  }
}
