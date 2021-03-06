const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")
const PasswordRecovery = require("./PasswordRecovery")
const Invoice = require("./Invoice")
const UserSchema = new Schema({
     username: {
          type: String,
          required: true,
          unique: [true, 'That email address has already been used']
     },
     companyName: String,
     address: String,
     tel: String,
     bankAccount: String,
     taxNumber: String,
     logo: {
          path: String,
          publicID: String,
     },
     invoices: [{
          type: Schema.Types.ObjectId,
          ref: "Invoice"
     }],
     lastLogin: {
          type: Date
     },
     verified: {
          type: Boolean,
          default: false
     },
     verificationCode: {
          type: String
     },
     passwordRecovery: {
          type: Schema.Types.ObjectId,
          ref: "PasswordRecovery",
          date: Date.now
     }

},
     { timestamps: true }
)
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User", UserSchema)