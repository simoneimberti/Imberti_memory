document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesElement = document.querySelector('.moves');
    const timerElement = document.querySelector('.timer');
    const restartButton = document.getElementById('restart');
    
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;
    let timerInterval;
    let seconds = 0;
    
    // Emoji da utilizzare come simboli delle carte
    const symbols = ['🍎', '🍌', '🍒', '🍓', '🍋', '🥝', '🍉', '🥭'];
    
    // Inizializza il gioco
    function initGame() {
        // Resetta le variabili
        cards = [];
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        moves = 0;
        matchedPairs = 0;
        seconds = 0;
        
        // Aggiorna l'interfaccia
        movesElement.textContent = '0 Mosse';
        timerElement.textContent = 'Tempo: 0s';
        
        // Ferma il timer se è in esecuzione
        clearInterval(timerInterval);
        
        // Crea le carte
        createCards();
        
        // Avvia il timer
        startTimer();
    }
    
    // Crea le carte
    function createCards() {
        // Svuota il game board
        gameBoard.innerHTML = '';
        
        // Crea un array con coppie di simboli
        const cardSymbols = [...symbols, ...symbols];
        
        // Mescola l'array
        shuffleArray(cardSymbols);
        
        // Crea le carte e le aggiunge al game board
        cardSymbols.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.addEventListener('click', flipCard);
            
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }
    
    // Mescola un array (algoritmo Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Gestisce il click su una carta
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        this.classList.add('flipped');
        this.textContent = this.dataset.symbol;
        
        if (!hasFlippedCard) {
            // Prima carta girata
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Seconda carta girata
        secondCard = this;
        
        // Incrementa il contatore delle mosse
        moves++;
        movesElement.textContent = moves === 1 ? '1 Mossa' : `${moves} Mosse`;
        
        // Controlla se le carte corrispondono
        checkForMatch();
    }
    
    // Controlla se le due carte girate corrispondono
    function checkForMatch() {
        const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            
            // Controlla se tutte le coppie sono state trovate
            if (matchedPairs === symbols.length) {
                setTimeout(() => {
                    clearInterval(timerInterval);
                    alert(`Hai vinto! Hai completato il gioco in ${moves} mosse e ${seconds} secondi.`);
                }, 500);
            }
        } else {
            unflipCards();
        }
    }
    
    // Disabilita le carte corrispondenti
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }
    
    // Rigira le carte non corrispondenti
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.textContent = '';
            
            resetBoard();
        }, 1000);
    }
    
    // Resetta le variabili del board
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    // Avvia il timer
    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            timerElement.textContent = `Tempo: ${seconds}s`;
        }, 1000);
    }
    
    // Gestisce il click sul pulsante di restart
    restartButton.addEventListener('click', initGame);
    
    // Inizializza il gioco al caricamento
    initGame();
});