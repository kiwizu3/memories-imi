//"use strict";
import * as PIXI from 'pixi.js'
import PIXI_Sound from 'pixi-sound'
import API from './api'

document.addEventListener("DOMContentLoaded", init);

//PIXI
var renderer;
var stage;
var PIXI_Loader;

//UI
var errorDialogSprite;
var rotDialogSprite;
var inGameUIContainer;
var topUIContainer;
var bottomUIContainer;

var playSprite;
var helpSprite;
var audioSprite;


var selectedLanguageButtonFrame;
var selectedLanguageButtonTex;

var siSprite;
var enSprite;
var taSprite;

var titleTex;
var titleFrame;
var titleSprite;
var homeBtnSprite;

var common_dialog_Sprite;
var revive_btn_Sprite;
var revive_txt;
var revive_msg;
var revive_value;
var error_txt;
var score_error_msg;
var coins_error_msg;
var close_btn_Sprite;
var refresh_btn_Sprite;
var tuteSprite;

var language_ID = 2;
var audioBtnFrame;
var audioBtnTex;

var tuteContTex;
var tuteContFrame;

var high_Score_lbl;
var high_Score_val = 0;
var highScoreTxt='HIGH SCORE\n';

var gameOver_lbl;

var common_dialog_close_func;

//LOOP
var tLastFrame = 0;
var tDelta = 0;
var request_Anim_ID;
var isPaused = false;

//GAME
var isGameLoaded = false;
var isInitMenu = false;
var isInitPlay = false;
var isGameOver = false;
var isPlaying = false;

var smoothStep;
var gameTicks = 0;

var isMenu = false;
var isRemoveUI = false;

var isRevive = false;
var tuteFrameID = -1;

var bg_X = 0;

var score_lbl;

//TODO: Remove
var Debug_SCORE_ButtonSprite;
var Debug_END_ButtonSprite;

//Audio
var sound_sprite_Ins;
var bg_audio_Ins;

var isAudioOn = true;

var playTute = false;

const audio_sprites = {
    'G_C': { start: 0.000, end: 0.287 },//Button Click
    'NextRound': { start: 0.323, end: 0.674 },
    'Flip': { start: 0.674, end: 1.166 },
    'SuccessFlip': { start: 1.177, end: 2.161 }
};

var platform;
//==================
const MIN_COUNT = 2;
let gridSize = MIN_COUNT;
let gridCellCount = 0;

var levelUpMaxCount = 3;
var currentLevelUpCount = 0;
var greyTex;
var redTex;
var nextRoundBool;
var nextRoundTicks = 0;
var playerCurrentScore;
var backToHome;
var achievementResponseInternalServerError;
var reTry;
var robot;
var maxGridReach;

var achievementDataObj = {
    gridSize: 2
};

let GridCellParent = {
    cellState:{
        no_state:-1,      
        start_state:0,      
        show_state:1,
        end_state:2,
        flip_state:3,
        quick_flip_on:4,
        quick_flip_off:5     
    },

    scaleLimit : 10,
    showLimit :100,
    scaleFac:1,
    onClick: function () {

    },

    start:function(){

       this.state = this.cellState.start_state;
       this.gameTicks = 0;
       this.sprite.scale.set(1,0);
       this.scaleFac = 1/this.scaleLimit;
       this.sprite.interactive = false;
    },

    flip:function(){
        this.state = this.cellState.quick_flip_on;
        this.sprite.scale.set(1);
        this.gameTicks=0;
        this.scaleFac = 1/this.scaleLimit;
        this.sprite.interactive = false;

        if (isAudioOn)
            sound_sprite_Ins.play('Flip');
    },

    update:function(tDelta){

        if(this.state === this.cellState.start_state){
      
            this.gameTicks += (tDelta * 0.06);
            this.gameTicks = this.gameTicks > this.scaleLimit ? this.scaleLimit : this.gameTicks;

            this.smoothStep = this.gameTicks * this.scaleFac;
            this.smoothStep = 3 * this.smoothStep * this.smoothStep - 2 * this.smoothStep * this.smoothStep * this.smoothStep;
            
            this.sprite.scale.set(1,this.smoothStep);

            if(this.gameTicks === this.scaleLimit){
               this.state = this.cellState.show_state;
               this.sprite.scale.set(1);
               this.gameTicks=0;
               this.scaleFac = 1/this.showLimit;

            }
           
        }
        else if(this.state === this.cellState.show_state){

            this.gameTicks += (tDelta * 0.06);
            this.gameTicks = this.gameTicks > this.showLimit ? this.showLimit : this.gameTicks;

            if(this.gameTicks === this.showLimit){
               this.state = this.cellState.end_state;
               this.gameTicks = 0;
               this.scaleFac = 1/this.scaleLimit;
            }

        }
        else if(this.state === this.cellState.end_state){
      
            this.gameTicks += (tDelta * 0.06);
            this.gameTicks = this.gameTicks > this.scaleLimit ? this.scaleLimit : this.gameTicks;

            this.smoothStep = this.gameTicks * this.scaleFac;
            this.smoothStep = 3 * this.smoothStep * this.smoothStep - 2 * this.smoothStep * this.smoothStep * this.smoothStep;
            
            this.sprite.scale.set(1,1-this.smoothStep);

            if(this.gameTicks === this.scaleLimit){
               this.state = this.cellState.flip_state;
               this.sprite.texture = this.defaultTex;
               this.sprite.scale.set(1,0);
               this.gameTicks=0;
            }
           
        }
        else if(this.state === this.cellState.flip_state){

            this.gameTicks += (tDelta * 0.06);
            this.gameTicks = this.gameTicks > this.scaleLimit ? this.scaleLimit : this.gameTicks;

            this.smoothStep = this.gameTicks * this.scaleFac;
            this.smoothStep = 3 * this.smoothStep * this.smoothStep - 2 * this.smoothStep * this.smoothStep * this.smoothStep;
            
            this.sprite.scale.set(1,this.smoothStep);

            if(this.gameTicks === this.scaleLimit){
               this.state = this.cellState.no_state;
               this.sprite.scale.set(1);
               this.gameTicks=0;
               this.scaleFac = 1/this.showLimit;

               this.sprite.interactive = true;
            }

        }
        else if(this.state === this.cellState.quick_flip_on){

            this.gameTicks += (tDelta * 0.06);
            this.gameTicks = this.gameTicks > this.scaleLimit ? this.scaleLimit : this.gameTicks;

            this.smoothStep = this.gameTicks * this.scaleFac;
            this.smoothStep = 3 * this.smoothStep * this.smoothStep - 2 * this.smoothStep * this.smoothStep * this.smoothStep;
            
            this.sprite.scale.set(1,1-this.smoothStep);

            if(this.gameTicks === this.scaleLimit){
               this.state = this.cellState.quick_flip_off;
               this.sprite.texture = this.isRed?this.redTex:this.defaultTex;
               this.sprite.scale.set(1,0);
               this.gameTicks=0;
            }
         
        }
        else if(this.state === this.cellState.quick_flip_off){

            this.gameTicks += (tDelta * 0.06);
            this.gameTicks = this.gameTicks > this.scaleLimit ? this.scaleLimit : this.gameTicks;

            this.smoothStep = this.gameTicks * this.scaleFac;
            this.smoothStep = 3 * this.smoothStep * this.smoothStep - 2 * this.smoothStep * this.smoothStep * this.smoothStep;
            
            this.sprite.scale.set(1,this.smoothStep);

            if(this.gameTicks === this.scaleLimit){
                this.sprite.scale.set(1);
                if(this.isRed)this.state = this.cellState.no_state;
                else this.state = this.cellState.end_state;
                this.gameTicks = 0;
                this.scaleFac = 1/this.scaleLimit;
            }
        }
        
    },

    remove:function(){
        this.state = this.cellState.no_state;
        this.gameTicks = 0;
        this.sprite.scale.set(1,0);
        this.sprite.interactive = false;
    }
}

