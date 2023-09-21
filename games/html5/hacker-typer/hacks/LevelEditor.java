package me.pieking.game.editor;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.awt.geom.AffineTransform;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JOptionPane;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import me.pieking.game.Game;
import me.pieking.game.InputHandler;
import me.pieking.game.ResourcePack;
import me.pieking.game.Utils;
import me.pieking.game.Vars;
import me.pieking.game.Vars.CollisionBoxType;
import me.pieking.game.Vars.Direction;
import me.pieking.game.characters.Monster;
import me.pieking.game.characters.MonsterGroup;
import me.pieking.game.characters.Player;
import me.pieking.game.combat.Combat;
import me.pieking.game.commands.CommandLevelEditor;
import me.pieking.game.gfx.Fonts;
import me.pieking.game.gfx.Images;
import me.pieking.game.gfx.Render;
import me.pieking.game.gfx.Sprite;
import me.pieking.game.level.CollisionBox;
import me.pieking.game.level.InteractDialogue;
import me.pieking.game.level.InteractionBox;
import me.pieking.game.level.Level;
import me.pieking.game.level.LevelImage;
import me.pieking.game.level.Location;
import me.pieking.game.level.objects.LevelObject;
import me.pieking.game.sound.Sound;
import me.pieking.game.sound.SoundClip;

public class LevelEditor{

	public Level l;
	
	public String name = "";
	
	public boolean playTesting = false;
	
	public List<List<EButton>> buttonGroups;
	public int currentGroup = 0;
	
	public static final int GR_MAIN = 0;
	public static final int GR_ADD = 1;
	
	public List<CollisionBox> selected = new ArrayList<CollisionBox>();
	
	public int lastMX = 0;
	public int lastMY = 0;
	
	public int selectingState = 0;
	public Point sel_p1;
	public String toAdd;
	
	public File base;

	private boolean hasSaved;
	
	public static SoundClip open;
	public static SoundClip close;
	
	public LevelEditor() {
	}
	
	public void init(){
		Game.info("Initiating editor...");
		
		try {
			URL out = new URL(ResourcePack.getUserFolder().toString() + "editor/" + name);
			base = new File(out.toURI());
			base.mkdirs();
		}
		catch (MalformedURLException | URISyntaxException e1) {
			e1.printStackTrace();
		}
		
		buttonGroups = new ArrayList<List<EButton>>();
		
		for(int i = 0; i < 5; i++){
			List<EButton> list = new ArrayList<EButton>();
			if(i == 0){
				EButton e = new EButton(20, -10, 50, 30);
				e.addListener(new Runnable() {
					@Override
					public void run() {
						System.out.println("click open");
						currentGroup = 1;
						Combat.select.stop();
						Combat.select.start();
					}
				});
				list.add(e);
			}else if(i == 1){
				EButton e = new EButton(20, -10 + 60, 50, 30);
				e.addListener(new Runnable() {
					@Override
					public void run() {
						System.out.println("click close");
						currentGroup = 0;
						Combat.select2.stop();
						Combat.select2.start();
					}
				});
				list.add(e);
				
				EButton addCol = new EButton(10, 4, 40, 40);
				addCol.addListener(new Runnable() {
					@Override
					public void run() {
						addType("coll");
					}
				});
				list.add(addCol);
				
				EButton addRm = new EButton(10 + 60, 4, 40, 40);
				addRm.addListener(new Runnable() {
					@Override
					public void run() {
						addType("room");
					}
				});
				list.add(addRm);
				
				EButton cam = new EButton(10 + 60 + 60, 4, 40, 40);
				cam.addListener(new Runnable() {
					@Override
					public void run() {
						addType("cam");
					}
				});
				list.add(cam);
				
				EButton obj = new EButton(10 + 60 + 60 + 60, 4, 40, 40);
				obj.addListener(new Runnable() {
					@Override
					public void run() {
						addObj();
					}
				});
				list.add(obj);
				
				EButton img = new EButton(10 + 60 + 60 + 60 + 60, 4, 40, 40);
				img.addListener(new Runnable() {
					@Override
					public void run() {
						addImg();
					}
				});
				list.add(img);
				
			}
			buttonGroups.add(list);
		}
		
		open = Sound.loadSound("src2/Undertale Sound Effects/elevator_open.ogg");
		close = Sound.loadSound("src2/Undertale Sound Effects/elevator_close.ogg");
		
		open.setPriority(true);
		open.setVolume(0.5f);
		close.setPriority(true);
		close.setVolume(0.5f);
	}
	
