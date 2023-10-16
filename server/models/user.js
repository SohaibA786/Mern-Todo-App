import { model, Schema } from "mongoose";

const userSchema = new Schema({
    email: {type: String, required: true},
});

const UserModel = model("user", userSchema);

export default UserModel;