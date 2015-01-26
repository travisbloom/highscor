/***
 * Factory used to validate locally stored information, return default application schema if it doesn't exist/is invalid
 ***/
angular.module('highScoreApp')
  .factory('userDataFactory', function($window) {
    var userData, localStorageKey = 'highScoreData';
    /***
     * returns default userData
     ***/
    function defaultUserData() {
      //todo remove mockData override
      return userData = {
          //array of strings that describe the paths of customScores already existing in scores
          //used to grey out options when selecting new custom scores
          usedCustomScores: [],
          //object that contains an obj property for each known provider, provider obj contains relevant metadata (access_token, etc)
          providers: {},
          //the scores that exist for a given user, an array of score objects
          scores: []
      }
    }
    /***
     * remove corrupted userData, return an object with a userMessage and the newUserData
     ***/
    function corruptUserData() {
      //delete any corrupted data
      $window.localStorage.removeItem(localStorageKey);
      return {
        userMessage: 'There was an issue with your saved scores, the app data has been reset',
        newUserData: defaultUserData()
      }
    }
    return {
      /***
       * accepts a JSON obj with new userData, saves a reference to it in the userData var and saves it to local storage
       ***/
      set data(newData) {
        userData = newData;
        $window.localStorage[localStorageKey] = JSON.stringify(userData);
      },
      /***
       * returns userData if the reference is truthy
       * otherwise, pull userData from localStorage
       * return default userData if none exists in local storage
       * parse the localStorage and validate top level attributes of local storage
       * return the parsed obj or an error if validation/parsing fails
       ***/
      get data() {
        var localUserData;
        //if userData has already been populated
        if (userData) return userData;
        //otherwise, query localStorage for saved application data
        localUserData = $window.localStorage[localStorageKey];
        //if no local object exists, return the new json obj
        if (!localUserData) return defaultUserData();
        //if something was returned from localStorage
        try {
          localUserData = JSON.parse(localUserData);
        } catch (e) {
          console.log(e);
          throw corruptUserData();
        }
        //if the object doesn't have correct top level properties, throw it
        if (!localUserData.usedCustomScores || !localUserData.providers || !localUserData.scores)
          throw corruptUserData();
        return userData = localUserData;
      }
    }
  });
