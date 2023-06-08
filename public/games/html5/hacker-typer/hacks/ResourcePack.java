package me.pieking.game;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.swing.filechooser.FileSystemView;

import org.json.JSONObject;

import me.pieking.game.characters.Player;
import me.pieking.game.gfx.Sprite;
import me.pieking.game.level.Level;
import me.pieking.game.sound.Sound;

public class ResourcePack {

	public static final ResourcePack DEFAULT = new ResourcePack("default", 
                                            "Default Pack", "It's the standard pack.", 
                                            true, true, false, false, false, true);
	
	public static boolean ranFromJar = false;

	public static String loadPack;
	
	public String filename;
	public boolean absolute = false;
	public String displayName;
	public String description;
	public boolean texturesIncluded;
	public boolean soundsIncluded;
	public boolean roomsIncluded;
	public boolean pluginIncluded;
	public boolean stringsIncluded;
	
	public HashMap<String, String> strings = new HashMap<String, String>();
	
	public static List<ResourcePack> availablePacks = new ArrayList<ResourcePack>();
	
	public ResourcePack(String filename, String displayName, String description){
		this(filename, displayName, description, true, true, false, false);
	}
	
	public ResourcePack(String filename, String displayName, 
                        String description, boolean texturesIncluded){
		this(filename, displayName, description, texturesIncluded, 
                true, false, false);
	}
	
	public ResourcePack(String filename, String displayName, 
                        String description, boolean texturesIncluded, 
                        boolean soundsIncluded){
		this(filename, displayName, description, 
             texturesIncluded, soundsIncluded, false, false);
	}
	
	public ResourcePack(String filename, String displayName, 
                        String description, boolean texturesIncluded, 
                        boolean soundsIncluded, boolean roomsIncluded){
		this(filename, displayName, description, 
             texturesIncluded, soundsIncluded, roomsIncluded, false);
	}
	
	public ResourcePack(String filename, String displayName, 
                        String description, boolean texturesIncluded, 
                        boolean soundsIncluded, boolean roomsIncluded, 
                        boolean absolute){
		this(filename, displayName, description, 
             texturesIncluded, soundsIncluded, roomsIncluded, absolute, false);
	}
	
	public ResourcePack(String filename, String displayName, 
                        String description, boolean texturesIncluded, 
                        boolean soundsIncluded, boolean roomsIncluded, 
                        boolean absolute, boolean pluginIncluded){
		this(filename, displayName, description, 
             texturesIncluded, soundsIncluded, 
             roomsIncluded, absolute, pluginIncluded, false);
	}
	
	public ResourcePack(String filename, String displayName, 
                        String description, boolean texturesIncluded, 
                        boolean soundsIncluded, boolean roomsIncluded, 
                        boolean absolute, boolean pluginIncluded, 
                        boolean strings){
		this.filename = filename;
		this.displayName = displayName;
		this.description = description;
		this.texturesIncluded = texturesIncluded;
		this.soundsIncluded = soundsIncluded;
		this.roomsIncluded = roomsIncluded;
		this.absolute = absolute;
		this.pluginIncluded = pluginIncluded;
		this.stringsIncluded = strings;
		if(stringsIncluded){
			loadStrings();
		}
	}
	
	public URL getResource(String path){
		
		URL returnURL = getResourceNoFallback(path);
		
		if(returnURL == null){
			Game.info("Missing resource in resource pack \"" + 
                        displayName + "\" (" + filename + ") - " + path + 
                        (absolute ? " (Absolute)" : " (Internal)"), true);
			returnURL = getDefaultResource(path);
		}
		
		return returnURL;
	}
	
