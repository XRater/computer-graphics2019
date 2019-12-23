package entities.camera;

import org.lwjgl.input.Mouse;
import org.lwjgl.util.vector.Vector3f;

public class FocusedCamera implements Camera {

    private float distance = 100;
    private float angleAround = 0;

    private Vector3f target;

    private Vector3f position = new Vector3f(0,10,0);
    private float pitch = 5;
    private float yaw;
    private float roll;

    public FocusedCamera(Vector3f target) {
        this.target = target;
    }

    @Override
    public void move(){
        calculateZoom();
        calculatePitch();
        calculateAngleAround();
        float horizontalDistance = calculateHorizontalDistance();
        float verticalDistance = calculateVerticalDistance();
        calculateCameraPosition(horizontalDistance, verticalDistance);
        this.yaw = 180 - angleAround;
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

    private void calculateCameraPosition(float horizontalDistance, float verticalDistance) {
        position.y = target.y + verticalDistance;
        float offsetX = (float) (horizontalDistance * Math.sin(Math.toRadians(angleAround)));
        float offsetZ = (float) (horizontalDistance * Math.cos(Math.toRadians(angleAround)));
        position.x = target.x - offsetX;
        position.z = target.z - offsetZ;
    }

    private float calculateHorizontalDistance() {
        return (float) (distance * Math.cos(Math.toRadians(pitch)));
    }

    private float calculateVerticalDistance() {
        return (float) (distance * Math.sin(Math.toRadians(pitch)));
    }

    private void calculateZoom() {
        float zoomLevel = Mouse.getDWheel() * 0.1f;
        distance = Math.max(distance + zoomLevel, 25);
        distance = Math.min(distance + zoomLevel, 200);
    }

    private void calculatePitch() {
        if (Mouse.isButtonDown(0)) {
            float pitchChange = Mouse.getDY() * 0.3f;
            pitch -= pitchChange;
        }
    }

    private void calculateAngleAround() {
        if (Mouse.isButtonDown(0)) {
            float angleChange = Mouse.getDX() * 0.3f;
            angleAround -= angleChange;
        }
    }
}