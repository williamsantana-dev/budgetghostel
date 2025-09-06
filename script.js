/**
 * Gerador de Orçamento - Pousada v2.0
 * Sistema para geração de orçamentos profissionais para WhatsApp
 */

class BudgetGenerator {
    constructor() {
        this.rooms = [
            { id: 'suite-individual-standard', name: 'Suíte individual standard (com ventilador)', capacity: 1, available: 1 },
            { id: 'suite-casal-standard', name: 'Suíte casal standard (com ventilador)', capacity: 2, available: 3 },
            { id: 'suite-casal-master', name: 'Suíte casal master (com ar condicionado)', capacity: 2, available: 6 },
            { id: 'suite-tripla-master', name: 'Suíte tripla master (com ar condicionado)', capacity: 3, available: 2 },
            { id: 'suite-quadrupla-standard', name: 'Suíte quádrupla standard (com ventilador)', capacity: 4, available: 2 },
            { id: 'suite-quadrupla-master', name: 'Suíte quádrupla master (com ar condicionado)', capacity: 4, available: 3 },
            { id: 'suite-sextupla-master', name: 'Suíte sêxtupla master (com ar condicionado)', capacity: 6, available: 1 },
            { id: 'suite-coletiva', name: 'Suíte coletiva - Separado por sexo (com ar condicionado e sem TV)', capacity: 1, available: 3 }
        ];
        
        this.init();
    }
    
    /**
     * Inicializa a aplicação
     */
    init() {
        this.bindEvents();
        this.setupConditionalFields();
        this.setupThemeToggle();
        this.updateRoomOptions();
        this.setDefaultDates();
    }
    
