import {
  db,
  getCurrentUser
} from '../firebase/firebaseAuth.js';

//CREANDO COLECCIÓN DOCUMENTOS EN LOS POST
const datePost = new Date();

export const createPost = (contentText, user) => {
  console.log(user);
  db.collection('post').add({
      name: user.displayName,
      userId: user.uid,
      photoURL: user.photoURL,
      date: datePost.toLocaleString(),
      content: contentText
    })
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    })

}

//MOSTRAR POST
export const readPost = () => {
  db.collection("post").orderBy('date', 'desc').onSnapshot((querySnapshot) => {
    const showingPost = document.querySelector('.containerPost');
    showingPost.innerHTML = '';
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().content}`);
      showingPost.innerHTML += `
            <div class = 'postFeed'>
            
            <div class = 'authorPost'>
            <img src='${doc.data().photoURL ? doc.data().photoURL : "https://i.ibb.co/4J9JFF0/perfil.png" }' width='40px'>
            <h2 class='namePost'>${doc.data().name}</h2>            
            </div>
            <div class = 'contentDiv'>
            <p class='contentPost'>${doc.data().content}</p>
            <textarea id='editContentPost' class = 'editContent' style = 'display:none'></textarea>
            </div>
            <div class = 'contentIconsPost'>
            <div class ='contentLike'>
            <button class = 'iconLike'><i class="icon-like fas fa-spa"></i></button>
            <h6 class='date'>${doc.data().date}</h6>
            </div>
            <div class ='editAndDelete'>
            <button class = 'iconSave' style = 'display:none'><i class="icon-save fas fa-check"></i></button>
            <button class = 'iconEdit' id ='edit'><i class="icon-edit fas fa-pen"></i></button>
            <button class = 'iconDelete'><i class="icon-delete fas fa-trash-alt"></i></button>
            </div>
            
            </div>
                        
            
            </div>
            `;
      console.log(doc.data().date);

    });
    querySnapshot.forEach(doc => {
      eventEditPost(doc, getCurrentUser());
    });
  });


};
export const eventEditPost = (doc, user) => {

  if (user) {
    if (user.userId === doc.userId) {
      const btnEdit = document.querySelector('#edit');
      btnEdit.addEventListener('click', () => {
        editPost(doc.id);
      });

    } else {
      document.querySelector('#edit').style.display = "none";
    }
  }

};

export const editPost = (id) => {
  let contentRef = db.collection("post").doc(id);

  contentRef.get().then(doc => {

    const textAreaEditPost = document.querySelector('#editContentPost');
    textAreaEditPost.style.display = 'block';
    textAreaEditPost.innerHTML = doc.data().content;
    document.querySelector('.contentPost').style.display = 'none';
    document.querySelector('.iconEdit').style.display = 'none';
    document.querySelector('.iconDelete').style.display = 'none';
    document.querySelector('.iconSave').style.display = 'block';

    const btnSavePostEdited = document.querySelector('.iconSave');
    btnSavePostEdited.addEventListener('click', () => {
      let contentTextEdited = document.querySelector('#editContentPost').value;
      // Set the "capital" field of the city 'DC'
      return contentRef.update({
          content: contentTextEdited
        })
        .then(() => {
          console.log("Document successfully updated!");
          textAreaEditPost.style.display = 'none';
          document.querySelector('.contentPost').style.display = 'block';
          document.querySelector('.iconEdit').style.display = 'block';
          document.querySelector('.iconDelete').style.display = 'block';
          document.querySelector('.iconSave').style.display = 'none';
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });



    });
  });

};



/*export const showPost = (viewPost) => {
  db.collection("post").onSnapshot((querySnapshot) => {
    let post = [];
    querySnapshot.forEach((doc) => {
      post.push(doc.data().content);
    });
      //console.log(`${doc.id} => ${doc.data().content}`);
      console.log('contenido: ', post.join(','));
      viewPost(post);
    });
    
    //console.log(post);
  };*/