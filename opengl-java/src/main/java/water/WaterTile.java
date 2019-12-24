package water;

public class WaterTile {

    public static final float TILE_SIZE = 80;

    private float x,z;

    public WaterTile(float centerX, float centerZ){
        this.x = centerX * TILE_SIZE;
        this.z = centerZ * TILE_SIZE;
    }

    public float getX() {
        return x;
    }

    public float getZ() {
        return z;
    }



}