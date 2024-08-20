window.onload = function () { // Fonction qui s'exécute lorsque la fenêtre est complètement chargée
    const blockSize = 30; // Taille d'un bloc (en pixels)
    let ctx; // Contexte de dessin pour le canevas
    const delay = 100; // Délai entre chaque mise à jour du jeu (en millisecondes)
    let snakee; // Instance du serpent
    let canvas; // Élément canvas où le jeu est dessiné
    let applee; // Instance de la pomme
    let widthInBlocks; // Largeur du canevas en blocs
    let heightInBlocks; // Hauteur du canevas en blocs
    let score; // Score du joueur
    let timeout; // ID du timeout pour la mise à jour du jeu
    let startTime; // Temps de début du jeu
    let gameOverButton; // Bouton "Rejouer" affiché à la fin du jeu

    init(); // Appelle la fonction d'initialisation

    function init() { // Fonction d'initialisation
        canvas = document.createElement('canvas'); // Crée un nouvel élément canvas
        document.body.appendChild(canvas); // Ajoute le canevas au corps du document
        ctx = canvas.getContext('2d'); // Obtient le contexte de dessin 2D
        resizeCanvas(); // Redimensionne le canevas pour s'adapter à la taille de la fenêtre
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right"); // Crée une instance du serpent avec une position initiale et une direction
        applee = new Apple([10, 10]); // Crée une instance de la pomme avec une position initiale
        score = 0; // Initialise le score à 0
        startTime = new Date(); // Enregistre le temps de début du jeu
        refreshCanvas(); // Commence à rafraîchir le canevas
        window.addEventListener('resize', resizeCanvas); // Ajoute un écouteur d'événements pour redimensionner le canevas lors du redimensionnement de la fenêtre
        document.documentElement.style.overflow = 'hidden'; // Masque les barres de défilement sur le document
        document.body.style.overflow = 'hidden'; // Masque les barres de défilement sur le corps du document
    }

    function resizeCanvas() { // Fonction pour redimensionner le canevas
        canvas.width = window.innerWidth; // Définit la largeur du canevas à la largeur de la fenêtre
        canvas.height = window.innerHeight; // Définit la hauteur du canevas à la hauteur de la fenêtre
        widthInBlocks = Math.floor(canvas.width / blockSize); // Calcule la largeur du canevas en blocs
        heightInBlocks = Math.floor(canvas.height / blockSize); // Calcule la hauteur du canevas en blocs
    }

    function refreshCanvas() { // Fonction pour rafraîchir le canevas
        drawPsychedelicBackground(); // Dessine l'arrière-plan psychédélique
        snakee.advance(); // Avance le serpent
        if (snakee.checkCollision()) { // Vérifie si le serpent a percuté un mur ou lui-même
            gameOver(); // Affiche l'écran de fin de jeu
        } else {
            if (snakee.isEatingApple(applee)) { // Vérifie si le serpent mange la pomme
                score++; // Incrémente le score
                snakee.ateApple = true; // Indique que le serpent a mangé une pomme
                do {
                    applee.setNewPosition(); // Définit une nouvelle position pour la pomme
                } while (applee.isOnSnake(snakee)); // Assure que la nouvelle position n'est pas sur le serpent
            }
            drawScore(); // Dessine le score
            drawTimer(); // Dessine le timer
            snakee.draw(); // Dessine le serpent
            applee.draw(); // Dessine la pomme
            timeout = setTimeout(refreshCanvas, delay); // Planifie le prochain rafraîchissement du canevas
        }
    }

    function drawPsychedelicBackground() { // Fonction pour dessiner l'arrière-plan psychédélique
        ctx.save(); // Sauvegarde le contexte de dessin
        let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); // Crée un dégradé linéaire
        gradient.addColorStop(0, '#000000'); // Ajoute un arrêt de couleur noir au début du dégradé
        gradient.addColorStop(0.5, '#00ff00'); // Ajoute un arrêt de couleur vert clair au milieu du dégradé
        gradient.addColorStop(1, '#00008B'); // Ajoute un arrêt de couleur bleu au bout du dégradé
        ctx.fillStyle = gradient; // Définit la couleur de remplissage avec le dégradé
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Remplit le canevas avec le dégradé

        // Créer un effet de dégradé animé
        ctx.globalCompositeOperation = 'source-over'; // Définit le mode de composition
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Définit une couleur noire semi-transparente
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Remplit le canevas avec la couleur semi-transparente

        ctx.restore(); // Restaure le contexte de dessin
    }

    function gameOver() { // Fonction pour afficher l'écran de fin de jeu
        ctx.save(); // Sauvegarde le contexte de dessin
        ctx.font = "bold 90px sans-serif"; // Définit la police et la taille du texte
        ctx.fillStyle = "#FAF0E6"; // Définit la couleur de remplissage du texte
        ctx.textAlign = "center"; // Centre le texte horizontalement
        ctx.textBaseline = "center"; // Centre le texte verticalement
        ctx.strokeStyle = "#404040"; // Définit la couleur du contour du texte
        ctx.lineWidth = 5; // Définit la largeur du contour du texte
        let centreX = canvas.width / 2; // Calcule la position horizontale du centre du canevas
        let centreY = canvas.height / 2; // Calcule la position verticale du centre du canevas
        ctx.strokeText("GAME OVER", centreX, centreY - 150); // Dessine le contour du texte "Game Over"
        ctx.fillText(" GAME OVER", centreX, centreY - 150); // Dessine le texte "Game Over"

        ctx.font = "bold 30px sans-serif"; // Modifie la police et la taille du texte pour le score et le temps
        ctx.strokeText(`SCORE: ${score}`, centreX, centreY - 100); // Dessine le contour du texte du score
        ctx.fillText(`SCORE: ${score}`, centreX, centreY - 100); // Dessine le texte du score
        ctx.strokeText(`TIME: ${formatTime(new Date() - startTime)}`, centreX, centreY - 50); // Dessine le contour du texte du temps écoulé
        ctx.fillText(`TIME: ${formatTime(new Date() - startTime)}`, centreX, centreY - 50); // Dessine le texte du temps écoulé

        ctx.restore(); // Restaure le contexte de dessin

        // Ajouter un bouton "Rejouer"
        if (!gameOverButton) { // Vérifie si le bouton "Rejouer" n'existe pas encore
            gameOverButton = document.createElement('button'); // Crée un nouvel élément bouton
            gameOverButton.textContent = 'REJOUER'; // Définit le texte du bouton
            gameOverButton.style.position = 'absolute'; // Définit la position du bouton
            gameOverButton.style.left = `${centreX - 50}px`; // Positionne le bouton horizontalement
            gameOverButton.style.top = `${centreY}px`; // Positionne le bouton verticalement
            gameOverButton.style.fontSize = '20px'; // Définit la taille de la police du bouton
            gameOverButton.style.padding = '10px 20px'; // Définit le remplissage du bouton
            gameOverButton.style.backgroundColor = '#2E8B57'; // Définit la couleur de fond du bouton
            gameOverButton.style.color = '#FAF0E6'; // Définit la couleur du texte du bouton
            gameOverButton.style.border = 'none'; // Supprime les bordures du bouton
            gameOverButton.style.borderRadius = '100px'; // Arrondit les coins du bouton
            gameOverButton.style.cursor = 'pointer'; // Change le curseur lorsque la souris est sur le bouton
            gameOverButton.style.fontWeight = 'bold'; // Rend le texte du bouton en gras
            document.body.appendChild(gameOverButton); // Ajoute le bouton au corps du document

            gameOverButton.addEventListener('click', restart); // Ajoute un écouteur d'événements au bouton pour redémarrer le jeu
        }
    }

    function restart() { // Fonction pour redémarrer le jeu
        score = 0; // Réinitialise le score à 0
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right"); // Crée une nouvelle instance du serpent
        applee = new Apple([10, 10]); // Crée une nouvelle instance de la pomme
        startTime = new Date(); // Réinitialise le temps de début du jeu
        clearTimeout(timeout); // Annule le timeout précédent
        refreshCanvas(); // Rafraîchit le canevas
        if (gameOverButton) { // Vérifie si le bouton "Rejouer" existe
            document.body.removeChild(gameOverButton); // Retire le bouton du corps du document
            gameOverButton = null; // Réinitialise la variable du bouton
        }
    }

    function drawScore() { // Fonction pour dessiner le score
        ctx.save(); // Sauvegarde le contexte de dessin
        ctx.font = "bold 20px sans-serif"; // Définit la police et la taille du texte
        ctx.fillStyle = "#FAF0E6"; // Définit la couleur de remplissage du texte
        ctx.textAlign = "left"; // Aligne le texte à gauche
        ctx.textBaseline = "top"; // Aligne le texte en haut
        ctx.fillText("SCORE : " + score.toString(), 20, 20); // Dessine le score en haut à gauche
        ctx.restore(); // Restaure le contexte de dessin
    }

    function drawTimer() { // Fonction pour dessiner le timer
        ctx.save(); // Sauvegarde le contexte de dessin
        ctx.font = "bold 20px sans-serif"; // Définit la police et la taille du texte
        ctx.fillStyle = "#FAF0E6"; // Définit la couleur de remplissage du texte
        ctx.textAlign = "right"; // Aligne le texte à droite
        ctx.textBaseline = "top"; // Aligne le texte en haut
        let elapsedTime = new Date() - startTime; // Calcule le temps écoulé depuis le début du jeu
        ctx.fillText("TIME : " + formatTime(elapsedTime), canvas.width - 20, 20); // Dessine le temps écoulé en haut à droite
        ctx.restore(); // Restaure le contexte de dessin
    }

    function formatTime(milliseconds) { // Fonction pour formater le temps écoulé en heures, minutes et secondes
        let totalSeconds = Math.floor(milliseconds / 1000); // Convertit les millisecondes en secondes
        let minutes = Math.floor(totalSeconds / 60); // Calcule le nombre de minutes
        let seconds = totalSeconds % 60; // Calcule le nombre de secondes restantes
        let hours = Math.floor(minutes / 60); // Calcule le nombre d'heures
        minutes = minutes % 60; // Calcule les minutes restantes

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Formate le temps en HH:MM:SS
    }

    function drawGradient(ctx, position, radius) { // Fonction pour dessiner un dégradé radial
        const x = position[0] * blockSize + blockSize / 2; // Calcule la position horizontale du centre du dégradé
        const y = position[1] * blockSize + blockSize / 2; // Calcule la position verticale du centre du dégradé
        const gradient = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius); // Crée un dégradé radial
        gradient.addColorStop(0, "#00ff00"); // Ajoute une couleur verte clair au centre du dégradé
        gradient.addColorStop(0.5, "#00cc00"); // Ajoute une couleur verte moyen au milieu du dégradé
        gradient.addColorStop(1, "#003300"); // Ajoute une couleur verte foncé au bord du dégradé

        ctx.fillStyle = gradient; // Définit la couleur de remplissage avec le dégradé
        ctx.beginPath(); // Commence un nouveau chemin
        ctx.arc(x, y, radius, 0, Math.PI * 2); // Dessine un cercle avec le dégradé
        ctx.fill(); // Remplit le cercle avec le dégradé
    }

    function Snake(body, direction) { // Constructeur pour le serpent
        this.body = body; // Corps du serpent
        this.direction = direction; // Direction du serpent
        this.ateApple = false; // Indique si le serpent a mangé une pomme

        this.draw = function () { // Fonction pour dessiner le serpent
            ctx.save(); // Sauvegarde le contexte de dessin

            // Dessiner le corps du serpent
            for (let i = 0; i < this.body.length; i++) { // Parcourt chaque segment du serpent
                const segment = this.body[i]; // Obtient le segment courant
                drawGradient(ctx, segment, blockSize / 2); // Dessine le segment avec un dégradé radial
            }

            ctx.restore(); // Restaure le contexte de dessin
        };

        this.advance = function () { // Fonction pour avancer le serpent
            const nextPosition = this.body[0].slice(); // Obtient la prochaine position du serpent
            switch (this.direction) { // Met à jour la position en fonction de la direction
                case "left":
                    nextPosition[0] -= 1; // Déplace le serpent vers la gauche
                    break;
                case "right":
                    nextPosition[0] += 1; // Déplace le serpent vers la droite
                    break;
                case "down":
                    nextPosition[1] += 1; // Déplace le serpent vers le bas
                    break;
                case "up":
                    nextPosition[1] -= 1; // Déplace le serpent vers le haut
                    break;
                default:
                    throw ("Invalid Direction"); // Lancer une erreur si la direction est invalide
            }
            this.body.unshift(nextPosition); // Ajoute la nouvelle position au début du corps du serpent
            if (!this.ateApple)
                this.body.pop(); // Retire le dernier segment si le serpent n'a pas mangé de pomme
            else
                this.ateApple = false; // Réinitialise l'état de consommation de pomme
        };

        this.setDirection = function (newDirection) { // Fonction pour définir la nouvelle direction du serpent
            let allowedDirections; // Directions autorisées
            switch (this.direction) { // Détermine les directions autorisées en fonction de la direction actuelle
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw ("Invalid Direction"); // Lancer une erreur si la direction est invalide
            }
            if (allowedDirections.indexOf(newDirection) > -1) { // Vérifie si la nouvelle direction est autorisée
                this.direction = newDirection; // Met à jour la direction
            }
        };

        this.checkCollision = function () { // Fonction pour vérifier les collisions
            let wallCollision = false; // Indique si le serpent a percuté un mur
            let snakeCollision = false; // Indique si le serpent a percuté lui-même
            let head = this.body[0]; // Obtient la tête du serpent
            let rest = this.body.slice(1); // Obtient le reste du corps du serpent
            let snakeX = head[0]; // Coordonnée X de la tête du serpent
            let snakeY = head[1]; // Coordonnée Y de la tête du serpent
            let minX = 0; // Coordonnée X minimale
            let minY = 0; // Coordonnée Y minimale
            let maxX = widthInBlocks - 1; // Coordonnée X maximale
            let maxY = heightInBlocks - 1; // Coordonnée Y maximale
            let inNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; // Vérifie si le serpent est hors des murs horizontaux
            let inNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY; // Vérifie si le serpent est hors des murs verticaux

            if (inNotBetweenHorizontalWalls || inNotBetweenVerticalWalls) { // Vérifie la collision avec les murs
                wallCollision = true; // Marque la collision avec un mur
            }
            for (let i = 0; i < rest.length; i++) { // Vérifie la collision avec le corps du serpent
                if (snakeX == rest[i][0] && snakeY === rest[i][1]) { // Si la tête du serpent entre en collision avec un segment du corps
                    snakeCollision = true; // Marque la collision avec le corps du serpent
                }
            }

            return wallCollision || snakeCollision; // Retourne vrai si une collision est détectée
        };

        this.isEatingApple = function (appleToEat) { // Fonction pour vérifier si le serpent mange une pomme
            let head = this.body[0]; // Obtient la tête du serpent
            return head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]; // Vérifie si la tête du serpent est à la même position que la pomme
        };
    }

    function Apple(position) { // Constructeur pour la pomme
        this.position = position; // Position de la pomme
        this.draw = function () { // Fonction pour dessiner la pomme
            ctx.save(); // Sauvegarde le contexte de dessin
            ctx.fillStyle = "#ff0000"; // Définit la couleur de remplissage de la pomme
            ctx.beginPath(); // Commence un nouveau chemin
            ctx.arc(this.position[0] * blockSize + blockSize / 2, this.position[1] * blockSize + blockSize / 2, blockSize / 2, 0, Math.PI * 2); // Dessine un cercle pour représenter la pomme
            ctx.fill(); // Remplit le cercle avec la couleur définie
            ctx.restore(); // Restaure le contexte de dessin
        };

        this.setNewPosition = function () { // Fonction pour définir une nouvelle position pour la pomme
            let newPosition; // Nouvelle position de la pomme
            do {
                newPosition = [Math.floor(Math.random() * widthInBlocks), Math.floor(Math.random() * heightInBlocks)]; // Génère une nouvelle position aléatoire
            } while (newPosition[0] === this.position[0] && newPosition[1] === this.position[1]); // Vérifie si la nouvelle position est différente de l'ancienne
            this.position = newPosition; // Met à jour la position de la pomme
        };

        this.isOnSnake = function (snake) { // Fonction pour vérifier si la pomme est sur le serpent
            let isOnSnake = false; // Indique si la pomme est sur le serpent
            for (let i = 0; i < snake.body.length; i++) { // Parcourt chaque segment du serpent
                if (this.position[0] === snake.body[i][0] && this.position[1] === snake.body[i][1]) { // Vérifie si la pomme est sur un segment du serpent
                    isOnSnake = true; // Marque que la pomme est sur le serpent
                }
            }
            return isOnSnake; // Retourne vrai si la pomme est sur le serpent
        };
    }

    document.onkeydown = function (event) { // Fonction pour gérer les événements de touche enfoncée
        const key = event.keyCode; // Obtient le code de la touche enfoncée
        const newDirection = key === 37 ? "left" // Flèche gauche
            : key === 38 ? "up" // Flèche haut
            : key === 39 ? "right" // Flèche droite
            : key === 40 ? "down" // Flèche bas
                : null; // Aucune direction

        if (newDirection) { // Vérifie si une nouvelle direction a été définie
            snakee.setDirection(newDirection); // Définit la direction du serpent
        }
    };
};
