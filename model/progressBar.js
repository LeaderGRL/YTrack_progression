import { createClient } from "@01-edu/api";
import fetch from "node-fetch";


export let user = Array()
export let object = Array()
let exercises = Array()
let pBar = Array()
let incomplete = 0

export const classB1A = {
    names: ["aleo", "aibrahim", "atommy", "btom", "bsam", "bjules", "bmiguel", "cgaspard", "cdylan", "gmaeva", "galexis", "kthomas", "kchouaib", "lhugo", "lbastien", "meoghan", "mgabriel", "mmike", "msiweil", "rlucas", "rdoria", "selouan", "swilliam", "tthienti", "wnathan"],
    questCompleted: 0
}

export const classB1B = {
    names: ["arachfan", "anathali", "apierre", "bgeoffre", "bleonard", "bmayeul", "balexandr", "cgabriel", "cclement", "crlukas", "ebastien", "galban", "gaxel", "krony", "kaymeric", "lmanon", "mvincent", "mequentin", "MALVINE", "pemma", "ranthony", "renvel", "ralexis", "sleo", "salexis", "slucas", "ymazigh"],
    questCompleted: 0
}

const domain = 'ytrack.learn.ynov.com'
    // access_token is the token provided by gitea
const access_token = 'b6cf9f7e6f1591712a97ee11818383065d4fd316'

const client = await createClient({
    domain,
    access_token,
})

export const users = [{
    user: String,
    progress: Number
}]

export async function fetchObject(piscine_name) {
    try {
        await fetch("https://ytrack.learn.ynov.com/api/object/lyon/")
            .then(response => response.json())
            .then(data => {
                let quest = data["children"][piscine_name]["children"]
                for (var key in quest) {
                    for (var key2 in quest[key]["children"]) {
                        exercises.push(key2)
                    }
                }
                // return exercises
                // console.log(exercises)
            }).catch(err => {
                console.log(err)
            })
    } catch (error) {
        console.log(error)
    }
}

export async function fetchXp(username, objectname) {
    try {
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

        if (!result["xp_by_path"][0]) {
            incomplete++
        }
        return incomplete
    } catch (err) {
        console.log(err)
    }
}

export async function getUser(campus, path) {
    try {
        const result = await client.run(`query usersEvent($campus: String!, $path: String!) {
      event_user(where: {event: {path: {_eq: $path}, _and: {campus: {_eq: $campus}}}}) {
        userLogin
      }
    }`, { campus, path })
        let user = Array(result["event_user"].length)
        for (let i = 0; i < result["event_user"].length; i++) {
            user[i] = result["event_user"][i]["userLogin"]
        }
        // console.log(user)
        return user
    } catch (err) {
        console.log(err)
    }
}

export async function getUserProgress() {

    object = await fetchObject("challenge-go").then(async function(obj) {
        // console.log(exercises)
        // console.log(obj)

        user = await getUser("lyon", "/lyon/challenge-go").then(async function(result) {
                // console.log(result)

                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < exercises.length; j++) {
                        // console.log(i + " : " + j)
                        const xp = await fetchXp(result[i], exercises[j])
                            // console.log(xp)
                    }

                    pBar[i] = ((exercises.length - incomplete) / exercises.length) * 100
                        // console.log(pBar[i])
                    users.push({
                        user: result[i],
                        progress: pBar[i]
                    })
                    console.log(incomplete)
                        //console.log(users)
                    incomplete = 0
                        // console.log(users)  
                }
                // return users
            })
            // console.log( "TEST" + users[0].progress)
            // return users
    })


}

// object = await fetchObject("challenge-js").then(async function(obj){
//     // console.log(exercises)
//     console.log(obj)
// })
// console.log(object)

// fetchObject("challenge-go")
// getUserProgress()