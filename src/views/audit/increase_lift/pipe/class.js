/*
 * @Author: zfd
 * @Date: 2020-12-16 14:34:34
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-24 17:03:29
 * @Description: 
 */
import { Matches, IsString, MinLength, IsBoolean } from 'class-validator'

export default class Pipe {
  @IsString({ message: '需为字符串' })
  @MinLength(2, { message: '最小长度为2' })
  unit

  @IsString({ message: '需为字符串' })
  @MinLength(1, { message: '最小长度为1' })
  note

  // @Matches(
  //   /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31 )|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02 -29 )\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
  //   { message: '请输入正确的时间字符串' })
  @IsString({ message: '需为时间字符串' })
  @MinLength(5, { message: '最小长度为5' })
  completeTime

  @IsBoolean
  whetherComplete


}
