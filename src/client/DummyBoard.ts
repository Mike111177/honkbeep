import { GameAttempt } from "../game/types/GameEvent";
import { genericVariant } from "../game/GenericData";
import { VariantDefinition } from "../game/types/Variant";
import SolitaireBoard from "./SolitaireBoard";
import UserAction from "./types/UserAction";

type UserActionCallback = (action: UserAction) => void;
export default class DummyBoard extends SolitaireBoard {
  private callback: UserActionCallback;
  constructor(
    callback: UserActionCallback,
    variant: VariantDefinition = genericVariant()
  ) {
    super(variant);
    this.callback = callback;
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    return true;
  }

  reduceUserAction(action: UserAction) {
    this.callback(action);
  }
}