	public void addImg() {
		new Thread(new Runnable() {
			@Override
			public void run() {
				SpriteInfo s = new SpriteInfo(l);
				s.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
				s.setLocationRelativeTo(null);
				s.setVisible(true);
			}
		}).start();
	}
	
	public void addObj() {
		new Thread(new Runnable() {
			@Override
			public void run() {
				ObjectInfo r = new ObjectInfo(l);
				r.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
				r.setLocationRelativeTo(null);
				r.setVisible(true);
			}
		}).start();
	}

	public void tick() {
		if(l != null){
			l.tick();
            
			boolean foundHover = false;
			for(CollisionBox b : l.allBoxes()){
				if(b.getVisibleArea().contains(InputHandler.lastMousePos) 
                   && !foundHover && canEditThings()){
					b.hovering = true;
					foundHover = true;
				}else{
					b.hovering = false;
				}
			}
			
		}
		
		for(int i = 0; i < buttonGroups.size(); i++){
			List<EButton> li = buttonGroups.get(i);
			for(EButton e : li){
				if(i == currentGroup && canEditThings()){
					if(!e.isEnabled()) e.setEnabled(true);
				}else{
					if(e.isEnabled()) e.setEnabled(false);
				}
				
				e.tick();
			}
		}
		
	}

	public void render(Graphics gn) {
		Graphics2D g = (Graphics2D) gn;
		
		if(l != null){
			l.render(g);
			if(playTesting) Player.render(g);
			l.renderOver(g);
			
			if(l.scrollLimits != null){
				
				g.setColor(Color.WHITE);
				
				g.drawRect((int) (-l.scrollLimits.getMaxX() + l.xOffset), 
                           (int) (-l.scrollLimits.getMaxY() + l.yOffset), 
                           (int) (l.scrollLimits.getMaxX() - l.scrollLimits.getMinX() + 646), 
                           (int) (l.scrollLimits.getMaxY() - l.scrollLimits.getMinY() + 505));
				
				if(playTesting && (Math.abs(Render.zoom - 1f) > 0.001f || 
                   Render.zOfsX != 0 || Render.zOfsY != 0)) 
                   g.drawRect((int) (0), (int) (0), 646, 505);
				
			}
			
			if(l.spawnPoints != null && !playTesting){
    			for(int i = 0; i < l.spawnPoints.length; i++){
    				Location loc = l.spawnPoints[i];
    				
    				Sprite s = Images.errorS;
    				
    				switch(loc.getDirection()){
    					case DOWN:
    						s = Player.d0;
    						break;
    					case LEFT:
    						s = Player.l0;
    						break;
    					case RIGHT:
    						s = Player.r0;
    						break;
    					case UP:
    						s = Player.u0;
    						break;
    					default:
    						s = Player.d0;
    						break;
    				}
    				
    				int xofs = l.xOffset;
    				int yofs = l.yOffset;
    				
    				g.drawImage(s.getImageAlpha(0.5f), 
                                loc.getX() + xofs, 
                                loc.getY() + yofs, s.getWidth()*2, 
                                s.getHeight()*2, null);
    				g.setColor(Color.WHITE);
    				g.setFont(Fonts.determMono);
    				g.drawString(i + "",
                                 loc.getX() + s.getWidth() - 
                                 g.getFontMetrics().stringWidth(i + "")/2 + xofs, 
                                 loc.getY() + g.getFont().getSize() + s.getHeight() + yofs);
    			}
			}
			
			AffineTransform tr = g.getTransform();
			
			g.setTransform(Render.origTrans);
			
			g.setFont(Fonts.determSans);
			g.setColor(Color.WHITE);
			
			if(playTesting){
				g.setColor(Color.YELLOW);
			}
			
			String plt = playTesting ? "playing..." : "editing...";
			
			int ofsx = g.getFontMetrics().stringWidth("Ctl + P");
			g.drawString("Ctl + P", 646 - ofsx - 10, 505 - 10);
			
			g.setFont(Fonts.combatHUD.deriveFont(12f));
			g.drawString(plt, 646 - ofsx - 10, 505 - 32);
			
			if(canEditThings()){
			    
			    
			    int yofs = 0;
			    
			    if(currentGroup == 1) yofs = 60;
			    
			    g.setColor(Color.GRAY);
				g.fillRoundRect(20, -10, 50, 30 + yofs, 10, 10);
				g.setColor(Color.DARK_GRAY);
				g.setStroke(new BasicStroke(3f));
				g.drawRoundRect(20, -10, 50, 30 + yofs, 10, 10);
				g.setFont(Fonts.determMono.deriveFont(30f));
				g.setStroke(new BasicStroke(1f));
				String text = "+";
				
				if(currentGroup == 1) text = "-";
				
				g.drawString(text, (20 + 34) - 
                             (g.getFontMetrics().stringWidth(text)), 18 + yofs);
			    
				if(currentGroup == 1){
    				g.setColor(Color.GRAY);
    				g.fillRoundRect(0, -10, 646, 60, 10, 10);
    				g.setColor(Color.DARK_GRAY);
    				g.setStroke(new BasicStroke(3f));
    				g.drawRoundRect(0, -10, 646, 60, 10, 10);
    				g.setStroke(new BasicStroke(1f));
				}
			}
			
			for(CollisionBox b : l.allBoxes()){
				if(selected.contains(b)){
    				g.setColor(new Color(1f, 0.9f, 0f, 0.3f));
    				g.fill(b.getVisibleDisplayArea());
    				g.setFont(Fonts.combatHUD.deriveFont(Render.zoom * 10));
    				g.setColor(new Color(1f, 0.9f, 0f, 0.5f));
			    	g.drawString(b.w + " x " + b.h, 
                                 b.getVisibleDisplayArea().getBounds().x, 
                                 b.getVisibleDisplayArea().getBounds().y - Render.zoom*2);
				}
			}
			
			if(selectingState == 2){
				Rectangle r = Utils.negativeRect2(sel_p1.x, 
                                                  sel_p1.y, 
                                                  InputHandler.lastMousePos.x, 
                                                  InputHandler.lastMousePos.y);
				g.setColor(Color.CYAN);
				
			    if(toAdd != null){
    				if(toAdd.contains("cam")){
    	    			Rectangle transRScroll = Utils.toLevelCoords(r);
    	    			System.out.println(transRScroll);
        				if(transRScroll.width < 646 || transRScroll.height < 505){
        					g.setColor(Color.RED);
        				}
    				}
			    }
				g.draw(r);
				
				g.setFont(Fonts.combatHUD.deriveFont(14f));
				Rectangle r2 = Utils.toLevelCoords(r);
			    g.drawString(r2.width + " x " + r2.height, r.x , r.y - 5);
			}
			
			g.setTransform(tr);
		}
		
		AffineTransform tr = g.getTransform();
		
		g.setTransform(Render.origTrans);
		
		boolean drawButtons = true;
		if(drawButtons){
    		for(int i = 0; i < buttonGroups.size(); i++){
    			List<EButton> li = buttonGroups.get(i);
    			for(EButton e : li){
    				g.setColor(new Color(0f, 1f, 0f, 0.2f));
    				if(!e.isEnabled()) g.setColor(new Color(1f, 0f, 0f, 0.2f));
    				g.drawRect(e.getBounds().x,
                               e.getBounds().y, 
                               e.getBounds().width, 
                               e.getBounds().height);
    			}
    		}
		}
		
		Point p = Game.disp.getMousePositionScaled();
		if (p != null) {
			g.setFont(Fonts.combatHUD.deriveFont(12f));
			g.setColor(new Color(1f, 1f, 1f, 0.7f));
			g.drawString("S: " + p.x + ", " + p.y, 
                         p.x + 14, 
                         p.y + g.getFont().getSize() + 10);
			Point ptr = Utils.toLevelCoords(p);
			g.drawString("L: " + ptr.x + ", " + ptr.y, 
                         p.x + 14, 
                         p.y + g.getFont().getSize() + 20);
		}
		g.setTransform(tr);


		if (p != null) {
			Point ptr = Utils.toLevelCoords(p);
			g.setColor(Vars.rainbowColor(0.1f, 0));
			g.fillRect(ptr.x + Level.getActiveLevel().xOffset, 
                       ptr.y + Level.getActiveLevel().yOffset, 
                       1, 1);
		}
		
	}

