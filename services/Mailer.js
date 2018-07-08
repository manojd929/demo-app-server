const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const keys = require("../config/keys");

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super();

    this.sgAPI = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email("no-reply@emaily-mano.com");
    this.subject = subject;
    this.body = new helper.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients);

    // Mail class has addContent
    this.addContent(this.body);

    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    // sendgrid stuffs
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    // sendgrid stuffs
    const personalizeObj = new helper.Personalization();
    this.recipients.forEach(recipient => {
      personalizeObj.addTo(recipient);
    });
    this.addPersonalization(personalizeObj);
  }

  async send() {
    const request = this.sgAPI.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });
    const response = this.sgAPI.API(request);
    return response;
  }
}

module.exports = Mailer;
