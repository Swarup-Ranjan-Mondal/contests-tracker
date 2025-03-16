import mongoose from 'mongoose';

const ContestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

const Contest = mongoose.model('Contest', ContestSchema);
export default Contest;
