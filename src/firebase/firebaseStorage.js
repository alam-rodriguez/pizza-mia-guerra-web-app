import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

const storage = getStorage();

// subir imagen de articulo
export const uploadImageCategory = async (id, file) => {
  try{
    const imgRef = ref(storage, `imagenes-categorias/${id}`);
    await uploadBytes(imgRef, file);
    return true;
  }catch(e){
    console.log(e);
    return false;
  }
}

// subir imagen de articulo
export const uploadImageArticle = async (id, file) => {
  try{
    const imgRef = ref(storage, `imagenes-articulos/${id}`);
    await uploadBytes(imgRef, file);
    return true;
  }catch(e){
    console.log(e);
    return false;
  }
}

// subir imagen de articulo
export const uploadImage = async (id, file) => {
  try{
    const imgRef = ref(storage, `imagenes/${id}`);
    await uploadBytes(imgRef, file);
    return true;
  }catch(e){
    console.log(e);
    return false;
  }
}

// obtener url de imagen
export const getUrlImage = async (path) => {
  try{
    const res = await getDownloadURL(ref(storage, path));
    return res;
  }catch(e){
    console.log(e);
    return false;
  }
}

// Borrar Imagen
export const deleteImageCategory = async (id) => {
 try {
    const imageRef = ref(storage, `imagenes-categorias/${id}`);
    await deleteObject(imageRef);
    return true;
 } catch (e) {
    console.log(e.code);
    return false;
 }
}

// Borrar Imagen
export const deleteImageArticle = async (id) => {
  try {
     const imageRef = ref(storage, `imagenes-articulos/${id}`);
     await deleteObject(imageRef);
     return true;
  } catch (e) {
     console.log(e.code);
     return false;
  }
 }

// Borrar Imagen
export const deleteImage = async (id) => {
  try {
     const imageRef = ref(storage, `imagenes/${id}`);
     await deleteObject(imageRef);
     return true;
  } catch (e) {
     console.log(e.code);
     return false;
  }
 }

//  Obtener todas las imagenes de las categorias
// export const getAllImages = async () => {
//   const folderRef = ref(storage, 'imagenes-categorias');

//   try {
//     const result = await listAll(folderRef);
//     const imageUrls = [];

//     for (const itemRef of result.items) {
//       const url = await getDownloadURL(itemRef);
//       imageUrls.push(url);
//     }

//     return imageUrls;
//   } catch (error) {
//     throw new Error("Error al obtener las imágenes: " + error.message);
//   }

// }
export async function getImagesFromFolder(folderPath) {
  const folderRef = ref(storage, folderPath);

  try {
    const result = await listAll(folderRef);
    const imageUrls = {};

    for (const itemRef of result.items) {
      const url = await getDownloadURL(itemRef);
      imageUrls[itemRef.name] = url;
      // imageUrls.push({[itemRef.name]:url});
    }

    console.log(imageUrls);
    return imageUrls;
  } catch (error) {
    throw new Error("Error al obtener las imágenes: " + error.message);
  }
}

export async function getImagesFromFolderForHome(folderPath, ids) {
  const folderRef = ref(storage, folderPath);

  try {
    const result = await listAll(folderRef);
    const imageUrls = {};

    for (const itemRef of result.items) {

      console.log( itemRef.name );
      if(ids.includes(itemRef.name)){
        const url = await getDownloadURL(itemRef);
        imageUrls[itemRef.name] = url;
      }
      // ids.forEach( async (id) => {
      //   if(id == itemRef.name){
      //     // return;
      //   }
      // });
      
      // console.log(itemRef.name);
      // if(ids.includes(itemRef.name)) {
      //   const url = await getDownloadURL(itemRef);
      //   imageUrls[itemRef.name] = url;
        
      //   // console.log(imageUrls[itemRef.name] = url);
      // }

      // imageUrls.push({[itemRef.name]:url});
    }

    // console.warn('----------------------------------------------');
    console.log(imageUrls);
    // console.warn('----------------------------------------------');

    return imageUrls;
  } catch (error) {
    throw new Error("Error al obtener las imágenes: " + error.message);
  }
}

// (async () => {
//   const folderPath = "imagenes-categorias";

//   try {
//     const imageUrls = await getImagesFromFolder(folderPath);
//     console.log("URLs de imágenes:", imageUrls);
//   } catch (error) {
//     console.error(error);
//   }
// })();