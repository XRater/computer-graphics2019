package entities.camera;

import org.lwjgl.input.Keyboard;
import org.lwjgl.util.vector.Vector3f;

public class FreeCamera implements Camera {

    private Vector3f position = new Vector3f(0,10,0);
    private float pitch = 10;
    private float yaw ;
    private float roll;

    public FreeCamera(){}

    @Override
    public void move(){
        if(Keyboard.isKeyDown(Keyboard.KEY_W)) {
            position.z -= 0.2f;
        }
        if(Keyboard.isKeyDown(Keyboard.KEY_S)) {
            position.z += 0.2f;
        }
        if(Keyboard.isKeyDown(Keyboard.KEY_D)) {
            position.x += 0.2f;
        }
        if(Keyboard.isKeyDown(Keyboard.KEY_A)) {
            position.x -= 0.2f;
        }
        if(Keyboard.isKeyDown(Keyboard.KEY_SPACE)) {
            position.y += 0.2f;
        }
        if(Keyboard.isKeyDown(Keyboard.KEY_LSHIFT)) {
            position.y -= 0.2f;
        }
    }

    @Override
    public Vector3f getPosition() {
        return position;
    }

    @Override
    public float getPitch() {
        return pitch;
    }

    @Override
    public float getYaw() {
        return yaw;
    }

    @Override
    public float getRoll() {
        return roll;
    }

    @Override
    public void invertPitch() {
        this.pitch = -pitch;
    }

}