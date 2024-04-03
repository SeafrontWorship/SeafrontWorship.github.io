// JS that change the color of Nav and Bot bar

// Object that needed to observer
const hero1 = document.querySelector('.hero1')
const hero2 = document.querySelector('.hero2')

// Change color target
const nav = document.querySelector('.nav')
const navIcon = document.querySelectorAll('.nav-links-icon')
const bottom = document.querySelector('.bottom')
const brandIcon = document.querySelectorAll('.brand-icon')
const hero2Text = document.querySelector('.hero2-text')
const hero2Img = document.querySelector('.hero2-img')


function dark2light(target) {
    target.classList.remove('color-dark')
    target.classList.add('color-light')
}
function light2dark(target) {
    target.classList.remove('color-light')
    target.classList.add('color-dark')
}

// Observer Callbacks functions for Nav
const observer_TOP = new IntersectionObserver((es) => {
    es.forEach((e) => {
        if(e.isIntersecting){
            console.log("hero1 IN!")
            dark2light(nav)
            navIcon.forEach(dark2light)
            
        } else {
            console.log("hero1 OUT!")
            light2dark(nav)
            navIcon.forEach(light2dark)
            hero2Text.classList.add('fade-in-UP')
            hero2Img.classList.add('fade-in-UP-delay')
        }
    })
})
// Observer Callbacks functions for Bottom
const observer_BOT = new IntersectionObserver((es) => {
    es.forEach((e) => {
        if(e.isIntersecting){
            console.log("hero2 IN!")
            light2dark(bottom)
            brandIcon.forEach(light2dark)
        } else {
            console.log("hero2 OUT!")
            dark2light(bottom)
            brandIcon.forEach(dark2light)
        }
    })
})

observer_TOP.observe(hero1)
observer_BOT.observe(hero2)
