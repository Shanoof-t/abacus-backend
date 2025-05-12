import mongoose from "mongoose";

const consentSchema = new mongoose.Schema({
  consent_id: { type: String, required: true },
  userDetails: {
    user_id: { type: String, required: true },
    user_email: { type: String, required: true },
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export const Consent = mongoose.model("consent", consentSchema);
