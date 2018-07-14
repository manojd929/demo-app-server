const _ = require('lodash');
const Path = require('path-parser');
// url is integrated module inside nodejs system
const { URL } = require('url');

const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for Voting!!!');
  });

  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({ recipients: 0 }); // remove recipients from the survey object and send
    // await Survey.find({ _user: req.user.id }).select('-recipients') is equivalent to above

    res.send(surveys);
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map((recipient) => ({ email: recipient.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    // Great place to send an email
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      // save survey to db
      await survey.save();
  
      // deduct credits
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch(err) {
      res.status(422).send(err);
    }
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    _.chain(req.body)
      .map(({ email, url }) => {
        const parserObj = new Path('/api/surveys/:surveyId/:choice');
        const pathname = new URL(url).pathname;

        const match = parserObj.test(pathname);
        if (match) {
          return { email, ...match };
        }
      })
      .compact(events)
      .uniqBy(compactEvents, 'email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne({
          _id: surveyId,
          recipients: {
            $elemMatch: { email: email, responded: false },
          }
        }, {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date()
        }).exec();
      })
      .value();

    // we do not have to respond to sendGrid anything 

    /* const events = _.map(req.body, ({ email, url }) => {
      const parserObj = new Path('/api/surveys/:surveyId/:choice');
      const pathname = new URL(url).pathname;

      const match = parserObj.test(pathname); // either be an object or null
      if (match) {
        return { email, ...match }; // object containing email, surveyId, choice as keys
      }
    });

    const compactEvents = _.compact(events); // removes undefined events from the events list
    const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId'); */
  });
};
