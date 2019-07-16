var mongoose   = require("mongoose");

//SCHEMA 
var campSchema = new mongoose.Schema({
    name: String,
	price: String,
    image: String,
    description: String,
    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
     comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

//MODEL
module.exports = mongoose.model("Campground", campSchema);
