document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eventForm');
    const errorMessage = document.getElementById('errorMessage');
    const progressBar = document.getElementById('progressBar');
    const participantsRange = document.getElementById('participantsRange');
    const participantsValue = document.getElementById('participantsValue');
    const questionsAnswered = document.getElementById('questionsAnswered');
    const progressPercentage = document.getElementById('progressPercentage');

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
        const radioChecked = form.querySelectorAll('input[type="radio"]:checked').length;
        const hasParticipants = parseInt(participantsRange.value) > 0;
        const totalFields = radioChecked + (hasParticipants ? 1 : 0);
        const progress = Math.min((totalFields / 7) * 100, 100); // Limit to 100%
        progressBar.style.width = `${progress}%`;
        questionsAnswered.textContent = totalFields;
        progressPercentage.textContent = `${Math.round(progress)}%`;
    }

    if (form) {
        form.querySelectorAll('input[type="radio"]').forEach(element => {
            element.addEventListener('change', updateProgress);
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            let isValid = true;
            let emptyFields = [];

            formData.forEach((value, key) => {
                if (!value) {
                    isValid = false;
                    emptyFields.push(key);
                }
            });

            if (!isValid || parseInt(participantsRange.value) === 0) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Veuillez répondre à toutes les questions.';
                return;
            }

            fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/results';
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
            });
        });
    }
});