import * as XLSX from '@e965/xlsx';
import type {Activity,Club,Dataset} from '../../types';
import {activityId,clubId,isoDate,money,slug} from '../normalize';
const SHEET_URL='https://docs.google.com/spreadsheets/d/';
const sameTitle=(a:string,b:string)=>{const x=slug(a),y=slug(b);return x===y||x.includes(y)||y.includes(x)};
export async function readWorkbook(file:File):Promise<XLSX.WorkBook>{const data=await file.arrayBuffer();return XLSX.read(data,{type:'array',cellDates:true})}
export async function readGoogleSheet(url:string):Promise<XLSX.WorkBook>{const match=url.match(/spreadsheets\/d\/([\w-]+)/);if(!match)throw new Error('URL ของ Google Sheets ไม่ถูกต้อง');const response=await fetch(`${SHEET_URL}${match[1]}/export?format=xlsx`);if(!response.ok)throw new Error('ไม่สามารถอ่าน Google Sheets ผ่านเบราว์เซอร์ได้ กรุณาดาวน์โหลด .xlsx แล้วอัปโหลด');return XLSX.read(await response.arrayBuffer(),{type:'array',cellDates:true})}
export function parseWorkbook(workbook:XLSX.WorkBook,month:string,source:string,base:Dataset):Dataset{
 const clubs:Club[]=[];const activities:Activity[]=[];
 workbook.SheetNames.forEach(tab=>{const rows=XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[tab],{header:1,defval:null,raw:true}) as unknown[][];if(!rows.length)return;const name=String(rows[0]?.[0]??tab).replace(/^งบประมาณชมรม\s*/,'').trim()||tab.trim();const id=clubId(name);const allocation=money(rows[3]?.[3]);const balanceRow=rows.find(r=>String(r?.[2]??'').trim()==='คงเหลือ');const reportedBalance=money(balanceRow?.[3]);clubs.push({id,name,allocation,reportedBalance,sourceTab:tab,sourceUrl:source});
 const header=rows.findIndex(r=>String(r?.[2]??'').trim()==='กิจกรรม');if(header<0)return;
 rows.slice(header+1).forEach((r,j)=>{const title=String(r?.[2]??'').trim();if(!title||title==='รวม'||title==='คงเหลือ')return;const date=isoDate(r?.[1]);const ref=`sheet:${tab}:${header+j+2}`;const existing=base.activities.find(a=>a.sourceRefs.includes(ref))??base.activities.find(a=>a.clubId===id&&sameTitle(a.title,title));const key=existing?.id??activityId(name,title);const requestedBudget=money(r?.[3]);const actualExpense=money(r?.[4]);activities.push(existing?{...existing,requestedBudget,actualExpense:actualExpense??existing.actualExpense,sourceRefs:[...new Set([...existing.sourceRefs,`sheet:${tab}:${header+j+2}`])]}:{id:key,clubId:id,title,originalMonth:month,plannedDate:date,revisedDate:null,actualDate:null,venue:'',status:'planned',proposalStatus:'unknown',proposalDate:null,summaryStatus:'unknown',summaryDate:null,requestedBudget,actualExpense,remarks:String(r?.[6]??''),sourceRefs:[`sheet:${tab}:${header+j+2}`]});});});
 return {schemaVersion:1,publishedAt:new Date().toISOString().slice(0,10),sourceNote:`นำเข้าจาก ${source} เดือน ${month}`,clubs,activities};
}
export function reconcile(base:Dataset,incoming:Dataset){return [
 ...incoming.clubs.map(c=>{const old=base.clubs.find(x=>x.id===c.id);return {key:`club:${c.id}`,label:c.name,kind:!old?'new':old.allocation!==c.allocation||old.reportedBalance!==c.reportedBalance?'changed':'same',manual:false,detail:`วงเงิน ${c.allocation??'—'} / คงเหลือ ${c.reportedBalance??'—'}`}}),
 ...incoming.activities.map(a=>{const old=base.activities.find(x=>x.id===a.id);return {key:`activity:${a.id}`,label:a.title,kind:!old?'new':old.requestedBudget!==a.requestedBudget||old.actualExpense!==a.actualExpense?'changed':'same',manual:!!old?.manual,detail:`ขออนุมัติ ${a.requestedBudget??'—'} / ใช้จริง ${a.actualExpense??'—'}`}})
 ] as const}
