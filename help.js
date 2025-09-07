/**
 * Help Page - Gerador de Orçamento v2.1
 * JavaScript para página de ajuda e changelog
 */

class HelpPage {
    constructor() {
        this.init();
    }
    
    /**
     * Inicializa a página de ajuda
     */
    init() {
        this.setupThemeToggle();
        this.setupTabs();
    }
    
    /**
     * Configura o toggle de tema dark/light
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const lightIcon = themeToggle.querySelector('.light-icon');
        const darkIcon = themeToggle.querySelector('.dark-icon');
        
        // Verifica preferência inicial do sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark');
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
        }
        
        // Toggle manual
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            
            lightIcon.style.display = isDark ? 'none' : 'block';
            darkIcon.style.display = isDark ? 'block' : 'none';
        });
        
        // Escuta mudanças do sistema
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
     * Configura o sistema de abas
     */
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                
                // Remove active de todas as abas
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Ativa a aba selecionada
                button.classList.add('active');
                document.getElementById(tabName).classList.add('active');
            });
        });
    }
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    new HelpPage();
});