function GridCell(x,y,defaultTex,redTex){

    this.state = this.cellState.no_state;
    this.gameTicks = 0;
    this.smoothStep = 0;
    this.scaleFac = 1/this.scaleLimit;

    this.redTex = redTex;
    this.defaultTex = defaultTex;
    this.sprite = new PIXI.Sprite(defaultTex);
    this.sprite.position.set(x,y);
    this.sprite.scale.set(1,0);
    this.sprite.anchor.set(0.5);
    this.isActive = true;

}

GridCell.prototype = GridCellParent;

let cellArray = [];
let cellArrayEndPoint = 0;

let patternVal_1 = 0;
let patternVal_2 = 0;

let clickedPatternVal_1 = 0;
let clickedPatternVal_2 = 0;

//PARTICLES==
var dust_sprites_Plus;
var dust_ary_Plus;
var dust_tick;
var curve_step;

var isemitting_particles;

const particle_dir = {
    T_L: 0,
    T_R: 1,
    B_R: 2,
    B_L: 3,
    L: 4,
    R: 5,
    T: 6,
    B: 7,
    ALL:8
};

//==================


//Init==================
function init() {

    let url = new URL(window.location.href);
    platform = url.searchParams.get("platform");

    if(platform){
        console.log("is pwa")
    }

    revive_value = 10;

    renderer =new PIXI.Renderer({ width: 576, height: 1024, transparent: true, autoDensity: true, backgroundColor: 0X2f015a }); 
    //PIXI.autoDetectRenderer(576, 1024, { antialis: false, transparent: false, resolution: 1, backgroundColor: 0x00001f, preserveDrawingBuffer: true });
    renderer.autoResize = true;
    // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;

    // var shaderCode = document.getElementById("shader").innerHTML;

    // camShader = new PIXI.Filter('',shaderCode);


    stage = new PIXI.Container();

    renderer.render(stage);

    document.body.appendChild(renderer.view);

    window.onresize = resize;
    window.addEventListener('orientationchange', doOnOrientationChange);

    document.addEventListener("visibilitychange", onVisibilityChanged, false);
    document.addEventListener("mozvisibilitychange", onVisibilityChanged, false);
    document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
    document.addEventListener("msvisibilitychange", onVisibilityChanged, false);

    resize();

    //Load Assets
    //PIXI.loader
    PIXI_Loader = new PIXI.Loader;
    PIXI_Loader
        .add([
            "images/intro.png",
            "images/error.png",
            "images/UI_Sprite_Sheet.png",
            "images/tute.png",
            "images/rot.png",

            //TODO: ADD GAME SPRITE

            "fonts/eng.fnt",
            "fonts/sin.fnt",
            "fonts/tam.fnt",

            "audio/sfx_v2.mp3",
            "audio/bg.mp3"
        ])
        .on("progress", loadHandler)
        .on('complete', loadComplete)
        .load(setup);

    var graphics = new PIXI.Graphics();

    stage.addChild(graphics);

    var LoadingIconTex;
    var LoadingIconSprite;

    function loadHandler(loader, res) {

        resize();

        if (res.url === 'images/intro.png') {

            LoadingIconTex = PIXI_Loader.resources['images/intro.png'].texture;
            LoadingIconSprite = new PIXI.Sprite(LoadingIconTex);
            LoadingIconSprite.y = 150;
            LoadingIconSprite.x = 188;

            stage.addChild(LoadingIconSprite);

        }

        graphics.clear();

        graphics.beginFill(0x3333ff,1);

        graphics.drawRect(163, 400, loader.progress * 2.5, 10);

        graphics.endFill();

        graphics.beginFill(0x3333ff, 0);

        graphics.lineStyle(2, 0xffffff, 1);

        graphics.drawRect(163, 400, 250, 10);

        graphics.endFill();

    }

    function loadComplete(loader, res) {

        stage.removeChild(graphics);
        stage.removeChild(LoadingIconSprite);
        //Keep for GC to clean !!!

    }

    function setup() {

        playTute = false;

        if (document.cookie === "") {
            playTute = true;
        }

        sound_sprite_Ins = PIXI_Loader.resources["audio/sfx_v2.mp3"].sound;
        sound_sprite_Ins.addSprites(audio_sprites);

        bg_audio_Ins = PIXI_Loader.resources["audio/bg.mp3"].sound;
        bg_audio_Ins.loop=true;
        bg_audio_Ins.play();
        //================

        //UI==============================
        var UI_texture_atlas = PIXI_Loader.resources["images/UI_Sprite_Sheet.png"].texture;

        //#region Common UI///////
        var errorTex = PIXI_Loader.resources["images/error.png"].texture;
        errorDialogSprite = new PIXI.Sprite(errorTex);
        errorDialogSprite.interactive = true;
        errorDialogSprite.on('pointerdown', () => { stage.removeChild(errorDialogSprite); });

        var rotTex = PIXI_Loader.resources["images/rot.png"].texture;
        rotDialogSprite = new PIXI.Sprite(rotTex);
        rotDialogSprite.interactive = true;

        var common_dialogTex = new PIXI.Texture(UI_texture_atlas);
        common_dialogTex.frame = new PIXI.Rectangle(25, 375, 400, 101);
        common_dialog_Sprite = new PIXI.Sprite(common_dialogTex);
        common_dialog_Sprite.position.set(88, 1200);//700


        var closeTex = new PIXI.Texture(UI_texture_atlas);
        closeTex.frame = new PIXI.Rectangle(150, 250, 58, 61);
        close_btn_Sprite = new PIXI.Sprite(closeTex);
        common_dialog_Sprite.addChild(close_btn_Sprite);

        close_btn_Sprite.position.set(371, -31);
        close_btn_Sprite.on('pointerdown', () => {
            common_dialog_close_func();
            if (isAudioOn)
                sound_sprite_Ins.play('G_C');
        });

        var refreshTex = new PIXI.Texture(UI_texture_atlas);
        refreshTex.frame = new PIXI.Rectangle(250, 250, 58, 61);
        refresh_btn_Sprite = new PIXI.Sprite(refreshTex);
        common_dialog_Sprite.addChild(refresh_btn_Sprite);

        refresh_btn_Sprite.position.set(171, 80);
        refresh_btn_Sprite.on('pointerdown', () => {

            resubmit_score_yes();

            if (isAudioOn)
                sound_sprite_Ins.play('G_C');

        });

        var reveiveTex = new PIXI.Texture(UI_texture_atlas);
        reveiveTex.frame = new PIXI.Rectangle(450, 325, 317, 51);
        revive_btn_Sprite = new PIXI.Sprite(reveiveTex);

        score_error_msg = "SCORE SUBMIT ERROR\nPLEASE TRY AGAIN";//EN
        coins_error_msg = "INSUFFICIENT COIN BALANCE!";

        error_txt = new PIXI.BitmapText(coins_error_msg, { font: '24px FMGanganee', align: "center" });

        error_txt.tint = 0xf7c31e;
        error_txt.anchor.set(0.5);
        error_txt.position.set(200, 50);


        revive_msg = "   X               KEEP PLAYING";
        revive_txt = new PIXI.BitmapText(revive_value + revive_msg, { font: '24px Insaniburger', align: "left" });
        revive_txt.tint = 0x002142;
        revive_btn_Sprite.addChild(revive_txt);
        revive_txt.anchor.set(0, 0.5);
        revive_txt.position.set(10, 25);

        common_dialog_Sprite.addChild(error_txt);
        revive_btn_Sprite.visible = false;
        common_dialog_Sprite.addChild(revive_btn_Sprite);
        revive_btn_Sprite.position.set(41, 25);
        revive_btn_Sprite.on('pointerdown', revive_yes);

        //#endregion

        //#region game over//////

        gameOver_lbl = new PIXI.BitmapText("GAME OVER", { font: '80px Insaniburger', align: "center" });
        gameOver_lbl.anchor.set(0.5);
        gameOver_lbl.position.set(288, 600);//-600

        var homeBtnTex = new PIXI.Texture(UI_texture_atlas);
        homeBtnTex.frame = new PIXI.Rectangle(250, 25, 194, 200);
        homeBtnSprite = new PIXI.Sprite(homeBtnTex);
        homeBtnSprite.interactive = true;
        homeBtnSprite.on('pointerdown', () => {

            resetGame();

            if (isAudioOn)
                sound_sprite_Ins.play('G_C');
        });

        gameOver_lbl.tint = 0x05263f;

        homeBtnSprite.anchor.set(0.5);
        homeBtnSprite.position.set(0, 300);

        gameOver_lbl.addChild(homeBtnSprite);

        //#endregion //////////////

        //#region In Game////////////
        inGameUIContainer = new PIXI.Container();

        var scoreTex = new PIXI.Texture(UI_texture_atlas);
        scoreTex.frame = new PIXI.Rectangle(800, 325, 200, 75);
        var scoreSprite = new PIXI.Sprite(scoreTex);
        inGameUIContainer.addChild(scoreSprite);
        scoreSprite.position.set(366, 10);

        score_lbl = new PIXI.BitmapText("0", { font: '40px Insaniburger', align: "left" });
        inGameUIContainer.addChild(score_lbl);
        score_lbl.anchor.set(0.5);
        score_lbl.position.set(466, 47);

        let reTryTex = new PIXI.Texture(UI_texture_atlas);
        reTryTex.frame = new PIXI.Rectangle(252, 254, 54, 55);
        reTry = new PIXI.Sprite(reTryTex);
        inGameUIContainer.addChild(reTry);
        reTry.position.set(45, 130);
        reTry.interactive = false;

        reTry.on('pointerdown', () => {
            if (isAudioOn)
                sound_sprite_Ins.play('G_C');

            CreateGrid(gridSize,greyTex,redTex);
        });

        let backToHomeTex = new PIXI.Texture(UI_texture_atlas);
        backToHomeTex.frame = new PIXI.Rectangle(249, 25, 196, 201);
        backToHome = new PIXI.Sprite(backToHomeTex);
        inGameUIContainer.addChild(backToHome);
        backToHome.position.set(25, 15);
        backToHome.interactive = true;
        backToHome.scale.set(0.5);

        backToHome.on('pointerdown', () => {
            if (isAudioOn)
                sound_sprite_Ins.play('G_C');

            if(achievementResponseInternalServerError){
                console.log("Internal Server Error");
                API.get_achievement(GetAchievementCallBack);
            }

            if(!achievementResponseInternalServerError && (gridSize > achievementDataObj.gridSize || maxGridReach)){
                console.log("Save State Success");
                achievementDataObj.gridSize = gridSize;

                if(maxGridReach)
                    achievementDataObj.gridSize = 8;

                var base64value = btoa(JSON.stringify(achievementDataObj));
                API.setachievementData(base64value);
                API.save_achievement(achievementCloseBtnClick);
            }
            else{
                console.log("Save State failure");
                achievementCloseBtnClick();
            }

            backToHome.interactive = false;
            backToHome.alpha= 0.5;
        });

        let robotTex = new PIXI.Texture(UI_texture_atlas);
        robotTex.frame = new PIXI.Rectangle(750 ,650 ,167 ,100);
        robot = new PIXI.Sprite(robotTex);
        inGameUIContainer.addChild(robot);
        robot.anchor.set(0.5);
        robot.position.set(288, 925);
        robot.ticks = 0;
        robot.steps = 0;
        robot.shakeTicks = 0;
        robot.shakeSteps = 0;
        robot.rotateSide = 1;
        robot.shakeCount = 0;
        robot.anim = false;

        //#endregion ////////////////

        //#region Menu////////////
        high_Score_lbl = new PIXI.BitmapText(" ", { font: '40px Insaniburger', align: "center" });
        high_Score_lbl.anchor.set(0.5);
        high_Score_lbl.position.set(288, 60);

        var tuteTex = PIXI_Loader.resources["images/tute.png"].texture;

        var tuteBgTex = new PIXI.Texture(tuteTex);
        tuteBgTex.frame = new PIXI.Rectangle(1000, 1000, 10, 10);
        let tutebg = new PIXI.Sprite(tuteBgTex);
        tutebg.width = 350;
        tutebg.height = 600;
        tutebg.position.set(-20,-30);
        tutebg.interactive = true;
        tuteSprite = new PIXI.Container();
        tuteSprite.addChild(tutebg);
        tuteSprite.scale.set(2);

        tuteContTex = new PIXI.Texture(tuteTex);
        tuteContFrame = new PIXI.Rectangle(0, 0, 306, 512);
        tuteContTex.frame = tuteContFrame;
        var tuteContSp = new PIXI.Sprite(tuteContTex);
        tuteContSp.scale.set(0.75);
        tuteContSp.position.set(27, 64);
        var tuteCloseBtn = new PIXI.Sprite(closeTex);
        tuteCloseBtn.scale.set(0.5);
        tuteCloseBtn.position.set(240, 50);
        tuteCloseBtn.interactive = true;

        tuteCloseBtn.on('pointerdown', () => {

            tuteFrameID = -1;
            stage.removeChild(tuteSprite);
            if (isAudioOn)
                sound_sprite_Ins.play('G_C');

            if(playTute){
                playTute=false;
                document.cookie = "init=1";
                playButtonClick();
            }
        });

        tuteSprite.addChild(tuteContSp);
        tuteSprite.addChild(tuteCloseBtn);

        topUIContainer = new PIXI.Container();
        var helpTex = new PIXI.Texture(UI_texture_atlas);
        helpTex.frame = new PIXI.Rectangle(25, 250, 80, 84);
        helpSprite = new PIXI.Sprite(helpTex);
        helpSprite.interactive = true;
        helpSprite.on('pointerdown', () => {

            tuteContFrame.x = 0;
            tuteContFrame.y = 0;
            tuteContTex.updateUvs();
            gameTicks = 0;
            tuteFrameID = 0;
            stage.addChild(tuteSprite);

            if (isAudioOn)
                sound_sprite_Ins.play('G_C');

            if (playTute) {
                playTute = false;
                document.cookie = "init=1";
            }
        });

        topUIContainer.addChild(helpSprite);
        topUIContainer.addChild(high_Score_lbl);
        helpSprite.position.set(486, 20);

        audioBtnTex = new PIXI.Texture(UI_texture_atlas);
        audioBtnFrame = new PIXI.Rectangle(925, 150, 80, 84);
        audioBtnTex.frame = audioBtnFrame;
        audioSprite = new PIXI.Sprite(audioBtnTex);

        audioSprite.interactive = true;
        audioSprite.on('pointerdown', toggleAudio);

        topUIContainer.addChild(audioSprite);
        audioSprite.position.set(10, 20);

        topUIContainer.position.set(0, -200);

        bottomUIContainer = new PIXI.Container();

        var siTex = new PIXI.Texture(UI_texture_atlas);
        siTex.frame = new PIXI.Rectangle(625, 25, 107, 112);
        siSprite = new PIXI.Sprite(siTex);

        siSprite.interactive = true;
        siSprite.lan = 0;
        siSprite.on('pointerdown', changeLanguageBtnClick);

        bottomUIContainer.addChild(siSprite);
        siSprite.position.set(64, 0);

        var enTex = new PIXI.Texture(UI_texture_atlas);
        enTex.frame = new PIXI.Rectangle(775, 175, 107, 112);
        enSprite = new PIXI.Sprite(enTex);

        selectedLanguageButtonTex = enTex;
        selectedLanguageButtonFrame = enTex.frame;

        enSprite.interactive = true;
        enSprite.lan = 2;
        enSprite.on('pointerdown', changeLanguageBtnClick);

        bottomUIContainer.addChild(enSprite);
        enSprite.position.set(405, 0);

        var taTex = new PIXI.Texture(UI_texture_atlas);
        taTex.frame = new PIXI.Rectangle(475, 25, 107, 112);
        taSprite = new PIXI.Sprite(taTex);

        taSprite.interactive = true;
        taSprite.lan = 1;
        taSprite.on('pointerdown', changeLanguageBtnClick);

        bottomUIContainer.addChild(taSprite);
        taSprite.position.set(234, 0);

        bottomUIContainer.y = 1050;

        var playTex = new PIXI.Texture(UI_texture_atlas);
        playTex.frame = new PIXI.Rectangle(25, 25, 194, 200);
        playSprite = new PIXI.Sprite(playTex);
        playSprite.position.set(191, -300);

        playSprite.interactive = true;
        playSprite.on('pointerdown', playButtonClick);

        titleTex = new PIXI.Texture(UI_texture_atlas);
        titleFrame = new PIXI.Rectangle(25, 800, 215, 200);
        titleTex.frame = titleFrame;
        titleSprite = new PIXI.Sprite(titleTex);
        titleSprite.anchor.set(0.5);
        titleSprite.position.set(288, -200);
        //#endregion       


        //#region DEBUG

        Debug_SCORE_ButtonSprite = new PIXI.Sprite(refreshTex);
        Debug_SCORE_ButtonSprite.interactive = true;
        Debug_SCORE_ButtonSprite.position.set(259, 512);

        Debug_SCORE_ButtonSprite.on('pointerdown', () => {

            if (isAudioOn)
                sound_sprite_Ins.play('G_C');

            add_Score(3);
        });

        Debug_END_ButtonSprite = new PIXI.Sprite(closeTex);
        Debug_END_ButtonSprite.interactive = true;
        Debug_END_ButtonSprite.position.set(259, 600);

        Debug_END_ButtonSprite.on('pointerdown', () => {

            if (isAudioOn)
                sound_sprite_Ins.play('G_C');

            player_failed();

        });

        //#endregion


        //Add TO STAGE
        stage.addChild(topUIContainer);
        stage.addChild(bottomUIContainer);
        stage.addChild(titleSprite);
        stage.addChild(playSprite);
        
        //=================
        greyTex = new PIXI.Texture(UI_texture_atlas);
        greyTex.frame = new PIXI.Rectangle(640 ,520 ,64 ,64);
        
        redTex = new PIXI.Texture(UI_texture_atlas);
        redTex.frame = new PIXI.Rectangle(550 ,520 ,64 ,64);

        //CreateGrid(gridSize,greyTex,redTex);
        //=================

        isGameLoaded = true;

        gameTicks = 0;
        isInitMenu = true;

        API.setscore(0);
        API.savetoken(languageCallBack, highScoreCallBack);

        resize();
        doOnOrientationChange();
    }

    tLastFrame = performance.now();
    game_update(tLastFrame);

}

