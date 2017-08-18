let container = document.querySelector('.container')
var hasNext = true
var loadingImg = false
let n = 0
window.onload = function () {
    waterFall()
    button.onclick = loadMore
    window.onscroll = function () {
        let images = document.querySelectorAll('img[data-src]')
        if (toUp(button)) {
            loadMore()
            waterFall()
        }
        for (var j = 0; j < images.length; j++) {
            if (toUp(images[j])) {
                images[j].src = images[j].getAttribute('data-src')
                images[j].removeAttribute('data-src')
                waterFall()
            }
        }
    }
}
//根据class获取元素
function getByClass(className) {
    let boxArr = []
    let boxs = document.querySelectorAll(className)
    for (var i = 0; i < boxs.length; i++) {
        boxArr.push(boxs[i])
    }
    return boxArr
}
//取一个数组中最小值的索引
function getMinIndex(array, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return i
        }
    }
}

function loadMore() {
    if (! hasNext) { return }
    if (loadingImg) { return }
    var request = new XMLHttpRequest()
    request.open('GET', `./page${n+1}.html`)
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status >= 200 && request.status < 400) {
                loadingImg = false
                n += 1
                let response = request.responseText
                let data = window.JSON.parse(response)
                for (let i = 0; i < data.src.length; i++) {
                    let imgDiv = `
            <div class="box"><div class="picture"><img src="about:blank" data-src='${data.src[i].url}'></div></div>
            `
                    container.insertAdjacentHTML('beforeend', imgDiv)
                    // let divBox = document.createElement('div')
                    // divBox.className = 'box'
                    // let divPic = document.createElement('div')
                    // divPic.className = 'picture'
                    // let img = document.createElement('img')
                    // img.src = data.src[i].url
                    // container.appendChild(divBox)
                    // divBox.appendChild(divPic)
                    // divPic.appendChild(img)
                    waterFall()
                }
                // console.log(data.hasNext === false)
                if (data.hasNext === false) {
                    hasNext = false
                }
            }
        } else if (request.status >= 400) {
            loadingImg = false
        }
    }
    loadingImg = true
    request.send()
}
function waterFall() {
    let boxWidth = document.querySelector('.box').clientWidth
    let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    let cols = Math.floor(viewportWidth / boxWidth)
    let containerWidth = boxWidth * cols
    //存储每一列的高度
    let hCols = []
    //动态获取整个容器的宽度
    container.style.width = containerWidth + 'px'
    let boxArray = getByClass('.box')
    for (var i = 0; i < boxArray.length; i++) {
        if (i < cols) {
            hCols.push(boxArray[i].offsetHeight)
        } else {
            let minHeight = Math.min.apply(null, hCols)
            let index = getMinIndex(hCols, minHeight)
            boxArray[i].style.position = 'absolute'
            boxArray[i].style.top = `${minHeight}px`
            boxArray[i].style.left = `${boxWidth * index}px`
            //每移动一张图片，相对该索引位置的某一列的高度发生变化。
            hCols[index] += boxArray[i].offsetHeight  //offserHeight是一个元素的高度，包括了内边距和边框。
        }
    }
    container.style.height = Math.max.apply(null, hCols) + 'px'
}
function toUp(element) {
    let viewPortTop = document.documentElement.clientHeight
    let buttonTop = element.getBoundingClientRect().top
    return (buttonTop < viewPortTop) ? true : false
}