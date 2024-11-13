import mongoose from "mongoose";
const { Schema } = mongoose;

const brandSchema = new Schema({
  name: { type: String, required: true },
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
