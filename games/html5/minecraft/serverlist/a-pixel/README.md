# Eaglercraft HTML5 Ping Embed

### This allows you to easily embed your Eaglercraft server's ping, player list, and MOTD in a \<div\> element in an HTML5 document using the same style as the game's multiplayer screen

![Eaglercraft HTML5 Ping Embed](https://i.gyazo.com/3db6a206bca69da3545a6083bc8aa7eb.gif)

### Demo link: [https://g.eags.us/eaglercraft/ping.html](https://g.eags.us/eaglercraft/ping.html)

# How to install:

1. Download 'embed.min.js' and 'icons.png' and upload them to your server

2. Add the script: `<script type="text/javascript" src="embed.min.js"></script>`

3. Create a \<div\> like: `<div id="embed"></div>`

4. In your Javascript, create a new `ServerEmbed` object. Pass the \<div\> object and a CSS width as parameters:  
`var embed = new ServerEmbed(document.getElementById("embed"), "500px");`

5. Call the `ping` function on the new object: `embed.ping("127.0.0.1:25565");`  

   (Replace `127.0.0.1:25565` with the `ip:port` or `ws://` or `wss://` address of your server)
   
6. You're done

## Extra features:

The `ping` function takes five arguments, four of which are optional:
```javascript
ping(addr, name, forceName, hideAddress, hideCracked)
```

- `addr` Is the  `ip:port` or `ws://` or `wss://` address of your server

- `name` *(Optional)* Sets the name to display for the server, if left undefined then the default name displayed for the server is the `server_name:` variable of config.yml of the server being pinged (once the server responds)

- `forceName` *(Optional)* Sets if the `name` parameter should always be shown as the server's name instead of the pinged server's config.yml `server_name:` sent in the response to the ping. Default is false, so by default the optional `name` parameter is only shown until the server responds with it's configured `server_name:`, which is then displayed instead until the ping is sent again

- `hideAddress` *(Optional)* Sets if the second line of the server's MOTD **should not display** the `addr` parameter on the canvas while it is still connecting, and then also if it shouldn't display the `addr` when the destination server's response does not specify a second line in it's MOTD. Default is false

- `hideCracked` *(Optional)* Sets if the warning icon and padlock icon, which indicate if the server uses online mode or not, should be hidden from the embed so nobody can tell if your server is cracked or not. Default is false