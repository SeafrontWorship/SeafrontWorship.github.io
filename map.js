// code for moving map using canvas
// User variables
const SCALE_MAX = 10
const SCALE_MIN = 0.1
const SCALE_FACTOR = 0.1
const SCALE_DEFAULT = 1
    // const CANVAS_W = 1024
    // const CANVAS_H = 576
const BG_INIT_POSITION_X = 0
const BG_INIT_POSITION_Y = 0


// Setup Canvas
const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d')

// get nav bar height
const nav = document.querySelector("#music-nav")
const NAV_HEIGHT = nav.clientHeight

//   // Set display size (vw/vh).
var sizeWidth = window.innerWidth
var sizeHeight = window.innerHeight - NAV_HEIGHT
    // console.log(sizeWidth, window.innerHeight, nav.clientHeight)
canvas.width = sizeWidth;
canvas.height = sizeHeight - 10;
canvas.style.width = sizeWidth;
canvas.style.height = sizeHeight - 10;
console.log(window.innerWidth, window.innerHeight, NAV_HEIGHT, canvas.width, canvas.height)


//class definitions
class Mouse {
    constructor() {
        this.pressed = false;
        this.pres_pos = {
                x: 0,
                y: 0
            } // defulat values
        this.curr_pos = {
                x: 0,
                y: 0
            } // defulat values
        this.scrolling = false
        this.zoomIn = false
        this.zoomOut = false
    }
}

class Sprite {
    constructor({ position, image_path, scale }) {
        this.position = position
        this.image = new Image()
        this.image.src = image_path
        this.scale = scale

        console.log(this.image.width, this.image.height)
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale)
    }

    // pass in: wold coor object {x, y} (float)
    // turn: screen coor object {x, y } (iont)
    // world2screen (world_position) {
    //     screen_position = {
    //         x: null,
    //         y: null
    //     }

    //     screen_position.x = Math.round((world_position.x + this.position.x) * this.scale);
    //     screen_position.y = Math.round((world_position.y + this.position.y) * this.scale);
    //     return screen_position;
    // }

    screen2world(screen_position) {
        var world_position = {
            x: null,
            y: null
        }

        world_position.x = Math.round((screen_position.x - this.position.x) / this.scale)
        world_position.y = Math.round((screen_position.y - this.position.y) / this.scale)
        return world_position;
    }
}

//const init.
const bg = new Sprite({
    position: {
        x: BG_INIT_POSITION_X,
        y: BG_INIT_POSITION_Y
    },
    image_path: "./img/demo_map.jpg",
    scale: SCALE_DEFAULT
})

const mouse = new Mouse()

// function definition
function clean() {
    c.clearRect(0, 0, canvas.width, canvas.height)
}

// main function loop
function animate() {
    window.requestAnimationFrame(animate)

    // panning
    if (mouse.pressed) {
        // update bg position
        bg.position.x += mouse.curr_pos.x - mouse.pres_pos.x
        bg.position.y += mouse.curr_pos.y - mouse.pres_pos.y
            // reset pres_pos to cur_pos
        mouse.pres_pos = mouse.curr_pos
    }

    // zooming
    if (mouse.scrolling) {
        var mouse_beforeZoom = bg.screen2world(mouse.curr_pos)

        if (mouse.zoomIn) {
            bg.scale *= (1 + SCALE_FACTOR)
            mouse.zoomIn = false
        } else if (mouse.zoomOut) {
            bg.scale *= (1 - SCALE_FACTOR)
            mouse.zoomOut = false
        }
        // set scale in max and min!
        bg.scale = Math.max(Math.min(bg.scale, SCALE_MAX), SCALE_MIN)

        var mouse_afterZoom = bg.screen2world(mouse.curr_pos)
            // console.log("mouse before and after", mouse_beforeZoom, mouse_afterZoom)

        bg.position.x += (mouse_afterZoom.x - mouse_beforeZoom.x) * bg.scale;
        bg.position.y += (mouse_afterZoom.y - mouse_beforeZoom.y) * bg.scale;

        mouse.scrolling = false
    }

    clean()
    bg.draw()
}

// event listen to make mousedown and up
window.addEventListener('mousedown', (e) => {
    mouse.pressed = true
    mouse.pres_pos = {
        x: e.clientX,
        y: e.clientY - NAV_HEIGHT
    }
    mouse.curr_pos = mouse.pres_pos
    console.log("screen vs world", mouse.curr_pos, bg.screen2world(mouse.curr_pos))
    console.log("background", bg.position, bg.scale)
})

window.addEventListener('mouseup', (e) => {
    mouse.pressed = false
        // console.log(mouse.pressed)
})

onmousemove = function(e) {
    mouse.curr_pos = {
        x: e.clientX,
        y: e.clientY - NAV_HEIGHT
    }
}

window.addEventListener("wheel", (e) => {
    mouse.scrolling = true
    mouse.curr_pos = {
        x: e.clientX,
        y: e.clientY - NAV_HEIGHT
    }
    if (e.deltaY > 0) {
        mouse.zoomOut = true
        console.log("ZoomOut")
    } else {
        mouse.zoomIn = true
        console.log("ZoomIn")
    }
})

//start animate loop
animate()