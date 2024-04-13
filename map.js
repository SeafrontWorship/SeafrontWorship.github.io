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

class Touch {
    constructor({ position, id }) {
        this.id = id
        this.position = position
    }
}

// touches related var
class Touches {
    constructor() {
        this.touches_list = []
        this.midPoint = {}
        this.init_distance = 0
        this.touch_scale = 1
        this.touch_zooming = false
    }

    //update the mid-point in this. only returns true when 2 touches present.
    update_midPoint() {
        if (touches.touches_list.length == 2) {
            this.midPoint = {
                x: (this.touches_list[0].position.x + this.touches_list[0].position.x) / 2,
                y: (this.touches_list[0].position.y + this.touches_list[1].position.y) / 2
            }

            // console.log(this.midPoint)
            return true
        } else return false
    }

    // return a distance of 2 given points p1, p2
    distance(p1, p2) {
        let dx = p2.x - p1.x,
            dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    addTouch(e) {
        let touch = new Touch({
            id: e.pointerId,
            position: {
                x: e.clientX,
                y: e.clientY
            }
        })
        this.touches_list.push(touch)
    }

    removeById(id) {
        this.touches_list.push(id)
        this.touches_list = this.touches_list.filter((touch, idx, arr) => {
            return !(touch.id == arr[arr.length - 1] || touch == arr[arr.length - 1])
        })
    }

    clear_touches_list() {
        this.touches_list = []
    }

    updateTouchPositionById(id, position) {
        this.touches_list.forEach((touch) => {
            if (touch.id == id) {
                touch.position = {
                    x: position.x,
                    y: position.y
                }

                // console.log("MOVED ID:", touch.id, "position", touch.position)
            }
        })
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

const touches = new Touches()

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

    if (touches.touch_zooming) {
        var mouse_beforeZoom = bg.screen2world(Math.round(touches.midPoint))

        bg.scale *= touches.touch_scale
        bg.scale = Math.max(Math.min(bg.scale, SCALE_MAX), SCALE_MIN)

        console.log(bg.scale)

        var mouse_afterZoom = bg.screen2world(Math.round(touches.midPoint))

        console.log("mouse before and after", mouse_beforeZoom, mouse_afterZoom)

        // bg.position.x += (mouse_afterZoom.x - mouse_beforeZoom.x) * bg.scale;
        // bg.position.y += (mouse_afterZoom.y - mouse_beforeZoom.y) * bg.scale;

        touches.touch_zooming = false
    }

    clean()
    bg.draw()
}

function mouseDown_handler(e) {
    mouse.pressed = true
    mouse.pres_pos = {
        x: e.clientX,
        y: e.clientY - NAV_HEIGHT
    }
    mouse.curr_pos = mouse.pres_pos

    // console.log("screen vs world", mouse.curr_pos, bg.screen2world(mouse.curr_pos))
    // console.log("background", bg.position, bg.scale)
}

function mouseUp_handler() {
    mouse.pressed = false

    // console.log(mouse.pressed)
}

function mouseMove_handler(e) {
    mouse.curr_pos = {
        x: e.clientX,
        y: e.clientY - NAV_HEIGHT
    }
}

function scroll_handler(e) {
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
}

// event listen to mouse user (changed to pointers events)
// window.addEventListener('mousedown', mouseDown_handler)
// window.addEventListener('mousemove', mouseMove_handler)
// window.addEventListener('mouseup', mouseUp_handler)

// event listener to pointer event
// Pointer DOWN
canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType == "mouse") {
        mouseDown_handler(e)
    } else {
        touches.addTouch(e)

        // console.log("touch Down, touches len:", touches.touches_list.length, touches.touches_list)

        if (touches.touches_list.length == 1) {
            mouseDown_handler(e)
        } else if (touches.touches_list.length == 2) {
            touches.init_distance = touches.distance(touches.touches_list[0].position, touches.touches_list[1].position)

            // console.log(touches.init_distance)

            // enable zoom!
            touches.touch_zooming = true
        }
    }
})

// Pointer MOVE
canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType == "mouse" || touches.touches_list.length == 1) {
        mouseMove_handler(e)
    } else if (touches.touches_list.length == 2) {
        touches.updateTouchPositionById(e.pointerId, { x: e.clientX, y: e.clientY })
        var curr_distance = touches.distance(touches.touches_list[0].position, touches.touches_list[1].position)
        touches.touch_scale = curr_distance / touches.init_distance

        touches.init_distance = curr_distance

        touches.update_midPoint()
        touches.touch_zooming = true

        console.log("midPoint: ", touches.midPoint)
    }
})

//Pointer UP
canvas.addEventListener('pointerup', (e) => {
    // console.log("pointerUp!")
    // touches.removeById(e.pointerId) // unknow bug: pointer up can't fire sometimes... 
    touches.clear_touches_list() // cancel all touch once pointer is up

    // console.log("touches len:", touches.touches_list.length, touches)

    if (touches.touches_list.length == 0 || e.pointerType == "mouse") {
        mouseUp_handler(e)
    }
})

// Mouse Wheeeel
canvas.addEventListener("wheel", scroll_handler)

//Pointer CANCLE
canvas.addEventListener('pointercancle', () => {
    touches = []
        // console.log("CANCEL!!!", touches)
})

//start animate loop
animate()