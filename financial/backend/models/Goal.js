import mongoose from 'mongoose';
const { Schema } = mongoose;

const goalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goalName: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  targetDate: { type: Date, required: true },
  // Add this new field
  riskProfile: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Goal', goalSchema);