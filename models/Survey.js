const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema],

  yes: { type: Number, default: 0 },
  no:  { type: Number, default: 0 },

  _user: { type: Schema.Types.ObjectId, ref: 'User' },

  dateSent: Date,
  lastResponded: Date
});

mongoose.model('surveys', surveySchema); // Collection Name, Schema

/*
  _user: { type: Schema.Types.ObjectId, ref: 'User' }

  id of the user who owns the survey

  reference belongs to User collection

  why underscore
  by convention, this indicates relationship
*/
