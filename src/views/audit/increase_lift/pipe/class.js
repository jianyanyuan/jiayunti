/*
 * @Author: zfd
 * @Date: 2020-12-16 14:34:34
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:33:49
 * @Description:
 */
import { IsString, MinLength, IsBoolean } from 'class-validator'

export default class Pipe {
  @IsString({ message: '请输入合法的踏勘单位' })
  @MinLength(2, { message: '踏勘单位最小长度为2' })
  unit

  // @IsString({ message: '请输入合法的踏勘结果' })
  // @MinLength(1, { message: '踏勘结果最小长度为1' })
  // note

  // @Matches(
  //   /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31 )|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02 -29 )\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
  //   { message: '请输入正确的时间字符串' })
  @IsString({ message: '请输入合法的时间' })
  @MinLength(5, { message: '时间最小长度为5' })
  completeTime

  @IsBoolean
  whetherComplete
}
