function createEventDiv(title, location, start, end, width, offset) {
  if(start == undefined || end == undefined){
    throw "Event start or end time not specified";
  }

  if(end < start){
    throw "Event end cannot be before event start";
  }


  var eventDiv = document.createElement("div");
  eventDiv.className = "event";
  eventDiv.innerHTML = "<span class=\"title\">" + title + "</span></br><span class=\"location\">" + location + "</span>";
  var startPixel = start / 30 * 50;
  eventDiv.style.position = "absolute";
  eventDiv.style.top = startPixel + "px";
  eventDiv.style.left = offset + "px";
  eventDiv.style.width = width + "px";
  var heightInPixels = ((end - start)/30) * 50;
  eventDiv.style.height = heightInPixels + "px";
  return eventDiv;
};

function splitEvents(events) {
  console.log("starting splitEvents()");
  //split events based upon the hours they span
  
  //for increased splitting accuracy change the
  //value that x is incremented by 
  var mySplitEvents = {};
  for(var x = 0; x <= 720; x += 60){
    mySplitEvents[x] = [];
  }

  mySplitEvents["duplicate"] = {};


  for(var x = 0; x < events.length; x++){
    for(var i=events[x]["start"]; i < events[x]["end"]; i += 60)
    {
      if(i % 60 != 0){
        i = Math.floor(i/60) * 60;
      }

      if(i >= 0 && i <= 720){
        if(events[x]["placed"] != true){
          mySplitEvents[i].push(events[x]);
          events[x]["placed"] = true;
          mySplitEvents["duplicate"][i + ":" + mySplitEvents[i].length] = false;
        } else {
          mySplitEvents["duplicate"][i + ":" + mySplitEvents[i].length] = true;
          mySplitEvents[i].push(events[x]);
        }
      }
    }
  }
  return mySplitEvents;
};

function layOutDay(events) {
  var eventDivs = [];
  var mySplitEvents = splitEvents(events); //find out which events take place at the same time
  eventsDiv = document.getElementById("events");

  for(var key in mySplitEvents) {
    if(key != "duplicate"){
      var split_amount = 1;
      for(var x = 0; x < mySplitEvents[key].length; x++){
        var event = mySplitEvents[key][x];
        if(mySplitEvents[key].length === 0){
          break;
        }

        split_amount = (1/mySplitEvents[key].length) * 600 - 10;
        if(mySplitEvents["duplicate"][key + ":" + x] != true){
          var offset = (split_amount * x) + x * 10 + 10;
          //right now this code will properly display if two events take place at the same time
          //more than that breaks the display, to fix that you would have to check that
          //all events except x are duplicates which at the moment I'm not sure how to
          //implement
          if(x > 0 && mySplitEvents["duplicate"][key + ":" + 0] == true){
            offset = 10;
          }

          console.log("x: " + x + "length: " + mySplitEvents[key].length);
          eventDivs.push(createEventDiv("Sample Event", "Sample Location", event["start"], event["end"], split_amount, offset));
        }
      }
    }
  }

  for(var x = 0; x < eventDivs.length; x++){
    eventsDiv.appendChild(eventDivs[x]);
  }

};