	public void keyJustPressed(KeyEvent e) {
		if(e.getKeyCode() == KeyEvent.VK_P){
			if(InputHandler.pressed.contains(KeyEvent.VK_CONTROL)){
				
				if(canEditThings()){
					l.ignoreLimits = false;
    				
    				Render.zOfsXDes = 0;
    				Render.zOfsYDes = 0;
    				Player.overworldLoc.set(l.getSpawn());
    				new Thread(new Runnable() {
						@Override
						public void run() {
							while(Render.zOfsX != Render.zOfsXDes 
                                  || Render.zOfsX != Render.zOfsYDes){
								try {
									Thread.sleep(10);
								}
								catch (InterruptedException e) {
									e.printStackTrace();
								}
    						}
							Render.desZoom = 1f;
		    				Render.zoomTimer = 180;
		    				
		    				close.stop();
		    				close.start();
		    				
		    				while(Math.abs(Render.zoom - Render.desZoom) > 0.001f){
		    					//System.out.println(Render.zoom + " " + Render.desZoom);
		    					try {
									Thread.sleep(10);
								}
								catch (InterruptedException e) {
									e.printStackTrace();
								}
		    				}
		    				Render.zoom = 1f;
		    				playTesting = true;
		    				//l.music.loop();
						}
					}).start();
    				
				}else{
//					Render.zOfsXDes = l.xOffset;
//					Render.zOfsYDes = l.yOffset;
					Render.desZoom = 0.5f;
					Render.zoomTimer = 180;
					playTesting = false;
					open.stop();
					open.start();
//					l.xOffset = 0;
//					l.yOffset = 0;
					//Player.overworldLoc.set(0, 0);
					//l.music.stop();
				}
				
			}
		}else if(e.getKeyCode() == KeyEvent.VK_R){
			if(InputHandler.pressed.contains(KeyEvent.VK_CONTROL)){
				init();
			}
		}
		
		if(canEditThings()){
    		if(e.getKeyCode() == KeyEvent.VK_A){
    			if(l != null){
        			if(InputHandler.pressed.contains(KeyEvent.VK_CONTROL)){
        				selected.clear();
        				selected.addAll(l.allBoxes());
        			}
    			}
    		}else if(e.getKeyCode() == KeyEvent.VK_B){
    			String toAdd = JOptionPane.showInputDialog(Game.frame, 
                                                   "Type something to add to the level.", 
                                                   "Add Something", 
                                                   JOptionPane.INFORMATION_MESSAGE);
    			addType(toAdd);
    			selected.clear();
    		}else if(e.getKeyCode() == KeyEvent.VK_I){
            
    			new Thread(new Runnable() {
					@Override
					public void run() {
						LevelInfo r = new LevelInfo(l);
						r.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
						r.setLocationRelativeTo(null);
						r.setVisible(true);
					}
				}).start();
    		}else if(e.getKeyCode() == KeyEvent.VK_O){
            
    			new Thread(new Runnable() {
					@Override
					public void run() {
						ObjectInfo r = new ObjectInfo(l);
						r.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
						r.setLocationRelativeTo(null);
						r.setVisible(true);
					}
				}).start();
    		}else if(e.getKeyCode() == KeyEvent.VK_DELETE){
    			for(CollisionBox b : selected){
    				l.remove(b);
    			}
    		}
		}
	}

	
	public void addType(String toAdd) {
        this.toAdd = toAdd;
        selectingState = 1;
	}

