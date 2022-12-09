# Donut World 🍩

## Cloud
This app used to be in the cloud at https://donut-world.herokuapp.com/.

## Requirements
The user should have Python 3.8+, Requests, Flask, pytest and PyMongo installed.

## Startup
To start the app, run the following command from the `DonutWorld/src` directory.
```
python3 donut.py 
```

To access the app in the browser, go to the url where the Flask server is running.
By default it will be `http://127.0.0.1:5000/`.

## Usage

Follow the hint to log in.

To generate a new maze: select the size of the square, type of maze, type of space and click on the "Create new maze" button.

To see an animation of a solution: select the speed, algorithm, and click "Solve".

To cancel a solution being drawn, or to clear a solution path, click on "Cancel solution".

The green square is your position and you can move around with the keyboard's arrow keys.
The red square is the end goal. 
The square board component needs to be "in focus" in order to move around, otherwise pressing the arrow keys will do nothing.

To log out, simply click the "Logout" button.



## Background
https://en.wikipedia.org/wiki/Fundamental_polygon#Examples_of_Fundamental_Polygons_Generated_by_Parallelograms

https://en.wikipedia.org/wiki/Torus
