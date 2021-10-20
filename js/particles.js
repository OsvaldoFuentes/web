const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let arregloparticulas;

let mouse = {
    x : null,
    y : null,
    radius : (canvas.height/80) * (canvas.width/80)
};

/*window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
        console.log('feo');
    }
);*/
window.addEventListener('resize', 
    function(event){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radious = ((canvas.height/80) * (canvas.height/80) );
        init();
    }
);
window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }

);


// Creates particles 
class Particle {
    constructor (x, y, directionX, directionY, size, color, speed){
        this.x=x;
        this.y=y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.speed = speed;
    }
    //method to draw an individual particle 
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI *2,false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    // check particle position. check mouse position, then move particle and draw it
    updatePosition (){
        //revisa si la particula esta dentro del área
        if (this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY;
        }
        //revisa si la particula colisiona con el area del mouse
        let distX = mouse.x - this.x; //x del mouse y x de la particula
        let distY = mouse.y - this.y;
        
        let distance = Math.sqrt(distX*distX + distY*distY); //formula
        if (distance < mouse.radius + this.size ){ //hay colision
            if (mouse.x < this.x && this.x < canvas.width - this.size *10){
                this.x += 50;
            }
            if (mouse.x > this.x && this.x > this.size * 10){
                this.x -= 50;
            }

            if (mouse.y < this.y && this.y < canvas.height - this.size *10){
                this.y += 50;
            }
            if (mouse.y > this.y && this.y > canvas.height*10){
                this.y -= 50;
            }
            
        }
        // mueve la particula velocidad
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
        // dibuja la prticula
        this.draw();


    }


}

// crea las particulas
function init (){
    arregloparticulas = [];
    let numParticulas = (canvas.height * canvas.width)*1 / 9000;
    console.log(numParticulas);
    for (let i=0; i < numParticulas; i++){
        let size = (Math.random() * 5) + 1;
        let x = ( Math.random() * (  ( innerWidth - size * 2 ) - ( size  *2 )  ) + size *2 ); 
        let y = ( Math.random() * (  ( innerHeight - size * 2 ) -  ( size  *2 )  ) + size *2 ); 
        
        let directionX = (Math.random() * 5 ) -2.5 ;
        let directionY = (Math.random() * 5 ) -2.5 ;
        
        let color = 'rgba(150,150,150,0.5)';
        //console.log("size",size," x",x," y",y," directionX",directionX, " diretcionY",directionY)
        
        arregloparticulas.push(new Particle(x, y, directionX, directionY, size, color, 0.2));
    } 
    //console.log(arregloparticulas)
    
}

//anima 
function anima(){
    requestAnimationFrame(anima);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i=0; i < arregloparticulas.length; i++){
        arregloparticulas[i].updatePosition();
    }
    connect();
}

//conecta con lineas
function connect(){
    let opacidad = 1;
    for (let a=0; a< arregloparticulas.length; a++){
        for (let b=a; b< arregloparticulas.length; b++){
            let distancia = ((arregloparticulas[a].x - arregloparticulas[b].x)
                        * (arregloparticulas[a].x - arregloparticulas[b].x)) 
                        + ((arregloparticulas[a].y - arregloparticulas[b].y) *
                        (arregloparticulas[a].y - arregloparticulas[b].y)
                        );
            if (distancia  < (canvas.width/7 )* (canvas.height/7)){
                opacidad = 1 - (distancia/20000);
                ctx.strokeStyle = 'rgba(150,150,150,'+opacidad+ ')'  ;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(arregloparticulas[a].x, arregloparticulas[a].y);
                ctx.lineTo(arregloparticulas[b].x, arregloparticulas[b].y);
                ctx.stroke();
            }

        }
    }
}

init();
anima();
