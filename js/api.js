
//var spend = "https://api.imigames.io/api/v1/lg/wallet/spend/";
//var save = "https://api.imigames.io/api/v1/lg/game-records/v2/";
//var highscore = "https://api.imigames.io/api/v1/lg/game-records/leaderboard?uuid=";

var IMI_DATA = require('../imi_data').data();

var spend = "https://api.staging.imigames.io/api/v1/lg/wallet/spend/";
var save = "https://api.staging.imigames.io/api/v1/lg/game-records/v2/";
var highscore = "https://api.staging.imigames.io/api/v1/lg/game-records/leaderboard?uuid=";
var revive_0 = "https://api.staging.imigames.io/api/v1/lg/game/user/purchase_spend/" + IMI_DATA.REVIVE_1;
var revive_1 = "https://api.staging.imigames.io/api/v1/lg/game/user/purchase_spend/" + IMI_DATA.REVIVE_2;
var revive_2 = "https://api.staging.imigames.io/api/v1/lg/game/user/purchase_spend/" + IMI_DATA.REVIVE_3;
var init_oponent = "https://api.staging.imigames.io/api/v1/lg/game-records/upper-score?game_uuid=";
var current_oponent = "https://api.staging.imigames.io/api/v1/lg/game-records/upper-score?game_uuid=";

var saveachievement = "https://api.staging.imigames.io:443/api/v1/lg/game_play_state/save";
var getachievement = "https://api.staging.imigames.io:443/api/v1/lg/game_play_state/";

var gameID = IMI_DATA.GAME_ID;
var leaderboardID = IMI_DATA.LB_ID;

var language = "";
var authtoken = "";
var sessiontoken = "";
var submitscore = 0;
var lockkey = IMI_DATA.SCORE_LOCK;

var achievementData = "";

//===================
var revive_count;

var url = "";

export default class API {

    static savetoken(callback1, callback2) {

        url = new URL(window.location.href);
        authtoken = "Bearer " + url.searchParams.get("user");
        language = url.searchParams.get("language");

        callback1(language);

        //TODO:REMOVE
        //authtoken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIZXNoYW4gU3VkYXJzaGFuYSIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE1NDA0NTkwMjgsImV4cCI6MTU3MTk5NTAyOCwidWQiOiJhYjNjMGVlNC1jYTJjLTQwMjAtOTFiYS0xYzBjZTNkMmMxYzUiLCJ0eXBlIjoiQUNDRVNTIn0.bTK0_W3_xFbd83d77XNDk9gIZ0cun6HUuYRxWeXaXqA';
        //authtoken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJJbmRpa2EgV2lqZXNvb3JpeWEiLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNTQyMjYzNDMwLCJleHAiOjE1NzM3OTk0MzAsInVkIjoiYTk4ZTU5ZWQtMjU1Zi00NGE1LWFhOTQtNDJkYjM3ZjUxMTg1IiwidHlwZSI6IkFDQ0VTUyJ9.PLX8wGFE6k_ag5AFDlLu8_mP1cnvoUl1jUffx9QESe0';
        //authtoken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJLYWxhbmEgRGlzc2FuYXlha2UiLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNTM5NjAyNzYxLCJleHAiOjE1NzExMzg3NjEsInVkIjoiNWQxYzk1OTktZmNjNy00NmQzLWJkNmEtYWY4YjJiZjY0MTllIiwidHlwZSI6IkFDQ0VTUyJ9.h98HylP_I4fTBLJ9TsWUCXCAvZ6rh2C0Rvr8C1RncSo';

        API.gethighscore(function (k) {
            callback2(k);
        });

    }

    static spendcoins(callback) {

        url = spend + "" + gameID;
        var request = new XMLHttpRequest();

        request.open('POST', url, true);
        request.setRequestHeader('Authorization', authtoken);
        request.send();
        request.onreadystatechange = processRequest;
        function processRequest(e) {
            if (request.readyState == 4) {

                if (request.status == 200) {

                    var response = JSON.parse(request.responseText);
                    sessiontoken = response.data;

                    revive_count = 0 ^ lockkey;

                    callback(true);
                }
                else {

                    //callback(false);
                    callback(true);
                }
            }

        }

    }

    static setscore(score) {
        submitscore = score ^ lockkey;
    }

    static appendscore(addon) {

        submitscore = submitscore ^ lockkey;
        submitscore = submitscore + addon;
        submitscore = submitscore ^ lockkey;
    }

    //=======================================
    static incReviveCount() {

        revive_count = revive_count ^ lockkey;
        revive_count = revive_count + 1;
        revive_count = revive_count ^ lockkey;

        console.log("REVIVE COUNT>>> " + API.getreviveCount());

    }

