package me.pieking.game.combat.attacks;

import java.awt.BasicStroke;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Stroke;
import java.util.ArrayList;
import java.util.List;

import me.pieking.game.Rand;
import me.pieking.game.Vars;
import me.pieking.game.Vars.AttackType;
import me.pieking.game.combat.Combat;

public class AttackBlueAndOrange1 extends Attack{

	public List<Integer> lines = new ArrayList<Integer>();
	public List<AttackType> types = new ArrayList<AttackType>();
	
	public AttackBlueAndOrange1() {
		
		prefferedTime = 300;
		prefferedUL= new Point(323 - 82, 260);
		prefferedBR = new Point(323 + 82, 400);
		
		int currMax = prefferedBR.x + 10;
		for(int i = 0; i < 5; i++){
			currMax += Rand.range(40, 120);
			lines.add(currMax);
			types.add(Rand.getRand().nextBoolean() ? AttackType.BLUE : AttackType.ORANGE);
		}
	}
	
	@Override
	protected void tick() {
		for(int i = 0; i < lines.size(); i++){
			
            int x = lines.get(i).intValue();
            int y = Combat.currCombat.boxUL.y;
            int w = 1;
            int h = Combat.currCombat.boxBR.y - Combat.currCombat.boxUL.y;
            
            Rectangle r = new Rectangle(x, y, w, h);
			if(Combat.currCombat.soulCollides(r)){
				//System.out.println("coll");
				hitPlayer(types.get(i));
			}
			
			lines.set(i, lines.get(i) - 2);
		}
	}

	@Override
	public void render(Graphics g) {
		
		Graphics2D g2d = (Graphics2D) g;
		Stroke str = g2d.getStroke();
		g2d.setStroke(new BasicStroke(3f));
		
		for(int i = 0; i < lines.size(); i++){
			int x = lines.get(i).intValue();
			AttackType t = types.get(i);
			if(t == AttackType.BLUE){
				g.setColor(Vars.parseColor("\\L"));
			}else{
				g.setColor(Vars.parseColor("\\O"));
			}
			g.drawLine(x, Combat.currCombat.boxUL.y, x, Combat.currCombat.boxBR.y);
			
		}
		
		g2d.setStroke(str);
	}

}
