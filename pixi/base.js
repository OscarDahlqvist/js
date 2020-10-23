async function init() {
    console.log("init() successfully called.");	
    console.log(PIXI.Sprite)

    let app = new PIXI.Application({ 
        width: 256,         // default: 800
        height: 200,        // default: 600
        antialias: false,    // default: false
        transparent: false, // default: false
        resolution: 1       // default: 1
      }
    );

    appRef = app

    app.renderer.backgroundColor = 0x061639;
    app.view.classList.add("integer_zoom")

    let farTex = getTexture("resources/test_bg.png")
    far = new PIXI.Sprite(farTex);
    far.setpos(0,-100);
    app.stage.addChild(far);
    
    let plyTex = getTexture("resources/characters/setzer/side.png")
    ply = new PIXI.Sprite(plyTex);
    ply.setpos(20,150);
    ply.scale.x = -1
    app.stage.addChild(ply);
    
    let enemyTex = getTexture("resources/test_enemy.png")
    enemy = new PIXI.Sprite(enemyTex);
    enemy.setpos(150,150);
    app.stage.addChild(enemy);


    document.body.appendChild(app.view);

    await sleep(1000);

    enemy.setpos(100,100);

    init_players()

    actionply = new Player(ply, static_setzer)
    actionply.setHome(20,150)

    while(true){
        actionply.sprite.arcTo(100,120,30)
        await actionply.playAnimation("attack.sword")
        await actionply.playAnimation("walk")
    }
}

appRef = undefined;

PIXI.Sprite.prototype.setpos = function(nx,ny){
    this.x = nx;
    this.y = ny;
}

function getTexture(path){
    var farTexture = PIXI.Texture.from(path);
    farTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    return farTexture
}

