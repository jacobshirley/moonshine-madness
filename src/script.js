import Truck from "./truck.js";
import GameObject from "./game-object.js";
import Renderer from "./renderer.js";
import World from "./world.js";

var Example = Example || {};

Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

const debug = false;

var offsetX = 0;

Example.car = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Body = Matter.Body,
        Bodies = Matter.Bodies,
        Constraint = Matter.Constraint,
        Composite = Matter.Composite;

    // create engine
    var engine = Engine.create(),
        physics = engine.world;


    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    const f = 0.2;
    const ff = 0.9;

    var ramp = Bodies.rectangle(700, 900, -5000, 600, { isStatic: true, frictionStatic: f, friction: ff, density: 1, angle: 0.1 * Math.PI });
    // add bodies
    Matter.World.add(physics, [
        // walls
        //Bodies.rectangle(400, 0, 1200, 50, { isStatic: true, frictionStatic: f, friction: ff, density: 1 }),
        //Bodies.rectangle(400, 600, 1200, 50, { isStatic: true, frictionStatic: f, friction: ff, density: 1 }),
        //Bodies.rectangle(1000, 300, 50, 600, { isStatic: true, frictionStatic: f, friction: ff, density: 1 }),
        //Bodies.rectangle(0, 300, 50, 600, { isStatic: true, frictionStatic: f, friction: ff, density: 1 }),
        ramp
    ]);

    const BLOCKS = 5;

    var renderer = new Renderer(300, 600, 300, 500);
    var world = new World(physics, renderer);
    var truck = new Truck(500, 300, 305, 1.0);

    truck.addWheel(-150, 40, 40, 0.2, 0.1, 0.8);
    truck.addWheel(110, 40, 40, 0.2, 0.1, 0.8);
    truck.load(physics, world);
    truck.flipX();

    renderer.follow(truck.chassis.renderObj);

    world.addObject(new GameObject(ramp, null));
    world.addObject(truck);

    var blocks = [];
    for (let i = 0; i < BLOCKS; i++) {
        var b = Bodies.rectangle(200, 350, 50, 50, {  friction: 0.9, frictionStatic: 0.6, density: 0.01});
        Matter.Body.setMass(b, 100);

        blocks.push(b);
        world.addObject(new GameObject(b));
    }

    Matter.World.add(physics, blocks);

    var left = false;
    var right = false;

    document.addEventListener("keydown", function(ev) {
        if (ev.key == "a") {
            left = true;
        } else if (ev.key == "d") {
            right = true;
        }
    });

    document.addEventListener("keyup", function(ev) {
        if (ev.key == "a") {
            left = false;
        } else if (ev.key == "d") {
            right = false;
        }
    });

    var debug = document.getElementById("debug");
    world.debug(debug);

    function draw() {
        debug.innerHTML = "RenderX: " + Math.round(renderer.renderX)+"px" + "<br />RenderY: " + Math.round(renderer.renderY)+"px";
        if (left) {
            truck.wheels[1].applyTorque(-30);
        }

        if (right) {
            truck.wheels[1].applyTorque(30);
        }

        //truck.update();
        world.update();

        renderer.render();

        requestAnimationFrame(draw);
    }

    draw();

    // add mouse control
    var mouse = Mouse.create(document.getElementById("game")),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Matter.World.add(physics, mouseConstraint);
};

Example.car();
