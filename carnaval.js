/**
 * Gerador de Orçamento Carnaval 2026 - Pousada
 * Adaptado do sistema de Réveillon para o período de 13/02/2026 a 18/02/2026
 */

class CarnavalBudgetGenerator {
    constructor() {
        this.rooms = [
            { id: 'suite-casal-standard', name: 'Suíte casal standard', capacity: 2, available: 3 },
            { id: 'suite-casal-master', name: 'Suíte casal master', capacity: 2, available: 6 },
            { id: 'suite-tripla-master', name: 'Suíte tripla master', capacity: 3, available: 2 },
            { id: 'suite-quadrupla-standard', name: 'Suíte quádrupla standard', capacity: 4, available: 2 },
            { id: 'suite-quadrupla-master', name: 'Suíte quádrupla master', capacity: 4, available: 3 },
            { id: 'suite-sextupla-master', name: 'Suíte sêxtupla master', capacity: 6, available: 1 },
            { id: 'suite-coletiva', name: 'Leito na suíte coletiva - Separado por sexo', capacity: 1, available: 3 }
        ];
        
        // Tabela de VALORES DA DIÁRIA do Carnaval (13/02/2026 a 18/02/2026)
        // Estrutura: { tipo_quarto: { quantidade_noites: valor_diaria } }
        this.carnavalDailyRates = {
            'suite-casal-standard': { 3: 517, 4: 501, 5: 470 },
            'suite-casal-master': { 3: 548, 4: 531, 5: 498 },
            'suite-tripla-master': { 3: 659, 4: 639, 5: 600 },
            'suite-quadrupla-standard': { 3: 827, 4: 802, 5: 753 },
            'suite-quadrupla-master': { 3: 876, 4: 849, 5: 797 },
            'suite-sextupla-master': { 3: 1099, 4: 1066, 5: 1000 },
            'suite-coletiva': { 3: 207, 4: 201, 5: 188 }
        };
        
        // Preços Fora do Pacote (Antes de 13/02 ou Depois de 18/02)
        // Baseado na tabela "A partir de 5 diárias" fornecida para fora da data
        this.standardDailyRates = {
            'suite-casal-standard': 245,
            'suite-casal-master': 263,
            'suite-tripla-master': 333,
            'suite-quadrupla-standard': 391,
            'suite-quadrupla-master': 400,
            'suite-sextupla-master': 525,
            'suite-coletiva': 89
        };
        
        this.roomCounter = 1;
        this.init();
    }
    
    /**
     * Inicializa a aplicação
     */
    init() {
        this.bindEvents();
        this.setupThemeToggle();
        this.setDefaultDates();
    }
    
    /**
     * Define as datas padrão para o Carnaval 2026
     */
    setDefaultDates() {
        // Sexta de carnaval até quarta de cinzas
        document.getElementById('checkin').value = '2026-02-13';
        document.getElementById('checkout').value = '2026-02-18';
    }
    