    static getreviveCount() {
        return revive_count ^ lockkey;
    }

    static getscore() {
        return submitscore ^ lockkey;
    }

    static submitscore(callback) {

        var num1 = (((submitscore ^ lockkey) << 5) | ((submitscore ^ lockkey) >>> 27)) ^ IMI_DATA.P_SCORE;
        var num2 = (((submitscore ^ lockkey) << 4) | ((submitscore ^ lockkey) >>> 28)) ^ IMI_DATA.Q_SCORE;
        var num3 = (((submitscore ^ lockkey) << 3) | ((submitscore ^ lockkey) >>> 29)) ^ IMI_DATA.Z_SCORE;

        url = save + "" + num1 + "/" + num2 + "/" + num3;
        var request = new XMLHttpRequest();

        request.open('POST', url, true);
        request.setRequestHeader('Authorization', authtoken);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send("{\"score\" : \"" + (submitscore ^ lockkey) + "\",\"leaderboardUUID\" : \"" + leaderboardID + "\",\"gameUUID\" : \"" + gameID + "\",\"token\" : \"" + sessiontoken + "\"}");
        request.onreadystatechange = processRequest;
        function processRequest(e) {
            if (request.readyState == 4) {

                if (request.status == 201) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            }
        }

    }

    static gethighscore(callback) {
        url = highscore + "" + leaderboardID;
        var request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.setRequestHeader('Authorization', authtoken);
        request.send();
        request.onreadystatechange = processRequest;
        function processRequest(e) {
            if (request.readyState == 4) {
                if (request.status == 200) {

                    var response = JSON.parse(request.responseText);
                    callback(response.data);
                }
                
            }
        }

    }

    static revivetheplayer(callback) {

        //==========================
        if (API.getreviveCount() === 3) {
            callback(false);
            return;
        }


        switch (API.getreviveCount()) {

            case 0:
                //console.log("00000000000000000");
                url = revive_0;
                break;

            case 1:
                //console.log("11111111111111111");
                url = revive_1;
                break;

            case 2:
                //console.log("22222222222222222");
                url = revive_2;
                break;

        }


        var request = new XMLHttpRequest();

        request.open('POST', url, true);
        request.setRequestHeader('Authorization', authtoken);
        request.setRequestHeader('x-platform', 'web');
        request.send();
        request.onreadystatechange = processRequest;
        function processRequest(e) {
            if (request.readyState == 4) {
                if (request.status == 201) {

                    //===================
                    API.incReviveCount();
                    callback(true);

                }
                else {
                    callback(false);
                }
            }

        }
    }

    static init_oponent(callback) {
        url = init_oponent+gameID;
        
        var request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.setRequestHeader('Authorization', authtoken);
        request.send();
        request.onreadystatechange = processRequest;

        function processRequest(e) {
            if (request.readyState == 4) {
                if (request.status == 200) {

                    var response = JSON.parse(request.responseText);
                    console.log(response);
                    console.log(response.data.user_name+ ", "+ response.data.score+", "+ response.data.user_image +", "+ response.data.userUUID);
                    callback(response.data.user_name , response.data.score, response.data.user_image, response.data.userUUID);
                }
            }
        }
    }

    static get_current_oponent(callback) {
        let score = submitscore^lockkey;
        url = current_oponent+gameID+"&score="+score;

        var request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.setRequestHeader('Authorization', authtoken);
        request.send();
        request.onreadystatechange = processRequest;

        function processRequest(e) {
            if (request.readyState == 4) {
                if (request.status == 200) {

                    var response = JSON.parse(request.responseText);
                    console.log(response.data);
                    callback(response.data.user_name , response.data.score, response.data.user_image, response.data.userUUID);
                }
                
            }
        }
    }

    static setachievementData(data)
    {
        achievementData = data;
    }

    static save_achievement(callback) {
        url = saveachievement;
        var request = new XMLHttpRequest();

        request.open('POST', url, true);
        request.setRequestHeader('Authorization', authtoken);
        request.setRequestHeader('Content-Type', 'application/json');

        var data = "{\"hashValue\" : \"" + achievementData + "\",\"gameUUID\" : \"" + gameID + "\"}";

        request.send(data);
        request.onreadystatechange = processRequest;
        function processRequest(e) {
            if (request.readyState == 4) {
                callback();
            } 
        }
    }

    static get_achievement(callback) {
        url = getachievement + gameID;
        var request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.setRequestHeader('Authorization', authtoken);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();
        request.onreadystatechange = processRequest;
        function processRequest(e) {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    var response = JSON.parse(request.responseText);
                    callback(response.data);
                }
                else if(request.status == 500)
                {
                    callback(null)
                }
            }
        }
    }
}