    /**
     * Define as datas padrão (hoje e amanhã)
     */
    setDefaultDates() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        document.getElementById('checkin').valueAsDate = today;
        document.getElementById('checkout').valueAsDate = tomorrow;
    }
    
    /**
     * Vincula eventos aos elementos do formulário
     */
    bindEvents() {
        // Form events
        document.getElementById('generateBtn').addEventListener('click', () => this.generateBudget());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearForm());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
        
        // Date change events
        document.getElementById('checkin').addEventListener('change', () => this.updateRoomOptions());
        document.getElementById('checkout').addEventListener('change', () => this.updateRoomOptions());
        
        // Input change events that affect room selection
        document.getElementById('adults').addEventListener('input', () => this.updateRoomOptions());
        document.getElementById('children').addEventListener('input', () => this.updateRoomOptions());
        document.getElementById('includeChildren').addEventListener('change', () => this.updateRoomOptions());
        document.getElementById('extraBedQuantity').addEventListener('input', () => this.updateRoomOptions());
        document.getElementById('includeExtraBed').addEventListener('change', () => this.updateRoomOptions());
        document.getElementById('includePet').addEventListener('change', () => this.updateRoomOptions());
        
        // Price change events
        document.getElementById('dailyRate').addEventListener('input', () => this.updateTotal());
        document.getElementById('selectedRoom').addEventListener('change', () => this.updateTotal());
        document.getElementById('extraBedPrice').addEventListener('input', () => this.updateTotal());
        document.getElementById('petPrice').addEventListener('input', () => this.updateTotal());
        document.getElementById('petQuantity').addEventListener('input', () => this.updateTotal());
        document.getElementById('earlyPrice').addEventListener('input', () => this.updateTotal());
        document.getElementById('latePrice').addEventListener('input', () => this.updateTotal());
    }
    
    /**
     * Configura os campos condicionais
     */
    setupConditionalFields() {
        const conditionalFields = [
            { checkbox: 'includeChildren', field: 'childrenField' },
            { checkbox: 'includeExtraBed', field: 'extraBedField' },
            { checkbox: 'includePet', field: 'petField' },
            { checkbox: 'earlyCheckin', field: 'earlyCheckinField' },
            { checkbox: 'lateCheckout', field: 'lateCheckoutField' }
        ];
        
        conditionalFields.forEach(({ checkbox, field }) => {
            const checkboxEl = document.getElementById(checkbox);
            const fieldEl = document.getElementById(field);
            
            checkboxEl.addEventListener('change', () => {
                fieldEl.classList.toggle('active', checkboxEl.checked);
                if (checkbox === 'includeChildren') {
                    this.updateRoomOptions();
                }
                this.updateTotal();
            });
        });
    }
    
    /**
     * Configura o toggle de tema dark/light
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const lightIcon = themeToggle.querySelector('.light-icon');
        const darkIcon = themeToggle.querySelector('.dark-icon');
        
        // Check initial dark mode preference
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
        
        // Listen for system theme changes
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
     * Atualiza as opções de quartos baseado na seleção do usuário
     */
    updateRoomOptions() {
        const adults = parseInt(document.getElementById('adults').value) || 0;
        const includeChildren = document.getElementById('includeChildren').checked;
        const children = includeChildren ? (parseInt(document.getElementById('children').value) || 0) : 0;
        const includeExtraBed = document.getElementById('includeExtraBed').checked;
        const extraBeds = includeExtraBed ? (parseInt(document.getElementById('extraBedQuantity').value) || 0) : 0;
        
        // Para seleção de quartos: adultos + camas extras (crianças cortesia NÃO são consideradas)
        const peopleForRoomSelection = adults + extraBeds;
        const roomSelect = document.getElementById('selectedRoom');
        
        // Limpa opções existentes exceto a primeira
        roomSelect.innerHTML = '<option value="">Selecione um quarto...</option>';
        
        // Lógica para sugestões de quartos baseada no número de pessoas
        let suggestions = [];
        
        if (peopleForRoomSelection <= 6) {
            suggestions = this.getSingleRoomSuggestions(adults, extraBeds, includeChildren);
        } else {
            suggestions = this.getRoomCombinations(peopleForRoomSelection);
        }
        
        suggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion.id;
            option.textContent = suggestion.name;
            
            if (suggestion.available === 0) {
                option.disabled = true;
                option.className = 'unavailable';
                option.textContent += ' (Indisponível)';
            } else if (suggestion.available <= 2) {
                option.className = 'limited';
                option.textContent += ` (${suggestion.available} disponível${suggestion.available > 1 ? 'is' : ''})`;
            } else {
                option.className = 'available';
                option.textContent += ` (${suggestion.available} disponíveis)`;
            }
            
            roomSelect.appendChild(option);
        });
        
        this.updateTotal();
    }
    
    /**
     * Obtém sugestões de quartos individuais
     */
    getSingleRoomSuggestions(adults, extraBeds, includeChildren) {
        const suggestions = [];
        const totalForRoomSelection = adults + extraBeds;
        const includePet = document.getElementById('includePet').checked;
        
        if (totalForRoomSelection === 1) {
            suggestions.push(this.rooms.find(r => r.id === 'suite-individual-standard'));
            if (!includePet) {
                suggestions.push(this.rooms.find(r => r.id === 'suite-coletiva'));
            }
        } else if (totalForRoomSelection === 2) {
            suggestions.push(
                this.rooms.find(r => r.id === 'suite-casal-standard'),
                this.rooms.find(r => r.id === 'suite-casal-master')
            );
            if (!includeChildren && !includePet) {
                suggestions.push({
                    ...this.rooms.find(r => r.id === 'suite-coletiva'), 
                    id: 'suite-coletiva-2', 
                    name: '2x Leitos na suíte coletiva - Separado por sexo (com ar condicionado e sem TV)', 
                    available: Math.floor(this.rooms.find(r => r.id === 'suite-coletiva').available / 2)
                });
            }
        } else if (totalForRoomSelection === 3) {
            suggestions.push(this.rooms.find(r => r.id === 'suite-tripla-master'));
            if (!includeChildren && !includePet) {
                suggestions.push({
                    ...this.rooms.find(r => r.id === 'suite-coletiva'), 
                    id: 'suite-coletiva-3', 
                    name: '3x Leitos na suíte coletiva - Separado por sexo (com ar condicionado e sem TV)', 
                    available: Math.floor(this.rooms.find(r => r.id === 'suite-coletiva').available / 3)
                });
            }
        } else if (totalForRoomSelection === 4) {
            suggestions.push(
                this.rooms.find(r => r.id === 'suite-quadrupla-standard'),
                this.rooms.find(r => r.id === 'suite-quadrupla-master')
            );
            if (!includeChildren && !includePet) {
                suggestions.push({
                    ...this.rooms.find(r => r.id === 'suite-coletiva'), 
                    id: 'suite-coletiva-4', 
                    name: '4x Leitos na suíte coletiva - Separado por sexo (com ar condicionado e sem TV)', 
                    available: Math.floor(this.rooms.find(r => r.id === 'suite-coletiva').available / 4)
                });
            }
        } else if (totalForRoomSelection === 5 || totalForRoomSelection === 6) {
            suggestions.push(this.rooms.find(r => r.id === 'suite-sextupla-master'));
        }
        
        return suggestions.filter(s => s && s.available > 0);
    }
    
    /**
     * Obtém combinações de quartos para grupos maiores
     */
    getRoomCombinations(totalPeople) {
        const combinations = [];
        
        if (totalPeople <= 8) {
            combinations.push({
                id: 'combo-casal-sextupla',
                name: 'Suíte casal master + Suíte sêxtupla master',
                available: Math.min(
                    this.rooms.find(r => r.id === 'suite-casal-master').available,
                    this.rooms.find(r => r.id === 'suite-sextupla-master').available
                )
            });
        }
        
        if (totalPeople <= 10) {
            combinations.push({
                id: 'combo-quadrupla-sextupla',
                name: 'Suíte quádrupla master + Suíte sêxtupla master',
                available: Math.min(
                    this.rooms.find(r => r.id === 'suite-quadrupla-master').available,
                    this.rooms.find(r => r.id === 'suite-sextupla-master').available
                )
            });
        }
        
        if (totalPeople <= 12) {
            combinations.push({
                id: 'combo-sextupla-sextupla',
                name: '2x Suíte sêxtupla master',
                available: Math.floor(this.rooms.find(r => r.id === 'suite-sextupla-master').available / 2)
            });
        }
        
        return combinations.filter(c => c.available > 0);
    }
    
    /**
     * Atualiza o total do orçamento
     */
    updateTotal() {
        const nights = this.calculateNights();
        const dailyRate = parseFloat(document.getElementById('dailyRate').value) || 0;
        let total = nights * dailyRate;
        
        // Adiciona custos de camas extras
        if (document.getElementById('includeExtraBed').checked) {
            const extraBedQuantity = parseInt(document.getElementById('extraBedQuantity').value) || 0;
            const extraBedPrice = parseFloat(document.getElementById('extraBedPrice').value) || 0;
            total += extraBedQuantity * extraBedPrice * nights;
        }
        
        // Adiciona custos de pets
        if (document.getElementById('includePet').checked) {
            const petQuantity = parseInt(document.getElementById('petQuantity').value) || 0;
            const petPrice = parseFloat(document.getElementById('petPrice').value) || 0;
            total += petQuantity * petPrice * nights;
        }
        
        // Adiciona taxa de early check-in
        if (document.getElementById('earlyCheckin').checked) {
            const earlyPrice = parseFloat(document.getElementById('earlyPrice').value) || 0;
            total += earlyPrice;
        }
        
        // Adiciona taxa de late check-out
        if (document.getElementById('lateCheckout').checked) {
            const latePrice = parseFloat(document.getElementById('latePrice').value) || 0;
            total += latePrice;
        }
        
        return total;
    }
    
    /**
     * Formata a data para DD/MM evitando problemas de fuso horário
     */
    formatDate(dateString) {
        if (!dateString) return '00/00';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}`;
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
        const requiredFields = ['checkin', 'checkout', 'adults', 'dailyRate', 'selectedRoom'];
        const missingFields = requiredFields.filter(field => !document.getElementById(field).value);
        
        if (missingFields.length > 0) {
            await this.showCustomModal('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        const nights = this.calculateNights();
        if (nights <= 0) {
            await this.showCustomModal('A data de saída deve ser posterior à data de entrada.');
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
        const form = document.getElementById('budgetForm');
        const formData = new FormData(form);
        
        const data = {
            checkin: formData.get('checkin'),
            checkout: formData.get('checkout'),
            adults: parseInt(formData.get('adults')) || 0,
            dailyRate: parseFloat(formData.get('dailyRate')) || 0,
            selectedRoom: formData.get('selectedRoom'),
            includeChildren: document.getElementById('includeChildren').checked,
            children: parseInt(formData.get('children')) || 0,
            includeExtraBed: document.getElementById('includeExtraBed').checked,
            extraBedQuantity: parseInt(formData.get('extraBedQuantity')) || 0,
            extraBedPrice: parseFloat(formData.get('extraBedPrice')) || 0,
            includePet: document.getElementById('includePet').checked,
            petQuantity: parseInt(formData.get('petQuantity')) || 0,
            petPrice: parseFloat(formData.get('petPrice')) || 0,
            isAverageRate: document.getElementById('isAverageRate').checked,
            earlyCheckin: document.getElementById('earlyCheckin').checked,
            earlyHour: formData.get('earlyHour'),
            earlyPrice: parseFloat(formData.get('earlyPrice')) || 0,
            lateCheckout: document.getElementById('lateCheckout').checked,
            lateHour: formData.get('lateHour'),
            latePrice: parseFloat(formData.get('latePrice')) || 0
        };
        
        data.nights = this.calculateNights();
        data.totalPrice = this.updateTotal();
        data.totalPeople = data.adults + (data.includeChildren ? data.children : 0);
        
        // Obtém nome do quarto
        if (data.selectedRoom.startsWith('combo-')) {
            const combo = this.getRoomCombinations(data.totalPeople).find(c => c.id === data.selectedRoom);
            data.roomName = combo ? combo.name : '';
        } else if (data.selectedRoom.startsWith('suite-coletiva-')) {
            const match = data.selectedRoom.match(/suite-coletiva-(\d+)/);
            if (match) {
                const count = match[1];
                data.roomName = `${count}x Leitos na suíte coletiva - Separado por sexo (com ar condicionado e sem TV)`;
            }
        } else {
            data.roomName = this.rooms.find(room => room.id === data.selectedRoom)?.name || '';
        }
        
        return data;
    }
    
    /**
     * Constrói o markdown do orçamento
     */
    buildMarkdown(data) {
        let markdown = '*ORÇAMENTO:*\n';
        
        // Linha de check-in
        let checkinTime = '14h';
        if (data.earlyCheckin && data.earlyHour) {
            checkinTime = data.earlyHour.substring(0, 5);
        }
        markdown += `🗓  *Check-in:* ${this.formatDate(data.checkin)}, a partir das ${checkinTime}.\n`;
        
        // Linha de check-out
        let checkoutTime = '12h';
        if (data.lateCheckout && data.lateHour) {
            checkoutTime = data.lateHour.substring(0, 5);
        }
        markdown += `🗓  *Check-out:* ${this.formatDate(data.checkout)}, até às ${checkoutTime}.\n`;
        
        // Linha de período
        const nightText = data.nights === 1 ? 'diária' : 'diárias';
        markdown += `⏳ *Período:* ${data.nights} ${nightText}.\n\n`;
        
        // Linha do quarto
        markdown += `🏡 *${data.roomName}*\n`;
        
        // Linha de capacidade
        let capacityText = `${data.adults} pessoas`;
        if (data.includeChildren && data.children > 0) {
            const childText = data.children === 1 ? 'criança cortesia' : 'crianças cortesia';
            capacityText += ` e ${data.children} ${childText}`;
        }
        if (data.includeExtraBed && data.extraBedQuantity > 0) {
            const bedText = data.extraBedQuantity === 1 ? 'colchão extra' : 'colchões extras';
            capacityText += `, incluso ${data.extraBedQuantity} ${bedText}`;
        }
        markdown += `👥 *Capacidade:* ${capacityText}.\n`;
        
        // Linha da diária
        let dailyRateText = `R$ ${data.dailyRate.toFixed(2).replace('.', ',')}`;
        if (data.isAverageRate) {
            dailyRateText += ' em média';
        }
        markdown += `💰 *Diária:* ${dailyRateText}`;
        
        // Taxa de pet (logo após a diária)
        if (data.includePet && data.petPrice > 0) {
            markdown += `\n🐶 *Taxa pet:* R$ ${data.petPrice.toFixed(2).replace('.', ',')} a diária por pet`;
        }
        
        // Taxas de early/late
        if (data.earlyCheckin && data.earlyPrice > 0) {
            markdown += `\n🕖 *Taxa early check-in:* R$ ${data.earlyPrice.toFixed(2).replace('.', ',')}`;
        }
        if (data.lateCheckout && data.latePrice > 0) {
            markdown += `\n🕕 *Taxa late check-out:* R$ ${data.latePrice.toFixed(2).replace('.', ',')}`;
        }
        markdown += '\n';
        
        // Linha do total
        const nightTotalText = data.nights === 1 ? 'noite' : 'noites';
        let totalPeopleText = `${data.adults} pessoas`;
        if (data.includeChildren && data.children > 0) {
            const childText = data.children === 1 ? 'criança cortesia' : 'crianças cortesia';
            totalPeopleText += ` e ${data.children} ${childText}`;
        }
        if (data.includePet && data.petQuantity > 0) {
            const petText = data.petQuantity === 1 ? 'pet' : 'pets';
            totalPeopleText += ` e ${data.petQuantity} ${petText}`;
        }
        markdown += `💵 *Total:* ${data.nights} ${nightTotalText}, R$ ${data.totalPrice.toFixed(2).replace('.', ',')} para ${totalPeopleText}.\n\n`;
        
        // Informações finais
        markdown += '💳 *Formas de pagamento:* Sinal de 50% no ato da reserva e o restante na chegada.\n\n';
        markdown += '☕ Café da manhã incluso.\n';
        markdown += '⚠️ *Orçamento válido por 24h.*';
        
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
            // Fallback para navegadores mais antigos
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
            document.getElementById('budgetForm').reset();
            document.getElementById('resultSection').classList.remove('show');
            
            // Reset campos condicionais
            document.querySelectorAll('.conditional-field').forEach(field => {
                field.classList.remove('active');
            });
            
            this.setDefaultDates();
            document.getElementById('adults').value = '2';
            this.updateRoomOptions();
        }
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    new BudgetGenerator();
});
