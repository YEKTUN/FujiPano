const mongoose = require("mongoose");


const panoSchema = new mongoose.Schema(
  {
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    panoName: {
      type: String,
      required: true,
      unique: true,
    },
    currentClock: [{
        type: mongoose.Schema.Types.ObjectId,
ref: "CurrentClock",
     
     
    }],
    countdown: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Countdown",
      
      
    }],
    markedCalendar:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Calendar",
      
    }],
    todoList:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "TodoList",
      
    }],
    textElements: [ 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TextElement",
      },
    ],
    imageUrl:[{
        type: String,
       
      }],
    videoUrl:[{
        type: String,
       
    }]
   
  },

  { timestamps: true }
);
module.exports = mongoose.model("Pano", panoSchema);
