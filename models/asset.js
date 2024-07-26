const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assetSchema = new Schema({
    bookName: { type: String, required: true },
    borrowed: { type: String, required: true },
    status: { type: String, required: true },
    dueDate: { type: Date, required: true }
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
