package water;

public class Water {

    public static final float TILE_SIZE = 80;

    private float height;
    private float x,z;

    public Water(float centerX, float centerZ, float height){
        this.x = centerX * TILE_SIZE;
        this.z = centerZ * TILE_SIZE;
        this.height = height;
    }

    public float getHeight() {
        return height;
    }

    public float getX() {
        return x;
    }

    public float getZ() {
        return z;
    }



}