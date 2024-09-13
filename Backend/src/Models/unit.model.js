const unitSchema = new mongoose.Schema({
    unitName: { type: String, required: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }
  });
  
  export const Unit = mongoose.model('Unit', unitSchema);
  