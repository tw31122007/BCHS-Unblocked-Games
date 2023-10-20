/*
MIT License

Copyright (c) 2022 Calder Young

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const CHAR_WIDTHS = [
	1,9,9,8,8,8,8,7,9,8,9,9,8,9,9,9,
	8,8,8,8,9,9,8,9,8,8,8,8,8,9,9,9,
	4,2,5,6,6,6,6,3,5,5,5,6,2,6,2,6,
	6,6,6,6,6,6,6,6,6,6,2,2,5,6,5,6,
	7,6,6,6,6,6,6,6,6,4,6,6,6,6,6,6,
	6,6,6,6,6,6,6,6,6,6,6,4,6,4,6,6,
	3,6,6,6,6,6,5,6,6,2,6,5,3,6,6,6,
	6,6,6,6,4,6,6,6,6,6,6,5,2,5,7,6,
	6,6,6,6,6,6,6,6,6,6,6,4,6,3,6,6,
	6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,6,
	6,3,6,6,6,6,6,6,6,7,6,6,6,2,6,6,
	8,9,9,6,6,6,8,8,6,8,8,8,8,8,6,6,
	9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,
	9,9,9,9,9,9,9,9,9,6,9,9,9,5,9,9,
	8,7,7,8,7,8,8,8,7,8,8,7,9,9,6,7,
	7,7,7,7,9,6,7,8,7,6,6,9,7,6,7,1
];

const CHAR_SHADOW_BRIGHTNESS = 0.247;

const SERVER_ASPECT_RATIO = 38.0 / 256.0;

class ServerEmbed {
	
	constructor(tag, width) {
		this.containerTag = tag;
		tag.style.width = width;
		tag.style.height = Math.floor(tag.clientWidth * SERVER_ASPECT_RATIO) + "px";
		tag.style.backgroundColor = "black";
		this.canvas = document.createElement("canvas");
		this.canvas.width = tag.clientWidth;
		this.canvas.height = tag.clientHeight;
		tag.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");
		if(!this.ctx) {
			throw new Error("CanvasRenderingContext2D is not supported in this browser");
		}
		this.ctx.imageSmoothingEnabled = false;
		this.tmpCanvas = document.createElement("canvas");
		this.tmpCanvas.width = 64;
		this.tmpCanvas.height = 64;
		this.tmpCtx = this.tmpCanvas.getContext("2d");
		this.tmpCtx.imageSmoothingEnabled = false;
		const self = this;
		this.spriteSheet = document.createElement("img");
		this.spriteSheet.addEventListener("load", () => {
			self.isSpriteSheetLoaded = true;
			setInterval(() => self.redraw(), 50);
		});
		this.spriteSheet.src = "icons.png";
		this.socket = null;
		this.connected = false;
		this.dirty = false;
		this.connecting = 0;
		this.currentStatus = {
			serverName: "",
			serverCracked: false,
			pingSentTime: 0,
			pingToServer: -1,
			motdLine1: "",
			motdLine2: "",
			onlineCount: 0,
			maxCount: 0,
			players: []
		};
		this.showCracked = true;
		this.tooltip = "";
		this.isShowingTooltip = false;
		this.isTooltipEnabled = true;
		this.tooltipCanvas = document.createElement("canvas");
		this.tooltipCanvas.width = 64;
		this.tooltipCanvas.height = 64;
		this.tooltipCanvas.style.display = "none";
		this.tooltipCanvas.style.position = "fixed";
		this.tooltipCanvas.style.zIndex = "100";
		this.tooltipCanvas.style.pointerEvents = "none";
		this.tooltipCtx = this.tooltipCanvas.getContext("2d");
		this.tooltipCtx.imageSmoothingEnabled = false;
		document.body.appendChild(this.tooltipCanvas);
		this.mouseOver = false;
		this.mouseX = 0;
		this.mouseY = 0;
		this.mousePageX = 0;
		this.mousePageY = 0;
		var mouseMove = (e) => {
			self.mouseOver = true;
			self.mouseX = e.offsetX / self.canvas.width * 256.0;
			self.mouseY = e.offsetY / self.canvas.height * 38.0;
			self.mousePageX = e.clientX;
			self.mousePageY = e.clientY;
		};
		this.canvas.addEventListener("mouseover", mouseMove);
		this.canvas.addEventListener("mousemove", mouseMove);
		this.canvas.addEventListener("mouseout", (e) => {
			self.mouseOver = false;
			self.tooltipCanvas.style.display = "none";
		});
		this.lastWidth = 0;
		this.redrawTimer = 0;
	}
	
	setShowCracked(b) {
		if(b != this.showCracked) {
			this.showCracked = b;
			this.dirty = true;
		}
	}
	
	setShowTooltip(b) {
		this.isTooltipEnabled = b;
	}
	
	getPixelX(x) {
		return x * this.canvas.width / 256.0;
	}
	
	getPixelY(y) {
		return y * this.canvas.height / 38.0;
	}
	
	drawIcon(x, y, w, h, dx, dy, dw, dh) {
		if(this.isSpriteSheetLoaded) {
			this.ctx.drawImage(this.spriteSheet, x + 0.05, y + 0.05, w - 0.1, h - 0.1, this.getPixelX(dx),
			this.getPixelY(dy), this.getPixelX(dw||w), this.getPixelY(dh||h));
		}
	}
	
	drawChar(x, y, ch, italic) {
		if(ch >= CHAR_WIDTHS.length) {
			ch = 176;
		}
		if(!italic) {
			this.drawIcon(ch % 16 * 8, Math.floor(ch / 16.0) * 8.0, CHAR_WIDTHS[ch], 8, x, y);
		}else {
			if(this.isSpriteSheetLoaded) {
				this.ctx.resetTransform();
				this.ctx.scale(this.canvas.width / 256.0, this.canvas.height / 38.0);
				this.ctx.translate(x + 1.1, y);
				this.ctx.transform(1, 0, -0.35, 1, 0, 0);
				this.ctx.drawImage(this.spriteSheet, ch % 16 * 8, Math.floor(ch / 16.0) * 8.0,
					CHAR_WIDTHS[ch] * 0.99, 8 * 0.99, 0, 0, CHAR_WIDTHS[ch], 8);
				this.ctx.resetTransform();
			}
		}
		return CHAR_WIDTHS[ch];
	}
	
	drawColoredChar(x, y, ch, color, italic) {
		if(ch >= CHAR_WIDTHS.length) {
			ch = 176;
		}
		if(!this.isSpriteSheetLoaded) {
			return CHAR_WIDTHS[ch];
		}
		this.tmpCtx.globalCompositeOperation = "source-over";
		this.tmpCtx.clearRect(0, 0, 8, 8);
		this.tmpCtx.imageSmoothingEnabled = false;
		this.tmpCtx.drawImage(this.spriteSheet, ch % 16 * 8, Math.floor(ch / 16.0) * 8.0,
			CHAR_WIDTHS[ch] * 0.99, 8 * 0.99, 0, 0, CHAR_WIDTHS[ch], 8);
		this.tmpCtx.globalCompositeOperation = "source-in";
		this.tmpCtx.fillStyle = color;
		this.tmpCtx.fillRect(0, 0, CHAR_WIDTHS[ch], 8);
		
		if(!italic) {
			this.ctx.drawImage(this.tmpCanvas, 0, 0, CHAR_WIDTHS[ch] * 0.99, 8 * 0.99, this.getPixelX(x),
			this.getPixelY(y), this.getPixelX(CHAR_WIDTHS[ch]), this.getPixelY(8));
		}else {
			this.ctx.resetTransform();
			this.ctx.scale(this.canvas.width / 256.0, this.canvas.height / 38.0);
			this.ctx.translate(x + 1.1, y);
			this.ctx.transform(1, 0, -0.35, 1, 0, 0);
			this.ctx.drawImage(this.tmpCanvas, 0, 0, CHAR_WIDTHS[ch] * 0.99, 8 * 0.99, 0, 0, CHAR_WIDTHS[ch], 8);
			this.ctx.resetTransform();
		}
		return CHAR_WIDTHS[ch];
	}
	
	drawCharLine(x, y, w, clr) {
		this.ctx.fillStyle = clr;
		this.ctx.fillRect(this.getPixelX(x), this.getPixelY(y), this.getPixelX(w + 0.02), this.getPixelY(1));
	}
	
	makeColor(r, g, b) {
		return "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ",1.0)";
	}
	
	getStringWidth(txt, escapeChar) {
		if(!escapeChar) {
			escapeChar = 167;
		}else {
			escapeChar = escapeChar.charCodeAt(0);
		}
		var j = 0;
		for(var i = 0; i < txt.length; ++i) {
			var c = txt.charCodeAt(i);
			if(c == escapeChar) {
				i += 2;
			}else {
				if(c < CHAR_WIDTHS.length) {
					j += CHAR_WIDTHS[c];
				}else {
					j += 6;
				}
			}
		}
		return j;
	}
	
	drawString(x, y, txt, r, g, b, shadow, randomSeed, escapeChar) {
		var escapeCharChar = escapeChar;
		if(!escapeChar) {
			escapeChar = 167;
		}else {
			escapeChar = escapeChar.charCodeAt(0);
		}
		var startX = x;
		var startY = y;
		if(shadow) {
			++x;
			++y;
		}
		if(!randomSeed) {
			randomSeed = 3492589035;
		}
		var readFormat = false;
		var cr = r;
		var cg = g;
		var cb = b;
		var obfuscate = false; var bold = false; var strikethrough = false;
		var underline = false; var italic = false;
		for(var i = 0; i < txt.length; ++i) {
			var c = txt.charCodeAt(i);
			if(c == escapeChar) { // color code symbol
				readFormat = true;
				continue;
			}
			if(readFormat) {
				if(c == 48) { // black (0)
					cr = cg = cb = 0;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 49) { // dark_blue (1)
					cr = cg = 0;
					cb = 170;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 50) { // dark_green (2)
					cr = cb = 0;
					cg = 170;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 51) { // dark_aqua (3)
					cr = 0;
					cg = cb = 170;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 52) { // dark_red (4)
					cr = 170;
					cg = cb = 0;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 53) { // dark_purple (5)
					cr = cb = 170;
					cg = 0;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 54) { // gold (6)
					cr = 255;
					cg = 170;
					cb = 0;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 55) { // gray (7)
					cr = cg = cb = 170;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 56) { // dark_gray (8)
					cr = cg = cb = 85;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 57) { // blue (9)
					cr = cg = 85;
					cb = 255;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 97) { // green (a)
					cr = cb = 85;
					cg = 255;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 98) { // aqua (b)
					cr = 85;
					cg = cb = 255;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 99) { // red (c)
					cg = cb = 85;
					cr = 255;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 100) { // light_purple (d)
					cr = cb = 255;
					cg = 85;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 101) { // yellow (e)
					cr = cg = 255;
					cb = 85;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 102) { // white (f)
					cr = cg = cb = 255;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}else if(c == 107) { // obfuscated (k)
					readFormat = false;
					obfuscate = true;
					continue;
				}else if(c == 108) { // bold (l)
					readFormat = false;
					bold = true;
					continue;
				}else if(c == 109) { // strikethrough (m)
					readFormat = false;
					strikethrough = true;
					continue;
				}else if(c == 110) { // underline (n)
					readFormat = false;
					underline = true;
					continue;
				}else if(c == 111) { // italic (o)
					readFormat = false;
					italic = true;
					continue;
				}else if(c == 114) { // reset (r)
					cr = r;
					cg = g;
					cb = b;
					readFormat = obfuscate = bold =
					strikethrough = underline = italic = false;
					continue;
				}
				readFormat = false;
				continue;
			}
			if(obfuscate) {
				this.dirty = true;
				var w = 6
				if(c < CHAR_WIDTHS.length) {
					w = CHAR_WIDTHS[c];
				}
				var j = 0;
				var newChar = 0;
				do {
					var t = randomSeed += 0x6D2B79F5;
					t = Math.imul(t ^ t >>> 15, t | 1);
					t ^= t + Math.imul(t ^ t >>> 7, t | 61);
					newChar = (((t ^ t >>> 14) >>> 0) / 429496) & 255;
				}while((newChar == c || CHAR_WIDTHS[newChar] != w) && ++j < 1000);
				c = newChar;
			}
			if(shadow) {
				var ccc = this.makeColor(cr * CHAR_SHADOW_BRIGHTNESS,
						cg * CHAR_SHADOW_BRIGHTNESS, cb * CHAR_SHADOW_BRIGHTNESS);
				var ox = x;
				var ow = 0;
				if(bold) this.drawColoredChar(x + 1, y, c, ccc, italic);
				x += (ow = this.drawColoredChar(x, y, c, ccc, italic));
				if(bold) {
					++x;
					++ow;
				}
				if(strikethrough) this.drawCharLine(ox, y + 4, ow, ccc);
				if(underline) this.drawCharLine(ox, y + 8, ow, ccc);
			}else {
				if(cr >= 250 && cg >= 250 && cb >= 250) {
					var ox = x;
					var ow = 0;
					if(bold) this.drawChar(x + 1.0, y, c, italic);
					x += (ow = this.drawChar(x, y, c, italic));
					if(bold) {
						++x;
						++ow;
					}
					if(strikethrough) this.drawCharLine(ox, y + 4, ow, "#FFFFFF");
					if(underline) this.drawCharLine(ox, y + 8, ow, "#FFFFFF");
				}else {
					var ccc = this.makeColor(cr,cg,cb);
					var ox = x;
					var ow = 0;
					if(bold) this.drawColoredChar(x + 1.0, y, c, ccc, italic);
					x += (ow = this.drawColoredChar(x, y, c, ccc, italic));
					if(bold) {
						++x;
						++ow;
					}
					if(strikethrough) this.drawCharLine(ox, y + 4, ow, ccc);
					if(underline) this.drawCharLine(ox, y + 8, ow, ccc);
				}
			}
			if(x > 250.0) {
				break;
			}
		}
		if(shadow) {
			this.drawString(startX, startY, txt, r, g, b, false, randomSeed, escapeCharChar);
		}
	}
	
	redraw() {
		if(this.dirty || (this.mouseOver && ++this.redrawTimer % 6 == 0) || this.canvas.width != this.containerTag.clientWidth) {
			this.dirty = false;
			if(this.canvas.width != this.containerTag.clientWidth) {
				this.containerTag.style.height = Math.floor(this.containerTag.clientWidth * SERVER_ASPECT_RATIO) + "px";
				this.canvas.width = this.containerTag.clientWidth;
				this.canvas.height = this.containerTag.clientHeight;
			}
			var tooltipNewArray = [];
			this.ctx.imageSmoothingEnabled = false;
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillStyle = "#101010";
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.strokeStyle = "#808080";
			this.ctx.lineWidth = this.getPixelX(1.0);
			this.ctx.strokeRect(this.ctx.lineWidth / 2, this.ctx.lineWidth / 2,this.canvas.width - this.ctx.lineWidth,this.canvas.height - this.ctx.lineWidth);
			
			if(!this.iconCanvas) {
				this.drawIcon(128, 0, 64, 64, 4, 4, 30, 30);
			}else {
				this.ctx.drawImage(this.iconCanvas, 0, 0, 64, 64, this.getPixelX(4),
				this.getPixelY(4), this.getPixelX(30), this.getPixelY(30));
			}
			
			var v = Date.now();
			var drawAddress = false;
			
			this.drawString(38, 4, this.currentStatus.serverName, 255, 255, 255, true, v);
			if(this.currentStatus.pingToServer >= 0) {
				if(this.currentStatus.motdLine1.length > 0) {
					this.drawString(38, 15, ""+this.currentStatus.motdLine1, 255, 255, 255, true, v);
				}
				if(this.currentStatus.motdLine2.length > 0) {
					this.drawString(38, 27, ""+this.currentStatus.motdLine2, 255, 255, 255, true, v);
				}else {
					drawAddress = true;
				}
			}else if(v - this.connecting < 7000) {
				this.dirty = true;
				var dots = Math.floor(v / 300) % 4;
				this.drawString(38, 15, "Connecting" + (dots > 0 ? "." : "") + (dots > 1 ? "." : "") + (dots > 2 ? "." : ""), 128, 128, 128, true, v);
				drawAddress = true;
			}else {
				this.drawString(38, 15, "No Connection", 96, 96, 96, true, v);
				drawAddress = true;
			}
			if(drawAddress && this.showAddress) {
				this.drawString(38, 27, this.originalAddress, 48, 48, 48, true, v);
			}
			var mouseIsOverPing = this.mouseOver && this.mouseX >= 233 && this.mouseX <= 256 && this.mouseY >= 1 && this.mouseY <= 11;
			var mouseIsOverPlayers = false;
			if(this.currentStatus.pingToServer >= 0) {
				if(mouseIsOverPing) tooltipNewArray = [""+this.currentStatus.pingToServer+"ms"];
				var i = 5;
				if(this.currentStatus.pingToServer < 150) i = 0;
				else if(this.currentStatus.pingToServer < 300) i = 1;
				else if(this.currentStatus.pingToServer < 600) i = 2;
				else if(this.currentStatus.pingToServer < 1000) i = 3;
				else i = 4;
				this.drawIcon(128, 80 + i * 8, 10, 7, 243, 3);
				var onlineStr = "" + this.currentStatus.onlineCount + "/" + this.currentStatus.maxCount;
				var xx = 253 - this.getStringWidth(onlineStr);
				mouseIsOverPlayers = !mouseIsOverPing && this.mouseOver && this.mouseX >= xx - 5 && this.mouseX <= 256
					&& this.mouseY >= 12 && this.mouseY <= 23;
				this.drawString(xx, 14, onlineStr, 128, 128, 128, true);
				if(mouseIsOverPlayers) {
					tooltipNewArray = this.currentStatus.players;
				}
			}else {
				if(v - this.connecting < 7000 || this.connected) {
					this.dirty = true;
					if(mouseIsOverPing) tooltipNewArray = ["Connecting..."];
					this.drawIcon(138, 80 + Math.abs(Math.floor(v / 100.0) % 8 - 4) * 8, 10, 7, 243, 3);
				}else {
					if(mouseIsOverPing) tooltipNewArray = ["No Connection"];
					this.drawIcon(128, 120, 10, 7, 243, 3);
				}
			}
			if(this.showCracked && this.currentStatus.pingToServer >= 0) {
				if(this.currentStatus.serverCracked) {
					this.drawIcon(144, 64, 16, 16, 243, 25, 10, 10);
				}else {
					this.drawIcon(176, 96, 16, 16, 243, 25, 11, 11);
				}
				if(!mouseIsOverPlayers && this.mouseOver && this.mouseX >= 239 && this.mouseX <= 256
					&& this.mouseY >= 22 && this.mouseY <= 36) {
					if(this.currentStatus.serverCracked) {
						tooltipNewArray = ["Server is cracked"];
					}else {
						tooltipNewArray = ["Server has login"];
					}
				}
			}
			if(!tooltipNewArray || !this.mouseOver || tooltipNewArray.length == 0) {
				this.tooltipCanvas.style.display = "none";
			}else {
				this.showTooltip(tooltipNewArray);
			}
		}
	}
	
	ping(addr, name, forceName, hideAddress, hideCracked) {
		if(!name) {
			name = "Minecraft Server";
			this.showQueryName = (typeof forceName === "undefined") || !forceName;
		}else {
			this.showQueryName = (typeof forceName !== "undefined") && !forceName;
		}
		this.defaultName = name;
		this.showAddress = !hideAddress;
		this.originalAddress = addr;
		if(typeof hideCracked !== "undefined") {
			this.showCracked = !hideCracked;
		}
		if(addr.indexOf("ws://") != 0 && addr.indexOf("wss://") != 0) {
			addr = (window.location.href.indexOf("https:") == 0 ? "wss" : "ws") + "://" + addr;
		}
		if(this.socket != null && this.connected) {
			this.socket.close();
		}
		this.currentStatus = {
			serverName: name,
			serverCracked: false,
			pingSentTime: Date.now(),
			pingToServer: -1,
			motdLine1: "Connecting...",
			motdLine2: "",
			onlineCount: 0,
			maxCount: 0,
			players: []
		};
		this.dirty = true;
		if(this.connected || this.connecting > 0) {
			this.socket.close();
			this.connected = false;
			this.connecting = 0;
			this.redraw();
		}
		this.connecting = Date.now();
		const self = this;
		this.socket = new WebSocket(addr);
		this.socket.binaryType = "arraybuffer";
		this.socket.onopen = () => {
			self.socket.send("Accept: MOTD");
			self.connecting = 0;
			self.connected = true;
			self.dirty = true;
		};
		this.socket.onmessage = (e) => {
			if(e.data) {
				if(typeof e.data === "string") {
					try {
						var dat = JSON.parse(e.data);
						if(dat["type"].toLowerCase() === "motd") {
							self.dirty = true;
							if(self.currentStatus.pingSentTime > 0) {
								self.currentStatus.pingToServer = Date.now() - self.currentStatus.pingSentTime;
								self.currentStatus.pingSentTime = 0;
							}
							if(this.showQueryName) {
								self.currentStatus.serverName = dat["name"];
							}else {
								self.currentStatus.serverName = this.defaultName;
							}
							self.currentStatus.serverCracked = dat["cracked"];
							var lns = dat["data"]["motd"];
							if(lns && lns.length > 0) {
								self.currentStatus.motdLine1 = lns[0];
								if(lns.length > 1) {
									self.currentStatus.motdLine2 = lns[1];
								}
							}
							self.currentStatus.onlineCount = dat["data"]["online"];
							self.currentStatus.maxCount = dat["data"]["max"];
							self.currentStatus.players = dat["data"]["players"]||[];
						}
					}catch(e) {
						self.currentStatus.motdLine1 = "ERROR: " + e;
					}
				}else {
					var dat = new Uint8Array(e.data);
					if(dat.length == 64*64*4) {
						this.updateIconFromBytes(dat);
						this.dirty = true;
					}
				}
			}
		};
		this.socket.onclose = (e) => {
			self.connecting = 0;
			self.connected = false;
			self.dirty = true;
		};
		this.socket.onerror = (e) => {
			if(self.connected || self.connecting > 0) {
				self.socket.close();
			}
			self.connecting = 0;
			self.connected = false;
			self.dirty = true;
		};
	}
	
	isActive() {
		return self.connecting > 0 || self.connected;
	}
	
	setTooltip(ttList) {
		if(this.isTooltipEnabled) {
			var tst = ttList.join();
			if(tst !== this.tooltip || this.lastWidth !== this.canvas.width) {
				var listWidth = 0;
				var listHeight = ttList.length * 9;
				for(var i = 0; i < ttList.length; ++i) {
					listWidth = Math.max(listWidth, this.getStringWidth(ttList[i]));
				}
				listWidth += 6;
				listHeight += 3;
				this.tooltipCanvas.width = this.getPixelX(listWidth);
				this.tooltipCanvas.height = this.getPixelY(listHeight);
				var mainCtx = this.ctx;
				this.ctx = this.tooltipCtx;
				this.ctx.imageSmoothingEnabled = false;
				this.ctx.clearRect(0, 0, this.tooltipCanvas.width, this.tooltipCanvas.height);
				this.ctx.fillStyle = "#101010E0";
				this.ctx.fillRect(0, 0, this.tooltipCanvas.width, this.tooltipCanvas.height);
				for(var i = 0; i < ttList.length; ++i) {
					this.drawString(3, (2 + i*9), ttList[i], 256, 256, 256, true);
				}
				this.ctx = mainCtx;
				this.tooltip = tst;
				this.lastWidth = this.canvas.width;
			}
		}
	}
	
	showTooltip(ttList) {
		this.dirty = true;
		if(!this.mouseOver) {
			this.tooltipCanvas.style.display = "none";
			return;
		}
		this.setTooltip(ttList);
		this.tooltipCanvas.style.display = "block";
		var x = this.mousePageX + this.getPixelX(4);
		var y = this.mousePageY - this.getPixelY(9);
		if(this.mousePageX + this.tooltipCanvas.width + 2 > window.innerWidth) {
			x = window.innerWidth - this.tooltipCanvas.width - 2;
		}
		if(this.mousePageY + this.tooltipCanvas.height + 2 > window.innerHeight) {
			y = window.innerHeight - this.tooltipCanvas.height - 2;
			if(y < 0) {
				y = 0;
			}
		}
		this.tooltipCanvas.style.left = x + "px";
		this.tooltipCanvas.style.top = y + "px";
	}
	
	updateIconFromBytes(arr) {
		if(!this.iconCanvas) {
			this.iconCanvas = document.createElement("canvas");
			this.iconCanvas.width = 64;
			this.iconCanvas.height = 64;
			this.iconContext = this.iconCanvas.getContext("2d");
		}
		var dat = this.iconContext.createImageData(64, 64);
		for(var i = 0, l = 64*64*4; i < l; ++i) {
			dat.data[i] = arr[i];
		}
		this.iconContext.putImageData(dat, 0, 0);
	}
	
}

