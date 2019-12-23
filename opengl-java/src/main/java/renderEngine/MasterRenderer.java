package renderEngine;

import entities.EntityRenderer;
import entities.camera.Camera;
import entities.Entity;
import entities.light.Light;
import models.TexturedModel;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.GL11;
import org.lwjgl.util.vector.Matrix4f;
import org.lwjgl.util.vector.Vector4f;
import entities.EntityShader;
import skybox.SkyboxRenderer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MasterRenderer {

    private static float FOV = 70;
    private static float NEAR_PLANE = 0.1f;
    private static float FAR_PLANE = 1000;

    private EntityShader shader = new EntityShader();
    private Matrix4f projectionMatrix;

    private EntityRenderer entityRenderer;
    private SkyboxRenderer skyboxRenderer;

    private Map<TexturedModel, List<Entity>> entities = new HashMap<>();

    public MasterRenderer(Loader loader) {
        GL11.glEnable(GL11.GL_CULL_FACE);
        GL11.glCullFace(GL11.GL_BACK);
        createProjectionMatrix();
        entityRenderer = new EntityRenderer(loader, shader, projectionMatrix);
        skyboxRenderer = new SkyboxRenderer(loader, projectionMatrix);
    }

    public void renderScene(List<Entity> entities, Light light, Camera camera, Vector4f clipPlane) {
        for (Entity entity: entities) {
            processEntity(entity);
        }
        render(light, camera, clipPlane);
    }

    private void render(Light sun, Camera camera, Vector4f clipPlane) {
        prepare();

        shader.start();
        shader.loadClipPLane(clipPlane);
        shader.loadLight(sun);
        shader.loadViewMatrix(camera);
        entityRenderer.render(entities);
        shader.stop();

        skyboxRenderer.render(camera);

        entities.clear();
    }

    public void cleanUp() {
        shader.cleanUp();
    }

    public Matrix4f getProjectionMatrix() {
        return projectionMatrix;
    }

    private void processEntity(Entity entity) {
        TexturedModel textureModel = entity.getModel();
        List<Entity> batch = entities.computeIfAbsent(textureModel, k -> new ArrayList<>());
        batch.add(entity);
    }

    private void prepare() {
        GL11.glEnable(GL11.GL_DEPTH_TEST);
        GL11.glClearColor(0, 0.3f, 0.3f, 1);
        GL11.glClear(GL11.GL_COLOR_BUFFER_BIT | GL11.GL_DEPTH_BUFFER_BIT);
    }

    private void createProjectionMatrix(){
        float aspectRatio = (float) Display.getWidth() / (float) Display.getHeight();
        float y_scale = (float) ((1f / Math.tan(Math.toRadians(FOV / 2f))) * aspectRatio);
        float x_scale = y_scale / aspectRatio;
        float frustum_length = FAR_PLANE - NEAR_PLANE;

        projectionMatrix = new Matrix4f();
        projectionMatrix.m00 = x_scale;
        projectionMatrix.m11 = y_scale;
        projectionMatrix.m22 = -((FAR_PLANE + NEAR_PLANE) / frustum_length);
        projectionMatrix.m23 = -1;
        projectionMatrix.m32 = -((2 * NEAR_PLANE * FAR_PLANE) / frustum_length);
        projectionMatrix.m33 = 0;
    }

}
