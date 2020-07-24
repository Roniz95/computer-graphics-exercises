function draw() {
	// line(x1,y1, x2,y2)
	// draws a line from a point at Normalized screen coordinates x1,y1 to Normalized screen coordinates x2,y2

	// Here there are only three lines command, but to obtain the car you will need 8 of them
	
	drawHouse()
}

function draw2() {
	

	drawYinYang();
	
}

function drawHouse() {
	line(-0.5, 0, -0.2, 0.1);
	line(-0.2,0.1, -0.2, 0.3);
	line(-0.2, 0.3, 0.3, 0.3);
	line(0.3, 0.3, 0.3, 0.1);
	line(0.3, 0.1, 0.5, 0);
	line(0.5, 0, 0.5, -0.3);
	line(0.5, -0.3, -0.5, -0.3);
	line(-0.5, -0.3, -0.5, 0);
}

function drawYinYang() {

	for(i = 0; i < 128; i++) {
		
		x = 4*Math.cos(i*6.28/128)/5;
		y = 4*Math.sin(i*6.28/128)/5;
		x1 = 4*Math.cos((i+1)*6.28/128)/5;
		y1 = 4*Math.sin((i+1)*6.28/128)/5;
		line(x,y,x1,y1);
	}

	for(i = 0; i < 128; i++) {

		x = Math.cos(i*6.28/128)/10;
		y = 0.4+Math.sin(i*6.28/128)/10;
		x1 = Math.cos((i+1)*6.28/128)/10;
		y1 = 0.4+Math.sin((i+1)*6.28/128)/10;
		line(x,y,x1,y1);
	}
	for(i = 0; i < 128; i++) {

		x = Math.cos(i*6.28/128)/10;
		y = -0.4+Math.sin(i*6.28/128)/10;
		x1 = Math.cos((i+1)*6.28/128)/10;
		y1 = -0.4+Math.sin((i+1)*6.28/128)/10;
		line(x,y,x1,y1);
	}
	for(i = 0; i < 128; i++) {

		x = 4*Math.sin(i*3.14/128)/10;
		y = 0.4+4*Math.cos(i*3.14/128)/10;
		x1 = 4*Math.sin((i+1)*3.14/128)/10;
		y1 = 0.4+4*Math.cos((i+1)*3.14/128)/10;
		line(x,y,x1,y1);
	}
	for(i = 0; i < 128; i++) {

		x = -4*Math.sin(i*3.14/128)/10;
		y = -0.4+4*Math.cos(i*3.14/128)/10;
		x1 = -4*Math.sin((i+1)*3.14/128)/10;
		y1 = -0.4+4*Math.cos((i+1)*3.14/128)/10;
		line(x,y,x1,y1);
	}
}