//Script JavaScript com o funcionamento lógico da página

// Captura das entradas
const committedInputs = {
    common: [],
    exclude: [],
    intext: [],
    allintext: [],
    filetype: [],
    site: [],
    after: [],
    before: [],
    intitle: [],
    allintitle: [],
    inurl: [],
    allinurl: [],
    ext: [],
    related: [],
    cache: [],
    info: [],
    link: [],
    define: [],
    inanchor: [],
    allinanchor: []
};

// Função para submeter as entradas para as caixas de seleção
function commitInput(type) {
    const inputElement = document.getElementById(`${type}Input`);
    const inputValue = inputElement.value.trim();
    if (inputValue) {
        committedInputs[type].push(inputValue);
        updateSelections(type);
        inputElement.value = ''; // Limpar caixa de entrada
    }
}

// Função para atualizar as caixas de seleção
function updateSelections(type) {
    const selectionsContainer = document.getElementById(`${type}Selections`);
    selectionsContainer.innerHTML = ''; // Limpar seleções prévias
    committedInputs[type].forEach((item, index) => {
        const selectionItem = document.createElement('div');
        selectionItem.className = 'selection-item';
        selectionItem.setAttribute('draggable', 'true');
        selectionItem.id = `${type}-${index}`;
        selectionItem.dataset.type = type; 

        // Aplicação de prefixo de busca avançada do Google
        let formattedItem = formatDorkItem(type, item);

        selectionItem.innerHTML = `${formattedItem} <button onclick="deleteSelection('${type}', ${index})">X</button>`;
        selectionsContainer.appendChild(selectionItem);

        
        addDragTouchAndKeyboardListeners(selectionItem);
    });
}


function formatDorkItem(type, item) {
    switch (type) {
        case 'exclude':
            return `-${item}`;
        case 'intext':
            return `intext:"${item}"`;
        case 'allintext':
            return `allintext:"${item}"`;
        case 'filetype':
            return `filetype:${item}`;
        case 'site':
            return `site:${item}`;
        case 'after':
            return `after:${item}`;
        case 'before':
            return `before:${item}`;
        case 'intitle':
            return `intitle:"${item}"`;
        case 'allintitle':
            return `allintitle:"${item}"`;
        case 'inurl':
            return `inurl:${item}`;
        case 'allinurl':
            return `allinurl:${item}`;
        case 'ext':
            return `ext:${item}`;
        case 'related':
            return `related:${item}`;
        case 'cache':
            return `cache:${item}`;
        case 'info':
            return `info:${item}`;
        case 'link':
            return `link:${item}`;
        case 'define':
            return `define:${item}`;
        case 'inanchor':
            return `inanchor:${item}`;
        case 'allinanchor':
            return `allinanchor:"${item}"`;
        default:
            return item;
    }
}

// Função de deleção de caixa de seleção específica
function deleteSelection(type, index) {
    committedInputs[type].splice(index, 1);
    updateSelections(type);
}


function allowDrop(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move'; 
}

function drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    setTimeout(() => {
        ev.target.style.display = 'none'; 
    }, 0);
}

function dragEnd(ev) {
    ev.target.style.display = 'inline-flex'; 
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);
    if (ev.target.classList.contains('selection-item') && ev.target !== draggedElement) {
        ev.target.parentNode.insertBefore(draggedElement, ev.target.nextSibling);
    } else if (ev.target.classList.contains('selections') || ev.target.classList.contains('final-selections')) {
        ev.target.appendChild(draggedElement);
    }
    draggedElement.style.display = 'inline-flex'; 
}

