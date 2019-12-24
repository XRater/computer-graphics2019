package water;

import java.util.List;

import entities.camera.Camera;
import models.RawModel;

import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL13;
import org.lwjgl.opengl.GL20;
import org.lwjgl.opengl.GL30;
import org.lwjgl.util.vector.Matrix4f;
import org.lwjgl.util.vector.Vector3f;

import renderEngine.DisplayManager;
import renderEngine.Loader;
import toolbox.Maths;

public class WaterRenderer {

    private static final float WAVE_SPEED = 0.08f;

    private RawModel quad;
    private WaterShader shader = new WaterShader();
    private WaterFrameBuffers fbos;

    private int dudvTexture;
    private float moveFactor;

    public WaterRenderer(Loader loader, Matrix4f projectionMatrix, WaterFrameBuffers fbos) {
        this.fbos = fbos;
        dudvTexture = loader.loadTexture("waterDUDV");
        shader.start();
        shader.connectTextureUnits();
        shader.loadProjectionMatrix(projectionMatrix);
        shader.stop();
        setUpVAO(loader);
    }

    public void render(Water water, Camera camera) {
        prepareRender(camera);
        for (WaterTile tile : water.getTiles()) {
            Matrix4f modelMatrix = Maths.createTransformationMatrix(
                    new Vector3f(tile.getX(), water.getLevel(), tile.getZ()), 0, 0, 0,
                    WaterTile.TILE_SIZE);
            shader.loadModelMatrix(modelMatrix);
            GL11.glDrawArrays(GL11.GL_TRIANGLES, 0, quad.getVertexCount());
        }
        unbind();
    }

    private void prepareRender(Camera camera){
        GL11.glDisable(GL11.GL_CULL_FACE);
        shader.start();
        shader.loadViewMatrix(camera);
        moveFactor += WAVE_SPEED * DisplayManager.getFrameTimeSecond();
        moveFactor %= 1;
        shader.loadMoveFactor(moveFactor);
        GL30.glBindVertexArray(quad.getVaoID());
        GL20.glEnableVertexAttribArray(0);
        GL13.glActiveTexture(GL13.GL_TEXTURE0);
        GL11.glBindTexture(GL11.GL_TEXTURE_2D, fbos.getReflectionTexture());
        GL13.glActiveTexture(GL13.GL_TEXTURE1);
        GL11.glBindTexture(GL11.GL_TEXTURE_2D, dudvTexture);
    }

    private void unbind(){
        GL20.glDisableVertexAttribArray(0);
        GL30.glBindVertexArray(0);
        shader.stop();
        GL11.glEnable(GL11.GL_CULL_FACE);
        GL11.glCullFace(GL11.GL_BACK);
    }

    private void setUpVAO(Loader loader) {
        float[] vertices = { -1, -1, -1, 1, 1, -1, 1, -1, -1, 1, 1, 1 };
        quad = loader.loadToVAO(vertices, 2);
    }

}