//Servives==============

function languageCallBack(Netlan) {

    if (Netlan) {

        if (Netlan === "SINHALA") {
            language_ID = 0;
        }
        else if (Netlan === "ENGLISH") {
            language_ID = 2;
        }
        else {

            language_ID = 1;
        }

    }

    else language_ID = 2;

    changeLanguageBtnClick();
}

function highScoreCallBack(hs) {


    console.log(highScoreTxt);
    console.log(high_Score_val);

    high_Score_val = hs | 0;
    high_Score_lbl.text = highScoreTxt + high_Score_val;

}

function playCallBack(net_state) {

    if (net_state) {

        isMenu = false;
        gameTicks = 0;
        isRemoveUI = true;

    }
    else {

        stage.addChild(errorDialogSprite);

        playSprite.interactive = true;
        helpSprite.interactive = true;
        audioSprite.interactive = true;
        siSprite.interactive = true;
        enSprite.interactive = true;
        taSprite.interactive = true;

        playSprite.alpha = 1;
        helpSprite.alpha = 1;
        audioSprite.alpha = 1;
        siSprite.alpha = 1;
        enSprite.alpha = 1;
        taSprite.alpha = 1;

    }


}

function reviveCallBack(net_state) {

    if (net_state) {

        gameTicks = 0;

        stage.removeChild(common_dialog_Sprite);

    }
    else {

        revive_btn_Sprite.visible = false;
        revive_btn_Sprite.interactive = false;

        error_txt.text = coins_error_msg;
        error_txt.visible = true;

        close_btn_Sprite.alpha = 1;
        close_btn_Sprite.interactive = true;

    }

}

