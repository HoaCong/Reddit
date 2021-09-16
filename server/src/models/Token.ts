import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
export class Token {
  _id!: mongoose.Types.ObjectId;

  @prop({ require: true })
  userId!: string;

  @prop({ require: true })
  token!: string;

  @prop({ default: Date.now, expires: 60 * 5 })
  createAt: Date;
}
export const TokenModel = getModelForClass(Token);
