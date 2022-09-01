import { createClient } from "@01-edu/api";
import fetch from "node-fetch";


export let user = Array()
let pBar = Array()
let incomplete = 0
export const object = ["introduction", "printalphabet", "printreversalphabet", "printdigits", "isnegative", "printcomb", "printnbr", "printcomb2", "firstrune", "lastrune", "strlen", "printstr", "compare", "isupper", "isnumeric", "alphacount", "isprintable", "tolower", "concat", "basicjoin", "join", "trimatoi", "printnbrinorder", "index", "capitalize", "printnbrbase", "atoibase", "iterativefactorial", "recursivefactorial", "iterativepower", "recursivepower", "sqrt", "isprime", "fibonacci", "findnextprime", "printcombn", "eightqueens", "pointone", "pilot", "fixthemain", "ultimatepointone", "divmod", "ultimatedivmod", "point", "swap", "strrev", "basicatoi", "basicatoi2", "atoi", "sortintegertable", "printprogramname", "printparams", "revparams", "boolean", "sortparams", "nbrconvertalpha", "flags", "rotatevowels", "appendrange", "makerange", "concatparams", "splitwhitespaces", "printwordstables", "split", "convertbase", "foreach", "map", "any", "countif", "issorted", "doop", "sortwordarr", "advancedsortwordarr", "displayfile", "cat", "ztail", "listpushback", "listpushfront", "listsize", "listlast", "listclear", "listat", "listreverse", "listforeach", "listforeachif", "listfind", "listremoveif", "listmerge", "listsort", "sortlistinsert", "sortedlistmerge"]

const domain = 'ytrack.learn.ynov.com'
// access_token is the token provided by gitea
const access_token = 'b6cf9f7e6f1591712a97ee11818383065d4fd316'
    
const client = await createClient({
  domain,
  access_token,
})

export const users = [{
  user : String,
  progress : Number
}]

export async function fetchObject(piscine_name){
  try{
    fetch("https://ytrack.learn.ynov.com/api/object/lyon/")
    .then(response => response.json())
    .then(data => {
      //console.log(data["children"]["challenge-go"]["children"])
      let quest = data["children"][piscine_name]["children"]
      let obj = JSON.parse(JSON.stringify(quest))
      let it = Object.keys(obj).length
      let it2 = Object.keys(obj).length
      // console.log(quest["quest-01"])
      for(let i = 0; i < it; i++){
        // console.log(quest[i])
        for(let j = 0; j < quest["quest-0" + i]; j++){
          console.log("test")
          console.log(quest["quest-" + i])
        }
      }
    }).catch(err => {
      console.log(err)
    }
    )
  }
  catch(error){
    console.log(error)
  }
  
  // .then(data => {
  //   for(let i = 0; i < data.length; i++){
  //     if(data[i].children == piscine_name){
  //       console.log(data[i].children)
  //     }
  //   }
  // }
  // )
}

export async function fetchXp(username, objectname) {
    try{
        const result = await client.run(`query{
            xp_by_path(where: {user: {login: {_eq: ` + username + `}}, _and: {object: {name: {_eq: ` + objectname + `}}}}) {
              path
              user {
                login
              }
              event {
                path
              }
              object {
                name
              }
              amount
            }
          }`)
            // console.log(result)
            console.log(result["xp_by_path"][0])
        
            if(!result["xp_by_path"][0]){
              incomplete++
            }
            return incomplete
    } catch(err){
        console.log(err)
    }
}

export async function getUser(campus, path){
  try{
    const result = await client.run(`query usersEvent($campus: String!, $path: String!) {
      event_user(where: {event: {path: {_eq: $path}, _and: {campus: {_eq: $campus}}}}) {
        userLogin
      }
    }`, { campus, path })
    let user = Array(result["event_user"].length)
    for(let i = 0; i < result["event_user"].length; i++){
        user[i] = result["event_user"][i]["userLogin"]
    }
    // console.log(user)
    return user
  } catch(err){
    console.log(err)
  }
}

export async function getUserProgress(){

  user = await getUser("lyon", "/lyon/div-01-2122/challenge-js").then( async function(result){

    // console.log(result)

    for(let i = 0; i < result.length; i++){
      for(let j = 0; j < object.length; j++){
        console.log(i + " : " + j)
        const xp = await fetchXp(result[i], object[j])
      }

      pBar[i] = ((object.length - incomplete) / object.length) * 100
      // console.log(pBar[i])
      users.push({
        user : result[i],
        progress : pBar[i]
      })
      console.log(incomplete)
      //console.log(users)
      incomplete = 0
      // console.log(users)  
  }
  // return users
  }
  )
  // console.log( "TEST" + users[0].progress)
  // return users
 
}

fetchObject("challenge-go")