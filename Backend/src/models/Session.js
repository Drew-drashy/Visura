import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		accessToken: { type: String, unique: true, sparse: true },
		refreshToken: { type: String, unique: true, sparse: true, index: true },
		userAgent: { type: String },
		ip: { type: String },
		expiresAt: { type: Date, required: true, index: true }
	},
	{ timestamps: true }
);

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);


