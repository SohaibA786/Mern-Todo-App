import { model, Schema } from "mongoose";

const todoSchema = new Schema({
    todo: {type: String, required: true},
    isCompleted: {type: Boolean, default: false},
    user: {type: Schema.Types.ObjectId, ref: "user"},
}, {timestamps: true});

const TodoModel = model("todo", todoSchema);

export default TodoModel;