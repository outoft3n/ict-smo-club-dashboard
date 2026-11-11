export type EventStatus='planned'|'completed'|'postponed'|'cancelled'|'uncertain';
export type DocumentStatus='submitted'|'pending'|'not_required'|'unknown';
export interface Activity { id:string; clubId:string; title:string; originalMonth:string|null; plannedDate:string|null; revisedDate:string|null; actualDate:string|null; venue:string; status:EventStatus; proposalStatus:DocumentStatus; proposalDate:string|null; summaryStatus:DocumentStatus; summaryDate:string|null; requestedBudget:number|null; actualExpense:number|null; remarks:string; sourceRefs:string[]; manual?:boolean; }
export interface Club { id:string; name:string; allocation:number|null; reportedBalance:number|null; sourceTab:string; sourceUrl:string; }
export interface Dataset { schemaVersion:1; publishedAt:string; sourceNote:string; clubs:Club[]; activities:Activity[]; }