function highScoreSubmitCallBack(net_state) {

    console.log("HIGH SCORE CALLBACK"+net_state);

    if (net_state) {

        if (API.getscore() > high_Score_val) {

            high_Score_val = API.getscore() | 0;
            high_Score_lbl.text = highScoreTxt + high_Score_val;
        }

        homeBtnSprite.alpha = 1;
        homeBtnSprite.interactive = true;
    }
    else {

        //setup score submit error dialog
        common_dialog_Sprite.y = 700;
        error_txt.text = score_error_msg;
        error_txt.visible = true;
        refresh_btn_Sprite.interactive = true;
        refresh_btn_Sprite.visible = true;
        revive_btn_Sprite.visible = false;
        revive_btn_Sprite.interactive = false;
        close_btn_Sprite.alpha = 1;
        close_btn_Sprite.interactive = true;
        common_dialog_close_func = resubmit_score_no;
        stage.addChild(common_dialog_Sprite);

    }

}

//UTIL================

function onVisibilityChanged() {
    if (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden) {
        onAppPause(false);
        bg_audio_Ins.stop();
    }
    else {
        onAppPause(true);
        bg_audio_Ins.play();
    }
}

function isMobileDevice() {

    var isiPad = navigator.userAgent.match(/iPhone|iPad|iPod/i);
    if (isiPad) return false;
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);

}

