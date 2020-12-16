/*
 * @Author: zfd
 * @Date: 2020-12-16 14:34:34
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-16 14:54:53
 * @Description: 
 */
import { IsMobilePhone, Matches, IsString, MinLength, IsDate, IsNumber, Min, IsDateString } from 'class-validator'

export class Construction {
  @IsString({ message: '需为字符串' })
  @MinLength(2, { message: '最小长度为2' })
  constructionUnit

  @IsString({ message: '需为字符串' })
  @MinLength(2, { message: '最小长度为2' })
  address

  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '请输入手机号' })
  phoneNumber

  @IsString({ message: '需为字符串' })
  @MinLength(2, { message: '最小长度为2' })
  contact

  @Matches(
    /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31 )|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02 -29 )\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
    { message: '请输入正确的时间字符串' })
  offerTime

  @IsNumber()
  @Min(1)
  constructionPeriod

  @IsNumber()
  @Min(1)
  materialCost

  @IsNumber()
  @Min(1)
  artificialCost

}
