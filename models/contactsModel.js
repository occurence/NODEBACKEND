import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
      index: 1,
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  }
);

const Contact = model("contact", contactSchema);

export { Contact };