function resize() {

    var ratio = 720 / 1280;
    var w = 0;
    var h = 0;

    if(platform == "pwa"){
        if (isMobileDevice()) {

            console.log("IS MOBILE DEVICE!!!!");
            //    if(Debug_txt)Debug_txt.text="IS MOBILE DEVICE!!!!";

            console.log("Ratios: " + (screen.width / screen.height) + ", " + ratio)
            if (screen.width / screen.height >= ratio) {
                w = screen.height * ratio;
                h = screen.height;
            } else {
                w = screen.width;
                h = screen.width / ratio;
            }

            renderer.view.style.width = w + 'px';
            renderer.view.style.height = h + 'px';

            var y = (screen.height - h) * 0.5;
            var x = (screen.width - w) * 0.5;

            renderer.view.style.margin = y + "px " + x + "px";

        }
        else {

            console.log("IS NOT MOBILE DEVICE!!!!");
            // if(Debug_txt)Debug_txt.text="IS NOT MOBILE DEVICE!!!!";

            console.log("Ratios: " + (window.innerWidth / window.innerHeight) + ", " + ratio)
            if (window.innerWidth / window.innerHeight >= ratio) {
                w = window.innerHeight * ratio;
                h = window.innerHeight;
            } else {
                w = window.innerWidth;
                h = window.innerWidth / ratio;
            }

            renderer.view.style.width = w + 'px';
            renderer.view.style.height = h + 'px';

            var y = (window.innerHeight - h) * 0.5;
            var x = (window.innerWidth - w) * 0.5;

            renderer.view.style.margin = y + "px " + x + "px";
        }
    }
    else
    {
        if (window.innerWidth / window.innerHeight >= ratio) {
            w = window.innerHeight * ratio;
            h = window.innerHeight;
        } else {
            w = window.innerWidth;
            h = window.innerWidth / ratio;
        }
    
        renderer.view.style.width = w + 'px';
        renderer.view.style.height = h + 'px';
    
        var y = (window.innerHeight - h) * 0.5;
        var x = (window.innerWidth - w) * 0.5;
    
        renderer.view.style.margin = y + "px " + x + "px";
    
    }

}

function doOnOrientationChange() {

    switch (window.orientation) {

        case 90:
            stage.addChild(rotDialogSprite);
            onAppPause(false);
            break;
        case -90:
            stage.addChild(rotDialogSprite);
            onAppPause(false);
            break;
        case 0:
            stage.removeChild(rotDialogSprite);
            onAppPause(true);
            break;
    }

    resize();
}

function onAppPause(status) {

    if (status) {

        if (isPaused) {
            tLastFrame = performance.now();
            game_update(tLastFrame);
            isPaused = false;
        }

    }
    else if (request_Anim_ID) {

        if (!isPaused) {
            //console.log("request_Anim_ID..." + request_Anim_ID);
            renderer.render(stage);
            cancelAnimationFrame(request_Anim_ID);
            isPaused = true;
        }

    }

}

//Buttons==========================

function playButtonClick() {

    if (isAudioOn)
            sound_sprite_Ins.play('G_C');

    if(playTute){

        tuteContFrame.x = 0;
        tuteContFrame.y = 0;
        tuteContTex.updateUvs();
        gameTicks = 0;
        tuteFrameID = 0;
        stage.addChild(tuteSprite);
    }
    else{

        playSprite.interactive = false;
        helpSprite.interactive = false;
        audioSprite.interactive = false;
        siSprite.interactive = false;
        enSprite.interactive = false;
        taSprite.interactive = false;

        playSprite.alpha = 0.5;
        helpSprite.alpha = 0.5;
        audioSprite.alpha = 0.5;
        siSprite.alpha = 0.5;
        enSprite.alpha = 0.5;
        taSprite.alpha = 0.5;

        API.spendcoins(playCallBack);

    }
    
}

function changeLanguageBtnClick() {

    var tempID = language_ID;
    console.log(this!=undefined && (this.lan==0||this.lan));
    if (this!=undefined && (this.lan==0||this.lan)) {
        if (language_ID === this.lan) return;
        language_ID = this.lan;
        if (isAudioOn)
            sound_sprite_Ins.play('G_C');
    }

    selectedLanguageButtonFrame.y = 25;
    selectedLanguageButtonTex.updateUvs();

    //new UI title frames may vary in position and size. they are additionally specified in this updated code
    switch (language_ID) {

        case 0://Si
            selectedLanguageButtonTex = siSprite.texture;
            selectedLanguageButtonFrame = siSprite.texture.frame;
            titleFrame.x = 10;
            titleFrame.y = 800;
            titleFrame.width = 500;
            titleFrame.height = 142;
            titleTex.updateUvs();
            high_Score_lbl.font = '40px FMGanganee';
            highScoreTxt = 'jeäu ,l=Kq\n';
            high_Score_lbl.text = highScoreTxt + high_Score_val;

            coins_error_msg = "m%udKj;a fYaIhla fkdue;";//SI

            error_txt.font = '24px FMGanganee';

            gameOver_lbl.font = '80px FMGanganee';
            gameOver_lbl.text = 'bjrdhsæ';

            revive_txt.font = '24px FMGanganee';
            revive_msg = "  «     È.gu fi,a,ï lrkak";
            revive_txt.text = revive_value + revive_msg;

            score_error_msg = ",l=Kq we;=,;a lsßfï fodaIhla'\nkej; W;aidy lrkak'";//SI

            break;
        case 1://Ta

            selectedLanguageButtonTex = taSprite.texture;
            selectedLanguageButtonFrame = taSprite.texture.frame;
            titleFrame.x = 10;
            titleFrame.y = 650;
            titleFrame.width = 500;
            titleFrame.height = 139;
            titleTex.updateUvs();

            high_Score_lbl.font = '40px Baamini';
            highScoreTxt = 'cau; Gs;sp\n';
            high_Score_lbl.text = highScoreTxt + high_Score_val;

            coins_error_msg = "epjp gw;whf;Fiw";//TA
            score_error_msg = "Gs;sp rku;g;gpg;gjpy; gpio.\njaTnra;J kPz;Lk; Kaw;rp nra;f.";//TA

            error_txt.font = '18px Baamini';

            gameOver_lbl.font = '80px Baamini';
            gameOver_lbl.text = 'Ml;lk;\nKbe;jJ!';

            revive_txt.font = '18px Baamini';
            revive_msg = "  ù    njhlu;e;J tpisahLq;fs;";
            revive_txt.text = revive_value + revive_msg;

            break;

        case 2://En

            selectedLanguageButtonTex = enSprite.texture;
            selectedLanguageButtonFrame = enSprite.texture.frame;
            titleFrame.x = 10;
            titleFrame.y = 500;
            titleFrame.width = 500;
            titleFrame.height = 119;
            titleTex.updateUvs();

            high_Score_lbl.font = '40px Insaniburger';
            highScoreTxt = 'HIGH SCORE\n';
            high_Score_lbl.text = highScoreTxt + high_Score_val;

            score_error_msg = "SCORE SUBMIT ERROR\nPLEASE TRY AGAIN";//EN
            coins_error_msg = "INSUFFICIENT COIN BALANCE!";

            error_txt.font = '30px Insaniburger';

            gameOver_lbl.font = '80px Insaniburger';
            gameOver_lbl.text = 'GAME OVER!';

            revive_txt.font = '24px Insaniburger';
            revive_msg = "   X               KEEP PLAYING";
            revive_txt.text = revive_value + revive_msg;

            break;

    }

    selectedLanguageButtonFrame.y = 175;
    selectedLanguageButtonTex.updateUvs();
}

function toggleAudio() {

    if (isAudioOn) {
        isAudioOn = false;
        audioBtnFrame.y = 25;
    }
    else {
        isAudioOn = true;
        audioBtnFrame.y = 150;
    }

    audioBtnTex.updateUvs();

    if (isAudioOn)
        sound_sprite_Ins.play('G_C');

    PIXI_Sound.toggleMuteAll();
}

function resetGame() {

    API.setscore(0);
    score_lbl.text = "" + API.getscore();

    //remove 
    stage.removeChild(inGameUIContainer);
    stage.removeChild(gameOver_lbl);
    stage.removeChild(Debug_SCORE_ButtonSprite);
    stage.removeChild(Debug_END_ButtonSprite);

    PIXI_Loader.reset();

    //bool
    isMenu = false;
    isRemoveUI = false;
    isRevive = false;

    //counts
    gameTicks = 0;

    isInitMenu = true;

    playSprite.interactive = true;
    helpSprite.interactive = true;
    audioSprite.interactive = true;
    siSprite.interactive = true;
    enSprite.interactive = true;
    taSprite.interactive = true;

    playSprite.alpha = 1;
    helpSprite.alpha = 1;
    audioSprite.alpha = 1;
    siSprite.alpha = 1;
    enSprite.alpha = 1;
    taSprite.alpha = 1;
}

