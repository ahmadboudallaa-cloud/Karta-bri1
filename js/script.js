let collections = JSON.parse(localStorage.getItem('collections')) || [];
let cartes = JSON.parse(localStorage.getItem('cartes')) || [];


function saveToLocalStorage() {
    localStorage.setItem('collections', JSON.stringify(collections));
    localStorage.setItem('cartes', JSON.stringify(cartes));
}


if (document.getElementById('input-Collection')) {
    console.log('Page Flashcards détectée');
    
  
    document.addEventListener('DOMContentLoaded', function() {
        initFlashcardsPage();
    });
    
    function initFlashcardsPage() {
        const inputCollection = document.getElementById('input-Collection');
        const addCollectionBtn = document.getElementById('addCollection');
        const collectionListe = document.getElementById('collection-liste');
        updateCollectionList();
        updateCollectionsDisplay();
        
        addCollectionBtn.addEventListener('click', function() {
            const nom = inputCollection.value.trim();
            if (nom === '') {
                alert('Veuillez entrer un nom de collection');
                return;
            }
            
            const nouvelleCollection = {
                id: Date.now().toString(),
                nom: nom
            };
            
            collections.push(nouvelleCollection);
            saveToLocalStorage();
            updateCollectionList();
            updateCollectionsDisplay();
            inputCollection.value = '';
            alert('Collection créée !');
        });
       
        window.addCards = function() {
            const collectionId = collectionListe.value;
            const question = document.querySelector('.question').value.trim();
            const reponse = document.querySelector('.reponse').value.trim();
            
            if (collectionId === 'null' || collectionId === '') {
                alert('Veuillez sélectionner une collection');
                return;
            }
            
            if (question === '' || reponse === '') {
                alert('Veuillez remplir la question et la réponse');
                return;
            }
            
            const nouvelleCarte = {
                id: Date.now().toString(),
                collectionId: collectionId,
                question: question,
                reponse: reponse
            };
            
            cartes.push(nouvelleCarte);
            saveToLocalStorage();
            document.querySelector('.question').value = '';
            document.querySelector('.reponse').value = '';
            alert('Carte ajoutée !');
        };
    }
    
    function updateCollectionList() {
        const collectionListe = document.getElementById('collection-liste');
        if (!collectionListe) return;
        
        collectionListe.innerHTML = '<option value="null">--collection--</option>';
        collections.forEach(col => {
            const option = document.createElement('option');
            option.value = col.id;
            option.textContent = col.nom;
            collectionListe.appendChild(option);
        });
    }
    
    function updateCollectionsDisplay() {
        const container = document.querySelector('.vos_collection');
        if (!container) return;

        const elementsToRemove = [];
        container.childNodes.forEach(child => {
            if (child.nodeType === 1 && !child.matches('h1')) { 
                elementsToRemove.push(child);
            }
        });
        
     
        elementsToRemove.forEach(el => el.remove());
        
 
        collections.forEach(col => {
            const collectionDiv = document.createElement('div');
            collectionDiv.className = 'collection-item flex  sm:flex-row items-center justify-center gap-3 mb-3 w-full px-4';
            
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'collection-cadre bg-[#92140C] font-bold h-[40px] w-full sm:w-[300px] md:w-[350px] lg:w-[400px] flex items-center justify-center cursor-pointer rounded text-center px-2';
            link.textContent = col.nom;
            link.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.setItem('currentCollection', col.id);
                localStorage.setItem('currentCollectionName', col.nom);
                window.location.href = 'cards.html';
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-collection bg-[#92140C] hover:bg-red-700 text-white h-[40px] w-[40%] sm:w-[100px] md:w-[120px] flex items-center justify-center cursor-pointer rounded font-bold text-sm sm:text-base';
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); 
                deleteCollection(col.id);
            });
            
            collectionDiv.appendChild(link);
            collectionDiv.appendChild(deleteBtn);
            container.appendChild(collectionDiv);
        });
    }
    
    function deleteCollection(collectionId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette collection ? Toutes les cartes associées seront également supprimées.')) { 
            collections = collections.filter(collection => collection.id !== collectionId);
            cartes = cartes.filter(carte => carte.collectionId !== collectionId);
            
            saveToLocalStorage();
            updateCollectionList();
            updateCollectionsDisplay();
            
            alert('Collection supprimée !');
        }
    }
}


else if (document.querySelector('.card')) {
    console.log('Page Cards détectée');
    
    document.addEventListener('DOMContentLoaded', function() {
        initCardsPage();
    });
    
    function initCardsPage() {
        const collectionId = localStorage.getItem('currentCollection');
        const collectionName = localStorage.getItem('currentCollectionName');
        const card1Element = document.querySelector('.card1 p');
        const card2Element = document.querySelector('.card2 p');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        const cardElement = document.querySelector('.card');
        const collectionNomElement = document.querySelector('.collection-nom');
        
        let currentCardIndex = 0;
        let cartesCollection = [];
        

        if (collectionId && collectionNomElement) {
            collectionNomElement.textContent = collectionName || 'Collection sans nom';
            cartesCollection = cartes.filter(carte => carte.collectionId === collectionId);
            
            if (cartesCollection.length > 0) {
                displayCard(currentCardIndex);
                
                if (prevBtn) {
                    prevBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        currentCardIndex = (currentCardIndex - 1 + cartesCollection.length) % cartesCollection.length;
                        displayCard(currentCardIndex);
                    });
                }
                
                if (nextBtn) {
                    nextBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        currentCardIndex = (currentCardIndex + 1) % cartesCollection.length;
                        displayCard(currentCardIndex);
                    });
                }
                
                if (cardElement) {
                    cardElement.addEventListener('click', function() {
                        this.classList.toggle('flip');
                    });
                }
            } else {
                if (card1Element) card1Element.textContent = 'Aucune carte dans cette collection';
                if (card2Element) card2Element.textContent = 'Aucune carte dans cette collection';
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
            }
        } else {
            alert('Aucune collection sélectionnée');
            window.location.href = 'flach.html';
        }
        
        function displayCard(index) {
            if (index < 0 || index >= cartesCollection.length) return;
            
            const carte = cartesCollection[index];
            if (card1Element) card1Element.textContent = carte.question;
            if (card2Element) card2Element.textContent = carte.reponse;
            if (cardElement) cardElement.classList.remove('flip');
        }
    }
}