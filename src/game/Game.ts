import xorshift32 from "./xorshift32";

type CardData = {
    rank: number,
    suit: string
};

type SuitData = string;

type GameDefinition = {
    suits: SuitData[],
    players: string[], 
    handSize: number,
}
//May either be a seed or a shuffled index list of a deck
type ShufflerInput = number | number[];
//If you are given a GameDefinition and a ShufflerInput
//You should be able to derive the entire deck order
//Meant for spectators and post game review

type GameAction = {
    description: string
}
type GameEventSeries = GameAction[];

//Minimum data to construct entire game state
type GameState = {
    events: GameEventSeries,
    definition: GameDefinition
}

enum PipStatus{
    Possible = 1,
    Impossible,
    KnownImpossible    
}

enum CardDestination{
    Deck = 1,
    Hand,
    Stacks, 
    Discard
}

type HandUpdate = {
    turn: number, //The turn this update was made on / this should be unique in a hands history
    played?: number, //Card that was played to cause this hand state
    destination?: CardDestination // Where the card went
    replaced?: number, //Card that replaced slot 1 from deck
    result: number[] //Cards (by deck index) in hand after play
}

type HandHistory = HandUpdate[]

type CardKnowledgeUpdate = {
    turn: number, //The turn this update was made on / this should be unique in a cards history
    pips: PipStatus
} 

type CardKnowledgeHistory = CardKnowledgeUpdate[];

// Calculates current board state as new turns are played
export class GameTracker{
    state: GameState;

    //Array the size of the whole deck, 
    //each player not know the value of each card, but they 
    //do know where every card is, so this should provide a 
    //stable memoizable lookup table
    cardKnowledge: CardKnowledgeHistory[];
    hands: HandHistory[];

    //Unshuffled deck information
    deck: CardData[];

    //Shuffled order of deck for spectator and review mode
    //Ergo shuffledOrder[0] contains the data index of the first card from deck
    shuffledOrder?: number[];

    //Linked copy, used for branches from hypotheticals
    hypothetical?:GameTracker;

    constructor(state: GameState){
        this.state = state;
        this.deck = [];

        this.cardKnowledge = [];
        this.hands = [];
        this.hands.fill([], state.definition.players.length);
    }

    useShuffler(si: ShufflerInput){}
}



    //Number for seeded RNG, 
    //CardData[] for supplied cards, 
    //undefined for random seed 
/*
export default class Game{
    deck: CardData[];
    suits: SuitData[];

    constructor({suits, players, handSize}: GameDefinition, deck: DeckDefinition = undefined){
        this.suits = suits;

        //Create Deck
        if (typeof(deck) === "object"){
            //If deck is supplied, just use whats given
            this.deck = deck;
        } else {
            //Build Deck
            this.deck = this.suits.map(suit=>(
                [1,1,1,2,2,3,3,4,4,5].map(rank=>(
                    {suit, rank}
                ))
            )).flat();
    
            //Shuffle Deck
            let rng = new xorshift32(deck);
            for (let i = 0; i < this.deck.length; i++){
                let s = rng.next() % (this.deck.length - 1);
                let tmp = this.deck[s];
                this.deck[s] = this.deck[i];
                this.deck[i] = tmp;
            }
        }
    }
}
*/