function revive_no() {

    stage.removeChild(common_dialog_Sprite);

    gameTicks = 0;

    gameOver_lbl.y = -600;
    stage.addChild(gameOver_lbl);

    if (isAudioOn)
        sound_sprite_Ins.play('G_C');

    homeBtnSprite.alpha = 0.5;
    homeBtnSprite.interactive = false;

    isGameOver = true;

    API.submitscore(highScoreSubmitCallBack);

}

function revive_yes() {

    API.revivetheplayer(reviveCallBack);

    revive_btn_Sprite.interactive = false;
    close_btn_Sprite.interactive = false;
    revive_btn_Sprite.alpha = 0.5;
    close_btn_Sprite.alpha = 0.5;

    if (isAudioOn)
        sound_sprite_Ins.play('G_C');

}

function resubmit_score_yes() {

    //console.log("RESUBMIT...SCORE!!!!");

    common_dialog_Sprite.y = 1200;
    stage.removeChild(common_dialog_Sprite);

    API.submitscore(highScoreSubmitCallBack);

}

function resubmit_score_no() {

    common_dialog_Sprite.y = 1200;
    stage.removeChild(common_dialog_Sprite);

    homeBtnSprite.alpha = 1;
    homeBtnSprite.interactive = true;

}

//GAME LOGIC=====================

function CreateGrid(size,greyTex,redTex) {
    
    let len = size*size;
    gridCellCount = len;
    //create pattern
    generatePattern(len);

    if (len < cellArrayEndPoint) {
        for (let i = len; i < cellArrayEndPoint; i++) {
            cellArray[i].remove();
            stage.removeChild(cellArray[i].sprite);
            cellArray[i].isActive=false;
        }
    }
    
    cellArrayEndPoint = len;
    let existingLen = cellArray.length;
    
    for (let i = 0; i < cellArrayEndPoint; i++) {

        let x = i % size;
        let y = (i/size) | 0;
        
        let xOffset = (576 -(size*62))*0.5 + 31;//72, 36
        let yOffset = (1024 -(size*62))*0.5 + 31;

        //if there is no element create element
        if(existingLen>i){
            let cell = cellArray[i];
            cell.sprite.position.set(xOffset + x * 62, yOffset + y * 62);//72

            if(isRed(i)){
                cell.sprite.texture = redTex;
                cell.isRed = true;
            }
            else {
                cell.sprite.texture = greyTex;
                cell.isRed = false;
            }

            cell.sprite.index = i;
            cell.start();
            if(!cell.isActive)stage.addChild(cell.sprite);
        }
        else{
            let cell = new GridCell(xOffset + x * 62, yOffset + y * 62, greyTex, redTex);
            stage.addChild(cell.sprite);

            if(isRed(i)){
                cell.sprite.texture = redTex;
                cell.isRed = true;
            }
            else {
                cell.sprite.texture = greyTex;
                cell.isRed = false;
            }
            
            cell.sprite.index = i;
            cell.sprite.on('pointerdown',matchPattern);
            cell.start();
            cellArray.push(cell);
        }
    }
}

function generatePattern(len){

    let numberOfBits = (len*0.5)|0;
    
    let maxValue = Math.pow(2,numberOfBits)-1;
    let minValue = (maxValue*0.1)|0;
    if(minValue===0)minValue = 1;
    let maxRange = maxValue-minValue*2;//Math.pow(2,numberOfBits)-1;//max value
    //patternVal_2 = Math.pow(2,numberOfBits)-1;//max value
   
    patternVal_1 = minValue + (maxRange*Math.random())|0;
    patternVal_2 = minValue + (maxRange*Math.random())|0;

    clickedPatternVal_1 = 0;
    clickedPatternVal_2 = 0;
}

function isRed(i){
    let lim = (gridCellCount*0.5)|0;
    //pick var
    let val = 0;
    if(lim > i){
        val = patternVal_1;
    }
    else {
        val = patternVal_2;
        i-=lim;
    }

    //pick bit
    val=val>>>i;
    val = val&1;
    
    return val===1; 
}

function matchPattern(){
    let i = this.index;

    if (cellArray[i].isRed) {
        let lim = (gridCellCount * 0.5) | 0;
        //pick var
        if (lim > i) {
            let val = 1 << i;
            clickedPatternVal_1 |= val;
        }
        else {
            i -= lim;
            //pick bit
            let val = 1 << i;
            clickedPatternVal_2 |= val;
        }

        if(clickedPatternVal_1===patternVal_1&&clickedPatternVal_2===patternVal_2){
            nextRoundBool = true;
            console.log("DONE!!!!");

            robot.anim = true;
            robot.texture.frame.x = 550;   
            robot.texture.updateUvs();
        }

        add_Score(100);

        if (isAudioOn)
            sound_sprite_Ins.play('SuccessFlip');
    }
    else if(!nextRoundBool){
        add_Score(-10);
    }

    cellArray[this.index].flip();
}

function MoveToNextRound(){
    if(gridSize >= 2){
        reTry.visible = true;
        reTry.interactive = true;
    }

    if(gridSize > 3 && currentLevelUpCount >= levelUpMaxCount){
        emit_dust_particles_on_position(288, 512);
        gridSize++;
        currentLevelUpCount = 0;
    }
    else if(gridSize <= 3){
        emit_dust_particles_on_position(288, 512);
        gridSize++;
        currentLevelUpCount = 0;
    }
    
    if(gridSize>7){
        gridSize=MIN_COUNT;

        reTry.visible = false;
        reTry.interactive = false;

        maxGridReach = true;
    }

    if (isAudioOn)
        sound_sprite_Ins.play('NextRound');

    CreateGrid(gridSize,greyTex,redTex);

    currentLevelUpCount++;
}

function achievementCloseBtnClick()
{
    stage.removeChild(inGameUIContainer);
    backToHome.interactive = true;
    backToHome.alpha= 1;

    isPlaying = false;
    
    for (let i = 0; i < cellArray.length; i++) {
        cellArray[i].remove();
        stage.removeChild(cellArray[i].sprite);
        cellArray[i].isActive=false;
    }

    resetGame();
}

function GetAchievementCallBack(data)
{
    if(data != null)
    {
        var response = atob(data);
        console.log(response);

        if(response === ""){
            console.log("Empty response");
            gridSize = 2;
        }
        else{
            achievementDataObj = JSON.parse(response);
        
            gridSize = achievementDataObj.gridSize - 1;
            gridSize = gridSize < 2 ? 2 : gridSize;

            if(gridSize > 2){
                reTry.visible = true;
                reTry.interactive = true;
            }
        } 
        
        achievementResponseInternalServerError = false;
    }
    else
    {
        console.log("Null Achievement response");
        gridSize = 2;
        achievementResponseInternalServerError = true;
    }

    CreateGrid(gridSize,greyTex,redTex);
}

function InitiateGamePlay(){
    stage.addChild(inGameUIContainer);

    reTry.visible = false;
    reTry.interactive = false;

    achievementDataObj.gridSize = 2;
    achievementResponseInternalServerError = true;
    API.get_achievement(GetAchievementCallBack);

    console.log(gridSize);
    init_dust_partice(-10, -10, particle_dir.ALL);
    stage.addChild(dust_sprites_Plus);

    currentLevelUpCount = 0;
    nextRoundTicks = 0;
    backToHome.alpha = 1;
    playerCurrentScore = 0;
    robot.ticks = 0;
    robot.shakeTicks = 0;
    robot.shakeCount = 0;

    backToHome.interactive = true;
    nextRoundBool = false;
    robot.anim = false;
    maxGridReach = false;

    robot.texture.frame.x = 750;   
    robot.texture.updateUvs();
}

