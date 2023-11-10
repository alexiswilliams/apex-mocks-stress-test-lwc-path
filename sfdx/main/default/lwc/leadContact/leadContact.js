import { LightningElement, api, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord } from "lightning/uiRecordApi";

const FIELDS = ["Contact.Name", "Contact.Phone"];

export default class LoadContact extends LightningElement {
  @api recordId;
  contact;
  name;
  phone;
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
          title: "Error loading contact",
          message,
          variant: "error",
        }),
      );
    } else if (data) {
      this.contact = data;
      this.name = this.contact.fields.Name.value;
      this.phone = this.contact.fields.Phone.value;
      if(this.phone != null && this.phone != '') {
        this.hasPhone = true;
      }
    }
  }
  @track hasPhone = false;
  get hasPhone() {
    return this.hasPhone;
  }
}