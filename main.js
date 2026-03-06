console.log("Début");

try {
  JSON.parse("{mauvais json}");
  console.log("Cette ligne ne s'affichera pas");
} catch (e) {
  console.log("Erreur attrapée:", e.name, "-", e.message);
}

console.log("Suite du programme");


// finally
let ressourceOuverte = false;

try {
  ressourceOuverte = true;
  console.log("Ressource ouverte");

  throw new Error("Oups!");

} catch (e) {

  console.warn("On gère:", e.message);

} finally {

  ressourceOuverte = false;
  console.log("Ressource refermée?", !ressourceOuverte);

}



// throw

function additionSure(a, b) {

  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("additionSure: a et b doivent être des nombres");
  }

  return a + b;
}

try {

  console.log(additionSure(2,3));
  console.log(additionSure("2",3));

} catch(e) {

  console.error("Problème:", e.message);

}



// erreur personnalisée

class ValidationError extends Error {

  constructor(message){
    super(message)
    this.name = "ValidationError"
  }

}

function creerUtilisateur({id,email}){

  if(!Number.isInteger(id) || id <= 0)
  throw new ValidationError("id doit être un entier positif")

  if(typeof email !== "string" || !email.includes("@"))
  throw new ValidationError("email invalide")

  return {id,email:email.trim()}

}

try{

  creerUtilisateur({id:0,email:"a@b.com"})

}catch(e){

  console.log(e.name,"-",e.message)

}



// promesse

function operationLente(reussit=true){

  return new Promise((resolve,reject)=>{

    setTimeout(()=>{

      if(reussit) resolve("OK")
      else reject(new Error("Opération échouée"))

    },300)

  })

}



operationLente(true)
.then(val => console.log("Succès:",val))
.catch(err => console.error("Erreur:",err.message))



;(async()=>{

  try{

    const val = await operationLente(false)
    console.log("Succès:",val)

  }catch(e){

    console.warn("Attrapé avec await:",e.message)

  }

})()



// allSettled

const p1 = operationLente(true)
const p2 = operationLente(false)

Promise.allSettled([p1,p2])
.then(results=>{

console.log("Résultats:",results)

})



// programmation défensive

function toInt(x,defaut=0){

return Number.isInteger(x) ? x : defaut

}

console.log(toInt(5))
console.log(toInt(5.2,1))
console.log(toInt("a",0))



const config = {db:{host:"localhost",port:5432}}

const port = config?.db?.port ?? 3306

console.log("Port:",port)



function ajouterProduit(liste,p){

if(!p || typeof p.nom !== "string" || p.nom.trim() === "")
throw new Error("Produit invalide: nom requis")

if(typeof p.prix !== "number" || p.prix < 0)
throw new Error("Produit invalide: prix >= 0")

return [...liste,{...p}]

}

const produits = []

const nouvelleListe = ajouterProduit(produits,{nom:"Stylo",prix:1.2})

console.log(produits === nouvelleListe)



// moyenne

function moyenne(nums){

if(!Array.isArray(nums) || nums.length === 0)
throw new Error("moyenne: fournir un tableau non vide")

if(!nums.every(n => typeof n === "number" && Number.isFinite(n)))
throw new Error("moyenne: tous les éléments doivent être des nombres")

const total = nums.reduce((a,n)=>a+n,0)

return total/nums.length

}

try{

console.log(moyenne([10,12,8]))
console.log(moyenne([10,"x",8]))

}catch(e){

console.warn(e.message)

}



// lecture sûre

function getSafe(obj,path,defaut){

try{

return path.split(".").reduce((acc,k)=>acc?.[k],obj) ?? defaut

}catch{

return defaut

}

}

const data = {user:{profil:{nom:"Lina"}}}

console.log(getSafe(data,"user.profil.nom","(inconnu)"))
console.log(getSafe(data,"user.adresse.ville","(inconnue)"))



// retry

async function withRetryOnce(op){

try{

return await op()

}catch(e){

console.warn("Échec, on réessaie une fois...")

return op()

}

}


let tentative = 0

const parfoisRate = () =>
new Promise((ok,ko)=>
setTimeout(()=>
(++tentative % 2 ? ko(new Error("raté")) : ok("réussi")),100)
)

withRetryOnce(parfoisRate)
.then(console.log)
.catch(e=>console.error("Toujours en échec:",e.message))