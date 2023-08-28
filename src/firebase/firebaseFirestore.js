import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc, query, where, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase Configuraciones
import { app } from "./firebaseConfig";

const db = getFirestore(app);

export const auth = getAuth();

// Verificar si existe usario admin
export const existAdmin = async () => {
  try{
    const docRef = doc(db, 'app', 'app-info');
    const docSnap = await getDoc(docRef);
    if( docSnap.exists()) return true;
    else return false;
  }catch(e){
    console.log(e);
    return true;
  }
}

// // Verificar si existe usario admin
// export const obtenerSemiAdmids = async () => {
//   try{
//     const docRef = doc(db, 'app', 'app-info');
//     const docSnap = await getDoc(docRef);
//     if( docSnap.exists()) {
//       docSnap.data();
//     }
//     else return 'no-data';
//   }catch(e){
//     console.log(e);
//     return false;
//   }
// }

// Guardar el admin
export const guardarAdmin = async (admin, token) => {
  try{
    await setDoc(doc(db, 'app', 'app-info'), {
      admin: admin,
      adminsTokens: {admin: token},
    });
    return true;
  }catch(e){
    return e;
  }
}

// Guardar el admin
export const guardarSemisAdmins = async (admins, adminsTokens) => {
  try{
    await updateDoc(doc(db, 'app', 'app-info'), {
      semisAdmins: admins,
      adminsTokens: adminsTokens,
    });
    return true;
  }catch(e){
    console.log(e);
    return false;
  }
}

// Guardar el admin
export const actualizarTokensAdmins = async (adminsTokens) => {
  try{
    await updateDoc(doc(db, 'app', 'app-info'), {
      adminsTokens: adminsTokens,
    });
    return true;
  }catch(e){
    console.log(e);
    return false;
  }
}

// Guardar el admin
export const guardarSemiAdmin = async (admin) => {
  try{
    await setDoc(doc(db, 'app', 'app-info'), {
      semisAdmin: admin,
    });
    return true;
  }catch(e){
    return e;
  }
}

// actualizar o guardar info de la app
export const infoApp = async (info) => {
  try{
    const infoAppRef = doc(db, 'app','app-info');
    await updateDoc(infoAppRef, {
      nombre: info.nombre,
      whatsapp: info.whatsapp,
      instagram: info.instagram,
      facebook: info.facebook,
      descripcion: info.descripcion,
    });
    return true;
  } catch(e){
    return e;
  }
}

// obtener info de la app
export const obtenerInfoApp = async () => {
  try{
    const docRef = doc(db, 'app', 'app-info');
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      return docSnap.data();
    }else {
      return 'no hay datos de esta app';
    }
  } catch(e){
    console.log(e);
    return false;
  }
}

// crear categorias
export const createCategories = async (info) => {
  try{
    await setDoc(doc(db, 'categorias', info.id), {
      id: info.id,
      nombre: info.nombreCategoria,
      sizeView: info.sizeView,
      viewInHome: info.viewInHome,
      viewInMenu: info.viewInMenu,
      imgpath: info.imgpath,
      isCategoryOfPoints: info.isCategoryOfPoints,
      position: info.position,
    });
    return true;
  }catch(e){
    console.log(e);
    return false;
  }
}

// ObtenerCategorias
export const getCategories = async () => {
  try{
    const data = [];
    const querySnapshot = await getDocs(collection(db, 'categorias'));
    querySnapshot.forEach( (doc) => {
      if(!doc.data().isCategoryOfPoints) data.push(doc.data());
    });
    return data;
  }catch(e){
    console.log(e);
    return false;
  }
}

// Crear articulo
export const createArticle = async (id, info) => {
  try{
    await setDoc(doc(db, 'articulos', id), {
      id: id,
      titulo: info.titulo, 
      subtitulo: info.subtitulo,
      categoria: info.categoria,
      imgpath: info.img,
      disponible: info.disponible,
      complex: info.complex,
      precios: info.precios,
      isArticleOfPoints: false,
      isMiddle: info.isMiddle,
      position: info.position,
    });
    return true;
  }catch(e){
    console.log(e)
    return false;
  }
}

