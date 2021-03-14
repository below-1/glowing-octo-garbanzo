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
