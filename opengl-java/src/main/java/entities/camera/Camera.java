package entities.camera;

import org.lwjgl.util.vector.Vector3f;

public interface Camera {

    void move();

    Vector3f getPosition();

    float getPitch();

    float getYaw();

    float getRoll();

    void invertPitch();
}
