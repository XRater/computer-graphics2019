import entities.camera.Camera;
import entities.camera.FocusedCamera;
import entities.Entity;
import entities.light.Light;
import models.TexturedModel;
import org.lwjgl.opengl.Display;

import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL30;
import org.lwjgl.util.vector.Vector3f;
import org.lwjgl.util.vector.Vector4f;
import renderEngine.*;
import models.RawModel;
import texture.ModelTexture;
import water.Water;
import water.WaterFrameBuffers;
import water.WaterRenderer;

import java.util.ArrayList;
import java.util.List;

public class MainGameLoop {

    public static void main(String[] args) {

        DisplayManager.createDisplay();
        Loader loader = new Loader();

        RawModel model = OBJLoader.loadObjModel("dragon", loader);

        TexturedModel staticModel = new TexturedModel(model, new ModelTexture(loader.loadTexture("red")));
        ModelTexture texture = staticModel.getTexture();
        texture.setShineDamper(10);
        texture.setReflectivity(1);

        Camera camera = new FocusedCamera(new Vector3f(20, 25, 20));
        Light light = new Light(new Vector3f(20000,20000,2000),new Vector3f(1,1,1));

        WaterFrameBuffers fbos = new WaterFrameBuffers();

        Entity entity1 = new Entity(staticModel, new Vector3f(0, 8, 0), 0, 0, 0, 1);
        Entity entity2 = new Entity(staticModel, new Vector3f(20, 15, 20), 0, -35, -15, 2);
        List<Entity> entities = new ArrayList<>();
        entities.add(entity1);
        entities.add(entity2);

        List<Water> waters = new ArrayList<>();
        int waterLevel = 10;
        for (int i = -20; i <= 20; i++) {
            for (int j = -20; j <= 20; j++) {
                waters.add(new Water(i, j, waterLevel));
            }
        }

        MasterRenderer renderer = new MasterRenderer(loader);
        WaterRenderer waterRenderer = new WaterRenderer(loader, renderer.getProjectionMatrix(), fbos);
        while(!Display.isCloseRequested()){
            camera.move();
            entity2.move();

            GL11.glEnable(GL30.GL_CLIP_DISTANCE0);
            fbos.bindReflectionFrameBuffer();
            float distance = 2 * (camera.getPosition().y - waterLevel);
            camera.getPosition().y -= distance;
            camera.invertPitch();
            renderer.renderScene(entities, light, camera, new Vector4f(0, 1, 0, -waterLevel));
            camera.invertPitch();
            camera.getPosition().y += distance;

            fbos.unbindCurrentFrameBuffer();
            renderer.renderScene(entities, light, camera, new Vector4f(0, 1, 0, -waterLevel));
            waterRenderer.render(waters, camera);
            GL11.glDisable(GL30.GL_CLIP_DISTANCE0);

            DisplayManager.updateDisplay();
        }

        fbos.cleanUp();
        renderer.cleanUp();
        loader.cleanUp();
        DisplayManager.closeDisplay();
    }

}