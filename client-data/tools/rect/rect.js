

(function () { //Code isolation
	//Indicates the id of the shape the user is currently drawing or an empty string while the user is not drawing
	var end = false,
		curId = "",
		curUpdate = { //The data of the message that will be sent for every new point
			'type': 'update',
			'id': "",
			'x': 0,
			'y': 0,
			'x2': 0,
			'y2': 0
		},
		lastTime = performance.now(); //The time at which the last point was drawn

	function start(x, y, evt) {

		//Prevent the press from being interpreted by the browser
		evt.preventDefault();

		curId = Tools.generateUID("r"); //"r" for rectangle

		Tools.drawAndSend({
			'type': 'rect',
			'id': curId,
			'color': Tools.getColor(),
			'size': Tools.getSize(),
			'opacity': Tools.getOpacity(),
			'x': x,
			'y': y,
			'x2': x,
			'y2': y
		});

		curUpdate.id = curId;
		curUpdate.x = x;
		curUpdate.y = y;
	}

	function move(x, y, evt) {
		/*Wait 70ms before adding any point to the currently drawing shape.
		This allows the animation to be smother*/
		if (curId !== "") {
			if (rectangleTool.secondary.active) {
				var dx = x - curUpdate.x;
				var dy = y - curUpdate.y;
				var d = Math.max(Math.abs(dx), Math.abs(dy));
				x = curUpdate.x + (dx > 0 ? d : -d);
				y = curUpdate.y + (dy > 0 ? d : -d);
			}
			curUpdate['x2'] = x; curUpdate['y2'] = y;
			if (performance.now() - lastTime > 70 || end) {
				Tools.drawAndSend(curUpdate);
				lastTime = performance.now();
			} else {
				draw(curUpdate);
			}
		}
		if (evt) evt.preventDefault();
	}

	function stop(x, y) {
		//Add a last point to the shape
		end = true;
		move(x, y);
		end = false;
		curId = "";
	}

	function draw(data) {
		Tools.drawingEvent = true;
		switch (data.type) {
			case "rect":
				createShape(data);
				break;
			case "update":
				var shape = svg.getElementById(data['id']);
				if (!shape) {
					console.error("Straight shape: Hmmm... I received a point of a rect that has not been created (%s).", data['id']);
					createShape({ //create a new shape in order not to loose the points
						"id": data['id'],
						"x": data['x2'],
						"y": data['y2']
					});
				}
				updateShape(shape, data);
				break;
			default:
				console.error("Straight shape: Draw instruction with unknown type. ", data);
				break;
		}
	}

	var svg = Tools.svg;
	function createShape(data) {
		//Creates a new shape on the canvas, or update a shape that already exists with new information
		var shape = svg.getElementById(data.id) || Tools.createSVGElement("rect");
		shape.id = data.id;
		updateShape(shape, data);
		//If some data is not provided, choose default value. The shape may be updated later
		shape.setAttribute("stroke", data.color || "black");
		shape.setAttribute("stroke-width", data.size || 10);
		shape.setAttribute("opacity", Math.max(0.1, Math.min(1, data.opacity)) || 1);
		Tools.drawingArea.appendChild(shape);
		return shape;
	}

	function updateShape(shape, data) {
		shape.x.baseVal.value = Math.min(data['x2'], data['x']);
		shape.y.baseVal.value = Math.min(data['y2'], data['y']);
		shape.width.baseVal.value = Math.abs(data['x2'] - data['x']);
		shape.height.baseVal.value = Math.abs(data['y2'] - data['y']);
	}

	var rectangleTool = {
		"name": "Rectangle",
		"shortcut": "r",
		"listeners": {
			"press": start,
			"move": move,
			"release": stop,
		},
		"secondary": {
			"name": "Square",
			"icon": "tools/rect/icon-square.svg",
			"active": false,
		},
		"draw": draw,
		"mouseCursor": "crosshair",
		"icon": "tools/rect/icon.svg",
		"stylesheet": "tools/rect/rect.css"
	};
	Tools.add(rectangleTool);

})(); //End of code isolation
