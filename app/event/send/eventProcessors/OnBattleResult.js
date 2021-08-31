
import { v4 as uuidv4 } from 'uuid';
import { Insert } from "../dbProvider.js"


export default function Process(uuid, event) {
    Insert('Event_OnBattleResult',
        {
            id: uuidv4(),
            battleID: uuid,
            botsCount: event.BotsCount
        }
    )
}