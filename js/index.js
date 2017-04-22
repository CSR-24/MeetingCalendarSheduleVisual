function sortMeetings (myMeetings) {
  /*
  Sort All the meetings according to the earliest sceduled meeting.
  */
    return _.sortBy(myMeetings, 'start');
}

function findLongestTrail (myMeetings){
  /*
    Finds the longest sequence of overlapping meetings.
  */
    var trail = [];
    trail.push(myMeetings[0]);
    for (var i= 0; i< myMeetings.length; i++){
        if(i < myMeetings.length && (i+1) < myMeetings.length && myMeetings[i+1].start <= myMeetings[i].end){
            trail.push(myMeetings[i+1]);
        } else {
            break;
        }
    }

    return trail;
}

function start (meetings){
  /*
  Checks if all overlapping meetings have been found and drawn.
  */
    var trail, allCSSNodes = [];
    while(true){
        trail = [];
        if (meetings.length > 0){
            trail = findLongestTrail(meetings);
            trail = getPosition(trail);
            trail = drawTrail(trail);
            allCSSNodes = _.union(allCSSNodes, trail);
            meetings = _.difference(meetings, trail);
        } else {
            break;
        }
    }
  
  /* Returns with all meeting nodes with correct css values */
  return allCSSNodes;
}

function getPosition(trail){
  /*
    This method takes as input the sequnece of overlapping meetings and position each of them.
  */
    var divLength = 600/trail.length;
    for (var j = 1; j<=trail.length; j++){
        trail[j-1].top = trail[j-1].start;
        trail[j-1].bottom = 1440- trail[j-1].end;
        trail[j-1].right = 600 - ( j * divLength);
        trail[trail.length - j].left = trail[j-1].right;
    }
    return trail;
}

function drawTrail(trail){
/*
    This method takes as input all the meetings in an overlapping sequence and creates the styling for each of them.
  */
    var element, 
        id, 
        colorPallete = ['orange', 'yellow', 'orange', 'cornflowerblue', 'brown', 'green', 'lightblue', 'lightgreen', 'steelblue'];
    _.forEach(trail, function(node, key){
        element = document.createElement('div');
        id = document.createAttribute('id');
        id.value = node.id;
        element.setAttributeNode(id);
        document.getElementById('myDay').appendChild(element);
    
        $('#'+node.id).css('position', 'absolute');
        $('#'+node.id).css('top', node.top);
        $('#'+node.id).css('bottom', node.bottom);
        $('#'+node.id).css('left', node.left);
        $('#'+node.id).css('right', node.right);
        $('#'+node.id).css('z-index', '1');
        $('#'+node.id).css('opacity', '0.6');
        $('#'+node.id).html("<h4 class='labels'>"+node.name+"</h4>");
        $('#'+node.id).css('background', _.sample(colorPallete));
    });
  
  /* Returns with all trail nodes with correct css values */
  return trail;
}

function checkMeetings(myMeetings){
  /*
    Filtering all meetings if a metting is wrongly sceduled it sis removed from meetings array.
  */
  var filteredMeetings = [];
  _.forEach(myMeetings, function(value, key){
    if (value.start < value.end){
      filteredMeetings.push(value);
    }
  });
  return filteredMeetings;
}

function init(){
  // Sample data for meetings.
  var meetings, 
      meetings_1 = [{ id: 1, start: 120, end: 300, name: 'Meeting A' },
                      { id: 2, start: 1080, end: 1140, name: 'Meeting B' },
                      { id: 3, start: 1110, end: 1200, name: 'Meeting C' },
                      { id: 4, start: 1170, end: 1320, name: 'Meeting D' }],
      meetings_2 = [{ id: 1, start: 120, end: 600, name: 'Meeting A' },
                      { id: 2, start: 500, end: 1140, name: 'Meeting B' },
                      { id: 3, start: 1080, end: 1140, name: 'Meeting C' },
                      { id: 4, start: 1110, end: 1200, name: 'Meeting D' },
                      { id: 5, start: 1170, end: 1320, name: 'Meeting E' }],
      meetings_3 = [{ id: 1, start: 120, end: 200, name: 'Meeting A' },
                      { id: 2, start: 220, end: 300, name: 'Meeting B' },
                      { id: 3, start: 300, end: 500, name: 'Meeting C' },
                      { id: 4, start: 500, end: 600, name: 'Meeting D' }],
      meetings_4 = [{ id: 1, start: 120, end: 100, name: 'Meeting A' },
                      { id: 2, start: 100, end: 190, name: 'Meeting B' },
                      { id: 3, start: 200, end: 290, name: 'Meeting C' },
                      { id: 4, start: 200, end: 390, name: 'Meeting D' },
                      { id: 5, start: 500, end: 800, name: 'Meeting E' },
                      { id: 6, start: 1000, end: 1320, name: 'Meeting F' }],
      meetings_5 = [{ id: 1, start: 100, end: 500, name: 'Meeting A' },
                      { id: 2, start: 450, end: 500, name: 'Meeting B' },
                      { id: 3, start: 800, end: 850, name: 'Meeting C' },
                      { id: 4, start: 900, end: 950, name: 'Meeting D' }];
 
  //Switch Sample data here...
  meetings = meetings_2;
  //..........................
 
  meetings = sortMeetings(meetings);
  meetings = checkMeetings(meetings);
  drawTimeTicks();
  
  /*PART 1: Returning All Meeting nodes with CSS values, Check console.*/
  console.log(start(meetings));
  /*PART 2: Drawing All Meeting nodes with CSS values*, Check View*/
}

function drawTimeTicks(){
  /*Also can use momentJS for on the fly date time computation.*/
  var hourMap = {
    0 : '9 am',
    60 : '10 am',
    120 : '11 am',
    180 : '12 pm',
    240 : '1 pm',
    300 : '2 pm',
    360 : '3 pm',
    420 : '4 pm',
    480 : '5 pm',
    540 : '6 pm',
    600 : '7 pm',
    660 : '8 pm',
    700 : '9 pm'
  };
  
  for(var tick=1; tick<=1440; tick = tick+120){
    var hourLine = document.createElement('div'),
        id = document.createAttribute('id');
    
        id.value = tick;
        hourLine.setAttributeNode(id);
        document.getElementById('myDay').appendChild(hourLine);
        
        $('#'+tick).css('position', 'absolute');
        $('#'+tick).css('top', tick);
        $('#'+tick).css('bottom', 1440-tick-1);
        $('#'+tick).css('left', 0);
        $('#'+tick).css('right', 0);
        $('#'+tick).text(hourMap[Math.floor(tick/2)]);
        $('#'+tick).css('background', 'red');
  }
}

/*App starts here...*/
init();