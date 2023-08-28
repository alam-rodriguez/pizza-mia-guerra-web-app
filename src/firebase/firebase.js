// importaciones
// import { initializeApp } from "firebase/app"; 
import { app } from './firebaseConfig'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyDikFvbB7WtjJWq0C02tT9QzvFXfZsgmM0",
//   authDomain: "pideya-f502d.firebaseapp.com",
//   projectId: "pideya-f502d",
//   storageBucket: "pideya-f502d.appspot.com",
//   messagingSenderId: "288720639525",
//   appId: "1:288720639525:web:f0bc44382d075aad9791cc"
// };

// // Inicializaciones
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth();

// const provider = new GoogleAuthProvider();

// const db = getFirestore(app);

// // Verificar si existe usario admin
// export const existAdmin = async () => {
//   try{
//     const docRef = doc(db, 'app', 'app-info');
//     const docSnap = await getDoc(docRef);
//     if( docSnap.exists()) return true;
//     else return false;
//   }catch(e){
//     return e;
//   }
// }

// // Registro de usuario como admin
// export const registrarAdmin = async () => {
//   try {
//       const result = await signInWithPopup(auth, provider);
//       // const credential = GoogleAuthProvider.credentialFromResult(result);
//       console.log(result.user.email);
//       await guardarAdmin(result.user.email);
//       return result.user.email;
//       // return credential.user.email;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

// export const registrarUsuario = async () => {
//   try {
//       const result = await signInWithPopup(auth, provider);
//       // console.log(result.user.email);
//       return result.user.email;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

// // Firestore
// export const guardarAdmin = async (admin) => {
//     try{
//       await setDoc(doc(db, 'app', 'app-info'), {
//         admin: admin,
//       });
//       return true;
//     }catch(e){
//       return e;
//     }
// }

// // Info de la app
// export const infoApp = async (info) => {
//   try{
//     const infoAppRef = doc(db, 'app','app-info');
//     await updateDoc(infoAppRef, {
//       nombre: info.nombre,
//       whatsapp: info.whatsapp,
//       instagram: info.instagram,
//       facebook: info.facebook,
//       descripcion: info.descripcion,
//     });
//     return true;
//   } catch(e){
//     return e;
//   }
// }

// export const autoLogUser = async () => {
//   onAuthStateChanged(auth, (user) => {
//     console.log(user)
//     return {user};
//   });
// }

// // obtener info de la app
// export const obtenerInfoApp = async () => {
//   try{
//     const docRef = doc(db, 'app', 'app-info');
//     const docSnap = await getDoc(docRef);
//     if(docSnap.exists()){
//       return docSnap.data();
//     }else {
//       return 'no hay datos de esta app';
//     }
//   } catch(e){
//     return e;
//   }
// }

// // cerrar sesion de usuario
// export const logOut = async () => {
//   try{
//     await signOut(auth);
//     return true;
//   }catch(e){
//     return false;
//   }
// }

// // crear categorias
// export const createCategories = async (id, nombre) => {
//   try{
//     await setDoc(doc(db, 'categorias', id), {
//       nombre: nombre,
//       id: id,
//     });
//     return true;
//   }catch(e){
//     return e;
//   }
// }

// // ObtenerCategorias
// export const getCategories = async () => {
//   try{
//     const data = [];
//     const querySnapshot = await getDocs(collection(db, 'categorias'));
//     querySnapshot.forEach( (doc) => {
//       data.push(doc.data());
//     });
//     return data;
//   }catch(e){
//     console.log(e);
//     return false;
//   }
// }