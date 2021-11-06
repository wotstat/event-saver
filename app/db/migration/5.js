const name = 'upd 06.11.2021 (add inQueueWaitTimeMS)'

const up = `
alter table Event_OnBattleStart add column inQueueWaitTimeMS Int32;
alter table Event_OnBattleStart add column gameplayMask UInt32;
`

const down = `  
alter table Event_OnBattleStart drop column inQueueWaitTimeMS;
alter table Event_OnBattleStart drop column gameplayMask;
`

export default { name, up, down }
