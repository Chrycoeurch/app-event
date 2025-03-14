document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eventForm');
    const errorMessage = document.getElementById('errorMessage');
    const progressBar = document.getElementById('progressBar');
    const participantsRange = document.getElementById('participantsRange');
    const participantsValue = document.getElementById('participantsValue');
    const questionsAnswered = document.getElementById('questionsAnswered');
    const progressPercentage = document.getElementById('progressPercentage');
    const container = document.querySelector('.container');
    const progressContainer = document.querySelector('.progress-container');

    // Initialize sticky polyfill
    Stickyfill.add(progressContainer);

    // Set initial value for participants
    if (participantsValue) {
        participantsValue.textContent = participantsRange.value;
    }
    
    // Update progress bar initially
    updateProgress();
    
    if (participantsRange) {
        participantsRange.addEventListener('input', function() {
            participantsValue.textContent = this.value;
            updateProgress();
        });
    }

    function updateProgress() {
        const checkboxGroups = ['eventType', 'eventFormat', 'communication', 'payments'].map(name => {
            return form.querySelector(`input[name="${name}"]:checked`) !== null;
        });
        
        const radioGroups = ['budget', 'paymentType'].map(name => {
            return form.querySelector(`input[name="${name}"]:checked`) !== null;
        });
        
        const hasParticipants = parseInt(participantsRange.value) > 0;
        
        const answeredQuestions = [
            ...checkboxGroups,
            ...radioGroups,
            hasParticipants
        ].filter(Boolean).length;
        
        const totalQuestions = 7;
        const progress = Math.min((answeredQuestions / totalQuestions) * 100, 100);
        
        progressBar.style.width = `${progress}%`;
        questionsAnswered.textContent = answeredQuestions;
        progressPercentage.textContent = `${Math.round(progress)}%`;
    }

    function showResults() {
        const mainContainer = document.querySelector('.main-container');
        mainContainer.style.opacity = '0';
        mainContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            mainContainer.style.display = 'none';
            
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'recommendations hidden';
            
            resultsContainer.innerHTML = `
                <h2>Merci d'avoir complété le questionnaire !</h2>
                <p>Voici les applications événementielles qui correspondent le mieux à vos besoins :</p>
                
                <div class="app-cards">
                    <div class="app-card">
                        <svg class="app-icon" width="80" height="80" viewBox="0 0 80 80">
                            <rect width="80" height="80" fill="#4FA2F0" rx="12"/>
                            <path d="M20 40 L35 55 L60 25" stroke="white" stroke-width="8" fill="none"/>
                        </svg>
                        <h3>Invent App</h3>
                        <p>Solution complète pour la gestion d'événements professionnels et personnalisés.</p>
                        <div class="points-forts">
                            <h4>Points forts :</h4>
                            <ul>
                                <li>Personnalisation avancée</li>
                                <li>Gestion des participants</li>
                                <li>Outils de communication intégrés</li>
                                <li>Interface intuitive</li>
                                <li>Support multilingue</li>
                                <li>Statistiques en temps réel</li>
                            </ul>
                        </div>
                        <div class="price">Prix : À partir de 199€ par événement</div>
                        <a href="#" class="learn-more-btn">En savoir plus</a>
                    </div>

                    <div class="app-card">
                        <svg class="app-icon" width="80" height="80" viewBox="0 0 80 80">
                            <rect width="80" height="80" fill="#FF6B6B" rx="12"/>
                            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="32" font-weight="bold">BA</text>
                        </svg>
                        <h3>Bursting App</h3>
                        <p>Application événementielle innovante avec fonctionnalités de réalité augmentée.</p>
                        <div class="points-forts">
                            <h4>Points forts :</h4>
                            <ul>
                                <li>Expériences immersives</li>
                                <li>Engagement des participants</li>
                                <li>Analyses en temps réel</li>
                                <li>Intégration réseaux sociaux</li>
                                <li>Gamification avancée</li>
                                <li>Support technique 24/7</li>
                            </ul>
                        </div>
                        <div class="price">Prix : À partir de 299€ par événement</div>
                        <a href="#" class="learn-more-btn">En savoir plus</a>
                    </div>

                    <div class="app-card">
                        <svg class="app-icon" width="80" height="80" viewBox="0 0 80 80">
                            <rect width="80" height="80" fill="#4287f5" rx="12"/>
                            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="32" font-weight="bold">ED</text>
                        </svg>
                        <h3>Eventdex</h3>
                        <p>Plateforme tout-en-un pour la gestion d'événements et le networking.</p>
                        <div class="points-forts">
                            <h4>Points forts :</h4>
                            <ul>
                                <li>Gestion des badges</li>
                                <li>Scan de cartes de visite</li>
                                <li>Matchmaking intelligent</li>
                                <li>Planification automatisée</li>
                                <li>Système de billetterie intégré</li>
                                <li>Application mobile native</li>
                            </ul>
                        </div>
                        <div class="price">Prix : À partir de 2,5€ par participant</div>
                        <a href="#" class="learn-more-btn">En savoir plus</a>
                    </div>
                </div>

                <button class="restart-btn">Recommencer le questionnaire</button>
            `;
            
            container.appendChild(resultsContainer);
            
            // Animate results in
            setTimeout(() => {
                resultsContainer.classList.remove('hidden');
            }, 50);

            // Add event listener for restart button
            const restartBtn = resultsContainer.querySelector('.restart-btn');
            restartBtn.addEventListener('click', function() {
                resultsContainer.classList.add('hidden');
                
                setTimeout(() => {
                    resultsContainer.remove();
                    mainContainer.style.display = 'flex';
                    form.reset();
                    updateProgress();
                    
                    // Animate form back in
                    setTimeout(() => {
                        mainContainer.style.opacity = '1';
                        mainContainer.style.transform = 'translateY(0)';
                    }, 50);
                }, 300);
            });
        }, 300);
    }

    if (form) {
        // Add change event listeners for all form inputs
        form.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(element => {
            element.addEventListener('change', updateProgress);
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            let isValid = true;

            // Check if at least one checkbox is checked for each checkbox group
            const checkboxGroups = ['eventType', 'eventFormat', 'communication', 'payments'];
            checkboxGroups.forEach(groupName => {
                if (!form.querySelector(`input[name="${groupName}"]:checked`)) {
                    isValid = false;
                }
            });

            // Check radio buttons
            const radioGroups = ['budget', 'paymentType'];
            radioGroups.forEach(groupName => {
                if (!form.querySelector(`input[name="${groupName}"]:checked`)) {
                    isValid = false;
                }
            });

            // Check participants
            if (parseInt(participantsRange.value) === 0) {
                isValid = false;
            }

            if (!isValid) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Veuillez répondre à toutes les questions.';
                return;
            }

            errorMessage.style.display = 'none';
            showResults();
        });
    }
});