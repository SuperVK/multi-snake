let world;
let canvas;
let ctx;

$(function() {
    canvas = document.getElementById('canvas')
    canvas.width = 100*15
    canvas.height = 50*15
    ctx = canvas.getContext('2d')
    $('body').keypress(function(event) {
        let key = event.originalEvent.key
        console.log(key)
        
        switch (key) {
            case 'ArrowUp':
                console.log(5)
                socket.emit('facing', 'North')
                break;
            case 'ArrowRight':
                console.log(6)
                socket.emit('facing', 'East')
                break;
            case 'ArrowDown':
                socket.emit('facing', 'South')
                break;
            case 'ArrowLeft':
                socket.emit('facing', 'West')
                break;
            
        }
    })
})

socket.on('draw', function(data) {
    draw(data.grid, data.height, data.width, data.spacingW, data.spacingH)
    console.log(data)
})

function draw(grid, height, width, spacingW, spacingH) {
      ctx.fillStyle = '#505050'
      ctx.fillRect(0,0,width*spacingW,height*spacingH)
      ctx.fill()
      for(let x in grid) {
          for(let y in grid[x]) {
              let spot = grid[x][y]
              
              ctx.fillStyle = spot.color
              ctx.fillRect(x*spacingW,y*spacingH,spacingW-spacingW/10,spacingW-spacingW/10)
              ctx.fill()
              //rect(spot.pos.x, spot.pos.y, spacingW, spacingH) 
          }
      }
    
}