// obtener todos los articulos
export const getAllArticles = async () => {
  try{
    const articles = [];
    const querySnapshot = await getDocs(collection(db, 'articulos'));
    querySnapshot.forEach( (doc) => {
      if(!doc.data().isArticleOfPoints) articles.push(doc.data());
    });
    return articles;
  }catch(e){
    console.log(e);
    return e.message;
  }
}

// obtener todas las categorias
export const getAllCategories = async () => {

  try {
    const querySnapshot = await getDocs(collection(db, 'categorias'));
    const data = [];
    querySnapshot.forEach( (categoria) => {
      data.push(categoria.data());
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }

}



// Obtener categorias que van al home
export const getCategoriesFilted = async (filtro) => {
  try{
    const data = [];
    const q = query(collection(db, 'categorias'), where(filtro, '==', true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach( (doc) => {
      data.push(doc.data());
    });
    return data;
  }catch(e){
    console.log(e);
    return e.message;
  }
}

// obtener articulos por categoria
export const getArticlesByCategory = async (categoriaId) => {
  try{
    const data = [];
    const q = query(collection(db, 'articulos'), where('categoria','==',categoriaId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach( (doc) => {
      data.push(doc.data());
    });
    return data;
  }catch(e){
    console.log(e);
    return false;
  }
}

// Generar codigo de usario
const generateCodeRef = (i) => {
  const codeRef = Math.floor(Math.random() * 100000);
  if(i == 0) return codeRef;
  if(codeRef.toString().length == 5) return codeRef;
  else generateCodeRef(i - 1);
} 

// Guardar info de usuario 
export const saveInfoUser = async (pedido) => {
  let codeRef = generateCodeRef(10);
  console.log(codeRef);
  // console.log(pedido.codeRef);
  try {
    await setDoc(doc(db, `user-${pedido.email}`, 'info'), {
      email: pedido.email,
      nombre: pedido.nombre,
      direccion: pedido.direccion,
      telefono: pedido.telefono,
      codeRef: codeRef,
    });
    await saveCodeRef(pedido.email, pedido.nombre, codeRef);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
// Guardar info de usuario 
export const updateInfoUser = async (pedido) => {
  console.log(pedido.codeRef);
  try {
    await updateDoc(doc(db, `user-${pedido.email}`, 'info'), {
      email: pedido.email,
      nombre: pedido.nombre,
      direccion: pedido.direccion,
      telefono: pedido.telefono,
      codeRef: pedido.codeRef,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Crear Pedido de cliente
export const crearPedidoUser = async (pedido) => {
  try {
    await setDoc(doc(db, 'pedidos', `${pedido.email}-${pedido.pedidoId}`), {
      id: pedido.pedidoId,
      user: pedido.nombre,
      direccion: pedido.direccion,
      telefono: pedido.telefono,
      comentario: pedido.comentario,
      email: pedido.email,
      horaPedido: pedido.horaPedido,
      dia: pedido.dia,
      pedido: pedido.pedido,
      pedidoOfPoints: pedido.pedidoOfPoints,
      isDelivery: pedido.isDelivery,
      deliveryInfo: pedido.deliveryInfo,
      wasView: pedido.wasView,
      isReady: pedido.isReady,
      paid: pedido.paid,
      guardar: pedido.guardar,
      pointsInfo: pedido.pointsInfo,
      recibioPuntos: pedido.recibioPuntos,
      total: pedido.total,
      puntosGastados: pedido.puntosGastados,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
// export const crearPedidoUser = async (pedido) => {
  
//   return new Promise( async (resolve, reject) => {
//     let res = false;
//     try{
//       await setDoc(doc(db, 'pedidos', `${pedido.email}-${pedido.pedidoId}`), {
//         id: pedido.pedidoId,
//         user: pedido.nombre,
//         direccion: pedido.direccion,
//         telefono: pedido.telefono,
//         comentario: pedido.comentario,
//         email: pedido.email,
//         hora: pedido.hora,
//         dia: pedido.dia,
//         pedido: pedido.pedido,
//         pedidoOfPoints: pedido.pedidoOfPoints,
//         isDelivery: pedido.isDelivery,
//         deliveryInfo: pedido.deliveryInfo,
//         wasView: pedido.wasView,
//         isReady: pedido.isReady,
//         paid: pedido.paid,
//         pointsInfo: pedido.pointsInfo,
//         recibioPuntos: pedido.recibioPuntos,
//         total: pedido.total,
//       });
//       res = true;
//     } catch(e) {
//       console.log(e);
//       res = false;
//     }
//     if(res) {
//       resolve('bien')
//     } else {
//       reject('mal');
//     }
//   });

// }

// Mostrar Pedidos a cliente
export const getPedidosByClient = async (email) => {
  try{
    const q = query(collection(db, 'pedidos'), where('email', '==' ,email));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  }catch(e){
    console.log(e);
    return [];
  }
}

// Mostrar pedidos que no estan listos
export const getordersNotView = async () => {
  try{
    const q = query(collection(db, 'pedidos'), where('guardar', '==' ,false));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  }catch(e){
    console.log(e);
    return [];
  }
}

// Ver todos los pedidos de hoy
export const orderOfToday = async (hoy) => {
  try {
    const q = query(collection(db, 'pedidos'), where('dia', '==', hoy));
    const data = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach( (pedido) => {
      data.push(pedido.data());
    });
    if(data.length > 0) return data;
    else return 'no-hay-pedidos';
  } catch (e) {
    console.log(e);
    return false;
  }
}

// obtener info del cliente
export const getInfoUser = async (email) => {
  try {
    const docRef = doc(db, `user-${email}`, 'info');
    const docSnap = await getDoc(docRef);
    if( docSnap.exists() ){
      return docSnap.data();
    }else {
      return 'no-exist';
    }

  } catch (e) {
    console.log(e.message);
    return false;
  }
}

// Atualizar info de categoria
export const ACtualizarCategory = async (id, newInfo) => {

  try {
    const docRef = doc(db, 'categorias', id);
    await updateDoc(docRef, {
      nombre: newInfo.nombreCategoria,
      sizeView: newInfo.sizeView,
      viewInHome: newInfo.viewInHome,
      viewInMenu: newInfo.viewInMenu,
      position: newInfo.position,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }

}

// Borrar categoria
export const deleteCategory =  async (id) => {
  try {
    await deleteDoc(doc(db, 'categorias', id));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Actualizar Articulo 
export const updateArticle = async (id, articleUpdated) => {
  try {
    const docRef = doc(db, 'articulos', id)
    await updateDoc(docRef, {
      titulo: articleUpdated.titulo,
      subtitulo: articleUpdated.subtitulo,
      categoria: articleUpdated.categoria,
      precios: articleUpdated.precios,
      disponible: articleUpdated.disponible,
      isMiddle: articleUpdated.isMiddle,
      isArticleOfPoints: false,
      position: articleUpdated.position,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Borrar categoria
export const deleteArticle =  async (id) => {
  try {
    await deleteDoc(doc(db, 'articulos', id));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Borrar categoria
export const deleteArticleOfPoints =  async (id) => {
  try {
    await deleteDoc(doc(db, 'articulos', `articulo-categoria-puntos-${id}`));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Afregar code Ref de user a la base de datos
export const saveCodeRef = async (email, nombre, codeRef) => {
  try {
    await setDoc(doc(db, 'codesRefs', `codeRef-${email}`), {
      codeRef: codeRef,
      email: email,
      nombre: nombre,
    });
    return true;
  } catch (e) {
    console.log(e.code);
    return false;
  }
}

// Encontrar el codigo referido
export const searchCodeRef = async (codeRef) => {

  try {
    const q = query(collection(db, 'codesRefs'), where('codeRef','==', codeRef));
    const querySnapshot = await getDocs(q);
    let res = {}
    querySnapshot.forEach( (doc) => {
      res = doc.data();
      return;
    });
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }

}

// Actualizar para agregar referidos a user
export const addReferidoPor = async (email, infoCodeRef) => {
  console.log(infoCodeRef)
  try {
    const docRef = doc(db, `user-${email}`, 'info');
    await updateDoc(docRef, {
      referidoPor: infoCodeRef,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Actualizar si recivio puntos por invitar
export const givePointForRefFriend = async (email, infoCodeRef) => {
  console.log(infoCodeRef)
  try {
    const docRef = doc(db, `user-${email}`, 'info');
    await updateDoc(docRef, {
      referidoPor: infoCodeRef,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
// Actualizar si recivio puntos por invitar
export const givePointForRefGoodFriend = async (email, infoCodeRef) => {
  console.log(infoCodeRef)
  try {
    const docRef = doc(db, `user-${email}`, 'info');
    await updateDoc(docRef, {
      referidoPor: infoCodeRef,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Aptualizar si el pedido esta listo y si lo hemos visto
export const UpdateOrderClient = async (email, idOrder, isReady, paid, guardar) => {
  try {
    const orderRef = doc(db, 'pedidos', `${email}-${idOrder}`);
    await updateDoc(orderRef, {
      wasView: true,
      isReady: isReady,
      paid: paid,
      guardar: guardar,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Agregar info de los points a la app
export const addInfoPoints = async (email, infoPoints) => {
  try {
    const admin = await obtenerInfoApp();
    if(email != admin.admin) return 'no eres admin';
    const appInfoRef = doc(db, 'app', 'app-info');
    await updateDoc(appInfoRef, {
      infoPoints: infoPoints, 
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Actualizar el pedido para poner cuantos puntos genero el pedido
export const savePuntosGeneradosForOrder = async (email, idOrder, puntosGenerados, recibioPuntos) => {
  try {
    const orderRef = doc(db, 'pedidos', `${email}-${idOrder}`);
    await updateDoc(orderRef, {
      puntosGenerados: puntosGenerados,
      recibioPuntos: recibioPuntos
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }

}

// Obtener Puntos de usuario
export const getPointsUser = async (email) => {
  try {
    const docRef = doc(db, 'puntos', email);
    const docSnap = await getDoc(docRef);
    
    if(docSnap.exists()){
      return docSnap.data();
    }else {
      return 'usuario no encontrado';
    }
  } catch (e) {
    console.log(e);
    return 'hubo un error'
  }

}

// guardar puntos generados de usuario
export const savePointsUser = async (email, newPoints) => {
  try {
    await setDoc(doc(db, 'puntos', email), {
      email: email,
      puntos: newPoints,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}


// crear o actualizar categoria de puntos 
export const createCategoryPunto = async (info) => {
  try{
    await setDoc(doc(db, 'categorias', 'category-puntos'), {
      id: info.id,
      nombre: info.nombreCategoria,
      sizeView: info.sizeView,
      viewInHome: info.viewInHome,
      viewInMenu: info.viewInMenu,
      imgpath: info.imgpath,
      isCategoryOfPoints: true,
      position: info.position,
    });
    return true;
  }catch(e){
    console.log(e);
    return false;
  }
}

// Actualizar categoria de puntos
export const updateCategoryPunto = async (info) => {
  try {
    const catRef = doc(db, 'categorias', 'category-puntos');
    await updateDoc(catRef, {
      id: info.id,
      nombre: info.nombreCategoria,
      sizeView: info.sizeView,
      viewInHome: info.viewInHome,
      viewInMenu: info.viewInMenu,
      isCategoryOfPoints: true,

      imgpath: info.imgpath,

    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// obtener categoria de puntos
export const getCategoryPoints = async () => {
  const docRef = doc(db, 'categorias', 'category-puntos');
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()){
    return docSnap.data();
  }else {
    return 'no existe la categoria de puntos';
  }
}

// Obtener los articulos de la categoria de puntos
export const getArticlesCategoryPoints = async (categoryPointsId) => {
  try {
    const q = query(collection(db, 'articulos'), where('categoria', '==', categoryPointsId));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Crear articulo
export const createArticleOfPoints = async (id, info) => {
  try{
    await setDoc(doc(db, 'articulos', `articulo-categoria-puntos-${id}`), {
      id: id,
      titulo: info.titulo, 
      subtitulo: info.subtitulo,
      categoria: info.categoria,
      imgpath: info.img,
      disponible: info.disponible,
      complex: info.complex,
      puntos: info.puntos,
      isArticleOfPoints: true,
      position: info.position
    });
    return true;
  }catch(e){
    console.log(e)
    return false;
  }
}

export const updateArticleOfPoints = async (article) => {
  try {
    const articleRef = doc(db, 'articulos', `articulo-categoria-puntos-${article.id}`);
    await updateDoc(articleRef, {
      disponible: true,
      puntos: article.puntos,
      subtitulo: article.subtitulo,
      titulo: article.titulo,
      isArticleOfPoints: true,
      position: article.position,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }

}

// // Para actualizar la informacion de estadisticas del cliente
// export const saveEstadistica = async (email, info) => {
//   try {
//     await setDoc(doc(db, `user-${email}`, `estadistica-pedido-${info.id}`), {
//       isEstadistica: true,
//       pedidoId: info.id,
//       fecha: info.fecha,
//       gastado: info.gastado,
//       puntosGastados: info.puntosGastados,
//       puntosGenerados: info.puntosGenerados,
//     });
//     return true;
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// }

// Para actualizar la informacion de estadisticas del cliente
export const saveEstadistica = async (email, info) => {
  try {
    await setDoc(doc(db, `estadiscas-cada-pedido`, `estadistica-pedido-${email}-${info.id}`), {
      email: email,
      id: info.id,
      // isEstadistica: true,
      pedidoId: info.id,
      fecha: info.fecha,
      gastado: info.gastado,
      puntosGastados: info.puntosGastados,
      puntosGenerados: info.puntosGenerados,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Borrar estadistica de la info del usuario
export const deleteEstadistica = async (email, estadisticaId) => {
  try {
    await deleteDoc(doc(db, `estadiscas-cada-pedido`, `estadistica-pedido-${email}-${estadisticaId}`));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// // create estadisticas del cliente
// export const createEstadisticas = async (email, info) => {
//   try {
//     await setDoc(doc(db, `user-${email}`, 'estadisticas'), {
//       dineroGastado: info.dineroGastado,
//       puntosGanados: info.puntosGanados,
//       puntosGastados: info.puntosGastados,
//       puntosRestantes: info.puntosGanados - info.puntosGastados,
//     });
//     return true;
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// }

// // create estadisticas del cliente
// export const createEstadisticas = async (email, info) => {
//   try {
//     await setDoc(doc(db, 'estadisticas', `user-${email}`), {
//       nombre: info.nombre,
//       email: email,
//       dineroGastado: info.dineroGastado,
//       puntosGanados: info.puntosGanados,
//       pointsForInviteFriend: info.pointsForInviteFriend,
//       puntosGastados: info.puntosGastados,
//       puntosRestantes: (info.puntosGanados + info.pointsForInviteFriend) - info.puntosGastados,
//     });
//     return true;
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// }

// create estadisticas del cliente
export const createEstadisticas = async (email, info) => {
  try {
    await setDoc(doc(db, 'estadisticas', `user-${email}`), {
      nombre: '',
      email: email,
      dineroGastado: 0,
      puntosGanados: 0,
      pointsForInviteFriend: 0,
      puntosGastados: 0,
      puntosRestantes: 0,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// // editar estadistica de usuario
// export const editEstadistica = async (email, info) => {
//   try {
//     const estadisticaRef = doc(db, `user-${email}`, 'estadisticas');
//     await updateDoc(estadisticaRef, {
//       dineroGastado: info.dineroGastado,
//       puntosGanados: info.puntosGanados,
//       puntosGastados: info.puntosGastados,
//       puntosRestantes: info.puntosGanados - info.puntosGastados,
//     });
//     return true;
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// }
// editar estadistica de usuario
export const editEstadistica = async (email, info) => {
  try {
    const estadisticaRef = doc(db, 'estadisticas', `user-${email}`);
    await updateDoc(estadisticaRef, {
      nombre: info.nombre,
      dineroGastado: info.dineroGastado,
      puntosGanados: info.puntosGanados,
      pointsForInviteFriend: info.pointsForInviteFriend,
      puntosGastados: info.puntosGastados,
      puntosRestantes: (info.puntosGanados + info.pointsForInviteFriend) - info.puntosGastados,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Editar puntos generados y restantes de usuario
export const editPoints = async (email, info) => {
  try {
    const statisticRef = doc(db, `user-${email}`, 'estadisticas');
    await updateDoc(statisticRef, {
      dineroGastado: info.dineroGastado,
      puntosGanados: info.puntosGanados,
      puntosRestantes: info.puntosRestantes,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// // obtener estadisticas del cliente
// export const getEstadisticas = async (email) => {
//   try {
//     const docRef = doc(db, `user-${email}`, 'estadisticas');
//     const docSnap = await getDoc(docRef);

//     if( docSnap.exists()){
//       return docSnap.data();
//     }else{
//       return 'no estadisticas';
//     }
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// }
// obtener estadisticas del cliente
export const getEstadisticas = async (email) => {
  try {
    const q = query(collection(db, 'estadisticas'), where('email', '==', email));
    
    const res = [];

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach( (estadistica) => {
      res.push(estadistica.data());
    });

    if( res.length > 0){
      return res[0];
    }else{
      return 'no estadisticas';
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

// // obtener cada estadisticas del cliente
// export const getEachStatitics = async (email) => {
//   try {
//     const q = query(collection(db, `user-${email}`), where('isEstadistica', '==', true));
//     const querySnapshot = await getDocs(q);
//     const data = [];
//     querySnapshot.forEach( (doc) => {
//       data.push(doc.data());
//     });
//     return data;
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// }
// obtener cada estadisticas del cliente
export const getEachStatitics = async (email) => {
  try {
    const q = query(collection(db, `estadiscas-cada-pedido`), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach( (doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// // obtener cada estadisticas del cliente
// export const getEachStatitics = async (email) => {
//   try {
//     const q = query(collection(db, `estadiscas-cada-pedido`), where('email', '==', email));
//     const querySnapshot = await getDocs(q);
//     const data = [];
//     querySnapshot.forEach( (doc) => {
//       data.push(doc.data());
//     });
//     return data;
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// }

// obtener las estadisticas de todos los usuarios
export const getEveryStatistics  = async () => {

  try {
    const querySnapshot = await getDocs(collection(db, 'estadiscas-cada-pedido'));
    const res = [];
    querySnapshot.forEach( (estadistica) => {
      res.push(estadistica.data());
    });
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }

}

// obtener las estadisticas de todos los usuarios
export const getAllStatistics  = async () => {

  try {
    const querySnapshot = await getDocs(collection(db, 'estadisticas'));
    const res = [];
    querySnapshot.forEach( (estadistica) => {
      res.push(estadistica.data());
    });
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }

}