class PoseKey {
    constructor(string) {
        this.name = string
    }
}
class TimedPose {
    constructor(frames, args){
        if(args.pose != undefined){
            this.pose = args.pose;
        }
        if(args.function != undefined){
            this.function = args.function;
        }
        this.nframes = frames;
    }    
}
class StaticPlayer {
    constructor(name,poseTable){
        this.name = {...name}
        this.poseTable = {...poseTable}
        this.poseSequences = {}
    }
    addAnimation(animationName, poseList) {
        this.poseSequences[animationName] = poseList
    }
}
class Player {
    constructor(sprite, staticPlayer){
        this.sprite = sprite;
        this.staticPlayer = staticPlayer;
    }
    setHome(x,y){
        this.homeX = x
        this.homeY = y
    }
    arcHome(){
        this.sprite.arcTo(this.homeX,this.homeY,20)
    }
    async playAnimation(animationName){
        this.TEMP = {}
        this.TEMP.poseSequence = [...this.staticPlayer.poseSequences[animationName]]
        if(this.TEMP.poseSequence == undefined) {
            console.log(`Animation ${animationName} does not exist`);
            return;
        }
        while(this.TEMP.poseSequence.length >= 1){
            this.TEMP.poppedPose = this.TEMP.poseSequence.shift()
            if(this.TEMP.poppedPose.pose != undefined){
                this.sprite.texture = this.staticPlayer.poseTable[this.TEMP.poppedPose.pose.name];
            }
            if(this.TEMP.poppedPose.function != undefined){
                this.TEMP.poppedPose.function.call(this)
            }
            await sleep(this.TEMP.poppedPose.nframes*1000/60);
        }
        delete this.TEMP
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

testSwordTex = getTexture("resources/test_sword.png")

PIXI.ObservablePoint.prototype.add = function(pos) {
    this.x += pos.x
    this.y += pos.y
}
PIXI.ObservablePoint.prototype.set = function(pos) {
    this.x = pos.x
    this.y = pos.y
}
PIXI.ObservablePoint.prototype.setf = function(x,y) {
    this.x = x
    this.y = y
}
PIXI.Sprite.prototype.arcTo = async function(newX,newY,nframes) {
    let oldX = this.position.x
    let oldY = this.position.y
    let p = newX-oldX
    let q = newY-oldY
    let h = Math.min(newY-10,oldY-10)-oldY

    let b = -2*(h*p+Math.sqrt((h**2)*(p**2)-h*(p**2)*q))/q
    let a = -4*h/b**2

    let t = 0.0
    while(t < nframes){
        let x = (p*(t/nframes))
        let y = a*x*(x+b)
        this.setpos(oldX+x,oldY+y)
        t++
        await sleep(1000/60);  
    }
    this.setpos(newX,newY);
    // y(x) = a(x²+bx)
    // dY = a((Dx)²+bDx)
    // dy/a = (Dx)²+bDx
    // dy/a-(Dx)² = b
}

Player.prototype.slashSword = async function() {
    sword = new PIXI.Sprite(testSwordTex);
    this.slashItem(sword)
    await sleep(1000/30);  
    sword2 = new PIXI.Sprite(testSwordTex);
    sword2.alpha = 0.5
    this.slashItem(sword2)
    await sleep(1000/30);  
    sword3 = new PIXI.Sprite(testSwordTex);
    sword3.alpha = 0.5
    this.slashItem(sword3)
}

Player.prototype.slashItem = async function(item){
    parentSprite = this.sprite
    item.setpos(parentSprite.position.x-10,parentSprite.position.y+20);
    item.angle = 200
    let scale = 0;
    item.scale.setf(scale,scale);

    appRef.stage.addChild(item);

    while (item.angle > 10) {
        if(item.angle > 200 && item.angle < 330){
            scale = Math.min(scale+0.2,1)
        } else {
            scale = Math.max(scale-0.2,0)
        }
        item.scale.setf(scale,scale);
        item.angle = (item.angle+10)%360
        await sleep(1000/60);        
    }
    appRef.stage.removeChild(item)
}


function init_players(){
    static_setzer = new StaticPlayer("setzer",{
        "side":getTexture("resources/characters/setzer/side.png"),
        "side.move":getTexture("resources/characters/setzer/side_move1.png"),
        "side.move2":getTexture("resources/characters/setzer/side_move2.png"),
        "side.move3":getTexture("resources/characters/setzer/side_move3.png"),
        "side.move4":getTexture("resources/characters/setzer/side_move4.png"),
        "side.jump":getTexture("resources/characters/setzer/side_carry2.png"),
        "side.fall":getTexture("resources/characters/setzer/side_pushed1.png"),
        "side.land":getTexture("resources/characters/setzer/side_kneel.png"),
        "side.dash":getTexture("resources/characters/setzer/side_dash.png")
    });
    static_setzer.addAnimation("attack.sword",[
        new TimedPose(6,{pose:new PoseKey("side.land")}),
        new TimedPose(12,{pose:new PoseKey("side.move")}),
        new TimedPose(12,{pose:new PoseKey("side.fall")}),
        new TimedPose(6,{pose:new PoseKey("side.land")}),
        new TimedPose(0,{function:Player.prototype.slashSword}),
        new TimedPose(20,{pose:new PoseKey("side.dash"), function:Player.prototype.slashSword}),
        new TimedPose(6,{pose:new PoseKey("side.move")}),
        new TimedPose(20,{function:Player.prototype.arcHome}),
        new TimedPose(20,{pose:new PoseKey("side")})
    ]);
    static_setzer.addAnimation("swipe.sword",[
        new TimedPose(20,{pose:new PoseKey("side.dash"), function:Player.prototype.slashSword}),
        new TimedPose(20,{pose:new PoseKey("side")})
    ]);

    static_setzer.addAnimation("walk",[
        new TimedPose(6,{pose:new PoseKey("side")}),
        new TimedPose(6,{pose:new PoseKey("side.move")}),
        new TimedPose(6,{pose:new PoseKey("side")}),
        new TimedPose(6,{pose:new PoseKey("side.move3")})
    ]);
}
