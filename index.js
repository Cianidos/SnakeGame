function ApplyStyle(html, style) {
    for (const styleKey in style) {
        html.style[styleKey] = style[styleKey]
    }
}

function CopyKeys(target, source) {
    for (const styleKey in source) {
        target[styleKey] = source[styleKey]
    }
}

function CopyStyle(htmlTarget, htmlSource) {
    CopyKeys(htmlTarget.style, htmlSource.style)
}


class Point {
    static isEqual(point1, point2) {
        return (point1.x === point2.x) && (point1.y === point2.y)
    }

    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    addEq(point) {
        this.x += point.x
        this.y += point.y
        return this
    }

    add(point) {
        return new Point(this.x + point.x, this.y + point.y)
    }

    isEqual(other) {
        return Point.isEqual(this, other)
    }
}


const anchor = document.querySelector('#anchor')
let startButtonBack = document.createElement('div')
let startButton = document.createElement('div')

let sbbWidth = 20
let sbbStyle = {
    width: sbbWidth + 'rem',
    height: sbbWidth * 0.5 + 'rem',
    position: 'relative',
    backgroundColor: '#FCFC44',
    textAlign: 'center',
    borderRadius: sbbWidth * 0.15 + 'em'
}
let sbStyle = {
    fontSize: sbbWidth * 0.3 + 'em',
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: 'red',
    transform: 'translate(-50%, -50%)',
    borderRadius: '0.2em',
    cursor: 'default'
}
ApplyStyle(startButtonBack, sbbStyle)
ApplyStyle(startButton, sbStyle)

startButton.textContent = 'Start'

//startButtonBack.insertBefore(startButton, null)
//document.body.insertBefore(startButtonBack, anchor)

startButton.addEventListener('click', () => {
    startButtonBack.style.display = 'none'
    startButton.style.display = 'none'
})

document.addEventListener('keydown', (event) => {
    const key = event.key
    if (key === 'Escape') {
        startButtonBack.style.display = ''
        startButton.style.display = ''
    }
})

let cellSize = 10
let cellX = 100
let cellY = 100
let emptyCellStyle = {
    borderColor: 'white white white white',
    borderWidth: '1px',
    borderStyle: 'solid',
    color: 'white',
    borderRadius: cellSize * 0.1 + 'rem',
    backgroundColor: 'white',
    zIndex: 10
}
let wallCellStyle = {
    borderColor: 'black black black black',
    borderWidth: '1px',
    borderStyle: 'solid',
    color: 'red',
    borderRadius: cellSize * 0.1 + 'rem',
    backgroundColor: 'grey',
    zIndex: 10
}
let eatCellStyle = {
    borderColor: 'black black black black',
    borderWidth: '1px',
    borderStyle: 'solid',
    color: 'red',
    borderRadius: cellSize * 0.1 + 'rem',
    backgroundColor: 'red',
    zIndex: 10
}

let snakeStyle = {}
CopyKeys(snakeStyle, wallCellStyle)
snakeStyle.backgroundColor = 'green'

const direction = {
    up: new Point(0, -1),
    left: new Point(-1, 0),
    right: new Point(1, 0),
    down: new Point(0, 1)
}

let field =
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]

let cellToStyle = {
    0: emptyCellStyle,
    1: wallCellStyle,
    2: snakeStyle,
    3: eatCellStyle
}

let snakeDirection = direction.up
let snake = [new Point(6, 6)]

let fieldViews = Array.from(Array(12), () => new Array(12))

function GenerateField() {
    for (let i = 0; i < 12; ++i) {
        for (let j = 0; j < 12; ++j) {
            let node = document.createElement('div')
            node.style.position = 'absolute'
            node.style.top = cellY + cellSize * 2 * i + 'px'
            node.style.left = cellX + cellSize * 2 * j + 'px'
            node.style.height = cellSize + 'px'
            node.style.width = cellSize + 'px'
            document.body.insertBefore(node, null)
            fieldViews[i][j] = node
        }
    }
}

function ClearTmp() {
    fieldViews.forEach((node) => node.remove())
    while (fieldViews.length !== 0) fieldViews.pop()
}

function DisplayField() {
    for (let i = 0; i < 12; ++i) {
        for (let j = 0; j < 12; ++j) {
            ApplyStyle(fieldViews[i][j], cellToStyle[field[i][j]])
        }
    }

}

GenerateField()
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        snakeDirection = direction.up
    }
    if (e.key === 'ArrowDown') {
        snakeDirection = direction.down
    }
    if (e.key === 'ArrowLeft') {
        snakeDirection = direction.left
    }
    if (e.key === 'ArrowRight') {
        snakeDirection = direction.right
    }
})

let counter = 0
let counterMax = 100

function RandomInRange(start, stop) {
    return Math.floor(Math.random() * (stop - start) + start)
}

function RandomPointOfEat() {
    let point;
    do {
        point = new Point(
            RandomInRange(1, 11),
            RandomInRange(1, 11))
    } while (snake.find((p) => p.isEqual(point)) !== undefined)
    return point
}


function update() {
    if (counter === counterMax) {
        counter = 0
        let nextPoint = snake[0].add(snakeDirection)
        let nextPointType = field[nextPoint.y][nextPoint.x]
        let tail = snake.pop()
        if (nextPointType === 1) {
            snake.push(tail)
        } else if (nextPointType === 0) {
            field[tail.y][tail.x] = 0
            field[nextPoint.y][nextPoint.x] = 2
            snake.unshift(nextPoint)
        } else if (nextPointType === 3) {
            snake.push(tail)
            snake.unshift(nextPoint)
            field[nextPoint.y][nextPoint.x] = 2
            let newEat = RandomPointOfEat()
            field[newEat.y][newEat.x] = 3
        }
        DisplayField()
    }
    counter += 1
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

while (true) {
    update()
    await sleep(8 / snake.length)
}