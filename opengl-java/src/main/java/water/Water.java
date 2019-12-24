package water;

import org.lwjgl.input.Keyboard;

import java.util.ArrayList;
import java.util.List;

public class Water {

    private float level;
    private List<WaterTile> tiles = new ArrayList<>();

    public Water(int width, int height, float level) {
        this.level = level;
        for (int i = -width; i <= width; i++) {
            for (int j = -height; j <= height; j++) {
                tiles.add(new WaterTile(i, j));
            }
        }
    }

    public void move() {
        updatedLevel();
    }

    public List<WaterTile> getTiles() {
        return tiles;
    }

    public float getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    private void updatedLevel() {
        if(Keyboard.isKeyDown(Keyboard.KEY_W)) {
            level += 0.3f;
        }
        if(Keyboard.isKeyDown(Keyboard.KEY_S)) {
            level -= 0.3f;
        }
        level = Math.min(level, 20);
        level = Math.max(level, 0);
    }

}