//PARTICLES=========================
function init_dust_partice(x,y,dir){

    dust_tick = 0;

    dust_sprites_Plus = new PIXI.ParticleContainer(5, {
        scale: true,
        position: true,
        rotation: true,
        uvs: false,
        alpha: true
    });


    var X_Func;
    var Y_Func;

    switch (dir) {

        case particle_dir.T_L:

            X_Func = function () {
                return (Math.random() * -1);
            };

            Y_Func = function () {
                return (Math.random()*-1);
            };

            break;

        case particle_dir.T_R:

            X_Func = function () {
                return (Math.random());
            };

            Y_Func = function () {
                return (Math.random()*-1);
            };

            break;

        case particle_dir.B_R:

            X_Func = function () {
                return (Math.random());
            };

            Y_Func = function () {
                return (Math.random());
            };

            break;

        case particle_dir.B_L:

            X_Func = function () {
                return (Math.random() * -1);
            };

            Y_Func = function () {
                return (Math.random());
            };

            break;

        case particle_dir.L:

            X_Func = function () {
                return (Math.random());
            };

            Y_Func = function () {
                return (Math.random() * 2 - 1);
            };

            break;

        case particle_dir.R:

            X_Func = function () {
                return (Math.random() * -1);
            };

            Y_Func = function () {
                return (Math.random() * 2 - 1);
            };

            break;

        case particle_dir.T:

            X_Func = function () {
                return (Math.random() * 2 - 1);
            };

            Y_Func = function () {
                return (Math.random()*-1);
            };

            break;

        case particle_dir.B:

            X_Func = function () {
                return (Math.random() * 2 - 1);
            };

            Y_Func = function () {
                return (Math.random());
            };

            break;

        case particle_dir.ALL:

            X_Func = function () {
                return (Math.random() * 2 - 1);
            };

            Y_Func = function () {
                return (Math.random() * 2 - 1);
            };

            break;
    }

    dust_ary_Plus = [];

    var totalSprites = 5;//renderer instanceof PIXI.WebGLRenderer ? 10 : 10;

    for (var i = 0; i < totalSprites; i++) {

        var dust_p = PIXI.Sprite.from('images/dust.png');
        
        dust_p.anchor.set(0.5);
        dust_p.initScale =0.25 + Math.random() * 0.25; 
        dust_p.scale.set(dust_p.initScale);
      
        dust_p.initX =x;
        dust_p.initY =y;
        dust_p.x = x;
        dust_p.y = y;

        dust_p.alpha = 0;
        
        dust_p.x_velocity = 100*X_Func();
        dust_p.y_velocity = 100*Y_Func();

        dust_p.rotation = Math.PI*Math.random()*2;

        // finally we push the dude into the maggots array so it can be easily accessed later
        dust_ary_Plus.push(dust_p);
        dust_sprites_Plus.addChild(dust_p);
    }
}

function reset_dust_particle(x,y,dir){

    dust_tick = 0;

    var totalSprites = dust_ary_Plus.length;//renderer instanceof PIXI.WebGLRenderer ? 10 : 10;
    var X_Func;
    var Y_Func;

    switch (dir) {

        case particle_dir.T_L:

            X_Func = function () {
                return (Math.random() * -1);
            };

            Y_Func = function () {
                return (Math.random()*-1);
            };

            break;

        case particle_dir.T_R:

            X_Func = function () {
                return (Math.random());
            };

            Y_Func = function () {
                return (Math.random()*-1);
            };

            break;

        case particle_dir.B_R:

            X_Func = function () {
                return (Math.random());
            };

            Y_Func = function () {
                return (Math.random());
            };

            break;

        case particle_dir.B_L:

            X_Func = function () {
                return (Math.random() * -1);
            };

            Y_Func = function () {
                return (Math.random());
            };

            break;

        case particle_dir.L:

            X_Func = function () {
                return (Math.random());
            };

            Y_Func = function () {
                return (Math.random() * 2 - 1);
            };

            break;

        case particle_dir.R:

            X_Func = function () {
                return (Math.random() * -1);
            };

            Y_Func = function () {
                return (Math.random() * 2 - 1);
            };

            break;

        case particle_dir.T:

            X_Func = function () {
                return (Math.random() * 2 - 1);
            };

            Y_Func = function () {
                return (Math.random()*-1);
            };

            break;

        case particle_dir.B:

            X_Func = function () {
                return (Math.random() * 2 - 1);
            };

            Y_Func = function () {
                return (Math.random());
            };

            break;

        case particle_dir.ALL:

            X_Func = function () {
                return (Math.random() * 2 - 1);
            };

            Y_Func = function () {
                return (Math.random() * 2 - 1);
            };

            break;
    }

    for (var i = 0; i < totalSprites; i++) {
        
        var dust_p = dust_ary_Plus[i];
        
        dust_p.initScale =0.25 + Math.random() * 0.25; 
        dust_p.scale.set(dust_p.initScale);
      
        dust_p.initX =x;
        dust_p.initY =y;
        dust_p.x = x;
        dust_p.y = y;

        dust_p.alpha = 0;
        
        dust_p.x_velocity = 100*X_Func();
        dust_p.y_velocity = 100*Y_Func();

        dust_p.rotation = Math.PI*Math.random()*2;

    }

    isemitting_particles = false;
}

function play_dust_particle(dt) {

    dust_tick += (dt * 0.06);
    dust_tick = dust_tick > 25 ? 25 : dust_tick;

    smoothStep = dust_tick * 0.04;
    smoothStep = 3 * smoothStep * smoothStep - 2 * smoothStep * smoothStep * smoothStep;
    
    curve_step = dust_tick * 0.04;
    curve_step = 4 * curve_step - 4 * curve_step * curve_step;

    if(dust_tick===25){
        reset_dust_particle(288,512,particle_dir.B_L);
    }
    else{

        for (var i = 0; i < dust_ary_Plus.length; i++) {

            var dust_p = dust_ary_Plus[i];
            
            dust_p.scale.set(dust_p.initScale + (1-dust_p.initScale) * smoothStep * 5);
            dust_p.alpha = 1-smoothStep;//curve_step;
            
            //dust_p.direction += dust_p.turningSpeed * 0.01;
            
            dust_p.position.x = dust_p.initX+smoothStep*dust_p.x_velocity;
            dust_p.position.y = dust_p.initY+smoothStep*dust_p.y_velocity;

            //dust_p.rotation = -dust_p.direction + Math.PI;
    
        }

    }
}

function emit_dust_particles_on_position(x,y) {
    
    reset_dust_particle(-10,-10,particle_dir.ALL);

    dust_ary_Plus.forEach(element => {
        element.initX =x;
        element.initY =y;
        element.x = x;
        element.y = y;
    });

    isemitting_particles = true;
}

