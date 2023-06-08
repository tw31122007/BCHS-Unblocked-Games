const check = document.getElementById("check")
const body = document.querySelector('body'),
      sidebar = body.querySelector('nav'),
      toggle = body.querySelector(".toggle"),
      modeSwitch = body.querySelector(".toggle-switch");

checktheusername()

function checktheusername(){
    if (localStorage.getItem('nickname')===null){
        localStorage.setItem('nickname', "Guest")
        document.getElementById("username").innerHTML = "Guest"
    }else{
        document.getElementById("username").innerHTML = localStorage.getItem('nickname')
        if (localStorage.getItem('nickname')==="AldessSc"){
            document.getElementById("grade").innerHTML = "ADMIN"
        }
        else{
            document.getElementById("username").innerHTML = localStorage.getItem('nickname')
            if (localStorage.getItem('nickname')==="Arrox78"){
                document.getElementById("grade").innerHTML = "ADMIN"
            }
            else{
                document.getElementById("username").innerHTML = localStorage.getItem('nickname')
                if (localStorage.getItem('nickname')==="Asicalug"){
                    document.getElementById("grade").innerHTML = "STAFF"
                }
                else{
                    document.getElementById("username").innerHTML = localStorage.getItem('nickname')
                    if (localStorage.getItem('nickname')==="Pix4rt"){
                        document.getElementById("grade").innerHTML = "STAFF"
                    }
                    
                }
                
            }
            
        }
        
    }
}

function setusername(){
    let result = prompt("Entrez votre nom d'utilisateur, ce nom sera utilisé dans le tchat. Veuillez éviter les caractères spéciaux")
        if (result===null){
            localStorage.setItem('nickname', "Guest")
        }else{
            localStorage.setItem('nickname', result)
        }
        
}