	public URL getResourceNoFallback(String path){
		
		URL returnURL = null;
		
		try{
			if(absolute){
				returnURL = new URL(getRunLocation() + "resources/" + 
                                    filename + "/" + path);
			}else{
				returnURL = ResourcePack.class.getClassLoader().getResource(
                                            "resources/" + filename + "/" + path);
			}
		}catch(Exception e){
			Game.warn("Error getting resource in resource pack \"" + 
                        displayName + "\" (" + filename + ") - " + path + 
                        (absolute ? " (Absolute)" : " (Internal)"), true);
			returnURL = getDefaultResource(path);
		}
		
		if(absolute){
			try {
				File f = new File(returnURL.toURI());
				if(!f.exists()){
					Game.info("Missing resource in resource pack \"" + 
                                displayName + "\" (" + filename + ") - " + path + 
                                (absolute ? " (Absolute)" : " (Internal)"), true);
					returnURL = getDefaultResource(path);
				}
			} catch (Exception e) {
				Game.info("Missing resource in resource pack \"" + 
                            displayName + "\" (" + filename + ") - " + path + 
                            (absolute ? " (Absolute)" : " (Internal)"), true);
				returnURL = getDefaultResource(path);
			}
		}
		
		return returnURL;
	}
	
	public URL getTexture(String path){
		if(texturesIncluded){
			return getResource("textures/" + path);
		}else{
			return getDefaultResource("textures/" + path);
		}
	}
	
	public URL getSound(String path){
		if(soundsIncluded){
			URL ret = getResource("sound/" + path);
			return ret;
		}else{
			URL ret = getDefaultResource("sound/" + path);
			return ret;
		}
	}
	
	public String getRoom(String id){
		if(roomsIncluded){
			return getResourceString("rooms/" + id);
		}else{
			return getDefaultResourceString("rooms/" + id);
		}
	}
	
	public String getResourceString(String res){
		if(absolute){
			try {
				return getRunLocation().toString() + "resources/" + 
                        filename + "/" + res;
			} catch (MalformedURLException | URISyntaxException e) {
				Game.warn("Error getting run location.");
				e.printStackTrace();
				return "";
			}
		}else{
			return "resources/" + filename + "/" + res;
		}
	}
	
	public void loadPlugin(){
		try {
			File f = new File(getResource("plugin.jar").toURI());
			ClassPathHacker.addFile(f);
		} catch (IOException | URISyntaxException e2) {
			Game.severe("COULD NOT LOAD RESOURCE PLUGIN- " + 
                        getResource("plugin.jar"));
			e2.printStackTrace();
		}
	}
	
