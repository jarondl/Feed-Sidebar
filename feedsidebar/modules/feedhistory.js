var FEEDHISTORY = {
    annotationService : Components.classes["@mozilla.org/browser/annotation-service;1"]
                              .getService(Components.interfaces.nsIAnnotationService),
       	log : function (m) {
		var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
		consoleService.logStringMessage("FEEDBAR: FEEDHISTORY: " + m);
	},
    FeedHistoryClass : function(LivemarkID){
        // initialize. first check if annotation already exists
        try {
            var feedhistory_json = FEEDHISTORY.annotationService.getItemAnnotation(LivemarkID, "feedbar/history");
            var feedhistory = JSON.parse(feedhistory_json);
        } catch(e){
            var feedhistory = [];
        }
        this.LivemarkID = LivemarkID;
        this.feedhistory = feedhistory;
        
        // METHODS
        this.find_uri_idx = function(uri){
            for (var key in this.feedhistory){
                 if (uri == this.feedhistory[key][0]) {
                    return key;
                }
            }
            return -1;
        }
        this.checkVisited = function(uri){
            if (this.find_uri_idx(uri) > 0){
                return true;
            }
            return false;
        }
        
        this.save_state = function(){
            feedhistory_json = JSON.stringify(this.feedhistory);
            FEEDHISTORY.annotationService.setItemAnnotation(this.LivemarkID, 
            "feedbar/history", feedhistory_json, 0, FEEDHISTORY.annotationService.EXPIRE_NEVER);
        }
        
        this.add_uri = function(uri){
            this.feedhistory.push([uri, new Date().getTime()]);
            this.save_state();
        }
        this.remove_uri = function(uri){
            this.feedhistory.splice(this.find_uri_idx(uri), 1);
            this.save_state();
        }
        

    
    },
    
}
var EXPORTED_SYMBOLS = ["FEEDHISTORY"];