	public void keyPressed(KeyEvent e) {
		if(l != null){
			if(canEditThings()){
    			int change = 1;
    			if(InputHandler.pressed.contains(KeyEvent.VK_CONTROL)) change = -1;
    			if(InputHandler.pressed.contains(KeyEvent.VK_SHIFT)) change *= 4;
    			if(e.getKeyCode() == KeyEvent.VK_LEFT){
    				for(CollisionBox b : selected){
    					b.w += change;
    					b.x -= change;
    					b.updateCollision();
    				}
    			}else if(e.getKeyCode() == KeyEvent.VK_RIGHT){
    				for(CollisionBox b : selected){
    					b.w += change;
    					b.updateCollision();
    				}
    			}else if(e.getKeyCode() == KeyEvent.VK_UP){
    				for(CollisionBox b : selected){
    					b.h += change;
    					b.y -= change;
    					b.updateCollision();
    				}
    			}else if(e.getKeyCode() == KeyEvent.VK_DOWN){
    				for(CollisionBox b : selected){
    					b.h += change;
    					b.updateCollision();
    				}
    			}
			}
		}
		
	}

	public void keyReleased(KeyEvent e) {

	}

	public void create() {
		if(l != null){
			l.music.stop();
		}
		
		Game.info("Creating new level...");
		l = new Level("base");
		l.parseInfo("rooms/base");
		
		name = "unnamed_" + System.currentTimeMillis();
		
		l.absolute = true;
		l.actuallyAbsolute = true;
		try {
			l.id = ResourcePack.getUserFolder().toString().replace("file:/", "") + 
                   "editor/" + name;
		} catch (MalformedURLException e1) {
			e1.printStackTrace();
		}
		
		Player.overworldLoc.set(0, 0);
		Player.overworldLoc.setDirection(Direction.DOWN);
	}
	
