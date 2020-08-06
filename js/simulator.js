// Create canvas
const canvas = document.querySelector(".myCanvas");
const sim_area = document.getElementById("sim-area")
const width = canvas.width = sim_area.getBoundingClientRect().width;
const height = canvas.height = sim_area.getBoundingClientRect().height;
const ctx = canvas.getContext("2d");
ctx.translate(width/2, height/2);

console.log("width: " + width + "\theight: " + height);

class Node {
    constructor(initial_x, initial_y, infected) {
        this.x = initial_x;
        this.y = initial_y;
        this.r = node_radius;
        this.infected = infected;
    }

    isInfected() {
        return this.infected;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getR() {
        return this.r;
    }

    draw() {
        if (this.infected) ctx.fillStyle = "rgb(255, 0, 0)";
        else ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
    }

    update() {
        var updated_list = [];
        var len = nodes.length;
        if (!this.infected) {
            for (let node of nodes) {
                    if (!(this===node) && node.isInfected()) {
                        var node_x = node.getX();
                        var node_y = node.getY();
                        var dist = Math.sqrt((node_x-this.x)*(node_x-this.x)+(node_y-this.y)*(node_y-this.y))
                        if (dist < max_dist_of_infection && Math.random() < chance_of_infection) this.infected = true;
                }
            }
        }
    }
}



// Generate Nodes
var number_of_nodes = 500; // changes with slider
var max_radius = 0.4*height;
var node_radius = 3;
var chance_of_infection = 0.05;
var max_dist_of_infection = 50;

var animation_speed = 5;
var inverse_speed = Math.floor(60/animation_speed);

var cnt = 1;

var nodes = [];

var animation;

function clear() {
    ctx.translate(-width/2, -height/2);
    ctx.clearRect(0, 0, width, height);
    ctx. translate(width/2, height/2);
}

function drawCanvas() {
    for (let node of nodes) {
        node.draw();
    }
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.arc(0, 0, max_radius+7, 0, 2*Math.PI);
    ctx.stroke();
}

function reset() {
    clear();

    nodes=[];
    for (let i = 0; i < number_of_nodes; i++) {
        var radius = Math.sqrt(Math.random())*max_radius;
        var angle = Math.random()*2*Math.PI;
        var x = radius*Math.cos(angle);
        var y = radius*Math.sin(angle);
    
        nodes[i] = new Node(x, y, i==0);
    }
    
    drawCanvas();
}

// returns true if all infected, false if not
function check_all_infected() {
    for (let node of nodes) {
        if (!node.isInfected()) return false;
    }
    return true;
}

function simulate() {
    drawCanvas();
    
    if (!check_all_infected()) {
        if (cnt==0) {
            for (let node of nodes) {
                node.update();
            }
        }
        animation = requestAnimationFrame(simulate);
    }
    cnt = (cnt+1)%(inverse_speed);
}
window.addEventListener('DOMContentLoaded', (event) => {
    reset();
    document.getElementById("node-number-label").innerHTML = "Number of Nodes: " + number_of_nodes;
    document.getElementById("infection-chance-label").innerHTML = "Chance of Infection: " + Math.floor(chance_of_infection*100) + "%";
    document.getElementById("infection-dist-label").innerHTML = "Maximum Infection Distance: " + max_dist_of_infection + " pixels";

    //requestAnimationFrame(simulate);
});

$("#start").on("click", function() {
    animation = requestAnimationFrame(simulate);
});

$("#stop").on("click", function() {
    cancelAnimationFrame(animation);
});

$("#reset").on("click", function() {
    cancelAnimationFrame(animation);
    reset();
})

$("#node-number-range").on("input change", function() {
    cancelAnimationFrame(animation);
    number_of_nodes=document.getElementById("node-number-range").value;
    document.getElementById("node-number-label").innerHTML = "Number of Nodes: " + number_of_nodes;
    reset();
});

$("#infection-chance-range").on("input chance", function() {
    chance_of_infection=document.getElementById("infection-chance-range").value;
    document.getElementById("infection-chance-label").innerHTML = "Chance of Infection: " + Math.floor(chance_of_infection*100) + "%";
});

$("#infection-dist-range").on("input chance", function() {
    max_dist_of_infection=document.getElementById("infection-dist-range").value;
    document.getElementById("infection-dist-label").innerHTML = "Maximum Infection Distance: " + max_dist_of_infection + " pixels";
});

/**
document.getElementById("start").addEventListener("click", function() {
    requestAnimationFrame(simulate);
});
**/