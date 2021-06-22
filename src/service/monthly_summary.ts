import { EntityManager } from '@mikro-orm/postgresql';
import { format, lastDayOfMonth } from 'date-fns';
import { readFileSync } from 'fs';
import { join } from 'path';
import { sql } from '../commons';

interface MonthlySummaryInput {
    tp: 'sale' | 'purchase';
    month: number;
    year: number;
}
const SQL_sp_monthly_summ = sql('sp_monthly_summ');

export async function monthlySummary (input: MonthlySummaryInput, em: EntityManager) {
    const knex = em.getKnex();
    const today = new Date(input.year, input.month, 1);
    const lastDay = lastDayOfMonth(today);
    const startDayMonth = format(today, 'yyyy-MM-dd');
    const endDayMonth = format(lastDay, 'yyyy-MM-dd');
    const tp = input.tp == 'sale' ? 2 : 1;
    
    let s = SQL_sp_monthly_summ
    s = s.split('#t0').join(startDayMonth);
    s = s.split('#t1').join(endDayMonth);
    s = s.replace('#type', tp + '');
    const result = await em.execute(s);
    console.log(result[0].day);
    return result;
}