	public void load(Level lv){
		if(l != null){
			l.music.stop();
		}
		
		l = lv;
		
		name = l.name.replace(" ", "%20") + "_" + System.currentTimeMillis();
		l.absolute = true;
		l.actuallyAbsolute = true;
		
		try {
			l.id = ResourcePack.getUserFolder().toString().replace("file:/", "") + 
                   "editor/" + name;
		} catch (MalformedURLException e1) {
			e1.printStackTrace();
		}
		
		Player.overworldLoc.set(0, 0);
		Player.overworldLoc.setDirection(Direction.DOWN);
		
		for(CollisionBox b : l.eventBoxes){
			System.out.println(b.type);
		}
		
		l.music.loop();
		
		hasSaved = false;
		
	}

	public void printInfo() {
		
	}

	@SuppressWarnings("unchecked")
	public void save() throws IOException, URISyntaxException{
		hasSaved = true;
		
		URL out = new URL(ResourcePack.getUserFolder().toString() + "editor/" + name);
		
		base = new File(out.toURI());
		base.mkdirs();
		
		JSONObject obj = new JSONObject();
		
		obj.put("name", l.name);
		
		JSONObject cameraBounds = new JSONObject();
		
		cameraBounds.put("xMin", l.scrollLimits.getMinX());
		cameraBounds.put("yMin", l.scrollLimits.getMinY());
		cameraBounds.put("xMax", l.scrollLimits.getMaxX());
		cameraBounds.put("yMax", l.scrollLimits.getMaxY());
		
		obj.put("cameraBounds", cameraBounds);
		
		JSONArray spawnPoints = new JSONArray();
		for(Location s : l.spawnPoints){
			JSONObject point = new JSONObject();
			
			point.put("x", (int)s.x);
			point.put("y", (int)s.y);
			point.put("dir", s.getDirection().toString());
			
			spawnPoints.add(point);
		}
		
		obj.put("spawnPoints", spawnPoints);
		
		obj.put("music", l.musicObj);
		
		//------------
		
		JSONArray collision = new JSONArray();
		for(CollisionBox b : l.allBoxes()){
			if(b.type == CollisionBoxType.NORMAL){
				collision.add(b.x + " " + b.y + " " + b.w + " " + b.h + " " + b.rotAmt);
			}
		}
		obj.put("collision", collision);
		
		JSONObject events = new JSONObject();
		JSONArray room = new JSONArray();
		JSONArray event = new JSONArray();
		JSONArray monster = new JSONArray();
		JSONArray interaction = new JSONArray();
		
		for(CollisionBox b : l.eventBoxes){
			if(b.type == CollisionBoxType.ROOM_TRIGGER){
				JSONObject o = new JSONObject();
				
				JSONObject coll = new JSONObject();
				coll.put("x", b.x);
				coll.put("y", b.y);
				coll.put("w", b.w);
				coll.put("h", b.h);
				o.put("bounds", coll);
				
				o.put("toRoom", b.toRoom);
				
				if(b.toRoomLoc != null){
					o.put("customLocation", true);
					
					o.put("toLocX", b.toRoomLoc.getX());
					o.put("toLocY", b.toRoomLoc.getY());
					o.put("toLocDir", b.toRoomLoc.getDirection().toString());
				}else{
					o.put("customLocation", false);
				}
				
				if(b.toRoomSpawnpoint != -50){
					o.put("spawnpoint", b.toRoomSpawnpoint);
				}
				
				o.put("toRoomMusic", (b.toRoomMusic != null ? b.toRoomMusic : ""));
				
				room.add(o);
			}
		}
		
		for(CollisionBox b : l.eventBoxes){
			if(b.type == CollisionBoxType.EVENT_TRIGGER){
				JSONObject o = new JSONObject();
				
				JSONObject coll = new JSONObject();
				coll.put("x", b.x);
				coll.put("y", b.y);
				coll.put("w", b.w);
				coll.put("h", b.h);
				o.put("bounds", coll);
				
				o.put("name", b.event.getClass().getSimpleName());
				
				event.add(o);
			}
		}
		
		for(CollisionBox b : l.eventBoxes){
			if(b.type == CollisionBoxType.MONSTER_SPAWN){
				JSONObject o = new JSONObject();
				
				JSONObject coll = new JSONObject();
				coll.put("x", b.x);
				coll.put("y", b.y);
				coll.put("w", b.w);
				coll.put("h", b.h);
				o.put("bounds", coll);
				
				if(b.monsterGroup != null){
					o.put("group", b.monsterGroup);
				}else{
					o.put("group", Monster.serializeMonsters(
                                   (MonsterGroup[]) b.monsterSpawns.toArray()));
				}
				
				monster.add(o);
			}
		}
		
		for(InteractionBox b : l.interactionBoxes){
			if(b instanceof InteractDialogue){
				InteractDialogue d = (InteractDialogue) b;
				
				JSONObject o = new JSONObject();
				
				JSONObject coll = new JSONObject();
				coll.put("x", d.x);
				coll.put("y", d.y);
				coll.put("w", d.w);
				coll.put("h", d.h);
				o.put("bounds", coll);
				
				o.put("font", d.rawFont);
				o.put("speed", d.m.displays[0].timePerChar);
				o.put("effect", d.m.displays[0].effect.toString());
				o.put("sound", d.m.displays[0].sound.getName());
				
				o.put("text", d.rawString);
				
				interaction.add(o);
			}
		}
		
		events.put("room", room);
		events.put("event", event);
		events.put("monster", monster);
		events.put("interaction", interaction);
		
		obj.put("events", events);
		
		//------------
		
		JSONArray sprites = new JSONArray();
		
		File spriteFolder = new File(base, "sprites/");
		spriteFolder.mkdirs();
		
		for(LevelImage im : l.levelImages){
			JSONObject spr = new JSONObject();
			
			File pic = new File(spriteFolder, im.id + ".png");
			pic.createNewFile();
			ImageIO.write(Images.toBufferedImage(im.spr.getImage()), "png", pic);
			
			spr.put("path", "@sprites/" + im.id + ".png");
			
			spr.put("x", im.x);
			spr.put("y", im.y);
			spr.put("scale", im.scale);
			spr.put("id", im.id);
			
			spr.put("relativeToTextures", false);
			//spr.put("absolute", true);
			
			sprites.add(spr);
		}
		
		obj.put("sprites", sprites);
		
		//------------
		
		JSONArray objects = new JSONArray();
		
		HashMap<Class<?>, List<LevelObject>> sortedObj = 
                            new HashMap<Class<?>, List<LevelObject>>();
		
		for(LevelObject o : l.objects){
			if(!sortedObj.keySet().contains(o.getClass())){
				sortedObj.put(o.getClass(), new ArrayList<LevelObject>());
			}
			
			sortedObj.get(o.getClass()).add(o);
		}
		
		for(Class<?> c : sortedObj.keySet()){
			List<LevelObject> ob = sortedObj.get(c);
			JSONObject objObj = new JSONObject();
			objObj.put("type", c.getSimpleName());
			
			JSONArray args = new JSONArray();
			
			for(LevelObject lo : ob){
				String arg = lo.createConstructorArgs();
				if(arg != null){
					args.add(arg);
				}
			}
			
			objObj.put("args", args);
			objects.add(objObj);
		}
		
		obj.put("objects", objects);
		
        
        
		File data = new File(base, "data.json");
		
		FileWriter file = new FileWriter(data);
		org.json.JSONObject jo = new org.json.JSONObject(obj.toJSONString());
		file.write(jo.toString(4));
		file.flush();
		file.close();

		Game.info("Saved level to: " + base.getAbsolutePath().replace("\\", "/"));
		Game.info("Load it with \"/le load @#" + base.getAbsolutePath().replace("\\", "/").replace(" ", "%20") + "\"");
	}

