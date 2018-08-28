class Game {
    constructor(height, width, spacingH, spacingW) {
        this.height = height
        this.width = width
        this.spacingH = spacingH
        this.spacingW = spacingW
        this.grid = this.calcGrid()
        
        this.snakes = []
        this.apples = []
        
    }
    process() {
        
        for(var snake of this.snakes) {
            if(snake.isAlive) snake.move()
        }
        this.updateGrid()
        return {
          grid: this.grid,
          height: this.height,
          width: this.width,
          spacingH: this.spacingH,
          spacingW: this.spacingW
        }
    }
    getGrid() {
      return this.grid
    }
    updateGrid() {
        for(let x in this.grid) {
            for(let y in this.grid[x]) {
                this.grid[x][y].color = '#000000'
                this.grid[x][y].snakeBody = false
                this.grid[x][y].snakeHead = false
                this.grid[x][y].apple = false
                for(let snake of this.snakes) {
                    for(let part of snake.parts) {
                        if(x == part.x && y == part.y) {
                            this.grid[x][y].color = snake.color
                            if(snake.pos.x == x && snake.pos.y == y) {
                                this.grid[x][y].snakeHead = true
                            } else {
                                this.grid[x][y].snakeBody = true
                            }
                            
                        }
                        
                    }
                }
                if(x == 0 || x == this.width-1 || y == 0 || y == this.height-1) {
                    this.grid[x][y].color = '#969696'
                }
                for(let apple of this.apples) {
                    if(apple.x == x && apple.y == y) {
                        this.grid[x][y].color = '#FF0000'
                        this.grid[x][y].apple = true
                    }
                }
            }
        }
        
    }
    calcGrid() {
        
        let grid = []
        for(let x = 0; x < this.width; x++) {
            grid[x] = []
            for(let y = 0; y < this.height; y++) {
                if(x == 0 || x == this.width-1 || y == 0 || y == this.height-1) {
                    grid[x][y] = {
                        snakeHead: false,
                        snakeBody: false,
                        apple: false,
                        wall: true,
                        color: '#969696',
                        pos: {
                            x: x*this.spacingW,
                            y: y*this.spacingH,
                        }
                    }
                } else {
                    grid[x][y] = {
                        snakeHead: false,
                        snakeBody: false,
                        apple: false,
                        wall: false,
                        color: '#000000',
                        pos: {
                            x: x*this.spacingW,
                            y: y*this.spacingH,
                        }
                    }
                }
            }
        }
        return grid
    }
    addSnake(socketID) {
        this.snakes.push(new Snake(this, this.getColor(), socketID))
        this.apples.push({
            x: Math.floor(Math.random() * (this.width-2))+1,
            y: Math.floor(Math.random() * (this.height-2))+1
        })
        this.apples.push({
            x: Math.floor(Math.random() * (this.width-2))+1,
            y: Math.floor(Math.random() * (this.height-2))+1
        })
    }
    removeSnake(socketID) {
        let index = this.snakes.find(s => s.socketID == socketID)
        this.snakes.splice(index, 1)
    }
    getColor() {
        return '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
    }
    setFacing(socketID, direction) {
        let snake = this.snakes.find(s => s.socketID == socketID)

        if(!(direction != 'North' && direction != 'East' && direction != 'South' && direction != 'West')) {

            snake.changeDirection(direction)
        }
    }
    resetApple(pos) {
        let appleIndex = this.apples.findIndex(a => a.x == pos.x && a.y == pos.y)
        if(this.apples.length == this.snakes.length*2) {
            let x = Math.floor(Math.random()*this.width)
            let y = Math.floor(Math.random()*this.height)
            for(let apple of this.apples) {
                if(apple.x == x && apple.y == y) return this.resetApple(pos)
            }
            this.apples.push({
                x: x,
                y: y
            })
            
        }
        this.apples.splice(appleIndex, 1)
        
        if(this.grid[this.apples[this.apples.length-1].x][this.apples[this.apples.length-1].y].wall) this.resetApple(pos)
    }
}

module.exports = Game
//Snake

class Snake {
    constructor(game, color, socketID) {
        this.length = 3
        this.score = 0
        this.highScore = 0
        this.deaths = 0
        this.facing = 'North'
        this.plannedFacing = 'North'
        this.isAlive = true
        this.color = color
        this.socketID = socketID
        this.pos = {
            x: Math.floor(Math.random()*(game.width-10))+5,
            y: Math.floor(Math.random()*(game.height-10))+5
        }
        this.parts = [{
                x: this.pos.x,
                y: this.pos.y
            },
            {
                x: this.pos.x,
                y: this.pos.y+1
            },
            {
                x: this.pos.x,
                y: this.pos.y+2
            }
        ]
        this.game = game
        
    }
    move() {
        this.facing = this.plannedFacing
        switch (this.facing) {
            case 'North': {
                this.shiftParts(0,-1)
                break;
            }
            case 'East': {
                this.shiftParts(1,0)
                break;
            }
            case 'South': {
                this.shiftParts(0,1)
                break;
            }
            case 'West': {
                this.shiftParts(-1,0)
                break;
            }
            
        }
        if(this.game.grid[this.pos.x][this.pos.y].wall) {
            this.die()
            return
        }
        for(let x in this.game.grid) {
            for(let y in this.game.grid[x]) {
                this.game.grid[x][y].snake = false
            }
        }
        if(this.game.grid[this.pos.x][this.pos.y].snakeBody) this.die()
        for(let i = 0; i < this.parts.length; i++) {
            let part = this.parts[i]
            //if((this.parts[0].x == part.x) && (this.parts[0].y == part.y) && (i != 0)) this.die()
            if(i == 0) {
              this.game.grid[part.x][part.y].snakeHead = true
            } else {
              this.game.grid[part.x][part.y].snakeBody = true
            }
        }
        return
    }
    changeDirection(direction) {
        if(direction == 'North' && this.facing != 'South') this.plannedFacing = 'North'
        else if(direction == 'East' && this.facing != 'West') this.plannedFacing = 'East'
        else if(direction == 'South' && this.facing != 'North') this.plannedFacing = 'South'
        else if(direction == 'West' && this.facing != 'East') this.plannedFacing = 'West'
    }
    shiftParts(xOffset, yOffset) {
        this.pos = {
            x: this.pos.x+xOffset,
            y: this.pos.y+yOffset
        }
        let appleCollected = false
        for(let apple of this.game.apples) {
            if(this.pos.x == apple.x && this.pos.y == apple.y) this.appleCollect()
        }
        if(!appleCollected) {
            this.parts.splice(this.parts.length-1, 1);
        }
        
        let firstEl = [this.pos]
        this.parts = firstEl.concat(this.parts)
        
    }
    die() {
        // this.deaths++
        // this.length = 3
        // this.score = 0
        this.facing = 'North';
        this.plannedFacing = 'North';
        this.pos = {
            x: Math.floor(Math.random()*(this.game.width-10))+5,
            y: Math.floor(Math.random()*(this.game.height-10))+5
        }
        this.parts = [{
                x: this.pos.x,
                y: this.pos.y
            },
            {
                x: this.pos.x,
                y: this.pos.y+1
            },
            {
                x: this.pos.x,
                y: this.pos.y+2
            }
        ]
        for(let x in this.game.grid) {
            for(let y in this.game.grid[x]) {
                this.game.grid[x][y].snake = false
            }
        }
        // document.getElementById('score').innerHTML = 'Score: '+ this.score
        // document.getElementById('deaths').innerHTML = 'Deaths: '+ this.deaths
    }
    appleCollect() {
        this.score++
        this.game.resetApple(this.pos)
    }

}