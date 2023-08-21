let includePrimeSubs = false,
    includeGiftSubs = false,
    subGoal = 100,
    currentProgress = 0,
    fontColor = "",
    backgroundColor = "",
    progressColor = "";

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
  
	if (event.listener === 'widget-button' && event.field === 'setProgressButton') {
		SE_API.store.set('seventyThirtySplit.subCount', {currentSubs: parseInt(fieldData.currentProgress)});  	
      	currentProgress = parseInt(fieldData.currentProgress);
      	updateProgress();
	}
  
  	if (listener === 'subscriber') {
        if (event.tier === "prime") {
          	if (includePrimeSubs) {
          		currentProgress++;
        	}
        }
      	else if (event.gifted) {
        	if (includeGiftSubs) {
          		currentProgress++;
        	}
		}
      	else if (event.bulkGifted) {
          	if (includeGiftSubs) {
            	currentProgress += event.amount;
            }
		}
        else {
        	currentProgress++;
        }
		SE_API.store.set('seventyThirtySplit.subCount', {currentSubs: parseInt(currentProgress)}); 
      	updateProgress();
    }
});

window.addEventListener('onWidgetLoad', function (obj) {
  	fieldData = obj.detail.fieldData;
  	includePrimeSubs = (fieldData.includePrimeSubs === "yes");
	includeGiftSubs = (fieldData.includeGiftSubs === "yes");
    subGoal = parseInt(fieldData.subGoal);
  	background = document.getElementById("background").style;
    background.width = {{boxWidth}}+"px";
	background.height = {{boxHeight}}+"px";
	progress = document.getElementById("progress").style;
	progress.height = {{boxHeight}}+"px";
  	SE_API.store.get('seventyThirtySplit.subCount').then((obj) => {
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
