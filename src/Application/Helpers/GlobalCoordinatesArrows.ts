import { Mesh, ArrowHelper, Group, Vector3, Sprite, BoxGeometry ,MeshBasicMaterial, EdgesGeometry, LineSegments, LineBasicMaterial} from "three";
import SpriteText from 'three-spritetext'

const hexX = 0xa6050d;
const hexY = 0x0675c9;
const hexZ = 0x0c8a53;
const headLength = 0.4;
const headWidth = 0.12;

export default class GlobalCoordinatesArrows
{
    
    dirX : Vector3
    dirY : Vector3
    dirZ : Vector3
    arrowHelperX : ArrowHelper
    arrowHelperY : ArrowHelper
    arrowHelperZ : ArrowHelper
    txtSpriteX : Sprite
    txtSpriteY : Sprite
    txtSpriteZ : Sprite
    origin : Vector3
    arrows : Group
    arrows2D : Group
    //box: any;

    constructor(origin:Vector3, length: number)
    {
        this.dirX = new Vector3(1, 0, 0)
        this.dirY = new Vector3(0, 1, 0)
        this.dirZ = new Vector3(0, 0, 1)
        this.origin = origin
        this.arrowHelperX = new ArrowHelper(this.dirX, origin, length, hexX, headLength, headWidth)
        this.arrowHelperY = new ArrowHelper(this.dirY, origin, length, hexY, headLength, headWidth)
        this.arrowHelperZ = new ArrowHelper(this.dirZ, origin, length, hexZ, headLength, headWidth)
        //this.box = new Mesh(new BoxGeometry(0.6,0.6,0.6), new MeshBasicMaterial({color:'red', transparent:true, opacity:0.4}))
        const geometry = new BoxGeometry( 0.8,0.8,0.8 ); 
        const edges = new EdgesGeometry( geometry ); 
        const line = new LineSegments(edges, new LineBasicMaterial( { color: 0xDDDDDD , transparent:true, opacity:0.2} ) ); 
        //line.position.set(0.3,0.3,0.3)
        //this.box.position.set(0.3,0.3,0.3)
        this.arrows = new Group()
        this.arrows2D = new Group()
        this.arrows.add(this.arrowHelperX);
        this.arrows.add(this.arrowHelperY);
        this.arrows.add(this.arrowHelperZ);
        //this.arrows.add(this.box)
        this.arrows.add(line)

        this.arrows2D.add(this.arrowHelperX.clone())
        this.arrows2D.add(this.arrowHelperY.clone())

        const xPos = origin.clone().add(new Vector3(length+0.5, 0, 0)) 
        const yPos = origin.clone().add(new Vector3(0, length+0.5, 0)) 
        const zPos = origin.clone().add(new Vector3(0, 0, length+0.5)) 

        //this.txtSpriteX = TextLabelsGenerator.makeTextSprite("X", xPos.x, xPos.y, xPos.z, { fontsize: 250, fontface: "Georgia", fillColor:{r:0,g:0,b:0,a:0.0}, textColor: { r: 204, g: 1, b: 1, a: 1.0 }, vAlign: "center", hAlign: "center" })
        //this.txtSpriteZ = TextLabelsGenerator.makeTextSprite("Z", zPos.x, zPos.y, zPos.z, { fontsize: 250, fontface: "Georgia", fillColor:{r:0,g:0,b:0,a:0.0}, textColor: { r: 5, g: 166, b: 96, a: 1.0 }, vAlign: "center", hAlign: "center" })
        //this.txtSpriteY = TextLabelsGenerator.makeTextSprite("Y", yPos.x, yPos.y, yPos.z, { fontsize: 250, fontface: "Georgia", fillColor:{r:0,g:0,b:0,a:0.0}, textColor: { r: 6, g: 117, b: 201, a: 1.0 }, vAlign: "center", hAlign: "center" })
      
        this.txtSpriteX = new SpriteText('X',  0.5, 'rgb(204,1,1,1)')
        this.txtSpriteX.position.set(xPos.x, xPos.y, xPos.z)
        if(this.txtSpriteX) this.arrows.add(this.txtSpriteX), this.arrows2D.add(this.txtSpriteX.clone())

        this.txtSpriteY = new SpriteText('Y',  0.5, 'rgb(6,117,201,1)')
        this.txtSpriteY.position.set(yPos.x, yPos.y, yPos.z)
        if(this.txtSpriteY)this.arrows.add(this.txtSpriteY), this.arrows2D.add(this.txtSpriteY.clone())

        this.txtSpriteZ = new SpriteText('Z',  0.5, 'rgb(5,166,96,1)')
        this.txtSpriteZ.position.set(zPos.x, zPos.y, zPos.z)
        if(this.txtSpriteZ)this.arrows.add(this.txtSpriteZ)
    }

    get()
    {
        return this.arrows
    }

    get2D()
    {
        return this.arrows2D
    }
}