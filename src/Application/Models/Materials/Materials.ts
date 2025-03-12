import { DoubleSide, LineBasicMaterial, MeshBasicMaterial, MeshStandardMaterial } from "three"

export default class BuildingMaterials
{
    static baseMaterial = new MeshBasicMaterial({ color: 0xFFFFE0, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static heighLightMaterial = new MeshBasicMaterial({ color: 0xFFFF40, side:DoubleSide, transparent:true, opacity:0.8 })
    // wall zones
    static AZoneMaterial = new MeshStandardMaterial({ color: 0xCF815F, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static BZoneMaterial = new MeshStandardMaterial({ color: 0x4A7F5C, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static CZoneMaterial = new MeshStandardMaterial({ color: 0xA5DADB, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static DZoneMaterial = new MeshStandardMaterial({ color: 0x368736, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static EZoneMaterial = new MeshStandardMaterial({ color: 0xA04040, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    // roof zones
    static FZoneMaterial = new MeshStandardMaterial({ color: 0xF4FAE8, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static GZoneMaterial = new MeshStandardMaterial({ color: 0xCDAB9E, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static HZoneMaterial = new MeshStandardMaterial({ color: 0xCEC986, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static IZoneMaterial = new MeshStandardMaterial({ color: 0x99A6A5, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static JZoneMaterial = new MeshStandardMaterial({ color: 0xDA857D, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static KZoneMaterial = new MeshStandardMaterial({ color: 0xFF6347, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static LZoneMaterial = new MeshStandardMaterial({ color: 0xDDC79C, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static MZoneMaterial = new MeshStandardMaterial({ color: 0xF4EC9C, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})
    static NZoneMaterial = new MeshStandardMaterial({ color: 0xDD8F54, side:DoubleSide, transparent:true, opacity:0.8 , alphaTest:0.5})

    static meshMaterialsList:MeshBasicMaterial[]|MeshStandardMaterial[] = 
    [
        BuildingMaterials.AZoneMaterial, BuildingMaterials.BZoneMaterial, BuildingMaterials.CZoneMaterial, 
        BuildingMaterials.DZoneMaterial, BuildingMaterials.EZoneMaterial, BuildingMaterials.FZoneMaterial, 
        BuildingMaterials.GZoneMaterial, BuildingMaterials.HZoneMaterial, BuildingMaterials.IZoneMaterial, 
        BuildingMaterials.JZoneMaterial, BuildingMaterials.KZoneMaterial, BuildingMaterials.LZoneMaterial, 
        BuildingMaterials.MZoneMaterial, BuildingMaterials.CZoneMaterial, BuildingMaterials.NZoneMaterial
    ]
    
    static textMaterial:MeshBasicMaterial= new MeshBasicMaterial({ color: 0x000000, opacity:0.9 })
    static lineMaterial = new LineBasicMaterial
        ( { color: 0x000000 , transparent:true, opacity:1, side:DoubleSide} ) 

    static getMaterialFromName(name:string)
    {
        if(name.toLowerCase() == 'a') return BuildingMaterials.AZoneMaterial
        if(name.toLowerCase() == 'b') return BuildingMaterials.BZoneMaterial
        if(name.toLowerCase() == 'c') return BuildingMaterials.CZoneMaterial
        if(name.toLowerCase() == 'd') return BuildingMaterials.DZoneMaterial
        if(name.toLowerCase() == 'e') return BuildingMaterials.EZoneMaterial
        if(name.toLowerCase() == 'f') return BuildingMaterials.FZoneMaterial
        if(name.toLowerCase() == 'g') return BuildingMaterials.GZoneMaterial
        if(name.toLowerCase() == 'h') return BuildingMaterials.HZoneMaterial
        if(name.toLowerCase() == 'i') return BuildingMaterials.IZoneMaterial
        if(name.toLowerCase() == 'j') return BuildingMaterials.JZoneMaterial
        if(name.toLowerCase() == 'k') return BuildingMaterials.KZoneMaterial
        if(name.toLowerCase() == 'l') return BuildingMaterials.LZoneMaterial
        if(name.toLowerCase() == 'm') return BuildingMaterials.MZoneMaterial
        if(name.toLowerCase() == 'n') return BuildingMaterials.NZoneMaterial
        return BuildingMaterials.FZoneMaterial
    }
    
}