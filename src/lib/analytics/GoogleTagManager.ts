export type GTMEvent = {
  event?: string,
  label?: string,
  action: string,
  category: string,
};

class GoogleTagManager {
  protected defaultEventName = 'customEvent';
  protected static instance: GoogleTagManager | undefined;

  /**
   * Getting single instance
   */
  static getInstance(): GoogleTagManager {
    if (!this.instance) {
      this.instance = new GoogleTagManager();
    }
    return this.instance;
  }

  /**
   * Sending event
   * @param event
   */
  sendEvent(event: GTMEvent) {
    const eventData: any = {
      'event': event.event || this.defaultEventName,
      'action': event.action,
      'category': event.category,
    };
    if (event.label) {
      eventData.label = event.label;
    }
    console.debug('[GTM] Sending event:', eventData);
    // @ts-ignore
    window.dataLayer.push(eventData);
  }
}

export default GoogleTagManager;
