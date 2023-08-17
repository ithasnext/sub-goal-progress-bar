let includePrimeSubs = false,
    includeGiftSubs = false,
    subGoal = 100,
    currentProgress = 0,
    fontColor = "",
    backgroundColor = "",
    progressColor = "";

let background,
    progress;

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
      return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;
	
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
      	updateProgress();
    }
});

window.addEventListener('onWidgetLoad', function (obj) {
  	const fieldData = obj.detail.fieldData;
  	includePrimeSubs = (fieldData.includePrimeSubs === "yes");
	includeGiftSubs = (fieldData.includeGiftSubs === "yes");
    subGoal = parseInt(fieldData.subGoal);
    currentProgress = parseInt(fieldData.currentProgress);
  	background = document.getElementById("background").style;
    background.width = {{boxWidth}}+"px";
	background.height = {{boxHeight}}+"px";
	progress = document.getElementById("progress").style;
	progress.height = {{boxHeight}}+"px";
  	updateProgress();
});

function updateProgress() {
	const percentage = Math.min(currentProgress / subGoal, 1);	
  	document.getElementById("progress").style.width = ({{boxWidth}} * percentage) + "px";
  	
}