	public static String[] readTxt(URL path){
		List<String> lines = new ArrayList<String>();
		
		try{
			String s = "";
			
			BufferedReader b = new BufferedReader(
                                    new FileReader(
                                        new File(path.toURI())));
			
			while((s = b.readLine()) != null){
				s = s.trim();
				lines.add(s);
			}
			
			b.close();
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return lines.toArray(new String[lines.size() - 1]);
	}
	
	public static URL getDefaultResource(String path){
		URL ret = ResourcePack.class.getClassLoader().getResource(
                                            "resources/default/" + path);

		return ret;
	}
	
	public static String getDefaultResourceString(String path){
		return "resources/default/" + path;
	}
	
	public static URL getRunLocation() throws MalformedURLException, 
                                                URISyntaxException{
		if(ranFromJar){
			return ResourcePack.class.getProtectionDomain().getCodeSource()
                                            .getLocation().toURI().toURL();
		}else{
			return new URL(getDesktop().toString() + "Undertale%20Neo/");
		}
	}
	
	public static URL getUserFolder() throws MalformedURLException{
		return new URL(getDesktop().toString() + "Undertale%20Neo/");
	}
	
	public static URL getDesktop() throws MalformedURLException{
		return FileSystemView.getFileSystemView().getHomeDirectory().toURI().toURL();
	}

	public URL getRoomFolder() {
		URL returnUrl = getResourceNoFallback("rooms/");
		return returnUrl;
	}
	
	public JSONObject getRoomData(){
		if(roomsIncluded){
			return Utils.getJSON(getResource("rooms/data.json"));
		}else{
			return Utils.getJSON(ResourcePack.class.getClassLoader()
                                    .getResource("rooms/data.json"));
		}
	}
	
	public JSONObject getRoomData(String room){
		return getRoomData(room, false);
	}
	
	public JSONObject getRoomData(String room, boolean absolute){
		if(absolute){
			try {
				return Utils.getJSON(new URL(room + "/data.json"));
			} catch (MalformedURLException e) {
				e.printStackTrace();
				return null;
			}
		}else{
			if(roomsIncluded){
				return Utils.getJSON(getResource(room + "/data.json"));
			}else{
				System.out.println(room);
				return Utils.getJSON(ResourcePack.class.getClassLoader()
                                        .getResource(room + "/data.json"));
			}
		}
	}
	
	public void loadStrings(){
		strings.clear();
		URL file = getResource("strings.txt");
		InputStream is;
		try {
			is = file.openStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			String line = "";
			while((line = br.readLine()) != null){
				String filteredLine = line;
				if(filteredLine.contains("#")){
					filteredLine = filteredLine.substring(0, 
                                filteredLine.indexOf("#")); //Filter out comments
				}
				if(!filteredLine.isEmpty()){
					String[] split =  filteredLine.split(":");
					if(split.length >= 2){
						String code = split[0];
						String msg = filteredLine.replace(code + ":", "");
						if(msg.startsWith(" ")){
							msg = msg.substring(1);
						}
						code = code.replaceFirst("^0+(?!$)", ""); //Remove leading 0s
						strings.put(code, msg);
					}
				}
			}
		} catch (IOException e) {
			Game.warn("Error parsing strings.txt:");
			e.printStackTrace();
		}
		
	}
	
	public String getString(String lineName){
		String ret = "???";
		if(stringsIncluded){
			ret = strings.get(0);
			try{
				lineName = lineName.replaceFirst("^0+(?!$)", ""); //Remove leading 0s
				ret = strings.get(lineName);
			}catch(Exception e){
				Game.warn("Could not find string with id: " + lineName);
				e.printStackTrace();
			}
		}else{
			ret = DEFAULT.getString(lineName);
		}
		
		ret = formatString(ret);
		
		return ret;
	}
	
	public static String formatString(String str){
		String ret = str;

		if(ret == null){
			return "null";
		}
		
		if(ret.contains("{v}")) ret = ret.replace("{v}", 
                                        Game.VERSION);
		if(ret.contains("{hp}")) ret = ret.replace("{hp}", 
                                        Player.hp + "");
		if(ret.contains("{maxHp}")) ret = ret.replace("{maxHp}", 
                                        Player.maxHp + "");
		if(ret.contains("{lv}")) ret = ret.replace("{lv}", 
                                        Player.love + "");
		if(ret.contains("{name}")) ret = ret.replace("{name}", 
                                        Player.name);
		if(ret.contains("{steps}")) ret = ret.replace("{steps}", 
                                        Player.numSteps + "");
		if(ret.contains("{lvlId}")) ret = ret.replace("{lvlId}", 
                                        Level.getActiveLevel() != null ? 
                                            Level.getActiveLevel().id : 
                                            Game.resourcePack.getString(193));
		if(ret.contains("{px}")) ret = ret.replace("{px}", 
                                        Player.overworldLoc.getX() + "");
		if(ret.contains("{py}")) ret = ret.replace("{py}", 
                                        Player.overworldLoc.getY() + "");
		
        
		if(ret.contains("{dbgMenu}")) ret = ret.replace("{dbgMenu}", 
                                        Vars.showDebugMenu + "");
		if(ret.contains("{atkHit}")) ret = ret.replace("{atkHit}", 
                                        Vars.showAttackHitboxes + "");
		if(ret.contains("{newBulBox}")) ret = ret.replace("{newBulBox}", 
                                        Vars.showNewBulletBox + "");
		if(ret.contains("{dbgInvul}")) ret = ret.replace("{dbgInvul}", 
                                        Vars.playerInvulnerable + "");
		if(ret.contains("{showColl}")) ret = ret.replace("{showColl}", 
                                        Vars.showCollisionHitboxes + "");
		if(ret.contains("{noclip}")) ret = ret.replace("{noclip}", 
                                        Vars.playerNoclip + "");
		if(ret.contains("{tpsMod}")) ret = ret.replace("{tpsMod}", 
                                        Vars.tps + "");
		if(ret.contains("{controller}")) ret = ret.replace("{controller}", 
                                        InputHandler.useController() + "");
		
		if(ret.contains("{c}")) ret = ret.replace("{c}", "\u00a9");
		
		Set<String> keySet = ResourcePack.DEFAULT.strings.keySet();
		for(String s : keySet){
			if(ret.contains("[$" + s + "]")){
				ret = ret.replace("[$" + s + "]", formatString(Game.resourcePack.getString(s)));
			}
		}
	
		return ret;
	}
	
	public String getString(int lineNumber){
		return getString(lineNumber + "");
	}
	
	public static boolean setPack(String packFileName, boolean sound){
		List<ResourcePack> packs = new ArrayList<ResourcePack>();
		packs.addAll(availablePacks);
		for(ResourcePack p : packs){
			if(p.filename.equals(packFileName)){
				setPack(p, sound);
				return true;
			}
		}
		Game.info("Could not find resource pack: " + packFileName + ".");
		return false;
	}
	
	public static void setPack(ResourcePack pack, boolean sound){
		Game.info("Setting resource pack: " + pack.displayName + 
                    " (" + pack.filename + ")...");
		Game.resourcePack = pack;
		if(sound)Sound.playSound("selectPack.ogg", 0f);
		if(pack.texturesIncluded)Sprite.reloadAll();
		if(pack.soundsIncluded){
			Thread t = new Thread(new Runnable() {
				@Override
				public void run() {
					Sound.soundSystem.reload();
				}
			});
			t.start();
		}
		Game.info("Set resource pack: " + pack.displayName + " (" + 
                    pack.filename + ")!");
	}
	
	public static void getAvailRPs(){
		try {
			ResourcePack.availablePacks.clear();
			
			ResourcePack.availablePacks.add(ResourcePack.DEFAULT);
		
			File parent = new File(new URL(
                                ResourcePack.getRunLocation().toString() + 
                                "resources/").toURI());
			getPacks(parent, true);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static void getPacks(File parent, boolean absolute) 
                                throws MalformedURLException{
		File[] children = parent.listFiles();
		
		for(File f : children){
			if(f.isDirectory()){
				
				if(f.getName().equals("default")){
					continue;
				}else{
					addPack(f, absolute);
				}
				
			}
		}
	}
	
	public static void addPack(File f, boolean absolute) 
                            throws MalformedURLException{
		String filename = f.getName();
		String displayName = "";
		String description = Game.resourcePack.getString(290);
		boolean includesSound = false;
		boolean includesTextures = false;
		boolean includesRooms = false;
		boolean includesPlugin = false;
		boolean includesStrings = false;
		
		File child = new File(f, "info.txt");
		
		URL u = child.toURI().toURL();
		
		String[] info = ResourcePack.readTxt(u);
		for(int i = 0; i < info.length; i++){
			if(i == 0){
				displayName = info[i];
			}else if(i == 1){
				description = info[i];
			}else if(i > 1){
				if(info[i].equalsIgnoreCase("sounds")) includesSound = true;
				if(info[i].equalsIgnoreCase("textures")) includesTextures = true;
				if(info[i].equalsIgnoreCase("rooms")) includesRooms = true;
				if(info[i].equalsIgnoreCase("plugin")) includesPlugin = true;
				if(info[i].equalsIgnoreCase("strings")) includesStrings = true;
			}
		}
		ResourcePack.availablePacks.add(new ResourcePack(filename, 
                    displayName, description, includesTextures, includesSound, 
                    includesRooms, absolute, includesPlugin, includesStrings));
	}
	
}
