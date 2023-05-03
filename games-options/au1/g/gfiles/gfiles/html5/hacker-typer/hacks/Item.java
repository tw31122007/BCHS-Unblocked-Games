package me.pieking.game.item;

import me.pieking.game.Game;
import me.pieking.game.Utils;

public class Item {
	
	public String fullName = Game.resourcePack.getString(227);
	public String shortName_reg = Game.resourcePack.getString(228);
	public String shortName_gen = Game.resourcePack.getString(228);
	
	public String desc = Game.resourcePack.getString(229);
	public String use = Game.resourcePack.getString(229);
	
	public int id = 0;
	
	public ItemType type = ItemType.UNKNOWN;
	
	public Item(int id, String fullName, String shortName_reg, 
                String shortName_gen, String desc, String use){
		this.fullName = fullName;
		this.shortName_reg = shortName_reg;
		this.shortName_gen = shortName_gen;
		this.desc = desc;
		this.type = ItemType.values()[id];
	}
	
	public Item(ItemType type, String fullName, String shortName_reg, 
                String shortName_gen, String desc, String use){
		this.fullName = fullName;
		this.shortName_reg = shortName_reg;
		this.shortName_gen = shortName_gen;
		this.desc = desc;
		this.type = type;
	}

	public static Item getById(int parseInt) {
		
		Item ret = new ItemMonsterCandy();
		
		ItemType it = ItemType.values()[parseInt];
		
		String className = "me.pieking.game.item.Item" + Utils.toTitleCase(
                            it.name().toLowerCase().replace("_", " ")).replace(" ", ""); 
		
		//System.out.println(parseInt + " " + it + " " + className);
		
		Class<?> clazz;
		try {
			clazz = Class.forName(className);
			
			try {
				ret = (Item) clazz.newInstance();
			} catch (InstantiationException | IllegalAccessException e) {
				Game.warn("Could not create instance for class " + 
                           className + " for item " + it + ". (" + e.getMessage() + ")");
			}
			
		} catch (ClassNotFoundException e) {
			Game.warn("Class " + className + " for item " + 
                      it + " does not exist! (" + e.getMessage() + ")");
		}
		
		return ret;
	}
	
	public enum ItemType{
		UNKNOWN				(0),
		MONSTER_CANDY		(1),
		CORQUET_ROLL		(2),
		STICK				(3),
		BANDAGE				(4),
		ROCK_CANDY			(5),
		PUMPKIN_RINGS		(6),
		SPIDER_DONUT		(7),
		STOIC_ONION			(8),
		GHOST_FRUIT			(9),
		SPIDER_CIDER		(10),
		BUTTERSCOTCH_PIE	(11),
		FADED_RIBBON		(12),
		TOY_KNIFE			(13),
		TOUGH_GLOVE			(14),
		MANLY_BANDANNA		(15),
		SNOWMAN_PIECE		(16),
		NICE_CREAM			(17),
		PUPPYDOUGH_ICECREAM	(18),
		BISICLE				(19),
		UNISICLE			(20),
		CINNAMON_BUN		(21),
		TEMMIE_FLAKES		(22),
		ABANDONED_QUICHE	(23),
		OLD_TUTU			(24),
		BALLET_SHOES		(25),
		PUNCH_CARD			(26),
		ANNOYING_DOG		(27),
		DOG_SALAD			(28),
		DOG_RESIDUE_0		(29),
		DOG_RESIDUE_1		(30),
		DOG_RESIDUE_2		(31),
		DOG_RESIDUE_3		(32),
		DOG_RESIDUE_4		(33),
		DOG_RESIDUE_5		(34),
		ASTRONAUT_FOOD		(35),
		INSTANT_NOODLES		(36),
		CRAB_APPLE			(37),
		HOT_DOG				(38),
		HOT_CAT				(39),
		GLAMBURGER			(40),
		SEA_TEA				(41),
		STARFAIT			(42),
		LEGENDARY_HERO		(43),
		BUTTY_GLASSES		(44),
		TORN_NOTEBOOK		(45),
		STAINED_APRON		(46),
		BURNT_PAN			(47),
		COWBOY_HAT			(48),
		EMPTY_GUN			(49),
		HEART_LOCKET		(50),
		WORN_DAGGER			(51),
		REAL_KNIFE			(52),
		THE_LOCKET			(53),
		BAD_MEMORY			(54),
		DREAM				(55),
		UNDYNE_LETTER		(56),
		UNDYNE_LETTER_EX	(57),
		POPATO_CHISPS		(58),
		JUNK_FOOD			(59),
		MYSTERY_KEY			(60),
		FACE_STEAK			(61),
		HUSH_PUPPY			(62),
		SNAIL_PIE			(63),
		TEmy_arORMOr		(64);
		
		public int id;
		
		ItemType(int id){
			this.id = id;
		}
	}
	
}
