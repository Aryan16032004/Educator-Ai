const topicSchema = new mongoose.Schema({
    topicName: { type: String, required: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' }
  });
  
  export const Topic = mongoose.model('Topic', topicSchema);
  