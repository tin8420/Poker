const GAME_STATE = {
    FirstCardAwaits: "FirstCardAwaits",
    SecondCardAwaits: "SecondCardAwaits",
    CardsMatchFailed: "CardsMatchFailed",
    CardsMatched: "CardsMatched",
    GameFinished: "GameFinished",
}
const Symbols = [
    'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
    'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
    'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
    'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]
const view = {
    getCardElement(index) {
        return `
        <div data-index=${index} class="card back">
        </div>
        `
    },
    getCardContent(index) {
        const number = this.transformNumber((index % 13) + 1)
        const symbol = Symbols[Math.floor(index / 13)]
        return `
          <p>${number}</p>
          <img src="${symbol}" />
          <p>${number}</p>`
    },
    transformNumber(number) {
        switch (number) {
            case 1:
                return 'A'
            case 11:
                return 'J'
            case 12:
                return 'Q'
            case 13:
                return 'K'
            default:
                return number
        }
    },
    displayCards(index) {
        const CardContainer = document.querySelector('#cards')
        const randomOrder = utility.getRandomNumberArray(52)
        console.log(randomOrder)
        for (const card of randomOrder) {
            CardContainer.innerHTML += this.getCardElement(card)
        }
    }, flipCard(...card) {
        card.map(card => {
            if (card.classList.contains('back')) {
                // 回傳正面
                card.classList.remove('back')
                card.innerHTML = this.getCardContent(Number(card.dataset.index))
                return
            }
            card.classList.add('back')
            card.innerHTML = ''
        })
    }, cardpair(...card) {
        card.map(card => {
            card.classList.add('paired')
        })
    }, renderScore(score) {
        model.score += 10
        document.querySelector(".score").innerHTML = `Score : ${model.score}`;
    }, renderTimes(times) {
        model.triedTimes++
        document.querySelector(".tried").innerHTML = `You 've tried: ${model.triedTimes} times`;
    }, appendWrongAnimation(...cards) {
        cards.map(card => {
            card.classList.add('wrong')
            card.addEventListener('animationend', event => event.target.classList.remove('wrong'), { once: true })
        })
    }
}
const controller = {
    currentState: GAME_STATE.FirstCardAwaits,
    generateCards() {
        view.displayCards()
    },
    dispatchCardAction(card) {
        if (!card.classList.contains('back')) return
        switch (this.currentState) {
            case GAME_STATE.FirstCardAwaits:
                view.flipCard(card)
                model.revealedCards.push(card)
                this.currentState = GAME_STATE.SecondCardAwaits
                break
            case GAME_STATE.SecondCardAwaits:
                view.renderTimes()
                view.flipCard(card)
                model.revealedCards.push(card)
                if (model.isRevealCardMatched()) {
                    // 配對成
                    view.renderScore()
                    this.currentState = GAME_STATE.CardsMatched
                    view.cardpair(...model.revealedCards)
                    model.revealedCards = []
                    this.currentState = GAME_STATE.FirstCardAwaits
                } else {
                    console.log(model.revealedCards)
                    this.currentState = GAME_STATE.CardsMatchFailed
                    view.appendWrongAnimation(...model.revealedCards)
                    setTimeout(() => {
                        view.flipCard(...model.revealedCards)
                        model.revealedCards = []
                        this.currentState = GAME_STATE.FirstCardAwaits
                    }, 1000)
                    break
                }

        }

        console.log(model.revealedCards)
        console.log(this.currentState)
    }
}

const model = {
    revealedCards: [],
    isRevealCardMatched() {
        return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
    },
    score: 0,
    triedTimes: 0
}
const utility = {
    getRandomNumberArray(count) {
        const number = Array.from(Array(count).keys())
        for (let index = number.length - 1; index > 0; index--) {
            let randomIndex = Math.floor(Math.random() * (index + 1))
                ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
        }
        return number
    }
}


controller.generateCards()




let eachCard = document.querySelectorAll('.card')
for (const card of eachCard) {
    card.addEventListener('click', e => {
        controller.dispatchCardAction(card)
    })
}

