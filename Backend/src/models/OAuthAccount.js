import mongoose from 'mongoose';

const oauthAccountSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		provider: { type: String, required: true },
		providerUserId: { type: String, required: true },
		email: { type: String }
	},
	{ timestamps: true }
);

oauthAccountSchema.index({ provider: 1, providerUserId: 1 }, { unique: true });

export default mongoose.models.OAuthAccount || mongoose.model('OAuthAccount', oauthAccountSchema);


