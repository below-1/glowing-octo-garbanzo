import { readFileSync } from 'fs';
import { join } from 'path';
import { Type, Platform } from '@mikro-orm/core'
import BigNumber from 'big.js'

export class BigNumberType extends Type<BigNumber, string> {
  public convertToDatabaseValue (value: BigNumber, platform: Platform): any {
    return value.toString()
  }
  public convertToJSValue (value: string, platform: Platform): BigNumber {
    return new BigNumber(value)
  }
}

export function rupiah (x: number | string) {
  if (x === null) return ''
  return 'rp, ' + x.toLocaleString( "id-ID" )
}

export function sql(name: string)  {
  const path = join(process.cwd(), 'sql', name + '.sql')
  const f = readFileSync(path);
  return f.toString();
}

