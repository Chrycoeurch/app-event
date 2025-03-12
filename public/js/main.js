document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eventForm');
    const errorMessage = document.getElementById('errorMessage');
    const progressBar = document.getElementById('progressBar');
    const participantsRange = document.getElementById('participantsRange');
    const participantsValue = document.getElementById('participantsValue');
    const questionsAnswered = document.getElementById('questionsAnswered');
    const progressPercentage = document.getElementById('progressPercentage');
    const container = document.querySelector('.container');

    // Set initial value to 0
    if (participantsValue) {
        participantsValue.textContent = '0';
    }
    
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
        
        const progress = Math.min((answeredQuestions / 7) * 100, 100);
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
            resultsContainer.className = 'recommendations';
            resultsContainer.style.opacity = '0';
            resultsContainer.style.transform = 'translateY(20px)';
            
            resultsContainer.innerHTML = `
                <h2>Merci d'avoir complété le questionnaire !</h2>
                <p>Voici les applications événementielles qui correspondent le mieux à vos besoins :</p>
                
                <div class="app-cards">
                    <!-- Your existing app cards here -->
                </div>

                <button class="restart-btn">Recommencer le questionnaire</button>
            `;
            
            container.appendChild(resultsContainer);
            
            // Animate results in
            setTimeout(() => {
                resultsContainer.style.opacity = '1';
                resultsContainer.style.transform = 'translateY(0)';
            }, 50);

            // Add event listener for restart button
            const restartBtn = resultsContainer.querySelector('.restart-btn');
            restartBtn.addEventListener('click', function() {
                resultsContainer.style.opacity = '0';
                resultsContainer.style.transform = 'translateY(20px)';
                
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

            showResults();
        });
    }
});