//Game Loop
function game_update(tFrame) {

    tDelta = tFrame - tLastFrame;
    request_Anim_ID = requestAnimationFrame(game_update);

    if (isGameLoaded) {

        if (isRevive) {

            //gameTicks++;

            gameTicks += (tDelta * 0.06);
            gameTicks = gameTicks > 10 ? 10 : gameTicks;

            smoothStep = gameTicks * 0.1;
            smoothStep = 3 * smoothStep * smoothStep - 2 * smoothStep * smoothStep * smoothStep;

            //common_dialog_Sprite.position.set(88, 1200);//700
            common_dialog_Sprite.y = 1200 - 500 * smoothStep;

            if (gameTicks === 10) {

                common_dialog_Sprite.y = 700;
                isRevive = false;

            }


        }
        else if (isGameOver) {

            gameTicks += (tDelta * 0.06);
            gameTicks = gameTicks > 10 ? 10 : gameTicks;

            smoothStep = gameTicks * 0.1;
            smoothStep = 3 * smoothStep * smoothStep - 2 * smoothStep * smoothStep * smoothStep;

            gameOver_lbl.y = -600 + 800 * smoothStep;

            if (gameTicks === 10) {

                gameOver_lbl.y = 200;//-600

                isGameOver = false;
            }

        }
        else if (isInitMenu) {

            gameTicks += (tDelta * 0.06);
            gameTicks = gameTicks > 10 ? 10 : gameTicks;

            smoothStep = gameTicks * 0.1;
            smoothStep = 3 * smoothStep * smoothStep - 2 * smoothStep * smoothStep * smoothStep;

            playSprite.y = -300 + 840 * smoothStep;
            titleSprite.y = -200 + 556 * smoothStep;
            bottomUIContainer.y = 1050 - 250 * smoothStep;
            topUIContainer.y = -200 + 200 * smoothStep;

            if (gameTicks === 10) {

                playSprite.y = 540;//-300
                titleSprite.y = 356;//-200
                bottomUIContainer.y = 800;//1050
                topUIContainer.y = 0;//-200

                isInitMenu = false;
                gameTicks = 0;
                isMenu = true;

            }

        }
        else if (isMenu) {

            gameTicks += (tDelta * 0.06);
            gameTicks = gameTicks > 50 ? 50 : gameTicks;

            smoothStep = gameTicks * 0.02;
            smoothStep = 3 * smoothStep * smoothStep - 2 * smoothStep * smoothStep * smoothStep;

            if (gameTicks === 50) {

                gameTicks = 0;

                if (tuteFrameID > -1) {

                    tuteFrameID = (tuteFrameID + 1) % 3;
                    tuteContFrame.x = ((tuteFrameID * 0.5) | 0) * 512;
                    tuteContFrame.y = (tuteFrameID % 2) * 512;
                    tuteContTex.updateUvs();

                }

            }

        }
        else if (isRemoveUI) {

            gameTicks += (tDelta * 0.06);
            gameTicks = gameTicks > 10 ? 10 : gameTicks;

            smoothStep = gameTicks * 0.1;
            smoothStep = 3 * smoothStep * smoothStep - 2 * smoothStep * smoothStep * smoothStep;

            playSprite.y = 540 - 840 * smoothStep;//-300 + 840 * smoothStep;
            titleSprite.y = 356 - 556 * smoothStep;//-200 + 556 * smoothStep;
            bottomUIContainer.y = 800 + 250 * smoothStep;//1050 - 250 * smoothStep;
            topUIContainer.y = - 200 * smoothStep;//-200 + 200 * smoothStep;

            if (gameTicks === 10) {

                playSprite.y = -300;
                titleSprite.y = -200;
                bottomUIContainer.y = 1050;
                topUIContainer.y = -200;

                isRemoveUI = false;
                gameTicks = 0;
                isInitPlay = true;
            }

        }
        else if (isInitPlay) {

            gameTicks += (tDelta * 0.06);
            gameTicks = gameTicks > 10 ? 10 : gameTicks;

            smoothStep = gameTicks * 0.1;
            smoothStep = 3 * smoothStep * smoothStep - 2 * smoothStep * smoothStep * smoothStep;

            if (gameTicks === 10) {
                InitiateGamePlay();

                isInitPlay = false;
                gameTicks = 0;
                isPlaying = true;
            }
        }
        else if (isPlaying) {
            for(let i=0;i<cellArrayEndPoint;i++){
                cellArray[i].update(tDelta);
            }
            
            if(nextRoundBool){
                if(nextRoundTicks == 75){
                    nextRoundTicks = 0;
                    nextRoundBool = false;
                    MoveToNextRound();
                }
                else{
                    nextRoundTicks += tDelta * 0.06;
                    nextRoundTicks = nextRoundTicks > 75 ? 75 : nextRoundTicks;
                }
            }

            //Robot Animation
            if(robot.ticks == 50){
                robot.ticks = 0;
                robot.y = 925;
            }
            else{
                robot.ticks += tDelta * 0.06;
                robot.ticks = robot.ticks > 50 ? 50 : robot.ticks;
                robot.steps = robot.ticks / 50;
                robot.steps = 4 * robot.steps - 4 * robot.steps * robot.steps;

                robot.y = 925 - robot.steps * 20;
            }

            if(robot.anim){
                if(robot.shakeTicks == 40){
                    robot.rotateSide *= -1;
                    robot.shakeTicks = 0;
                    robot.rotation = 0;
                    robot.shakeCount++;

                    if(robot.shakeCount == 2){
                        robot.anim = false;
                        
                        robot.texture.frame.x = 750;   
                        robot.texture.updateUvs();

                        robot.shakeCount = 0;
                    }
                }
                else{
                    robot.shakeTicks += tDelta * 0.06;
                    robot.shakeTicks = robot.shakeTicks > 40 ? 40 : robot.shakeTicks;
                    robot.shakeSteps = robot.shakeTicks / 40;
                    robot.shakeSteps = 4 * robot.shakeSteps - 4 * robot.shakeSteps * robot.shakeSteps;

                    robot.rotation = 0 + robot.rotateSide * robot.shakeSteps * 0.5;
                }
            }
        }

        //Emitting Particles
        if(isemitting_particles)
        {
            play_dust_particle(tDelta);
        }
    }

    tLastFrame = tFrame;
    renderer.render(stage);
}

function player_failed() {

    if (API.getreviveCount() < 3) {

        console.log("REVIVE!!!!");

        switch (API.getreviveCount()) {

            case 0:
                revive_value = 10;
                break;
            case 1:
                revive_value = 25;
                break;
            case 2:
                revive_value = 50;
                break;

        }

        console.log("REVIVE_VALUE " + revive_value);

        //set up revive
        common_dialog_Sprite.y = 1200;
        error_txt.visible = false;
        refresh_btn_Sprite.interactive = false;
        refresh_btn_Sprite.visible = false;
        revive_btn_Sprite.visible = true;
        revive_btn_Sprite.interactive = true;
        revive_btn_Sprite.alpha = 1;
        revive_txt.text = revive_value + revive_msg;
        close_btn_Sprite.alpha = 1;
        close_btn_Sprite.interactive = true;
        common_dialog_close_func = revive_no;
        stage.addChild(common_dialog_Sprite);

        isRevive = true;
    }
    else {

        console.log("GAME OVER!!!!");
        isGameOver = true;
        gameOver_lbl.y = -600;
        stage.addChild(gameOver_lbl);
        homeBtnSprite.alpha = 0.5;
        homeBtnSprite.interactive = false;
        API.submitscore(highScoreSubmitCallBack);

    }

}

function add_Score(val) {

    // API.appendscore(val);
    // score_lbl.text = "" + (API.getscore() | 0);

    playerCurrentScore += val;

    if(val > 0 || playerCurrentScore >= 0){
        API.appendscore(val);
    }   

    playerCurrentScore = playerCurrentScore < 0 ? 0 : playerCurrentScore;
    score_lbl.text = "" + (API.getscore() | 0);
}

//TODO: remove only for DEBUG 
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );

    //Return the `key` object
    return key;
}