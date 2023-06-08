loaded_assets = {
	arrow_sets: false,
	graphics: false,
	sounds: false,
	fonts: false,
}

function start_preload() {

	// TODO: load arrow sets independently.
	markAssetLoaded("arrow_sets");

	fonts_loader.load();
	graphics_loader.load();
	// sounds are handled by Howler.js independently.

}

function markAssetLoaded(asset) {
	loaded_assets[asset] = true;
	checkForAllAssetsLoaded();
}

function checkForAllAssetsLoaded() {
	for (var asset in loaded_assets) {
		if (!loaded_assets[asset]) return;
	}
	init_game();
}
