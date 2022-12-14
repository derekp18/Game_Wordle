let resultElement = document.querySelector('.result')
let mainContainer = document.querySelector('.main-container');
let rowId = 1;

//api de palabras 

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'd261a6ad8amsh2374a96c6768897p1b8caejsne63b763de10d',
		'X-RapidAPI-Host': '1000-most-common-words.p.rapidapi.com'
	}
};

fetch('https://1000-most-common-words.p.rapidapi.com/words/spanish?words_limit=1', options)
.then(result => result.json())
.finally(()=>{
    let loadingElement = document.querySelector('.loading')
    loadingElement.style.display = 'none';
})
.then(data => {
    console.log(data)
    let word = data[0];
    let wordArray = word.toUpperCase().split('');
    console.log(wordArray)
    var actualRow = document.querySelector('.row')

    drawSquares(actualRow);
    listenInput(actualRow)
    addfocus(actualRow)

    function listenInput(actualRow){
        let squares = actualRow.querySelectorAll('.square');
        squares = [...squares];

        let userInput = []

        squares.forEach(element =>{
            element.addEventListener('input', event=>{
                // Si no se ha borrado
                if(event.inputType !== 'deleteContentBackward'){
                    //Recoger el ingreso del usuario
                    userInput.push(event.target.value.toUpperCase())
                    
                    if(event.target.nextElementSibling){
                        event.target.nextElementSibling.focus();
                    }else{
                        // Crear el arreglo con las letras

                        
                        // Buscar el contenido de la fila anterior
                        // Armar un arreglo con el resultado antes de comparar
                        
                        let squaresFilled = document.querySelectorAll('.square')
                        squaresFilled = [...squaresFilled]
                        let lastFiveSquaresFilled = squaresFilled.slice(-word.length);
                        let finalUserInput = [];
                        lastFiveSquaresFilled.forEach(element => {
                            finalUserInput.push(element.value.toUpperCase()) 
                        });

                        // Cambiar estilos si existe la letra pero no en la posicion correcta
                        let existIndexArray = existLetter(wordArray, finalUserInput)

                        existIndexArray.forEach(element =>{

                            squares[element].classList.add('gold');
                        });
                        //Cambiar estilos si existe la letra pero si en la posicion correcta
                        let rightIndex = compareArrays(wordArray, finalUserInput)
                        console.log(rightIndex)
                        rightIndex.forEach(element => {
                            squares[element].classList.add('green');
                        })
                        // Si los arreglos son iguales
                        if(rightIndex.length == wordArray.length){
                            showResult('Ganaste!')
                            return;
                        }
                
                        //Crear una nueva fila
                        let actualRow = createRow()

                        if(!actualRow){
                            return
                        }
                        drawSquares(actualRow)
                        listenInput(actualRow)
                        addfocus(actualRow)
                    }   
                }else{
                    //en caso de que no borre
                    userInput.pop();
                }
                console.log(userInput)
            });
        })
    }


    // FUNCIONES

    function compareArrays(array1, array2){
        let iqualsIndex = []
        array1.forEach((element, index)=>{
            if(element == array2[index]){
                console.log(`En la posicion ${index} si son iguales`);
                iqualsIndex.push(index);
            }else{
                console.log(`En la posicion ${index} NO son iguales`);
            }
        });
        return iqualsIndex;
    }

    function existLetter(array1, array2){
        let existIndexArray = [];
        array2.forEach((element, index)=>{
            if(array1.includes(element)){
                existIndexArray.push(index);
            }
        });
        return existIndexArray;
    }

    function createRow(){
        rowId++
        if (rowId <= 5){
            let newRow = document.createElement('div');
            newRow.classList.add('row');
            newRow.setAttribute('id', rowId)
            mainContainer.appendChild(newRow)
            return newRow;
        }else{
            showResult(`Intentalo de nuevo, la respuesta correcta era "${word.toUpperCase()}"`)
        }
        
    }

    function drawSquares(actualRow){
        wordArray.forEach((item, index) => {
            if(index === 0){
                actualRow.innerHTML += `<input type="text" maxlength="1" class="square focus">`
            }else{
                actualRow.innerHTML += `<input type="text" maxlength="1" class="square">`
            }
        });
    }

    function addfocus(actualRow){
        let focusElement = actualRow.querySelector('.focus')
        console.log(focusElement)
        focusElement.focus();
    }

    function showResult(textMsg){
        resultElement.innerHTML = `
        <p>${textMsg}</p>
        <button class="button">Reiniciar</button>`

        let resetBtn = document.querySelector('.button')
        resetBtn.addEventListener('click', ()=>{
            location.reload();
        });
    }

});
