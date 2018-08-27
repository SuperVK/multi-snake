let world;
let canvas;
let ctx;

$(function() {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
})

socket.on('draw', function(data) {
    draw(data.grid, data.height, data.width, data.spacingW, data.spacingH)
})

function draw(grid, height, width, spacingW, spacingH) {
      ctx.fillStyle = '#505050'
      ctx.fillRect(0,0,height*spacingH,width*spacingW)
      ctx.fill()
      this.snake.checkDirection()
      for(let x in grid) {
          for(let y in grid[x]) {
              let spot = grid[x][y]
              
              if(spot.snakeBody || spot.snakeHead) {
                  ctx.fillStyle = '#00FF00'
              } else if(spot.apple) {
                  ctx.fillStyle = '#FF0000'
              } else if(spot.wall) {
                  ctx.fillStyle = '#969696'
              } else {
                  ctx.fillStyle = '#000000'
              }
              ctx.fillRect(x*spacingW,y*spacingH,spacingW-spacingW/10,spacingW-spacingW/10)
              ctx.fill()
              //rect(spot.pos.x, spot.pos.y, spacingW, spacingH) 
          }
      }
    
}