	public void reload(boolean save) {
		try {
			if(save || !hasSaved){
				save();
			}
			l.music.stop();
			new CommandLevelEditor().runCommand(Arrays.asList("load", "@#" + base.getAbsolutePath().replace("\\", "/").replace(" ", "%20")));

		} catch (IOException | URISyntaxException e) {
			e.printStackTrace();
		}
	}
	
	public boolean doEvents(){
		return false;
	}

	public void click(MouseEvent e) {
		if(e.getButton() == MouseEvent.BUTTON1){
    		if(e.getClickCount() == 2 && playTesting){
    			Render.desZoom = 1f;
				Render.zOfsXDes = 0;
				Render.zOfsYDes = 0;
				Render.zoomTimer = 180;
    		}
    		
    		if(l != null && canEditThings()){
        		CollisionBox found = null;
        		for(CollisionBox b : l.allBoxes()){
        			if(b.getVisibleArea().contains(InputHandler.lastMousePos) && found == null){
        				found = b;
        			}
        		}
        		
        		if(found != null){
        			if(!InputHandler.pressed.contains(KeyEvent.VK_SHIFT)) selected.clear();
        			selected.add(found);
        		}else{
        			selected.clear();
        		}
    		}
		}else if(e.getButton() == MouseEvent.BUTTON2){
			if(e.getClickCount() == 2){
    			Render.desZoom = 1f;
    			Render.zoomTimer = 180;
    		}
		}
	}