function addDragTouchAndKeyboardListeners(selectionItem) {
    selectionItem.addEventListener('dragstart', drag);
    selectionItem.addEventListener('dragend', dragEnd);
    selectionItem.addEventListener('dragover', allowDrop);
    selectionItem.addEventListener('drop', drop);

  
    let touchStartX = 0;
    let touchStartY = 0;
    let initialIndex = null;

    selectionItem.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        initialIndex = [...selectionItem.parentElement.children].indexOf(selectionItem);
        event.target.style.opacity = 0.5;
        event.target.style.transition = 'transform 0.2s'; 
    });

    selectionItem.addEventListener('touchmove', function(event) {
        const touch = event.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        
        event.target.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    selectionItem.addEventListener('touchend', function(event) {
        event.target.style.opacity = ''; 
        event.target.style.transform = 'none'; 

        const elements = [...selectionItem.parentElement.children];
        const finalIndex = elements.indexOf(selectionItem);
        const swapElement = elements.find((el, idx) => idx > initialIndex && el !== selectionItem);

        if (swapElement) {
            swapElement.parentNode.insertBefore(selectionItem, swapElement.nextSibling);
        }
    });

    // Habilitação das setas esquerda e direita do teclado
    selectionItem.setAttribute('tabindex', '0');
    selectionItem.addEventListener('keydown', function(event) {
        const selectedElement = event.target;
        const container = selectedElement.parentNode;

        if (event.key === 'ArrowLeft' && selectedElement.previousElementSibling) {
            container.insertBefore(selectedElement, selectedElement.previousElementSibling);
        } else if (event.key === 'ArrowRight' && selectedElement.nextElementSibling) {
            container.insertBefore(selectedElement.nextElementSibling, selectedElement);
        }
    });
}

// Função para submeter as caixas de seleções específicas para o campo geral de caixas  
function commitAll() {
    const finalContainer = document.getElementById('finalSelections');
    finalContainer.innerHTML = ''; 
    for (const type in committedInputs) {
        committedInputs[type].forEach((item, index) => {
            const selectionItem = document.createElement('div');
            selectionItem.className = 'selection-item';
            selectionItem.setAttribute('draggable', 'true');
            selectionItem.dataset.type = type; 
            const formattedItem = formatDorkItem(type, item); 
            selectionItem.id = `${type}-${index}-final`;
            selectionItem.innerHTML = `${formattedItem} <button onclick="deleteSelectionFromFinal('${type}-${index}-final')">X</button>`;
            finalContainer.appendChild(selectionItem);

            
            addDragTouchAndKeyboardListeners(selectionItem);
        });
    }
}


function deleteSelectionFromFinal(id) {
    const element = document.getElementById(id);
    element.remove();
}

// Função para alternância entre Modo Claro e Modo Escuro
function toggleMode() {
    const isChecked = document.getElementById('modeToggle').checked;
    const root = document.documentElement;

    if (isChecked) {
        
        root.style.setProperty('--bg-color', '#1e1e1e');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--input-bg-color', '#333333');
        root.style.setProperty('--input-text-color', '#ffffff');
        root.style.setProperty('--border-color', '#444444');
        root.style.setProperty('--button-bg-color', '#555555');
        root.style.setProperty('--button-text-color', '#ffffff');
        document.getElementById('modeLabel').textContent = 'Modo Escuro';
    } else {
        
        root.style.setProperty('--bg-color', '#ffffff');
        root.style.setProperty('--text-color', '#333333');
        root.style.setProperty('--input-bg-color', '#ffffff');
        root.style.setProperty('--input-text-color', '#333333');
        root.style.setProperty('--border-color', '#ddd');
        root.style.setProperty('--button-bg-color', '#007bff');
        root.style.setProperty('--button-text-color', '#ffffff');
        document.getElementById('modeLabel').textContent = 'Modo Claro';
    }
}

function showPlaceholderDialog(event, placeholderText) {
    const dialog = document.getElementById('placeholder-dialog');
    dialog.textContent = placeholderText;
    dialog.style.display = 'block';
    
    
    const rect = event.target.getBoundingClientRect();
    dialog.style.top = `${rect.top + window.scrollY}px`;
}


function hidePlaceholderDialog() {
    const dialog = document.getElementById('placeholder-dialog');
    dialog.style.display = 'none';
}

document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('mousedown', (event) => {
        const placeholderText = event.target.placeholder;
        if (placeholderText) {
            showPlaceholderDialog(event, placeholderText);
        }
    });

    input.addEventListener('mouseup', hidePlaceholderDialog);
    input.addEventListener('mouseleave', hidePlaceholderDialog);

    input.addEventListener('touchstart', (event) => {
        const placeholderText = event.target.placeholder;
        if (placeholderText) {
            showPlaceholderDialog(event, placeholderText);
        }
    });

    input.addEventListener('touchend', hidePlaceholderDialog);
    input.addEventListener('touchcancel', hidePlaceholderDialog);
});

// Função de "Gerar Texto de Busca"
function generateDork() {
    let outputText = '';
    const finalContainer = document.getElementById('finalSelections');
        
    const selectionItems = finalContainer.querySelectorAll('.selection-item');
    selectionItems.forEach(item => {
        outputText += item.textContent.replace(' X', '') + ' '; 
    });

    document.getElementById('output').textContent = outputText.trim(); 
}


// Função de cópia texto para a área de transferência
function copyToClipboard() {
    const outputText = document.getElementById('output').textContent;
    if (outputText) {
        navigator.clipboard.writeText(outputText).then(() => {
            alert('Texto copiado para a área de transferência!');
        }, () => {
            alert('Falha ao copiar texto.');
        });
    } else {
        alert('Nada para copiar!');
    }
}

// Função de limpeza a página
function clearQuery() {
    
    for (const type in committedInputs) {
        committedInputs[type] = [];
        updateSelections(type);
    }

  
    document.getElementById('finalSelections').innerHTML = '';

  
    document.getElementById('output').textContent = '';

    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
}

function enableFinalSelectionDragAndDrop() {
    const finalContainer = document.getElementById('finalSelections');
    finalContainer.addEventListener('dragover', allowDrop);
    finalContainer.addEventListener('drop', drop);
}

enableFinalSelectionDragAndDrop();





