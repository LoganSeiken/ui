from PIL import Image
D="/private/tmp/claude-501/-Users-christiambarrera-Documents-Workspace/a09c3b4d-32a4-48fa-81d3-e4966eba84cd/images/"
def load(n):
    im=Image.open(D+f"{n}.png").convert("RGB"); return im, im.width/2000
def hx(c): return "#%02x%02x%02x"%c
def vscan(n,x,y0,y1):
    im,s=load(n); out=[];prev=None
    for y in range(int(y0*s),int(y1*s)):
        p=im.getpixel((int(x*s),y))
        if prev is None or sum(abs(p[i]-prev[i]) for i in range(3))>10: out.append((round(y/s*s/2,1),hx(p))); 
        prev=p
    return out[:24]
def hscan(n,y,x0,x1):
    im,s=load(n); out=[];prev=None
    for x in range(int(x0*s),int(x1*s)):
        p=im.getpixel((x,int(y*s)))
        if prev is None or sum(abs(p[i]-prev[i]) for i in range(3))>10: out.append((round(x/2,1),hx(p)))
        prev=p
    return out[:24]
# values are CSS px = original px / 2
print("S05 topbar x=1000 y0-120:", vscan(5,1000,0,120))
print("S05 sidebar edge y=300 x=240-300:", hscan(5,300,240,300))
print("S05 subnav edge y=300 x=590-640:", hscan(5,300,590,640))
print("S05 sidebar items x=20 y=80-260 (active bg boundaries):", vscan(5,20,500,600))
print("S05 sidebar item spacing: Project Overview text y vs Table Editor y -> measured from display 97 vs 142 =>", round((142-97)*(3010/2000)/2,1),"CSS px")
print("S05 tile border y(tile top/bottom) x=800:", vscan(5,800,240,520))
print("S05 tile horiz y=330:", hscan(5,330,720,1380))
print("S02 Refresh btn region vertical x=1150:", vscan(2,1150,85,140))
print("S15 header/rows x=640 y=120-400:", vscan(15,640,120,400))
print("S15 row separators x=1300 y=190-560:", vscan(15,1300,190,560))