	public void drag(MouseEvent e) {
		if(InputHandler.lMousePressed && !InputHandler.mMousePressed){
			int cx = e.getX() - lastMX;
    		int cy = e.getY() - lastMY;
    		
    		float xs = ((float)Game.disp.width / (float)Game.disp.rwidth);
			float ys = ((float)Game.disp.height / (float)Game.disp.rheight);
    		
			for(CollisionBox b : selected){
				float xo = (cx / Render.zoom) * xs;
				float yo = (cy / Render.zoom) * ys;
				b.move(xo, yo);
			}
			
		}
		
		lastMX = e.getX();
		lastMY = e.getY();
		
	}

	public void moved(MouseEvent e) {
		lastMX = e.getX();
		lastMY = e.getY();
	}

	public void mousePress(MouseEvent e) {
		if(e.getButton() == MouseEvent.BUTTON1){
    		if(selectingState == 1){
    			selectingState = 2;
    			sel_p1 = InputHandler.lastMousePos;
    		}
		}
	}

	public void mouseRelease(MouseEvent e) {
		if(e.getButton() == MouseEvent.BUTTON1){
    		if(selectingState == 2){
    			Point p22 = InputHandler.lastMousePos;
    			Point p1 = Utils.toLevelCoords(sel_p1);
    			Point p2 = Utils.toLevelCoords(p22);
    			Rectangle r = Utils.negativeRect2(p1.x, p1.y, p2.x, p2.y);
    			Rectangle ro = Utils.negativeRect2(sel_p1.x, sel_p1.y, p22.x, p22.y);
    			
    			System.out.println(toAdd);
    			if(toAdd != null){
        			if(toAdd.toLowerCase().contains("coll")){
        				CollisionBox b = new CollisionBox(r.x, r.y, r.width, r.height);
        				b.type = CollisionBoxType.NORMAL;
        				l.collisionBoxes.add(b);
        				b.updateCollision();
        				selectingState = 0;
        			}else if(toAdd.toLowerCase().contains("room")){
        				CollisionBox b = new CollisionBox(r.x, r.y, r.width, r.height);
        				b.type = CollisionBoxType.ROOM_TRIGGER;
        				b.updateCollision();
        				
        				System.out.println("room");
        				
        				new Thread(new Runnable() {
    						@Override
    						public void run() {
    							RoomInfo r = new RoomInfo(l, b);
    							r.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
    							r.setLocationRelativeTo(null);
    							r.setVisible(true);
    						}
    					}).start();
        				selectingState = 0;
        			}else if(toAdd.toLowerCase().contains("im")){
        				System.out.println("image");
        				
        				new Thread(new Runnable() {
    						@Override
    						public void run() {
    							SpriteInfo s = new SpriteInfo(l);
    							s.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
    							s.setLocationRelativeTo(null);
    							s.setVisible(true);
    						}
    					}).start();
        				selectingState = 0;
        			}else if(toAdd.toLowerCase().contains("cam")){
        			    
    	    			Rectangle transRScroll = Utils.toLevelCoords(r);

        				Rectangle rscroll = Utils.negativeRect2(-p1.x + 646, -p1.y, (-p2.x), (-p2.y) + 505);

        				if(transRScroll.width >= 646 && transRScroll.height >= 505){
        					l.scrollLimits = rscroll;
        				}
        			}
        			selectingState = 0;
    			}else{
    				selectingState = 0;
    			}
    		}
		}
	}
	
	public boolean canEditThings(){
		return (!playTesting && l != null);
	}
	
}
