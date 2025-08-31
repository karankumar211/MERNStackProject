import mongoose from 'mongoose';
const { Schema } = mongoose;

const expenseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  note: { type: String, required: true },
  category: { type: String, default: 'Uncategorized' },
  timestamp: { type: Date, default: Date.now },
  emotion: { type: String }, // e.g., 'happy', 'stressed'
  source: { type: String, enum: ['voice', 'manual'], default: 'manual' }
});

export default mongoose.model('Expense', expenseSchema);