import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true, index: true },
		name: { type: String },
		passwordHash: { type: String },
		googleId: { type: String, unique: true, sparse: true },
		credits: { type: Number, default: 2 },
		deletedAt: { type: Date, default: null }
	},
	{ timestamps: true }
);

userSchema.index({ deletedAt: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);


