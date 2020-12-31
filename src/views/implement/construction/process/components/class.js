/*
 * @Author: zfd
 * @Date: 2020-12-16 14:34:34
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 13:47:37
 * @Description:
 */
import { IsMobilePhone, IsString, MinLength, IsNumber, Min } from 'class-validator'

export class Construction {
  @IsString({ message: '请输入合法的施工单位' })
  @MinLength(2, { message: '施工单位名最小长度2' })
  constructionUnit

  @IsString({ message: '请输入合法的联系人' })
  @MinLength(2, { message: '联系人最小长度为2' })
  contact

  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '请输入联系方式' })
  phoneNumber

  @IsString({ message: '请输入合法的地址' })
  @MinLength(2, { message: '地址最小长度为2' })
  address

  // @Matches(
  //   /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31 )|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02 -29 )\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
  //   { message: '请输入正确的时间字符串' })
  @IsString({ message: '请输入合法的时间' })
  @MinLength(2, { message: '时间最小长度为2' })
  offerTime

  @IsNumber({}, { message: '请输入合法的施工周期' })
  @Min(1, { message: '最短施工周期为一天' })
  constructionPeriod

  @IsNumber({}, { message: '请输入合法的材料费' })
  @Min(1, { message: '材料费最低为1元' })
  materialCost

  @IsNumber({}, { message: '请输入合法的人工费' })
  @Min(1, { message: '人工费最低为1元' })
  artificialCost
}
