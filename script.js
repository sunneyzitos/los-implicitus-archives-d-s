document.addEventListener('DOMContentLoaded', () => {
    const skillsContainer = document.getElementById('skills-container');
    const inventoryContainer = document.getElementById('inventory-container');
    const addItemBtn = document.getElementById('add-item-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');

    // Predefined skills with their attributes
    const predefinedSkills = [
        { name: 'Adestramento', attr: 'PRE' },
        { name: 'Artes', attr: 'INT' },
        { name: 'Atletismo', attr: 'FOR/AGI' },
        { name: 'Atualidades', attr: 'INT' },
        { name: 'Atuar', attr: 'PRE' },
        { name: 'Crime', attr: 'INT/AGI' },
        { name: 'Conhecimentos/Estudos', attr: 'INT' },
        { name: 'Enganação', attr: 'PRE' },
        { name: 'Fortitude', attr: 'VIG' },
        { name: 'Furtividade', attr: 'AGI' },
        { name: 'Iniciativa', attr: 'AGI' },
        { name: 'Intimidação', attr: 'FOR/PRE' },
        { name: 'Intuição', attr: 'PRE' },
        { name: 'Investigação', attr: 'INT' },
        { name: 'Luta', attr: 'FOR' },
        { name: 'Medicina', attr: 'INT' },
        { name: 'Natureza', attr: 'INT' },
        { name: 'Ocultismo', attr: 'INT' },
        { name: 'Ofícios', attr: 'INT' },
        { name: 'Percepção', attr: 'PRE' },
        { name: 'Persuadir', attr: 'PRE' },
        { name: 'Pilotagem', attr: 'AGI' },
        { name: 'Pontaria', attr: 'AGI' },
        { name: 'Reflexos', attr: 'AGI' },
        { name: 'Religião', attr: 'PRE/INT' },
        { name: 'Tática/Planejar', attr: 'INT/AGI' },
        { name: 'Tecnologia', attr: 'INT' },
        { name: 'Vontade', attr: 'PRE' }
    ];

    const skillLevels = ['Plebeu', 'Treinado', 'Veterano', 'Expert'];
    const categories = ['I', 'II', 'III', 'IV'];

    // Initialize progress bars
    function updateProgressBar(currentId, maxId, barClass) {
        const current = parseInt(document.getElementById(currentId).value) || 0;
        const max = parseInt(document.getElementById(maxId).value) || 1;
        const percentage = (current / max) * 100;
        const bar = document.querySelector(`${barClass} .progress-fill`);
        bar.style.width = `${Math.min(100, percentage)}%`;
    }

    // Add event listeners for stat changes
    ['pv', 'pe', 'san'].forEach(stat => {
        document.getElementById(`${stat}-current`).addEventListener('input', () => {
            updateProgressBar(`${stat}-current`, `${stat}-max`, `.${stat}-bar`);
        });
        document.getElementById(`${stat}-max`).addEventListener('input', () => {
            updateProgressBar(`${stat}-current`, `${stat}-max`, `.${stat}-bar`);
        });
    });

    function createSkillElement(skill) {
        const skillItem = document.createElement('div');
        skillItem.classList.add('skill-item');

        const skillLabel = document.createElement('div');
        skillLabel.textContent = `${skill.name} (${skill.attr})`;
        
        const skillLevelSelect = document.createElement('select');
        skillLevels.forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level;
            skillLevelSelect.appendChild(option);
        });

        skillItem.appendChild(skillLabel);
        skillItem.appendChild(skillLevelSelect);

        return skillItem;
    }

    function createInventoryItemElement() {
        const inventoryItem = document.createElement('div');
        inventoryItem.classList.add('inventory-item');
        
        const itemGrid = document.createElement('div');
        itemGrid.classList.add('inventory-item-grid');

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Nome do Item';

        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.min = '0';
        weightInput.step = '0.1';
        weightInput.placeholder = 'Peso';

        const categorySelect = document.createElement('select');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        const descriptionInput = document.createElement('textarea');
        descriptionInput.placeholder = 'Descrição do Item';
        descriptionInput.rows = 2;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Remover';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            inventoryContainer.removeChild(inventoryItem);
        });

        itemGrid.appendChild(nameInput);
        itemGrid.appendChild(weightInput);
        itemGrid.appendChild(categorySelect);
        itemGrid.appendChild(descriptionInput);
        
        inventoryItem.appendChild(itemGrid);
        inventoryItem.appendChild(deleteBtn);

        return inventoryItem;
    }

    // Initialize skills
    predefinedSkills.forEach(skill => {
        skillsContainer.appendChild(createSkillElement(skill));
    });

    addItemBtn.addEventListener('click', () => {
        const currentSlots = inventoryContainer.children.length;
        const maxSlots = parseInt(document.getElementById('inventory-slots').value);

        if (currentSlots < maxSlots) {
            const newItem = createInventoryItemElement();
            inventoryContainer.appendChild(newItem);
        } else {
            alert(`Limite de ${maxSlots} itens no inventário atingido.`);
        }
    });

    // Save and Load functionality
    saveBtn.addEventListener('click', () => {
        const characterData = {
            attributes: {
                agi: document.getElementById('agi').value,
                for: document.getElementById('for').value,
                vig: document.getElementById('vig').value,
                pre: document.getElementById('pre').value,
                int: document.getElementById('int').value,
                pi: document.getElementById('pi').value
            },
            stats: {
                pv: {
                    current: document.getElementById('pv-current').value,
                    max: document.getElementById('pv-max').value
                },
                pe: {
                    current: document.getElementById('pe-current').value,
                    max: document.getElementById('pe-max').value
                },
                san: {
                    current: document.getElementById('san-current').value,
                    max: document.getElementById('san-max').value
                }
            },
            skills: Array.from(skillsContainer.children).map(skill => ({
                name: skill.firstChild.textContent,
                level: skill.querySelector('select').value
            })),
            inventory: Array.from(inventoryContainer.children).map(item => ({
                name: item.querySelector('input[type="text"]').value,
                weight: item.querySelector('input[type="number"]').value,
                category: item.querySelector('select').value,
                description: item.querySelector('textarea').value
            }))
        };

        const dataStr = JSON.stringify(characterData);
        localStorage.setItem('characterSheet', dataStr);
        alert('Ficha salva com sucesso!');
    });

    loadBtn.addEventListener('click', () => {
        const savedData = localStorage.getItem('characterSheet');
        if (savedData) {
            const characterData = JSON.parse(savedData);
            
            // Load attributes
            Object.entries(characterData.attributes).forEach(([attr, value]) => {
                document.getElementById(attr).value = value;
            });

            // Load stats
            ['pv', 'pe', 'san'].forEach(stat => {
                document.getElementById(`${stat}-current`).value = characterData.stats[stat].current;
                document.getElementById(`${stat}-max`).value = characterData.stats[stat].max;
                updateProgressBar(`${stat}-current`, `${stat}-max`, `.${stat}-bar`);
            });

            // Load skills
            Array.from(skillsContainer.children).forEach((skillElement, index) => {
                if (characterData.skills[index]) {
                    skillElement.querySelector('select').value = characterData.skills[index].level;
                }
            });

            // Load inventory
            inventoryContainer.innerHTML = '';
            characterData.inventory.forEach(item => {
                const itemElement = createInventoryItemElement();
                itemElement.querySelector('input[type="text"]').value = item.name;
                itemElement.querySelector('input[type="number"]').value = item.weight;
                itemElement.querySelector('select').value = item.category;
                itemElement.querySelector('textarea').value = item.description;
                inventoryContainer.appendChild(itemElement);
            });

            alert('Ficha carregada com sucesso!');
        } else {
            alert('Nenhuma ficha salva encontrada!');
        }
    });
});
