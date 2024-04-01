// code for moving map using canvas
// User variables
const SCALE_MAX = 10
const SCALE_MIN = 0.1
const SCALE_STEP = 0.1
const SCALE_DEFAULT = 1
const CANVAS_W  = 1024
const CANVAS_H = 576
const BG_INIT_POSITION_X = 0
const BG_INIT_POSITION_Y = 0


// Setup
const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d')

canvas.width = CANVAS_W
canvas.height = CANVAS_H
// console.log(c)

//class definitions
class Mouse {
    constructor(){
        this.pressed = false;
        this.pres_pos =  {
            x: 0,
            y: 0
        }// defulat values
        this.curr_pos =  {
            x: 0,
            y: 0
        }// defulat values
        this.scale = SCALE_DEFAULT
    }
}

class Sprite {
    constructor({position, image_path, scale}){
        this.position = position
        this.image = new Image()
        this.image.src = image_path
        this.scale = scale
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y, this.image.width*this.scale, this.image.height*this.scale)
    }
}

//const init.
const bg = new Sprite({
    position: {
        x: BG_INIT_POSITION_X,
        y: BG_INIT_POSITION_Y
    },
    image_path: "./img/demo_map.jpg",
    scale: 1
})

const mouse = new Mouse()

// function definition
function clean(){
    c.clearRect(0,0,canvas.width, canvas.height)
}
function animate(){
    window.requestAnimationFrame(animate)
    if (mouse.pressed){
        // update bg position
        bg.position.x += mouse.curr_pos.x - mouse.pres_pos.x
        bg.position.y += mouse.curr_pos.y - mouse.pres_pos.y
        // reset pres_pos to cur_pos
        mouse.pres_pos = mouse.curr_pos

    }
    bg.scale = mouse.scale
    clean()
    bg.draw()
}

// event listen to make mousedown and up
window.addEventListener('mousedown', (e) => {
    mouse.pressed = true
    mouse.pres_pos = {
        x: e.clientX,
        y: e.clientY
    }
    mouse.curr_pos = mouse.pres_pos
    console.log(mouse)
})

window.addEventListener('mouseup', (e) => {
    mouse.pressed = false
    console.log(mouse.pressed)
})

onmousemove = function(e){
    if(mouse.pressed){
        mouse.curr_pos = {
            x: e.clientX,
            y: e.clientY
        }
    }
}

window.addEventListener("wheel", (e) => {
    // console.log(e)
    mouse.scale += (-e.deltaY / 102) * SCALE_STEP
    mouse.scale = Math.min(Math.max(SCALE_MIN, mouse.scale), SCALE_MAX);
    console.log(mouse.scale)
})



//start animate loop
animate()

