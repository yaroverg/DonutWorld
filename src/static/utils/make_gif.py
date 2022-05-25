
from math import sin, cos, pi
from PIL import Image, ImageDraw

height = 1080
width = 1920
spread = 50
dpr = 2
points = 1000
posX = 160
posY = 40
speed = 300
multiplier = 3
size = 1

r = size * dpr

images = []

for delta in range(round(speed*pi)):
  im = Image.new('RGB', (width, height), (255, 255, 255))
  draw = ImageDraw.Draw(im)

  # Sam Wray https://codepen.io/2xAA/pen/GOdNvE
  for i in range(points):
    x = (width / 2) - spread * dpr * - sin(((i / points) * 360) * pi / 180) + -(cos(delta * 2 / speed + (i * multiplier)) * dpr * posX)
    y = (height / 2) - spread * dpr * - cos(((i / points) * 360) * pi / 180) + -(sin(delta * 2 / speed - (i * multiplier)) * dpr * posY)

    draw.ellipse((x-r, y-r, x+r, y+r), fill=(0, 51, 102))

  images.append(im)


images[0].save('donut.gif', save_all=True, append_images=images[1:], 
                optimize=True, duration=20, loop=0)
