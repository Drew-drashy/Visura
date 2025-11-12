import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		token: { type: String, required: true, unique: true },
		expiresAt: { type: Date, required: true, index: true },
		usedAt: { type: Date, default: null }
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.PasswordReset || mongoose.model('PasswordReset', passwordResetSchema);