    /**
     * Vincula eventos aos elementos do formulário
     */
    bindEvents() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateBudget());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearForm());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('addRoomBtn').addEventListener('click', () => this.addRoom());
        
        document.getElementById('checkin').addEventListener('change', () => this.handleCheckinChange());
        document.getElementById('checkout').addEventListener('change', () => this.handleCheckoutChange());
    
        // Setup conditional fields for the first room
        this.setupRoomConditionalFields(document.querySelector('.room-item'));
    }
    
    /**
     * Configura campos condicionais para um quarto específico
     */
    setupRoomConditionalFields(roomItem) {
        const extraBedCheckbox = roomItem.querySelector('.include-extra-bed');
        const extraBedField = roomItem.querySelector('.extra-bed-field');
        const petCheckbox = roomItem.querySelector('.include-pet');
        const petField = roomItem.querySelector('.pet-field');
    
        extraBedCheckbox.addEventListener('change', () => {
            extraBedField.classList.toggle('active', extraBedCheckbox.checked);
        });
    
        petCheckbox.addEventListener('change', () => {
            petField.classList.toggle('active', petCheckbox.checked);
        });
    }
    
    /**
     * Adiciona um novo quarto
     */
    addRoom() {
        const container = document.getElementById('roomsContainer');
        const roomIndex = this.roomCounter++;
        
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room-item';
        roomDiv.setAttribute('data-room-index', roomIndex);
        
        roomDiv.innerHTML = `
            <div class="room-header">
                <h4>Quarto ${roomIndex + 1}</h4>
                <button type="button" class="remove-room-btn" onclick="removeRoom(${roomIndex})">✕</button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Tipo de Quarto</label>
                    <select class="room-type" required>
                        <option value="">Selecione...</option>
                        <option value="suite-casal-standard">Suíte casal standard</option>
                        <option value="suite-casal-master">Suíte casal master</option>
                        <option value="suite-tripla-master">Suíte tripla master</option>
                        <option value="suite-quadrupla-standard">Suíte quádrupla standard</option>
                        <option value="suite-quadrupla-master">Suíte quádrupla master</option>
                        <option value="suite-sextupla-master">Suíte sêxtupla master</option>
                        <option value="suite-coletiva">Cama na suíte coletiva</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantidade</label>
                    <input type="number" class="room-quantity" min="1" max="10" value="1" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Adultos</label>
                    <input type="number" class="room-adults" min="1" max="20" value="2" required>
                </div>
                <div class="form-group">
                    <label>Crianças Cortesia</label>
                    <input type="number" class="room-children" min="0" max="10" value="0">
                </div>
            </div>
            
            <div class="form-group">
                <label class="checkbox-wrapper">
                    <input type="checkbox" class="include-extra-bed">
                    <span class="checkmark"></span>
                    Incluir colchão extra
                </label>
                <div class="conditional-field extra-bed-field">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Quantidade de Colchões</label>
                            <input type="number" class="extra-bed-quantity" min="1" max="5" value="1">
                        </div>
                        <div class="form-group">
                            <label>Valor do Colchão Extra por Diária (R$)</label>
                            <input type="number" class="extra-bed-price" step="0.01" min="0" placeholder="30,00">
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="form-group">
                <label class="checkbox-wrapper">
                    <input type="checkbox" class="include-pet">
                    <span class="checkmark"></span>
                    Incluir pet
                </label>
                <div class="conditional-field pet-field">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Quantidade de Pets</label>
                            <input type="number" class="pet-quantity" min="1" max="5" value="1">
                        </div>
                        <div class="form-group">
                            <label>Valor da Diária por Pet (R$)</label>
                            <input type="number" class="pet-price" step="0.01" min="0" placeholder="25,00">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(roomDiv);
        this.setupRoomConditionalFields(roomDiv);
        this.updateRemoveButtons();
    }
    
    /**
     * Remove um quarto
     */
    removeRoom(roomIndex) {
        const roomElement = document.querySelector(`[data-room-index="${roomIndex}"]`);
        if (roomElement) {
            roomElement.remove();
            this.updateRemoveButtons();
            this.updateRoomNumbers();
        }
    }
    
    /**
     * Atualiza a visibilidade dos botões de remover
     */
    updateRemoveButtons() {
        const roomItems = document.querySelectorAll('.room-item');
        roomItems.forEach((item, index) => {
            const removeBtn = item.querySelector('.remove-room-btn');
            if (roomItems.length > 1) {
                removeBtn.style.display = 'flex';
            } else {
                removeBtn.style.display = 'none';
            }
        });
    }
    
    /**
     * Atualiza os números dos quartos
     */
    updateRoomNumbers() {
        const roomItems = document.querySelectorAll('.room-item');
        roomItems.forEach((item, index) => {
            const header = item.querySelector('.room-header h4');
            header.textContent = `Quarto ${index + 1}`;
        });
    }
    
    /**
     * Manipula mudança na data de entrada
     */
    handleCheckinChange() {
        const checkinDate = new Date(document.getElementById('checkin').value);
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinDate) {
            const minCheckout = new Date(checkinDate);
            minCheckout.setDate(minCheckout.getDate() + 3);
            
            const currentCheckout = new Date(checkoutInput.value);
            if (!currentCheckout || currentCheckout < minCheckout) {
                checkoutInput.valueAsDate = minCheckout;
            }
            
            checkoutInput.min = minCheckout.toISOString().split('T')[0];
        }
    }
    
    /**
     * Manipula mudança na data de saída
     */
    handleCheckoutChange() {
        const checkinDate = new Date(document.getElementById('checkin').value);
        const checkoutDate = new Date(document.getElementById('checkout').value);
        
        if (checkinDate && checkoutDate) {
            const nights = this.calculateNights();
            if (nights < 3) {
                this.showCustomModal('O período mínimo para o Carnaval é de 3 diárias.');
                const minCheckout = new Date(checkinDate);
                minCheckout.setDate(minCheckout.getDate() + 3);
                document.getElementById('checkout').valueAsDate = minCheckout;
            }
        }
    }
    
    /**
     * Configura o toggle de tema dark/light
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const lightIcon = themeToggle.querySelector('.light-icon');
        const darkIcon = themeToggle.querySelector('.dark-icon');
        
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark');
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            
            lightIcon.style.display = isDark ? 'none' : 'block';
            darkIcon.style.display = isDark ? 'block' : 'none';
        });
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (!document.body.classList.contains('dark') && !document.body.classList.contains('light')) {
                if (event.matches) {
                    document.body.classList.add('dark');
                    lightIcon.style.display = 'none';
                    darkIcon.style.display = 'block';
                } else {
                    document.body.classList.remove('dark');
                    lightIcon.style.display = 'block';
                    darkIcon.style.display = 'none';
                }
            }
        });
    }
    
    /**
     * Calcula o número de noites entre as datas
     */
    calculateNights() {
        const checkin = new Date(document.getElementById('checkin').value);
        const checkout = new Date(document.getElementById('checkout').value);
        
        if (!checkin || !checkout || checkout <= checkin) {
            return 0;
        }
        
        const diffTime = Math.abs(checkout - checkin);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    /**
     * Calcula o preço total baseado no período e tipo de quarto
     */
    calculateTotalPrice(roomId, checkinDate, checkoutDate) {
        const totalNights = this.calculateNights();
        let totalPrice = 0;
        let dailyRateAverage = 0;
        let originalDailyRate = null;
        let hasCarnavalPeriod = false;
        
        // Define o intervalo do Carnaval
        const carnavalStart = new Date('2026-02-13');
        const carnavalEnd = new Date('2026-02-18');
        
        // Verifica se a estadia intersecta com o período principal do carnaval
        // Se a data de entrada for antes do fim do carnaval E a data de saída for depois do inicio do carnaval
        let intersectsCarnaval = (checkinDate < carnavalEnd && checkoutDate > carnavalStart);
        
        if (intersectsCarnaval) {
            hasCarnavalPeriod = true;
            const rates = this.carnavalDailyRates[roomId];
            
            // Lógica de Pacotes de Carnaval
            // O código original usava preço total. Aqui usamos Diária x Noites.
            
            if (totalNights <= 5 && rates[totalNights]) {
                // Pacote exato de 3, 4 ou 5 diárias
                totalPrice = rates[totalNights] * totalNights;
                
                // Simulação de "preço original" para mostrar desconto (lógica herdada do reveillon)
                if (totalNights > 3 && rates[3]) {
                    // Se for mais de 3 dias, mostra comparativo com a diária de 3 dias
                    originalDailyRate = rates[3];
                }
            } else if (totalNights > 5) {
                // Mais de 5 diárias: Pacote de 5 dias + dias extras
                // Dias extras são cobrados conforme tabela padrão (standardDailyRates)
                // OU dias extras proporcionais? O prompt diz para usar preços específicos fora do range 13-18.
                
                // Vamos calcular dia a dia para ser preciso
                let currentDate = new Date(checkinDate);
                let tempTotal = 0;
                let carnavalDaysCount = 0;
                
                // Primeiro pass: contar quantos dias caem DENTRO do intervalo de carnaval
                while (currentDate < checkoutDate) {
                    if (currentDate >= carnavalStart && currentDate < carnavalEnd) {
                        carnavalDaysCount++;
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                
                // Reiniciar data para calculo de preço
                currentDate = new Date(checkinDate);
                
                // Se ficar o período todo do carnaval (5 dias ou mais dentro do range), usa a tarifa de 5 dias
                // Se ficar menos dias dentro do range (ex: chegou dia 17), usa tarifa proporcional
                const carnavalBaseRate = (carnavalDaysCount >= 5) ? rates[5] : (rates[carnavalDaysCount] || rates[5]); 
                
                // Definir originalDailyRate para visualização
                originalDailyRate = rates[3];
    
                while (currentDate < checkoutDate) {
                    if (currentDate >= carnavalStart && currentDate < carnavalEnd) {
                        // Dia de Carnaval
                        tempTotal += carnavalBaseRate;
                    } else {
                        // Dia fora do Carnaval
                        tempTotal += this.standardDailyRates[roomId];
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                
                totalPrice = tempTotal;
                
            } else {
                // Menos de 3 diárias no carnaval (caso raro se o sistema bloquear, mas por segurança)
                // Usa a tarifa de 3 diárias pro-rata
                totalPrice = (rates[3] || 600) * totalNights;
            }
            
        } else {
            // Período totalmente fora do Carnaval (Antes de 13/02 ou Depois de 18/02)
            totalPrice = this.standardDailyRates[roomId] * totalNights;
        }
        
        dailyRateAverage = totalPrice / totalNights;
        
        return {
            total: totalPrice,
            dailyRate: dailyRateAverage,
            originalDailyRate: originalDailyRate,
            isSpecialPeriod: hasCarnavalPeriod,
            breakdown: {
                intersectsCarnaval: intersectsCarnaval,
                totalNights: totalNights
            }
        };
    }
    
    /**
     * Formata a data para DD/MM
     */
    formatDate(dateString) {
        if (!dateString) return '00/00';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}`;
    }
    
    /**
     * Formata valor monetário com separador de milhares
     */
    formatCurrency(value) {
        return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    /**
     * Exibe modal customizado
     */
    showCustomModal(message, isConfirm = false) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            `;
            
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: white;
                padding: 24px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                max-width: 400px;
                width: 90%;
                margin: 0 20px;
            `;
            
            if (document.body.classList.contains('dark')) {
                modalContent.style.background = '#1e293b';
                modalContent.style.color = '#f8fafc';
            }
            
            modalContent.innerHTML = `
                <p style="margin-bottom: 20px; line-height: 1.5; color: inherit;">${message}</p>
                <div style="display: flex; justify-content: flex-end; gap: 12px;">
                    ${isConfirm ? `<button class="cancel-btn" style="padding: 8px 16px; border: 1px solid #d1d5db; background: transparent; color: inherit; border-radius: 6px; cursor: pointer;">Cancelar</button>` : ''}
                    <button class="confirm-btn" style="padding: 8px 16px; background: #6366F1; color: white; border: none; border-radius: 6px; cursor: pointer;">${isConfirm ? 'Confirmar' : 'OK'}</button>
                </div>
            `;
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            const confirmBtn = modalContent.querySelector('.confirm-btn');
            const cancelBtn = modalContent.querySelector('.cancel-btn');
            
            confirmBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(true);
            });
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    document.body.removeChild(modal);
                    resolve(false);
                });
            }
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    resolve(false);
                }
            });
        });
    }
    
    /**
     * Gera o orçamento
     */
    async generateBudget() {
        const roomItems = document.querySelectorAll('.room-item');
        if (roomItems.length === 0) {
            await this.showCustomModal('Adicione pelo menos um quarto.');
            return;
        }
        
        // Validar se todos os quartos estão preenchidos
        let hasErrors = false;
        roomItems.forEach(item => {
            const roomType = item.querySelector('.room-type').value;
            const roomAdults = item.querySelector('.room-adults').value;
            
            if (!roomType || !roomAdults || parseInt(roomAdults) < 1) {
                hasErrors = true;
            }
        });
        
        if (hasErrors) {
            await this.showCustomModal('Preencha todos os campos obrigatórios dos quartos.');
            return;
        }
        
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        
        if (!checkin || !checkout) {
            await this.showCustomModal('Preencha as datas de entrada e saída.');
            return;
        }
        
        const nights = this.calculateNights();
        if (nights < 3) {
            await this.showCustomModal('O período mínimo para o Carnaval é de 3 diárias.');
            return;
        }
        
        const data = this.getFormData();
        const markdown = this.buildMarkdown(data);
        
        document.getElementById('markdownOutput').textContent = markdown;
        document.getElementById('resultSection').classList.add('show');
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Obtém dados do formulário
     */
    getFormData() {
        const checkinDate = new Date(document.getElementById('checkin').value);
        const checkoutDate = new Date(document.getElementById('checkout').value);
        const nights = this.calculateNights();
        
        const roomItems = document.querySelectorAll('.room-item');
        const rooms = [];
        let grandTotal = 0;
        let totalPeople = 0;
        let totalChildren = 0;
        
        roomItems.forEach(item => {
            const roomType = item.querySelector('.room-type').value;
            const quantity = parseInt(item.querySelector('.room-quantity').value) || 1;
            const adults = parseInt(item.querySelector('.room-adults').value) || 0;
            const children = parseInt(item.querySelector('.room-children').value) || 0;
            
            // Colchão extra
            const includeExtraBed = item.querySelector('.include-extra-bed').checked;
            const extraBedQuantity = parseInt(item.querySelector('.extra-bed-quantity').value) || 0;
            const extraBedPrice = parseFloat(item.querySelector('.extra-bed-price').value) || 0;
            
            // Pet
            const includePet = item.querySelector('.include-pet').checked;
            const petQuantity = parseInt(item.querySelector('.pet-quantity').value) || 0;
            const petPrice = parseFloat(item.querySelector('.pet-price').value) || 0;
            
            const roomName = this.rooms.find(r => r.id === roomType)?.name || '';
            const roomPrice = this.calculateTotalPrice(roomType, checkinDate, checkoutDate);
            
            // Calcular total do quarto incluindo extras
            let roomTotal = roomPrice.total * quantity;
            
            // Para leito coletivo: multiplicar pelo número de adultos (1 leito = 1 pessoa)
            if (roomType === 'suite-coletiva') {
                roomTotal = roomPrice.total * quantity * adults;
            }
            
            if (includeExtraBed && extraBedPrice > 0) {
                roomTotal += extraBedQuantity * extraBedPrice * nights * quantity;
            }
            
            if (includePet && petPrice > 0) {
                roomTotal += petQuantity * petPrice * nights * quantity;
            }
            
            grandTotal += roomTotal;
            totalPeople += adults;
            totalChildren += children;
            
            rooms.push({
                type: roomType,
                name: roomName,
                quantity: quantity,
                adults: adults,
                children: children,
                price: roomPrice,
                total: roomTotal,
                includeExtraBed: includeExtraBed,
                extraBedQuantity: extraBedQuantity,
                extraBedPrice: extraBedPrice,
                includePet: includePet,
                petQuantity: petQuantity,
                petPrice: petPrice
            });
        });
        
        return {
            checkin: document.getElementById('checkin').value,
            checkout: document.getElementById('checkout').value,
            nights: nights,
            rooms: rooms,
            totalPeople: totalPeople,
            totalChildren: totalChildren,
            grandTotal: grandTotal,
            additionalInfo: document.getElementById('additionalInfo').value || ''
        };
    }
    
    /**
     * Constrói o markdown do orçamento
     */
    buildMarkdown(data) {
        let markdown = '🎭 *ORÇAMENTO ESPECIAL CARNAVAL* 🎭\n\n';
        
        // Cabeçalho
        markdown += `🗓 *Check-in:* ${this.formatDate(data.checkin)}, a partir das 14h\n`;
        markdown += `🗓 *Check-out:* ${this.formatDate(data.checkout)}, até às 12h\n`;
        
        const nightText = data.nights === 1 ? 'diária' : 'diárias';
        markdown += `⏳ *Período:* ${String(data.nights).padStart(2, '0')} ${nightText}\n`;
        
        // Verificar se tem período especial
        const hasSpecialPeriod = data.rooms.some(room => room.price.isSpecialPeriod);
        if (hasSpecialPeriod) {
            markdown += '_Durante o período do carnaval, estamos reservando a partir de 03 diárias._\n\n';
        } else {
            markdown += '\n';
        }
        
        // Blocos de quartos
        const hasMultipleBlocks = data.rooms.length > 1;
        
        data.rooms.forEach(room => {
            // Mostrar "1x" sempre que há múltiplos blocos
            const quantityText = (hasMultipleBlocks || room.quantity > 1) ? `${room.quantity}x ` : '';
            markdown += `🏡 *${quantityText}${room.name}*\n`;
            
            let capacityText = `${String(room.adults).padStart(2, '0')} pessoas`;
            if (room.children > 0) {
                const childText = room.children === 1 ? 'criança cortesia' : 'crianças cortesia';
                capacityText += ` e ${String(room.children).padStart(2, '0')} ${childText}`;
            }
            
            // Adicionar extras na capacidade
            if (room.includeExtraBed && room.extraBedQuantity > 0) {
                const bedText = room.extraBedQuantity === 1 ? 'colchão extra' : 'colchões extras';
                capacityText += `, incluso ${room.extraBedQuantity} ${bedText}`;
            }
            
            if (room.includePet && room.petQuantity > 0) {
                const petText = room.petQuantity === 1 ? 'pet' : 'pets';
                capacityText += `, ${room.petQuantity} ${petText}`;
            }
            
            markdown += `👥 *Capacidade:* ${capacityText}.\n`;
            
            // Linha da diária
            if (room.price.isSpecialPeriod && room.price.originalDailyRate && room.price.dailyRate < room.price.originalDailyRate) {
                const fullDailyRate = this.formatCurrency(room.price.originalDailyRate);
                const discountDailyRate = this.formatCurrency(room.price.dailyRate);
                markdown += `💰 *Diária:* R$ ${fullDailyRate} por R$ ${discountDailyRate}\n`;
            } else {
                const dailyRate = this.formatCurrency(room.price.dailyRate);
                markdown += `💰 *Diária:* R$ ${dailyRate}\n`;
            }
            
            // Taxa de colchão extra (se houver)
            if (room.includeExtraBed && room.extraBedPrice > 0) {
                markdown += `🛏️ *Colchão extra:* R$ ${this.formatCurrency(room.extraBedPrice)} a diária\n`;
            }
            
            // Taxa de pet (se houver)
            if (room.includePet && room.petPrice > 0) {
                markdown += `🐶 *Taxa pet:* R$ ${this.formatCurrency(room.petPrice)} a diária por pet\n`;
            }
            
            // Total do quarto
            const nightTotalText = data.nights === 1 ? 'noite' : 'noites';
            let roomPeopleText = `${String(room.adults).padStart(2, '0')} pessoas`;
            if (room.children > 0) {
                const childText = room.children === 1 ? 'criança' : 'crianças';
                roomPeopleText += ` e ${String(room.children).padStart(2, '0')} ${childText}`;
            }
            if (room.includePet && room.petQuantity > 0) {
                const petText = room.petQuantity === 1 ? 'pet' : 'pets';
                roomPeopleText += ` e ${room.petQuantity} ${petText}`;
            }
            
            markdown += `💵 Total pacote (${String(data.nights).padStart(2, '0')} ${nightTotalText}): R$ ${this.formatCurrency(room.total)} para ${roomPeopleText}.\n\n`;
        });
        
        // Total geral (só se houver múltiplos quartos)
        if (hasMultipleBlocks) {
            const totalRooms = data.rooms.reduce((sum, room) => sum + room.quantity, 0);
            const roomText = totalRooms === 1 ? 'quarto' : 'quartos';
            markdown += `Valor total dos ${totalRooms} ${roomText} *R$ ${this.formatCurrency(data.grandTotal)}*.\n\n`;
        }
        
        // Informações da pousada
        markdown += '🏪 Recepção 24 Horas, Wi-Fi\n';
        markdown += '☕ Café da manhã incluso todos os dias\n';
        markdown += '🏊‍♂️ Piscina, churrasqueira e mesa de bilhar disponível para os hóspedes\n';
        markdown += '📍 Localização privilegiada, próximo à praia e aos pontos turísticos\n';
        markdown += '🐠 Desconto no Aquário Acqua Mundo!\n\n';
        
        // Formas de pagamento
        markdown += '💳 *Formas de Pagamento*\n\n';
        markdown += '*À vista:*\n';
        markdown += '💵 Depósito/PIX com 50% no ato da reserva + 50% na chegada\n\n';
        markdown += '💳 *Parcelado no cartão:*\n';
        markdown += 'Até 5x sem juros (parcela mínima de R$ 200,00)\n';
        markdown += 'Até 10x com condição especial para parcelamento (disponível para valores acima de R$ 1.500,00)\n\n';
        
        // Informações adicionais
        if (data.additionalInfo.trim()) {
            markdown += `${data.additionalInfo.trim()}\n\n`;
        }
        
        // Fechamento
        markdown += '⚠ *Orçamento válido por 24h*.\n\n';
        markdown += 'As vagas para o Carnaval são limitadas e a procura é alta.\n';
        markdown += 'Garanta já sua reserva e venha curtir a folia com conforto! 🎉\n\n';
        markdown += '📲 Para confirmar agora, basta me enviar seu nome completo e a forma de pagamento escolhida.';
        
        return markdown;
    }
    
    /**
     * Copia o orçamento para a área de transferência
     */
    async copyToClipboard() {
        const markdownText = document.getElementById('markdownOutput').textContent;
        
        try {
            await navigator.clipboard.writeText(markdownText);
            const successMsg = document.getElementById('copySuccess');
            successMsg.classList.add('show');
            setTimeout(() => successMsg.classList.remove('show'), 3000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = markdownText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const successMsg = document.getElementById('copySuccess');
            successMsg.classList.add('show');
            setTimeout(() => successMsg.classList.remove('show'), 3000);
        }
    }
    
    /**
     * Limpa o formulário
     */
    async clearForm() {
        const confirmed = await this.showCustomModal('Tem certeza que deseja limpar todos os campos?', true);
        
        if (confirmed) {
            // Remove quartos extras
            const roomsContainer = document.getElementById('roomsContainer');
            const roomItems = roomsContainer.querySelectorAll('.room-item');
            for (let i = roomItems.length - 1; i > 0; i--) {
                roomItems[i].remove();
            }
            
            // Reset primeiro quarto
            const firstRoom = roomItems[0];
            firstRoom.querySelector('.room-type').value = '';
            firstRoom.querySelector('.room-quantity').value = '1';
            firstRoom.querySelector('.room-adults').value = '2';
            firstRoom.querySelector('.room-children').value = '0';
            firstRoom.querySelector('.include-extra-bed').checked = false;
            firstRoom.querySelector('.extra-bed-field').classList.remove('active');
            firstRoom.querySelector('.include-pet').checked = false;
            firstRoom.querySelector('.pet-field').classList.remove('active');
            
            // Reset outros campos
            document.getElementById('carnavalForm').reset();
            document.getElementById('resultSection').classList.remove('show');
            
            this.setDefaultDates();
            this.roomCounter = 1;
            this.updateRemoveButtons();
        }
    }
}

// Função global para remover quartos
function removeRoom(roomIndex) {
    const generator = window.budgetGenerator;
    if (generator) {
        generator.removeRoom(roomIndex);
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    window.budgetGenerator = new CarnavalBudgetGenerator();
});