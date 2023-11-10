import { LightningElement, api, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord } from "lightning/uiRecordApi";

const FIELDS = ["Quote.Status", "Quote.gunpla__Sub_Status__c", "Quote.CreatedDate"];

export default class CustomScopedNotification extends LightningElement {
  @api recordId;
  quote;
  status;
  subStatus;
  createdDate;
  @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
  wiredRecord({ error, data }) {
    if (error) {
      let message = "Unknown error";
      if (Array.isArray(error.body)) {
        message = error.body.map((e) => e.message).join(", ");
      } else if (typeof error.body.message === "string") {
        message = error.body.message;
      }
      this.dispatchEvent(
        new ShowToastEvent({
          mode: 'sticky',
          title: "Error loading quote",
          message: message,
          variant: "error",
        }),
      );
    } else if (data) {
      this.quote = data;
      this.status = this.quote.fields.Status.value;
      this.subStatus = this.quote.fields.gunpla__Sub_Status__c.value;
      if(this.subStatus != null && this.subStatus != '') {
        this.scopedNotificationOuterClass = "slds-scoped-notification slds-media slds-media_center slds-theme_" + this.subStatus;
        this.scopedNotificationInnerClass = "slds-icon_container slds-icon-utility-" + this.subStatus;
        this.icon = "/_slds/icons/utility-sprite/svg/symbols.svg#" + this.subStatus;
        this.title = this.subStatus;
      }
    }
  }
  
  @track scopedNotificationOuterClass;
  @track scopedNotificationInnerClass
  @track icon;
  @track title;

  get scopedNotificationOuterClass() {
    return this.scopedNotificationOuterClass;
  }

  get scopedNotificationInnerClass() {
    return this.scopedNotificationInnerClass;
  }
  get icon() {
    return this.icon;
  }

  get title() {
    return this.title;
  }
}