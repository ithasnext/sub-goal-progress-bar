let includePrimeSubs = false,
    includeGiftSubs = false,
    subGoal = 100,
    currentProgress = 0,
    fontColor = "",
    backgroundColor = "",
    progressColor = "",
    eventIds = {};

let background,
    progress,
   	fieldData;

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
      	return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;
  	
	if (event.listener === 'widget-button' && event.field === 'setGoalButton') {
		SE_API.store.set('customSubGoalTracker.subCount', {currentSubs: parseInt(fieldData.currentProgress)});  	
      	currentProgress = parseInt(fieldData.currentProgress);
      	eventIds = {};
      	updateProgress();
	}
  
  	if (listener === 'subscriber') {
		if (event.bulkGifted) { // Ignore the inciting bulk gifted event and instead react to each individual sub gift.
			return;
	  	}
        if (event.tier === "prime") {
          	if (includePrimeSubs) {
              	if (!event.isTest && eventIds[event.providerId] === undefined) {
          			currentProgress++;
                  	eventIds[event.providerId] = true;
                }
        	}
        }
      	else if (event.gifted) {
        	if (includeGiftSubs) {
              	if (!event.isTest && eventIds[event.providerId] === undefined) {
          			currentProgress++;
                  	eventIds[event.providerId] = true;
                }
        	}
		}
        else {
          if (!event.isTest && eventIds[event.providerId] === undefined) {
            currentProgress++;
            eventIds[event.providerId] = true;
          }
        }
		SE_API.store.set('customSubGoalTracker.subCount', {currentSubs: parseInt(currentProgress)}); 
      	updateProgress();
    }
});

window.addEventListener('onWidgetLoad', function (obj) {
  	fieldData = obj.detail.fieldData;
  	includePrimeSubs = (fieldData.includePrimeSubs === true);
	includeGiftSubs = (fieldData.includeGiftSubs === true);
    subGoal = parseInt(fieldData.subGoal);
  	background = document.getElementById("background").style;
    background.width = {{boxWidth}}+"px";
	background.height = {{boxHeight}}+"px";
	progress = document.getElementById("progress").style;
	progress.height = {{boxHeight}}+"px";
  	SE_API.store.get('customSubGoalTracker.subCount').then((obj) => {
      	if (obj) {
        	currentProgress = obj.currentSubs;
  			updateProgress();
        }
    }); 
});

function updateProgress() {
	const percentage = Math.min(currentProgress / subGoal, 1);	
  	document.getElementById("progress").style.width = ({{boxWidth}} * percentage) + "px";
}