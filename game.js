class Game {
    constructor(height, width, spacingH, spacingW) {
        this.height = height
        this.width = width
        this.spacingH = spacingH
        this.spacingW = spacingW
        this.grid = this.calcGrid()
        
        this.snakes = []
        this.apple = {
            x: Math.floor(Math.random() * width-2)+1,
            y: Math.floor(Math.random() * height-2)+1
        }
        this.grid[this.apple.x][this.apple.y].apple = true
    }
    process() {
        
        for(var snake of this.snakes) {
            snake.move()
        }
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
    calcGrid() {
        
        let grid = []
        for(let x = 0; x < this.width; x++) {
            grid[x] = []
            for(let y = 0; y < this.height; y++) {
                if(x == 0 || x == this.height-1 || y == 0 || y == this.height-1) {
                    grid[x][y] = {
                        snakeHead: false,
                        snakeBody: false,
                        apple: false,
                        wall: true,
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
        console.log('added new snek')
        this.snakes.push(new Snake(this, this.getColor(), socketID))
    }
    getColor() {
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }
    setFacing(socketID, direction) {
    }
    resetApple() {
        this.grid[this.apple.x][this.apple.y].apple = false
        this.apple = {
            x: Math.floor(Math.random()*this.width),
            y: Math.floor(Math.random()*this.height)
        }
        if(this.grid[this.apple.x][this.apple.y].wall) this.resetApple()
        this.grid[this.apple.x][this.apple.y].apple = true
    }
}

module.exports = Game
//Snake

class Snake {
    constructor(game, color, socketID) {
        console.log('beans')
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
            x: Math.floor(Math.random()*game.width-10)+5,
            y: Math.floor(Math.random()*game.height-10)+5
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
            
        }        console.log(this.pos)
        console.log(this.game.grid)
      
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
        this.plannedFacing = direction
    }
    shiftParts(xOffset, yOffset) {
        this.pos = {
            x: this.pos.x+xOffset,
            y: this.pos.y+yOffset
        }
        if(this.pos.x == this.game.apple.x && this.pos.y == this.game.apple.y) {
            this.appleCollect()
        } else {
            this.parts.splice(this.parts.length-1, 1);
        }
        
        let firstEl = [this.pos]
        this.parts = firstEl.concat(this.parts)
        
    }
    die() {
        // this.deaths++
        // this.length = 3
        // this.score = 0
        // this.facing = 'North';
        // this.plannedFacing = 'North';
        // this.pos = {
        //     x: Math.floor(random(5, this.game.width-5)),
        //     y: Math.floor(random(5, this.game.height-5))
        // }
        // this.parts = [{
        //         x: this.pos.x,
        //         y: this.pos.y
        //     },
        //     {
        //         x: this.pos.x,
        //         y: this.pos.y+1
        //     },
        //     {
        //         x: this.pos.x,
        //         y: this.pos.y+2
        //     }
        // ]
        // for(let x in this.game.grid) {
        //     for(let y in this.game.grid[x]) {
        //         this.game.grid[x][y].snake = false
        //     }
        // }
        // document.getElementById('score').innerHTML = 'Score: '+ this.score
        // document.getElementById('deaths').innerHTML = 'Deaths: '+ this.deaths
        this.parts = []
        this.isAlive = false
    }
    appleCollect() {
        this.score++
        this.game.resetApple()
    }

}