import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI ;

let isConnected = false;

export async function connectMongo() {
	if (isConnected) {
		console.log('MongoDB already connected');
		return mongoose;
	}
	mongoose.set('strictQuery', false);
	await mongoose.connect(mongoUri, {
		// keep options minimal; modern drivers infer sensible defaults
	});

	console.log('MongoDB connected');
	isConnected = true;
	return mongoose;
}

process.on('SIGINT', async () => {
	try {
		if (isConnected) await mongoose.disconnect();
	} finally {
		process.exit(0);
	}
});

export default mongoose;


