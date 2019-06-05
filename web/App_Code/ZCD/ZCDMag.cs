using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SmartFramework4v2.Web.WebExecutor;
using System.Data;
using SmartFramework4v2.Data.SqlServer;
using System.Text;
using System.Data.SqlClient;
using SmartFramework4v2.Web.Common.JSON;
using SmartFramework4v2.Data;
using Aspose.Cells;
using System.IO;

/// <summary>
///ZCDMag 的摘要说明
/// </summary>
[CSClass("ZCDMag")]
public class ZCDMag
{
    /// <summary>
    /// 装车单号规则   当前用户从属办事处officeCodeYYMM-编号(暂定三位)
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetZhuangchedanNum")]
    public string GetZhuangchedanNum()
    {
        using (DBConnection dbc = new DBConnection())
        {
            SystemUser user = SystemUser.CurrentUser;
            //获取当天办事处最新编号
            string sql = "select * from zhuangchedan_zhuangchedan where status=0 and DateDiff(mm,qiandanDate,getdate())=0 and officeId=" + dbc.ToSqlValue(user.CsOfficeId) + " and companyId=" + dbc.ToSqlValue(user.CompanyID) + " order by addtime desc";
            DataTable dt = dbc.ExecuteDataTable(sql);
            if (dt.Rows.Count > 0)
            {
                string lastZhuangchedanNum = dt.Rows[0]["zhuangchedanNum"].ToString();
                string[] arr = lastZhuangchedanNum.Split('-');
                if (arr.Length == 2)
                {
                    string num = arr[1];
                    int count = Convert.ToInt32(num) + 1;
                    num = count.ToString("D3");
                    return arr[0] + "-" + num;
                }
                else
                {
                    throw new Exception("请检查上一装车单号。");
                }
            }
            return user.CsOfficeCode + DateTime.Now.ToString("yyMM") + "-" + "001";
        }
    }

    [CSMethod("GetZCDList")]
    public object GetZCDList(int pagnum, int pagesize, string zcdh, string sj, string pz)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string where = "";
                if (!string.IsNullOrEmpty(zcdh.Trim()))
                {
                    where += " and " + dbc.C_Like("a.zhuangchedanNum", zcdh.Trim(), LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(sj.Trim()))
                {
                    where += " and " + dbc.C_Like("d.zcdid", sj.Trim(), LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(pz.Trim()))
                {
                    where += " and " + dbc.C_Like("d.carNum", pz.Trim(), LikeStyle.LeftAndRightLike);
                }

                string str = @" select a.*,b.officeName as fromOfficeName,c.officeName as toOfficeName,d.people,d.carNum
                                  from zhuangchedan_zhuangchedan a 
                                  left join jichu_office b on a.officeId=b.officeId
                                  left join jichu_office c on a.toOfficeId=c.officeId 
                                  left join jichu_driver d on a.driverId=d.driverId
                                  where a.status=0 " + where + @"  and a.companyId='" + SystemUser.CurrentUser.CompanyID + @"'
                                  order by addtime desc";
                //开始取分页数据   
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("DelZcd")]
    public void DelZcd(string zcdid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string sql = @"update dbo.yundan_chaifen set zhuangchedan_id=null where zhuangchedan_id=" + dbc.ToSqlValue(zcdid);
                dbc.ExecuteNonQuery(sql);

                sql = "update dbo.zhuangchedan_zhuangchedan set status=1 where zhuangchedan_id=" + dbc.ToSqlValue(zcdid);
                dbc.ExecuteNonQuery(sql);
                dbc.CommitTransaction();
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("GetZCDByID")]
    public object GetZCDByID(string zcdid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select a.*,b.people,b.tel,b.carNum from zhuangchedan_zhuangchedan a left join jichu_driver b on a.driverId=b.driverId
                                where zhuangchedan_id=@zhuangchedan_id";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.AddWithValue("@zhuangchedan_id", zcdid);
                DataTable zcddt = dbc.ExecuteDataTable(cmd);

                return zcddt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetZCDQSZ")]
    public DataTable GetZCDQSZ()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select a.csOfficeId officeId,b.officeName from tb_b_user a
                                left join jichu_office b on a.csOfficeId=b.officeId
                                where UserID=" + dbc.ToSqlValue(SystemUser.CurrentUser.UserID);
                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetZCDZDZ")]
    public DataTable GetZCDZDZ()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select officeId,officeName from jichu_office 
where officeId in (select officeId from tb_b_user_office where userId=" + dbc.ToSqlValue(SystemUser.CurrentUser.UserID) + " and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + ") and officeId not in(" + dbc.ToSqlValue(SystemUser.CurrentUser.CsOfficeId) + ")";

                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }

    [CSMethod("GetDriver")]
    public DataTable GetDriver()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select driverId,people,tel,carNum from jichu_driver where status=0 and officeId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CsOfficeId) + " and companyId='" + SystemUser.CurrentUser.CompanyID + @"' order by people";
                SqlCommand cmd = new SqlCommand(str);
                DataTable dt = dbc.ExecuteDataTable(cmd);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }

    #region 获取库存运单、已配送运单（拆分单）
    /// <summary>
    /// 库存运单List
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetKCYDList")]
    public object GetKCYDList(int pagnum, int pagesize, string fromOfficeId, string toOfficeId, string kssj, string jssj, string keyword)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string where = "";
                if (!string.IsNullOrEmpty(fromOfficeId))
                {
                    where += " and " + dbc.C_EQ("b.officeId", fromOfficeId);
                }
                if (!string.IsNullOrEmpty(toOfficeId))
                {
                    where += " and " + dbc.C_EQ("b.toOfficeId", toOfficeId);
                }
                if (!string.IsNullOrEmpty(kssj))
                {
                    where += " and b.yundanDate>='" + Convert.ToDateTime(kssj) + "'";
                }
                if (!string.IsNullOrEmpty(jssj))
                {
                    where += " and b.yundanDate<='" + Convert.ToDateTime(jssj) + "'";
                }
                if (!string.IsNullOrEmpty(keyword.Trim()))
                {
                    where += " and " + dbc.C_Like("b.fahuoPeople", keyword, LikeStyle.LeftAndRightLike);
                }
                string str = @"select a.*,b.*,c.officeName,d.officeName as toOfficeName,e.zhuangchedanNum,
                                case 
                                when b.moneyHuikouXianFan=0 then b.moneyHuikouQianFan
                                else b.moneyHuikouXianFan end as moneyHuikou
                                from yundan_chaifen a 
                                left join yundan_yundan b on a.yundan_id=b.yundan_id
                                left join jichu_office c on b.officeId=c.officeId
                                left join jichu_office d on b.toOfficeId=d.officeId
                                left join zhuangchedan_zhuangchedan e on a.zhuangchedan_id=e.zhuangchedan_id
                                 where a.status=0 and a.zhuangchedan_id is null and b.status=0 " + where + " and  a.companyId='" + SystemUser.CurrentUser.CompanyID + @"' order by b.addtime asc,a.addtime asc";
                //开始取分页数据   
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);
                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    /// <summary>
    /// 已配送运单list
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="zcdid"></param>
    /// <returns></returns>
    [CSMethod("GetYPSYD")]
    public object GetYPSYD(int pagnum, int pagesize, string zcdid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string str = @"select a.*,b.*,c.officeName,d.officeName as toOfficeName,e.zhuangchedanNum,
case 
when b.moneyHuikouXianFan=0 then b.moneyHuikouQianFan
else b.moneyHuikouXianFan end as moneyHuikou
from yundan_chaifen a left join yundan_yundan b
                                on a.yundan_id=b.yundan_id
                                left join jichu_office c on b.officeId=c.officeId
                                left join jichu_office d on b.officeId=d.officeId
                                left join zhuangchedan_zhuangchedan e on a.zhuangchedan_id=e.zhuangchedan_id
                                where a.zhuangchedan_id='" + zcdid + "'  and b.status=0  and a.companyId='" + SystemUser.CurrentUser.CompanyID + "' order by e.zhuangchedanNum asc";
                //开始取分页数据   
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
    #endregion

    [CSMethod("GetHPList")]
    public object GetHPList(int pagnum, int pagesize, string cfid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int isleaf = 1;
                string ydid = "";
                string str = @"select * from yundan_chaifen where yundan_chaifen_id=" + dbc.ToSqlValue(cfid);
                DataTable cfdt = dbc.ExecuteDataTable(str);
                if (cfdt.Rows.Count > 0)
                {
                    isleaf = Convert.ToInt32(cfdt.Rows[0]["is_leaf"]);
                    ydid = cfdt.Rows[0]["yundan_id"].ToString();
                }

                int cp = pagnum;
                int ac = 0;
                if (isleaf == 0)
                {
                    str = @"select t.SP_ID,t.yundan_goodsName,t.yundan_goodsPack,(t.yundan_goodsAmount-ISNULL(t1.yundan_goodsAmount,0))yundan_goodsAmount,(t.yundan_goodsWeight-ISNULL(t1.yundan_goodsWeight,0))yundan_goodsWeight,(t.yundan_goodsVolume-ISNULL(t1.yundan_goodsVolume,0))yundan_goodsVolume from(
                                select SP_ID,yundan_goodsName,yundan_goodsPack,yundan_goodsAmount,yundan_goodsWeight,yundan_goodsVolume from yundan_goods
                                where status=0 and yundan_chaifen_id=" + dbc.ToSqlValue(cfid) + @"
                            )t
                            left join(
                                select SP_ID,yundan_goodsName,yundan_goodsPack,sum(yundan_goodsAmount) yundan_goodsAmount,sum(yundan_goodsWeight)yundan_goodsWeight,sum(yundan_goodsVolume) yundan_goodsVolume from dbo.yundan_goods
                                where status=0 and yundan_chaifen_id in(select yundan_chaifen_id from dbo.yundan_chaifen where status=0 and yundan_id=" + dbc.ToSqlValue(ydid) + @" and is_leaf=1)
                                group by yundan_goodsName,yundan_goodsPack,SP_ID
                            )t1 on t.SP_ID=t1.SP_ID";
                }
                else if (isleaf == 1)
                {
                    str = @"select * from yundan_goods where status=0 and yundan_chaifen_id='" + cfid + "' order by addtime desc";
                }

                //开始取分页数据   
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    /// <summary>
    /// 保存装车单
    /// </summary>
    /// <param name="zcdid"></param>
    /// <param name="jsr"></param>
    /// <param name="xzkclist"></param>
    /// <returns></returns>
    [CSMethod("SaveZCD")]
    public object SaveZCD(string zcdid, JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (string.IsNullOrEmpty(zcdid))
                {
                    zcdid = Guid.NewGuid().ToString();

                    //装车单号验证
                    string zcdbm = jsr["zhuangchedanNum"].ToString();
                    string checkSql = @"select * from zhuangchedan_zhuangchedan 
where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and zhuangchedanNum=" + dbc.ToSqlValue(zcdbm);
                    DataTable checkDt = dbc.ExecuteDataTable(checkSql);
                    if (checkDt.Rows.Count > 0)
                    {
                        string newBm = GetZhuangchedanNum();
                        return new { bo = false, newBm = newBm };
                    }

                    #region 新增装车单
                    //装车单表
                    bool yjzt = false;
                    bool yfzt = false;
                    bool qfzt = false;
                    bool dfzt = false;
                    bool zhdfzt = false;
                    DataTable zcdt = dbc.GetEmptyDataTable("zhuangchedan_zhuangchedan");

                    DataRow zcdr = zcdt.NewRow();
                    zcdr["zhuangchedan_id"] = zcdid;
                    zcdr["officeId"] = jsr["officeId"].ToString();
                    zcdr["toOfficeId"] = jsr["toOfficeId"].ToString();
                    zcdr["zhuangchedanNum"] = jsr["zhuangchedanNum"].ToString();
                    zcdr["driverId"] = jsr["driverId"].ToString();
                    //zcdr["fromAddress"]
                    //zcdr["toAddress"]
                    zcdr["toAdsPeople"] = jsr["toAdsPeople"].ToString();
                    zcdr["toAdsTel"] = jsr["toAdsTel"].ToString();
                    if (jsr["moneyTotal"] != null && jsr["moneyTotal"].ToString() != "")//运费总额
                    {
                        zcdr["moneyTotal"] = Convert.ToDecimal(jsr["moneyTotal"].ToString());
                    }
                    else
                    {
                        zcdr["moneyTotal"] = 0;
                    }
                    //if (jsr["moneyYunfeiYifu"] != null && jsr["moneyYunfeiYifu"].ToString() != "")
                    //{
                    //    zcdr["moneyYunfeiYifu"] = Convert.ToDecimal(jsr["moneyYunfeiYifu"].ToString());
                    //}
                    //else
                    //{
                    //    zcdr["moneyYunfeiYifu"] = 0;
                    //}
                    if (jsr["moneyYufu"] != null && jsr["moneyYufu"].ToString() != "")//预付运费
                    {
                        zcdr["moneyYufu"] = Convert.ToDecimal(jsr["moneyYufu"].ToString());
                        if (Convert.ToDecimal(jsr["moneyYufu"].ToString()) != 0)
                        {
                            yfzt = true;
                        }
                    }
                    else
                    {
                        zcdr["moneyYufu"] = 0;
                    }
                    if (jsr["moneyQianfu"] != null && jsr["moneyQianfu"].ToString() != "")//尚欠运费
                    {
                        zcdr["moneyQianfu"] = Convert.ToDecimal(jsr["moneyQianfu"].ToString());
                        if (Convert.ToDecimal(jsr["moneyQianfu"].ToString()) != 0)
                        {
                            qfzt = true;
                        }
                    }
                    else
                    {
                        zcdr["moneyQianfu"] = 0;
                    }
                    if (jsr["moneyDaofu"] != null && jsr["moneyDaofu"].ToString() != "")//点上到付
                    {
                        zcdr["moneyDaofu"] = Convert.ToDecimal(jsr["moneyDaofu"].ToString());
                        if (Convert.ToDecimal(jsr["moneyDaofu"].ToString()) != 0)
                        {
                            dfzt = true;
                        }
                    }
                    else
                    {
                        zcdr["moneyDaofu"] = 0;
                    }
                    if (jsr["moneyZhuhuoDaofu"] != null && jsr["moneyZhuhuoDaofu"].ToString() != "")//主货到付
                    {
                        zcdr["moneyZhuhuoDaofu"] = Convert.ToDecimal(jsr["moneyZhuhuoDaofu"].ToString());
                        if (Convert.ToDecimal(jsr["moneyZhuhuoDaofu"].ToString()) != 0)
                        {
                            zhdfzt = true;
                        }
                    }
                    else
                    {
                        zcdr["moneyZhuhuoDaofu"] = 0;
                    }
                    if (jsr["moneyYajin"] != null && jsr["moneyYajin"].ToString() != "")//押金
                    {
                        zcdr["moneyYajin"] = Convert.ToDecimal(jsr["moneyYajin"].ToString());
                        if (Convert.ToDecimal(jsr["moneyYajin"].ToString()) != 0)
                        {
                            yjzt = true;
                        }
                    }
                    else
                    {
                        zcdr["moneyYajin"] = 0;
                    }
                    zcdr["isOverYufuHexiao"] = 0;
                    zcdr["isOverQianfuHexiao"] = 0;
                    zcdr["isOverDaofuHexiao"] = 0;
                    zcdr["isOverYajinHexiao"] = 0;
                    zcdr["isOverZhuhuoDaofuHexiao"] = 0;
                    //zcdr["isYajinKouliu"] = 0;
                    //zcdr["isArrive"] = 0;
                    //zcdr["yajinKouliuMeno"]
                    if (jsr["jiaofuDate"] != null && jsr["jiaofuDate"].ToString() != "")
                    {
                        zcdr["jiaofuDate"] = Convert.ToDateTime(jsr["jiaofuDate"].ToString());
                    }
                    if (jsr["qiandanDate"] != null && jsr["qiandanDate"].ToString() != "")
                    {
                        zcdr["qiandanDate"] = Convert.ToDateTime(jsr["qiandanDate"].ToString());
                    }
                    //zcdr["maoLishenhe"]
                    zcdr["memo"] = jsr["memo"].ToString();
                    zcdr["adduser"] = SystemUser.CurrentUser.UserID;
                    zcdr["addtime"] = DateTime.Now;
                    zcdr["status"] = 0;
                    zcdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    zcdt.Rows.Add(zcdr);
                    dbc.InsertTable(zcdt);
                    #endregion

                    #region 财务
                    //应收
                    if (zhdfzt)
                    {
                        new Finance().AddIncome(dbc, 6, jsr, "", "", zcdid);
                        new Finance().AddExpense(dbc, 6, jsr, "", "", zcdid);
                    }
                    if (yjzt)
                    {
                        new Finance().AddIncome(dbc, 7, jsr, "", "", zcdid);
                        new Finance().AddExpense(dbc, 7, jsr, "", "", zcdid);
                    }
                    if (yfzt)
                    {
                        new Finance().AddExpense(dbc, 8, jsr, "", "", zcdid);
                    }
                    if (qfzt)
                    {
                        new Finance().AddExpense(dbc, 9, jsr, "", "", zcdid);
                    }
                    if (dfzt)
                    {
                        new Finance().AddExpense(dbc, 10, jsr, "", "", zcdid);
                    }
                    #endregion
                }
                else
                {
                    #region 编辑装车表
                    //运单表
                    DataTable zcdt = dbc.GetEmptyDataTable("zhuangchedan_zhuangchedan");
                    DataTableTracker zcdtt = new DataTableTracker(zcdt);
                    DataRow zcdr = zcdt.NewRow();
                    zcdr["zhuangchedan_id"] = zcdid;
                    zcdr["officeId"] = jsr["officeId"].ToString();
                    zcdr["toOfficeId"] = jsr["toOfficeId"].ToString();
                    zcdr["zhuangchedanNum"] = jsr["zhuangchedanNum"].ToString();
                    zcdr["driverId"] = jsr["driverId"].ToString();
                    //zcdr["fromAddress"]
                    //zcdr["toAddress"]
                    zcdr["toAdsPeople"] = jsr["toAdsPeople"].ToString();
                    zcdr["toAdsTel"] = jsr["toAdsTel"].ToString();
                    if (jsr["moneyTotal"] != null && jsr["moneyTotal"].ToString() != "")
                    {
                        zcdr["moneyTotal"] = Convert.ToDecimal(jsr["moneyTotal"].ToString());
                    }
                    else { zcdr["moneyTotal"] = 0; }
                    if (jsr["moneyYufu"] != null && jsr["moneyYufu"].ToString() != "")
                    {
                        zcdr["moneyYufu"] = Convert.ToDecimal(jsr["moneyYufu"].ToString());
                    }
                    else { zcdr["moneyYufu"] = 0; }
                    if (jsr["moneyQianfu"] != null && jsr["moneyQianfu"].ToString() != "")
                    {
                        zcdr["moneyQianfu"] = Convert.ToDecimal(jsr["moneyQianfu"].ToString());
                    }
                    else { zcdr["moneyQianfu"] = 0; }

                    if (jsr["moneyDaofu"] != null && jsr["moneyDaofu"].ToString() != "")
                    {
                        zcdr["moneyDaofu"] = Convert.ToDecimal(jsr["moneyDaofu"].ToString());
                    }
                    else { zcdr["moneyDaofu"] = 0; }
                    if (jsr["moneyZhuhuoDaofu"] != null && jsr["moneyZhuhuoDaofu"].ToString() != "")
                    {
                        zcdr["moneyZhuhuoDaofu"] = Convert.ToDecimal(jsr["moneyZhuhuoDaofu"].ToString());
                    }
                    else { zcdr["moneyZhuhuoDaofu"] = 0; }
                    if (jsr["moneyYajin"] != null && jsr["moneyYajin"].ToString() != "")
                    {
                        zcdr["moneyYajin"] = Convert.ToDecimal(jsr["moneyYajin"].ToString());
                    }
                    else { zcdr["moneyYajin"] = 0; }
                    //zcdr["yajinKouliuMeno"]
                    if (jsr["jiaofuDate"] != null && jsr["jiaofuDate"].ToString() != "")
                    {
                        zcdr["jiaofuDate"] = Convert.ToDateTime(jsr["jiaofuDate"].ToString());
                    }
                    if (jsr["qiandanDate"] != null && jsr["qiandanDate"].ToString() != "")
                    {
                        zcdr["qiandanDate"] = Convert.ToDateTime(jsr["qiandanDate"].ToString());
                    }
                    //zcdr["maoLishenhe"]
                    zcdr["memo"] = jsr["memo"].ToString();
                    zcdt.Rows.Add(zcdr);
                    dbc.UpdateTable(zcdt, zcdtt);
                    #endregion
                }
                dbc.CommitTransaction();
                return new { bo = true, zcdid = zcdid };
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    #region 选中运单
    /// <summary>
    /// 修改（大车送）
    /// </summary>
    /// <param name="isdcs"></param>
    /// <param name="xzkclist"></param>
    /// <returns></returns>
    [CSMethod("SaveDCS")]
    public object SaveDCS(string isdcs, JSReader xzkclist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (!string.IsNullOrEmpty(isdcs))
                {
                    List<string> cfidArr = new List<string>();
                    for (int i = 0; i < xzkclist.ToArray().Length; i++)
                    {
                        cfidArr.Add(xzkclist[i]["yundan_chaifen_id"].ToString());
                    }

                    if (cfidArr.Count > 0)
                    {
                        //更新拆单表
                        string sql = @"update yundan_chaifen set isDache=" + dbc.ToSqlValue(Convert.ToInt32(isdcs)) + " where yundan_chaifen_id in ('" + string.Join("','", cfidArr) + @"')";
                        dbc.ExecuteNonQuery(sql);
                    }
                }
                else
                {
                    throw new Exception("请选择是否为大车送！");
                }

                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    /// <summary>
    /// 到付验证
    /// </summary>
    /// <param name="xzkclist"></param>
    /// <returns></returns>
    [CSMethod("CheckDF")]
    public object CheckDF(JSReader xzkclist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            List<string> cfidArr = new List<string>();
            for (int i = 0; i < xzkclist.ToArray().Length; i++)
            {
                if (Convert.ToInt32(xzkclist[i]["is_leaf"].ToString()) == 0)
                {
                    cfidArr.Add(xzkclist[i]["yundan_chaifen_id"].ToString());
                }
                else
                {
                    return new { bo = true, msg = "运单号：【" + xzkclist[i]["yundan_chaifen_number"] + "】拆分单不能设置主货到付。" };
                }
            }
            //得到运单IDs，得到运单
            string sql = @"select yundanNum,moneyDaofu from dbo.yundan_yundan where yundan_id in(
                                    select distinct yundan_id from dbo.yundan_chaifen where yundan_chaifen_id in('" + string.Join("','", cfidArr) + @"')
                            )";
            DataTable dt = dbc.ExecuteDataTable(sql);
            foreach (DataRow dr in dt.Rows)
            {
                if (dr["moneyDaofu"] == DBNull.Value || Convert.ToDecimal(dr["moneyDaofu"]) == 0)
                {
                    return new { bo = true, msg = "运单号：【" + dr["yundanNum"] + "】到付金额为0" };
                }
            }
            return new { bo = false };
        }
    }

    /// <summary>
    /// 主货到付
    /// </summary>
    /// <param name="isZhuhuodaofu"></param>
    /// <param name="xzkclist"></param>
    /// <returns></returns>
    [CSMethod("SaveZHDF")]
    public decimal SaveZHDF(int isZhuhuodaofu, JSReader xzkclist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                decimal dfzje = 0m;
                List<string> cfidArr = new List<string>();//勾选拆分单
                List<string> zcfidArr = new List<string>();//主拆分单
                for (int i = 0; i < xzkclist.ToArray().Length; i++)
                {
                    if (Convert.ToInt32(xzkclist[i]["is_leaf"].ToString()) == 0)
                    {
                        zcfidArr.Add(xzkclist[i]["yundan_chaifen_id"].ToString());
                    }
                    cfidArr.Add(xzkclist[i]["yundan_chaifen_id"].ToString());
                }

                //1.更新所有拆分单主货到付状态
                string sql = @"update yundan_chaifen set isZhuhuodaofu=" + dbc.ToSqlValue(Convert.ToInt32(isZhuhuodaofu)) + " where yundan_chaifen_id in ('" + string.Join("','", cfidArr) + @"')";
                dbc.ExecuteNonQuery(sql);

                //2.算出主拆分单主货到付总额
                if (isZhuhuodaofu == 1 && zcfidArr.Count > 0)
                {
                    sql = @"select * from dbo.yundan_yundan where yundan_id in(
                        select distinct yundan_id from yundan_chaifen where yundan_chaifen_id in('" + string.Join(",", zcfidArr) + @"')
                    )";
                    DataTable yundanDt = dbc.ExecuteDataTable(sql);
                    foreach (DataRow dr in yundanDt.Rows)
                    {
                        if (dr["moneyDaofu"] != DBNull.Value)
                        {
                            dfzje += Convert.ToDecimal(dr["moneyDaofu"]);
                        }
                    }

                }


                return dfzje;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    /// <summary>
    /// 修改收货网点（到达站）
    /// </summary>
    /// <param name="shwd"></param>
    /// <param name="xzkclist"></param>
    /// <returns></returns>
    [CSMethod("SaveSHWD")]
    public object SaveSHWD(string shwd, JSReader xzkclist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (!string.IsNullOrEmpty(shwd))
                {
                    if (xzkclist.ToArray().Length > 0)
                    {
                        for (int i = 0; i < xzkclist.ToArray().Length; i++)
                        {
                            string str = "select yundan_id from yundan_chaifen where yundan_chaifen_id='" + xzkclist[i]["yundan_chaifen_id"].ToString() + "'";
                            DataTable yddt = dbc.ExecuteDataTable(str);

                            if (yddt.Rows.Count > 0)
                            {
                                DataTable cfdt = dbc.GetEmptyDataTable("yundan_yundan");
                                DataTableTracker cfdtt = new DataTableTracker(cfdt);
                                DataRow cfdr = cfdt.NewRow();
                                cfdr["yundan_id"] = yddt.Rows[0]["yundan_id"];
                                cfdr["toOfficeId"] = shwd;
                                cfdt.Rows.Add(cfdr);
                                dbc.UpdateTable(cfdt, cfdtt);
                            }
                        }
                    }
                }
                else
                {
                    throw new Exception("请选择收货网点！");
                }

                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    /// <summary>
    /// 添加运单到装车单里
    /// </summary>
    /// <param name="zcdid"></param>
    /// <param name="xzkclist"></param>
    /// <returns></returns>
    [CSMethod("AddZCD")]
    public decimal AddZCD(string zcdid, JSReader xzkclist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                decimal sumDf = 0m;
                if (!string.IsNullOrEmpty(zcdid))
                {
                    //锁表验证
                    string checkSql = "select * from caiwu_income where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and isLock=1 and zhuangchedanId=" + dbc.ToSqlValue(zcdid);
                    DataTable checkInDt = dbc.ExecuteDataTable(checkSql);
                    checkSql = "select * from caiwu_expense where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and isLock=1 and zhuangchedanId=" + dbc.ToSqlValue(zcdid);
                    DataTable checkOutDt = dbc.ExecuteDataTable(checkSql);
                    if (checkInDt.Rows.Count > 0 || checkOutDt.Rows.Count > 0)
                    {
                        throw new Exception("当前装车单已进入财物日记账被锁定，不允许编辑保存。");
                    }

                    //计算主货到付的金额
                    List<string> zcfidArr = new List<string>();//需要到付的运单（拆分单）
                    for (int i = 0; i < xzkclist.ToArray().Length; i++)
                    {
                        if (Convert.ToInt32(xzkclist[i]["isZhuhuodaofu"].ToString()) == 1 && Convert.ToInt32(xzkclist[i]["is_leaf"].ToString()) == 0)
                        {
                            zcfidArr.Add(xzkclist[i]["yundan_chaifen_id"].ToString());
                        }
                    }
                    if (zcfidArr.Count > 0)
                    {
                        string sql = @"select isnull(sum(moneyDaofu),0) sumDf from dbo.yundan_yundan where yundan_id in(
                                    select distinct yundan_id from dbo.yundan_chaifen where yundan_chaifen_id in('" + string.Join("','", zcfidArr) + @"')
                                )";
                        sumDf = Convert.ToDecimal(dbc.ExecuteScalar(sql));
                    }

                    if (xzkclist.ToArray().Length > 0)
                    {
                        for (int i = 0; i < xzkclist.ToArray().Length; i++)
                        {
                            string sql = "update yundan_chaifen set zhuangchedan_id=" + dbc.ToSqlValue(zcdid) + ",isPeiSong=1 where yundan_chaifen_id=" + dbc.ToSqlValue(xzkclist[i]["yundan_chaifen_id"].ToString());
                            dbc.ExecuteNonQuery(sql);
                        }
                    }
                    return sumDf;
                }
                else
                {
                    throw new Exception("请先保存装车单！");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion

    [CSMethod("DeleteZCD")]
    public object DeleteZCD(string zcdid, JSReader[] xzypslist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (!string.IsNullOrEmpty(zcdid))
                {
                    DataTable cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataTableTracker cfdtt = new DataTableTracker(cfdt);
                    if (xzypslist.Length > 0)
                    {
                        for (int i = 0; i < xzypslist.Length; i++)
                        {
                            DataRow cfdr = cfdt.NewRow();
                            cfdr["yundan_chaifen_id"] = xzypslist[i]["yundan_chaifen_id"].ToString(); ;
                            cfdr["zhuangchedan_id"] = DBNull.Value;
                            cfdr["isPeiSong"] = 0;
                            cfdt.Rows.Add(cfdr);
                        }
                    }
                    dbc.UpdateTable(cfdt, cfdtt);

                }
                else
                {
                    throw new Exception("请先保存装车单！");
                }

                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    /// <summary>
    /// 是否到站
    /// </summary>
    /// <param name="zcdid"></param>
    /// <returns></returns>
    [CSMethod("UpdateIsArrive")]
    public object UpdateIsArrive(string zcdid, int type)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (!string.IsNullOrEmpty(zcdid))
                {
                    string sql = "update zhuangchedan_zhuangchedan set isArrive=" + type + " where zhuangchedan_id=" + dbc.ToSqlValue(zcdid);
                    dbc.ExecuteNonQuery(sql);
                }
                else
                {
                    throw new Exception("无效的装车单！");
                }

                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("IsArrive")]
    public bool IsArrive(string zcdid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = "select * from zhuangchedan_zhuangchedan where isArrive=1 and zhuangchedan_id=" + dbc.ToSqlValue(zcdid);
            DataTable dt = dbc.ExecuteDataTable(sql);
            if (dt.Rows.Count > 0)
            {
                return true;
            }
            return false;
        }
    }

    #region 拆分运单
    [CSMethod("GetYDNum")]
    public object GetYDNum(string cfid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select * from yundan_chaifen where yundan_chaifen_id=" + dbc.ToSqlValue(cfid);
                DataTable cfdt = dbc.ExecuteDataTable(str);
                string ydid = cfdt.Rows[0]["yundan_id"].ToString();
                string isleaf = cfdt.Rows[0]["is_leaf"].ToString();
                string oldyundanNum = "";
                string newyundanNum = "";
                str = " select yundanNum from yundan_yundan where yundan_id=" + dbc.ToSqlValue(ydid);
                DataTable yddt = dbc.ExecuteDataTable(str);

                if (yddt.Rows.Count > 0)
                {
                    oldyundanNum = yddt.Rows[0]["yundanNum"].ToString();

                    str = "select * from yundan_chaifen where status=0 and chaifen_statue=1 and is_leaf=1 and yundan_id=" + dbc.ToSqlValue(ydid) + " order by addtime desc";
                    DataTable cfDt = dbc.ExecuteDataTable(str);
                    if (cfDt.Rows.Count > 0)
                    {
                        newyundanNum = oldyundanNum + "_" + (Convert.ToInt32(cfDt.Rows[0]["yundan_chaifen_number"].ToString().Split('_')[1]) + 1);
                    }
                    else
                    {
                        newyundanNum = oldyundanNum + "_1";
                    }
                }
                else
                {
                    throw new Exception("该运单无效！");
                }

                return new { oldyundanNum = oldyundanNum, newyundanNum = newyundanNum, ydid = ydid, isleaf = isleaf };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }


    [CSMethod("GetHPByYD2")]
    public DataTable GetHPByYD2(string cfid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sql = @"select SP_ID,yundan_goodsName,yundan_goodsPack,sum(yundan_goodsAmount) yundan_goodsAmount,sum(yundan_goodsWeight)yundan_goodsWeight,sum(yundan_goodsVolume) yundan_goodsVolume from dbo.yundan_goods
                    where status=0 and yundan_chaifen_id=" + dbc.ToSqlValue(cfid) + @"
                    group by yundan_goodsName,yundan_goodsPack,SP_ID";
                DataTable G_dt = dbc.ExecuteDataTable(sql);

                return G_dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    public DataTable GetHPByYD(string ydid, string ydnum)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select * from yundan_goods where yundan_chaifen_id in 
                (select yundan_chaifen_id from yundan_chaifen where status=0 and yundan_id=@yundan_id and yundan_chaifen_number=@yundan_chaifen_number ) and status=0 order by addtime desc";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@yundan_id", ydid);
                cmd.Parameters.Add("@yundan_chaifen_number", ydnum);
                DataTable dt = dbc.ExecuteDataTable(cmd);

                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("SaveCF2")]
    public object SaveCF2(string ydid, string cfid, string oldyundanNum, string newyundanNum, JSReader[] hplist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string checkStr = "select * from yundan_chaifen where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and yundan_chaifen_number=" + dbc.ToSqlValue(newyundanNum);
                DataTable checkDt = dbc.ExecuteDataTable(checkStr);
                if (checkDt.Rows.Count > 0)
                {
                    throw new Exception("拆分单已存在，请重新拆分。");
                }

                dbc.BeginTransaction();
                //新建拆分单
                string cf_yundan_chaifen_id = Guid.NewGuid().ToString();
                DataTable cf_cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                DataRow cf_cfdr = cf_cfdt.NewRow();
                cf_cfdr["yundan_chaifen_id"] = cf_yundan_chaifen_id;
                cf_cfdr["yundan_id"] = ydid;
                //cfdr["zhuangchedan_id"]
                cf_cfdr["chaifen_statue"] = 1;
                cf_cfdr["yundan_chaifen_number"] = newyundanNum;
                cf_cfdr["is_leaf"] = 1;   //是否末级（0：否；1：是；）
                cf_cfdr["status"] = 0;
                cf_cfdr["addtime"] = DateTime.Now;
                cf_cfdr["adduser"] = SystemUser.CurrentUser.UserID;
                cf_cfdr["isDache"] = 0;
                cf_cfdr["isZhuhuodaofu"] = 0;
                cf_cfdr["isPeiSong"] = 0;
                cf_cfdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                cf_cfdt.Rows.Add(cf_cfdr);
                dbc.InsertTable(cf_cfdt);

                //新建货品
                DataTable cf_hpdt = dbc.GetEmptyDataTable("yundan_goods");
                if (hplist.Length > 0)
                {
                    for (int i = 0; i < hplist.Length; i++)
                    {
                        DataRow cf_hpdr = cf_hpdt.NewRow();
                        cf_hpdr["yundan_goods_id"] = Guid.NewGuid().ToString();
                        cf_hpdr["yundan_chaifen_id"] = cf_yundan_chaifen_id;
                        cf_hpdr["yundan_goodsName"] = hplist[i]["yundan_goodsName"].ToString();
                        cf_hpdr["yundan_goodsPack"] = hplist[i]["yundan_goodsPack"].ToString();
                        if (hplist[i]["yundan_goodsAmount"] != null && hplist[i]["yundan_goodsAmount"].ToString() != "")
                        {
                            cf_hpdr["yundan_goodsAmount"] = Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                        }
                        else { cf_hpdr["yundan_goodsAmount"] = 0; }
                        if (hplist[i]["yundan_goodsWeight"] != null && hplist[i]["yundan_goodsWeight"].ToString() != "")
                        {
                            cf_hpdr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[i]["yundan_goodsWeight"].ToString());
                        }
                        if (hplist[i]["yundan_goodsVolume"] != null && hplist[i]["yundan_goodsVolume"].ToString() != "")
                        {
                            cf_hpdr["yundan_goodsVolume"] = Convert.ToDecimal(hplist[i]["yundan_goodsVolume"].ToString());
                        }
                        cf_hpdr["status"] = 0;
                        cf_hpdr["addtime"] = DateTime.Now;
                        cf_hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                        cf_hpdr["SP_ID"] = hplist[i]["SP_ID"].ToString();
                        cf_hpdt.Rows.Add(cf_hpdr);
                    }
                }
                dbc.InsertTable(cf_hpdt);

                ////更新根拆分状态
                //string sql = "update dbo.yundan_chaifen set chaifen_statue=1 where yundan_id=" + dbc.ToSqlValue(ydid) + " and is_leaf=0";
                //dbc.ExecuteNonQuery(sql);

                //更新非根拆分单商品
                if (hplist.Length > 0)
                {
                    string sql = @"select * from yundan_goods
                where status=0 and yundan_chaifen_id =" + dbc.ToSqlValue(cfid);
                    DataTable dt = dbc.ExecuteDataTable(sql);

                    DataTable goodsdt = dbc.GetEmptyDataTable("yundan_goods");
                    DataTableTracker goodsdtt = new DataTableTracker(goodsdt);
                    foreach (DataRow dr in dt.Rows)
                    {
                        string spid = dr["SP_ID"].ToString();

                        for (int i = 0; i < hplist.Length; i++)
                        {
                            if (hplist[i]["SP_ID"] == spid)
                            {
                                int amount = dr["yundan_goodsAmount"] != DBNull.Value ? Convert.ToInt32(dr["yundan_goodsAmount"].ToString()) : 0;
                                decimal weight = dr["yundan_goodsWeight"] != DBNull.Value ? Convert.ToDecimal(dr["yundan_goodsWeight"].ToString()) : 0m;
                                decimal volume = dr["yundan_goodsVolume"] != DBNull.Value ? Convert.ToDecimal(dr["yundan_goodsVolume"].ToString()) : 0m;


                                DataRow newDr = goodsdt.NewRow();
                                newDr["yundan_goods_id"] = dr["yundan_goods_id"];
                                newDr["yundan_chaifen_id"] = dr["yundan_chaifen_id"];
                                newDr["yundan_goodsName"] = dr["yundan_goodsName"];
                                newDr["yundan_goodsPack"] = dr["yundan_goodsPack"];

                                if (hplist[i]["yundan_goodsAmount"] != null && hplist[i]["yundan_goodsAmount"].ToString() != "")
                                {
                                    newDr["yundan_goodsAmount"] = amount - Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                                }
                                if (hplist[i]["yundan_goodsWeight"] != null && hplist[i]["yundan_goodsWeight"].ToString() != "")
                                {
                                    newDr["yundan_goodsWeight"] = weight - Convert.ToDecimal(hplist[i]["yundan_goodsWeight"].ToString());
                                }
                                if (hplist[i]["yundan_goodsVolume"] != null && hplist[i]["yundan_goodsVolume"].ToString() != "")
                                {
                                    newDr["yundan_goodsVolume"] = volume - Convert.ToDecimal(hplist[i]["yundan_goodsVolume"].ToString());
                                }
                                newDr["status"] = dr["status"];
                                newDr["addtime"] = dr["addtime"];
                                newDr["adduser"] = dr["adduser"];
                                newDr["SP_ID"] = spid;
                                goodsdt.Rows.Add(newDr);
                            }
                        }

                    }
                    dbc.UpdateTable(goodsdt, goodsdtt);


                }
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw;
            }
        }
    }

    [CSMethod("SaveCF")]
    public object SaveCF(string cfid, string newyundanNum, JSReader[] hplist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();

                string str = @"select a.*,b.yundanNum from yundan_chaifen a left join yundan_yundan b on a.yundan_id=b.yundan_id
                            where a.yundan_chaifen_id=" + dbc.ToSqlValue(cfid);
                DataTable dt1 = dbc.ExecuteDataTable(str);

                string ydid = dt1.Rows[0]["yundan_id"].ToString();
                string oldyundanNum = dt1.Rows[0]["yundanNum"].ToString();

                str = "select * from yundan_chaifen where status=0 and  yundan_id=" + dbc.ToSqlValue(ydid) + " and yundan_chaifen_number='" + oldyundanNum + "'";
                DataTable cfdt = dbc.ExecuteDataTable(str);
                //未拆
                if (Convert.ToInt32(cfdt.Rows[0]["chaifen_statue"].ToString()) == 0)
                {
                    DataTable kcdt = GetHPByYD(ydid, oldyundanNum);

                    #region 剩余
                    DataTable sydt = dbc.GetEmptyDataTable("yundan_goods");

                    for (int i = 0; i < kcdt.Rows.Count; i++)
                    {
                        int n = 1;
                        for (int j = 0; j < hplist.Length; j++)
                        {
                            if (kcdt.Rows[i]["yundan_goods_id"].ToString() == hplist[j]["yundan_goods_id"].ToString())
                            {
                                DataRow dr = sydt.NewRow();
                                dr["yundan_goods_id"] = hplist[j]["yundan_goods_id"].ToString();
                                dr["yundan_chaifen_id"] = hplist[j]["yundan_chaifen_id"].ToString();
                                dr["yundan_goodsName"] = hplist[j]["yundan_goodsName"].ToString();
                                dr["yundan_goodsPack"] = hplist[j]["yundan_goodsPack"].ToString();
                                dr["yundan_goodsAmount"] = Convert.ToInt32(kcdt.Rows[i]["yundan_goodsAmount"]) - Convert.ToInt32(hplist[j]["yundan_goodsAmount"].ToString());
                                if (hplist[j]["yundan_goodsWeight"] != null && hplist[j]["yundan_goodsWeight"].ToString() != "")
                                {
                                    dr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[j]["yundan_goodsWeight"].ToString());
                                }
                                if (hplist[j]["yundan_goodsVolume"] != null && hplist[j]["yundan_goodsVolume"].ToString() != "")
                                {
                                    dr["yundan_goodsVolume"] = Convert.ToDecimal(hplist[j]["yundan_goodsVolume"].ToString());
                                }
                                dr["status"] = hplist[j]["status"].ToString();
                                dr["addtime"] = hplist[j]["addtime"].ToString();
                                dr["adduser"] = hplist[j]["adduser"].ToString();
                                sydt.Rows.Add(dr);
                                n--;
                            }
                        }
                        if (n > 0)
                        {
                            DataRow dr = sydt.NewRow();
                            dr["yundan_goods_id"] = Guid.NewGuid().ToString();
                            dr["yundan_chaifen_id"] = kcdt.Rows[i]["yundan_chaifen_id"];
                            dr["yundan_goodsName"] = kcdt.Rows[i]["yundan_goodsName"];
                            dr["yundan_goodsPack"] = kcdt.Rows[i]["yundan_goodsPack"];
                            dr["yundan_goodsAmount"] = kcdt.Rows[i]["yundan_goodsAmount"];
                            if (kcdt.Rows[i]["yundan_goodsWeight"] != null && kcdt.Rows[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                dr["yundan_goodsWeight"] = Convert.ToDecimal(kcdt.Rows[i]["yundan_goodsWeight"]);
                            }
                            if (kcdt.Rows[i]["yundan_goodsVolume"] != null && kcdt.Rows[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                dr["yundan_goodsVolume"] = Convert.ToDecimal(kcdt.Rows[i]["yundan_goodsVolume"]);
                            }
                            dr["status"] = kcdt.Rows[i]["status"];
                            dr["addtime"] = kcdt.Rows[i]["addtime"];
                            dr["adduser"] = kcdt.Rows[i]["adduser"];
                            sydt.Rows.Add(dr);
                        }
                    }

                    //拆分表
                    string sy_yundan_chaifen_id = Guid.NewGuid().ToString();
                    DataTable sy_cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataRow sy_cfdr = sy_cfdt.NewRow();
                    sy_cfdr["yundan_chaifen_id"] = sy_yundan_chaifen_id;
                    sy_cfdr["yundan_id"] = ydid;
                    //cfdr["zhuangchedan_id"]
                    sy_cfdr["chaifen_statue"] = 0;
                    sy_cfdr["yundan_chaifen_number"] = oldyundanNum + "_1";
                    sy_cfdr["is_leaf"] = 1;   //是否末级（0：否；1：是；）
                    sy_cfdr["status"] = 0;
                    sy_cfdr["addtime"] = DateTime.Now;
                    sy_cfdr["adduser"] = SystemUser.CurrentUser.UserID;
                    sy_cfdr["isDache"] = 0;
                    sy_cfdr["isZhuhuodaofu"] = 0;
                    sy_cfdr["isPeiSong"] = 0;
                    sy_cfdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    sy_cfdt.Rows.Add(sy_cfdr);
                    dbc.InsertTable(sy_cfdt);

                    //货品表
                    DataTable sy_hpdt = dbc.GetEmptyDataTable("yundan_goods");
                    for (int i = 0; i < sydt.Rows.Count; i++)
                    {
                        if (Convert.ToInt32(sydt.Rows[i]["yundan_goodsAmount"]) > 0)
                        {
                            DataRow sy_hpdr = sy_hpdt.NewRow();
                            sy_hpdr["yundan_goods_id"] = Guid.NewGuid().ToString();
                            sy_hpdr["yundan_chaifen_id"] = sy_yundan_chaifen_id;
                            sy_hpdr["yundan_goodsName"] = sydt.Rows[i]["yundan_goodsName"].ToString();
                            sy_hpdr["yundan_goodsPack"] = sydt.Rows[i]["yundan_goodsPack"].ToString();
                            sy_hpdr["yundan_goodsAmount"] = sydt.Rows[i]["yundan_goodsAmount"].ToString();
                            if (sydt.Rows[i]["yundan_goodsWeight"] != null && sydt.Rows[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                sy_hpdr["yundan_goodsWeight"] = Convert.ToDecimal(sydt.Rows[i]["yundan_goodsWeight"].ToString());
                            }
                            if (sydt.Rows[i]["yundan_goodsVolume"] != null && sydt.Rows[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                sy_hpdr["yundan_goodsVolume"] = Convert.ToDecimal(sydt.Rows[i]["yundan_goodsVolume"].ToString());
                            }
                            sy_hpdr["status"] = 0;
                            sy_hpdr["addtime"] = DateTime.Now;
                            sy_hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                            sy_hpdt.Rows.Add(sy_hpdr);
                        }
                    }
                    dbc.InsertTable(sy_hpdt);
                    #endregion

                    #region 拆分
                    string cf_yundan_chaifen_id = Guid.NewGuid().ToString();
                    DataTable cf_cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataRow cf_cfdr = cf_cfdt.NewRow();
                    cf_cfdr["yundan_chaifen_id"] = cf_yundan_chaifen_id;
                    cf_cfdr["yundan_id"] = ydid;
                    //cfdr["zhuangchedan_id"]
                    cf_cfdr["chaifen_statue"] = 0;
                    cf_cfdr["yundan_chaifen_number"] = newyundanNum;
                    cf_cfdr["is_leaf"] = 1;   //是否末级（0：否；1：是；）
                    cf_cfdr["status"] = 0;
                    cf_cfdr["addtime"] = DateTime.Now;
                    cf_cfdr["adduser"] = SystemUser.CurrentUser.UserID;
                    cf_cfdr["isDache"] = 0;
                    cf_cfdr["isZhuhuodaofu"] = 0;
                    cf_cfdr["isPeiSong"] = 0;
                    cf_cfdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    cf_cfdt.Rows.Add(cf_cfdr);
                    dbc.InsertTable(cf_cfdt);

                    //货品表
                    DataTable cf_hpdt = dbc.GetEmptyDataTable("yundan_goods");
                    if (hplist.Length > 0)
                    {
                        for (int i = 0; i < hplist.Length; i++)
                        {
                            DataRow cf_hpdr = cf_hpdt.NewRow();
                            cf_hpdr["yundan_goods_id"] = Guid.NewGuid().ToString();
                            cf_hpdr["yundan_chaifen_id"] = cf_yundan_chaifen_id;
                            cf_hpdr["yundan_goodsName"] = hplist[i]["yundan_goodsName"].ToString();
                            cf_hpdr["yundan_goodsPack"] = hplist[i]["yundan_goodsPack"].ToString();
                            if (hplist[i]["yundan_goodsAmount"] != null && hplist[i]["yundan_goodsAmount"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsAmount"] = Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                            }
                            else { cf_hpdr["yundan_goodsAmount"] = 0; }
                            if (hplist[i]["yundan_goodsWeight"] != null && hplist[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[i]["yundan_goodsWeight"].ToString());
                            }
                            if (hplist[i]["yundan_goodsVolume"] != null && hplist[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsVolume"] = Convert.ToDecimal(hplist[i]["yundan_goodsVolume"].ToString());
                            }
                            cf_hpdr["status"] = 0;
                            cf_hpdr["addtime"] = DateTime.Now;
                            cf_hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                            cf_hpdt.Rows.Add(cf_hpdr);
                        }
                    }
                    dbc.InsertTable(cf_hpdt);

                    #endregion

                    #region 更新主记录
                    //拆分表
                    DataTable zcfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataTableTracker zcfdtt = new DataTableTracker(zcfdt);
                    DataRow zcfdr = zcfdt.NewRow();
                    zcfdr["yundan_chaifen_id"] = cfdt.Rows[0]["yundan_chaifen_id"];
                    zcfdr["chaifen_statue"] = 1;
                    zcfdr["is_leaf"] = 0;   //是否末级（0：否；1：是；）
                    zcfdt.Rows.Add(zcfdr);
                    dbc.UpdateTable(zcfdt, zcfdtt);
                    #endregion
                }
                else
                {
                    string sql = @"select * from yundan_goods where status=0 and yundan_chaifen_id=" + dbc.ToSqlValue(cfid) + " order by addtime desc";
                    DataTable kcdt = dbc.ExecuteDataTable(sql);

                    #region 剩余
                    DataTable sydt = dbc.GetEmptyDataTable("yundan_goods");

                    for (int i = 0; i < kcdt.Rows.Count; i++)
                    {
                        int n = 1;
                        for (int j = 0; j < hplist.Length; j++)
                        {
                            if (kcdt.Rows[i]["yundan_goods_id"].ToString() == hplist[j]["yundan_goods_id"].ToString())
                            {
                                DataRow dr = sydt.NewRow();
                                dr["yundan_goods_id"] = hplist[j]["yundan_goods_id"].ToString();
                                dr["yundan_chaifen_id"] = hplist[j]["yundan_chaifen_id"].ToString();
                                dr["yundan_goodsName"] = hplist[j]["yundan_goodsName"].ToString();
                                dr["yundan_goodsPack"] = hplist[j]["yundan_goodsPack"].ToString();
                                dr["yundan_goodsAmount"] = Convert.ToInt32(kcdt.Rows[i]["yundan_goodsAmount"]) - Convert.ToInt32(hplist[j]["yundan_goodsAmount"].ToString());
                                if (hplist[j]["yundan_goodsWeight"] != null && hplist[j]["yundan_goodsWeight"].ToString() != "")
                                {
                                    dr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[j]["yundan_goodsWeight"].ToString());
                                }
                                if (hplist[j]["yundan_goodsVolume"] != null && hplist[j]["yundan_goodsVolume"].ToString() != "")
                                {
                                    dr["yundan_goodsVolume"] = Convert.ToDecimal(hplist[j]["yundan_goodsVolume"].ToString());
                                }
                                dr["status"] = hplist[j]["status"].ToString();
                                dr["addtime"] = hplist[j]["addtime"].ToString();
                                dr["adduser"] = hplist[j]["adduser"].ToString();
                                sydt.Rows.Add(dr);
                                n--;
                            }
                        }
                        if (n > 0)
                        {
                            DataRow dr = sydt.NewRow();
                            dr["yundan_goods_id"] = kcdt.Rows[i]["yundan_goods_id"];
                            dr["yundan_chaifen_id"] = kcdt.Rows[i]["yundan_chaifen_id"];
                            dr["yundan_goodsName"] = kcdt.Rows[i]["yundan_goodsName"];
                            dr["yundan_goodsPack"] = kcdt.Rows[i]["yundan_goodsPack"];
                            dr["yundan_goodsAmount"] = kcdt.Rows[i]["yundan_goodsAmount"];
                            if (kcdt.Rows[i]["yundan_goodsWeight"] != null && kcdt.Rows[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                dr["yundan_goodsWeight"] = Convert.ToDecimal(kcdt.Rows[i]["yundan_goodsWeight"]);
                            }
                            if (kcdt.Rows[i]["yundan_goodsVolume"] != null && kcdt.Rows[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                dr["yundan_goodsVolume"] = Convert.ToDecimal(kcdt.Rows[i]["yundan_goodsVolume"]);
                            }
                            dr["status"] = kcdt.Rows[i]["status"];
                            dr["addtime"] = kcdt.Rows[i]["addtime"];
                            dr["adduser"] = kcdt.Rows[i]["adduser"];
                            sydt.Rows.Add(dr);
                        }
                    }

                    string sy_yundan_chaifen_id = cfid;

                    //货品表
                    DataTable sy_hpdt = dbc.GetEmptyDataTable("yundan_goods");
                    DataTableTracker sy_hpdtt = new DataTableTracker(sy_hpdt);
                    for (int i = 0; i < sydt.Rows.Count; i++)
                    {
                        if (Convert.ToInt32(sydt.Rows[i]["yundan_goodsAmount"]) > 0)
                        {

                            DataRow sy_hpdr = sy_hpdt.NewRow();
                            sy_hpdr["yundan_goods_id"] = sydt.Rows[i]["yundan_goods_id"].ToString();
                            sy_hpdr["yundan_goodsAmount"] = sydt.Rows[i]["yundan_goodsAmount"].ToString();
                            sy_hpdt.Rows.Add(sy_hpdr);
                        }
                        else
                        {
                            DataRow sy_hpdr = sy_hpdt.NewRow();
                            sy_hpdr["yundan_goods_id"] = sydt.Rows[i]["yundan_goods_id"].ToString();
                            sy_hpdr["status"] = 1;
                            sy_hpdt.Rows.Add(sy_hpdr);
                        }
                    }
                    dbc.UpdateTable(sy_hpdt, sy_hpdtt);
                    #endregion

                    #region 拆分
                    string cf_yundan_chaifen_id = Guid.NewGuid().ToString();
                    DataTable cf_cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataRow cf_cfdr = cf_cfdt.NewRow();
                    cf_cfdr["yundan_chaifen_id"] = cf_yundan_chaifen_id;
                    cf_cfdr["yundan_id"] = ydid;
                    //cfdr["zhuangchedan_id"]
                    cf_cfdr["chaifen_statue"] = 0;
                    cf_cfdr["yundan_chaifen_number"] = newyundanNum;
                    cf_cfdr["is_leaf"] = 1;   //是否末级（0：否；1：是；）
                    cf_cfdr["status"] = 0;
                    cf_cfdr["addtime"] = DateTime.Now;
                    cf_cfdr["adduser"] = SystemUser.CurrentUser.UserID;
                    cf_cfdr["isDache"] = 0;
                    cf_cfdr["isZhuhuodaofu"] = 0;
                    cf_cfdr["isPeiSong"] = 0;
                    cf_cfdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    cf_cfdt.Rows.Add(cf_cfdr);
                    dbc.InsertTable(cf_cfdt);

                    //货品表
                    DataTable cf_hpdt = dbc.GetEmptyDataTable("yundan_goods");
                    if (hplist.Length > 0)
                    {
                        for (int i = 0; i < hplist.Length; i++)
                        {
                            DataRow cf_hpdr = cf_hpdt.NewRow();
                            cf_hpdr["yundan_goods_id"] = Guid.NewGuid().ToString();
                            cf_hpdr["yundan_chaifen_id"] = cf_yundan_chaifen_id;
                            cf_hpdr["yundan_goodsName"] = hplist[i]["yundan_goodsName"].ToString();
                            cf_hpdr["yundan_goodsPack"] = hplist[i]["yundan_goodsPack"].ToString();
                            if (hplist[i]["yundan_goodsAmount"] != null && hplist[i]["yundan_goodsAmount"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsAmount"] = Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                            }
                            else { cf_hpdr["yundan_goodsAmount"] = 0; }
                            if (hplist[i]["yundan_goodsWeight"] != null && hplist[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[i]["yundan_goodsWeight"].ToString());
                            }
                            if (hplist[i]["yundan_goodsVolume"] != null && hplist[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsVolume"] = Convert.ToDecimal(hplist[i]["yundan_goodsVolume"].ToString());
                            }
                            cf_hpdr["status"] = 0;
                            cf_hpdr["addtime"] = DateTime.Now;
                            cf_hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                            cf_hpdt.Rows.Add(cf_hpdr);
                        }
                    }
                    dbc.InsertTable(cf_hpdt);

                    #endregion
                }

                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }


    #endregion

    [CSMethod("GetKCYDToFile", 2)]
    public byte[] GetKCYDToFile(int k, JSReader xzkclist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                Workbook workbook = new Workbook(); //工作簿
                Worksheet sheet = workbook.Worksheets[0]; //工作表
                Cells cells = sheet.Cells;//单元格

                //为标题设置样式  
                Style styleTitle = workbook.Styles[workbook.Styles.Add()];
                styleTitle.HorizontalAlignment = TextAlignmentType.Center;//文字居中
                styleTitle.Font.Name = "宋体";//文字字体
                styleTitle.Font.Size = 18;//文字大小
                styleTitle.Font.IsBold = true;//粗体

                //样式2
                Style style2 = workbook.Styles[workbook.Styles.Add()];
                style2.HorizontalAlignment = TextAlignmentType.Left;//文字居中
                style2.Font.Name = "宋体";//文字字体
                style2.Font.Size = 14;//文字大小
                style2.Font.IsBold = true;//粗体
                style2.IsTextWrapped = true;//单元格内容自动换行
                style2.Borders[BorderType.LeftBorder].LineStyle = CellBorderType.Thin; //应用边界线 左边界线
                style2.Borders[BorderType.RightBorder].LineStyle = CellBorderType.Thin; //应用边界线 右边界线
                style2.Borders[BorderType.TopBorder].LineStyle = CellBorderType.Thin; //应用边界线 上边界线
                style2.Borders[BorderType.BottomBorder].LineStyle = CellBorderType.Thin; //应用边界线 下边界线
                style2.IsLocked = true;

                //样式3
                Style style4 = workbook.Styles[workbook.Styles.Add()];
                style4.HorizontalAlignment = TextAlignmentType.Left;//文字居中
                style4.Font.Name = "宋体";//文字字体
                style4.Font.Size = 11;//文字大小
                style4.Borders[BorderType.LeftBorder].LineStyle = CellBorderType.Thin;
                style4.Borders[BorderType.RightBorder].LineStyle = CellBorderType.Thin;
                style4.Borders[BorderType.TopBorder].LineStyle = CellBorderType.Thin;
                style4.Borders[BorderType.BottomBorder].LineStyle = CellBorderType.Thin;

                #region 表头
                cells.SetRowHeight(0, 20);
                cells[0, 0].PutValue("导出库存运单");
                cells[0, 0].SetStyle(styleTitle);
                cells.Merge(0, 0, 1, 17);
                //运单号 大车送	送货方式	到达站	收货地址	制单日期	起始站	收货网点	发货人	发货人电话	收货人	收货电话	结算方式	代收	回单/收条	回单张数	备注
                cells.SetRowHeight(1, 20);
                cells[1, 0].PutValue("运单号");
                cells[1, 0].SetStyle(style2);
                cells.SetColumnWidth(0, 20);
                cells[1, 1].PutValue("大车送");
                cells[1, 1].SetStyle(style2);
                cells.SetColumnWidth(1, 20);
                cells[1, 2].PutValue("送货方式");
                cells[1, 2].SetStyle(style2);
                cells.SetColumnWidth(2, 20);
                cells[1, 3].PutValue("到达站");
                cells[1, 3].SetStyle(style2);
                cells.SetColumnWidth(3, 20);
                cells[1, 4].PutValue("收货地址");
                cells[1, 4].SetStyle(style2);
                cells.SetColumnWidth(4, 20);
                cells[1, 5].PutValue("制单日期");
                cells[1, 5].SetStyle(style2);
                cells.SetColumnWidth(5, 20);
                cells[1, 6].PutValue("起始站");
                cells[1, 6].SetStyle(style2);
                cells.SetColumnWidth(6, 20);
                cells[1, 7].PutValue("收货网点");
                cells[1, 7].SetStyle(style2);
                cells.SetColumnWidth(7, 20);
                cells[1, 8].PutValue("发货人");
                cells[1, 8].SetStyle(style2);
                cells.SetColumnWidth(8, 20);
                cells[1, 9].PutValue("发货人电话");
                cells[1, 9].SetStyle(style2);
                cells.SetColumnWidth(9, 20);
                cells[1, 10].PutValue("收货人");
                cells[1, 10].SetStyle(style2);
                cells.SetColumnWidth(10, 20);
                cells[1, 11].PutValue("收货电话");
                cells[1, 11].SetStyle(style2);
                cells.SetColumnWidth(11, 20);
                cells[1, 12].PutValue("结算方式");
                cells[1, 12].SetStyle(style2);
                cells.SetColumnWidth(12, 20);
                cells[1, 13].PutValue("代收");
                cells[1, 13].SetStyle(style2);
                cells.SetColumnWidth(13, 20);
                cells[1, 14].PutValue("回单/收条");
                cells[1, 14].SetStyle(style2);
                cells.SetColumnWidth(14, 20);
                cells[1, 15].PutValue("回单张数");
                cells[1, 15].SetStyle(style2);
                cells.SetColumnWidth(15, 20);
                cells[1, 16].PutValue("备注");
                cells[1, 16].SetStyle(style2);
                cells.SetColumnWidth(16, 20);
                #endregion

                double dshj = 0;

                if (xzkclist.ToArray().Length > 0)
                {
                    for (int i = 0; i < xzkclist.ToArray().Length; i++)
                    {
                        #region 判空
                        string yundan_chaifen_number = "";
                        if (xzkclist[i]["yundan_chaifen_number"] != null && xzkclist[i]["yundan_chaifen_number"].ToString() != "")
                        {
                            yundan_chaifen_number = xzkclist[i]["yundan_chaifen_number"].ToString();
                        }
                        string isDaChe = "";
                        if (xzkclist[i]["isDache"] != null && xzkclist[i]["isDache"].ToString() != "")
                        {
                            if (Convert.ToInt32(xzkclist[i]["isDache"].ToString()) == 0)
                            {
                                isDaChe = "否";
                            }
                            else
                            {
                                isDaChe = "是";
                            }
                        }
                        var songhuoType = "";
                        if (xzkclist[i]["songhuoType"] != null && xzkclist[i]["songhuoType"].ToString() != "")
                        {
                            if (Convert.ToInt32(xzkclist[i]["songhuoType"].ToString()) == 0)
                            {
                                songhuoType = "自提";
                            }
                            else
                            {
                                songhuoType = "送货";
                            }
                        }
                        string shouhuoAddress = "";
                        if (xzkclist[i]["shouhuoAddress"] != null && xzkclist[i]["shouhuoAddress"].ToString() != "")
                        {
                            shouhuoAddress = xzkclist[i]["shouhuoAddress"].ToString();
                        }
                        string yundanDate = "";
                        if (xzkclist[i]["yundanDate"] != null && xzkclist[i]["yundanDate"].ToString() != "")
                        {
                            yundanDate = Convert.ToDateTime(xzkclist[i]["yundanDate"].ToString()).ToString("yyyy-MM-dd");
                        }
                        string officeName = "";
                        if (xzkclist[i]["officeName"] != null && xzkclist[i]["officeName"].ToString() != "")
                        {
                            officeName = xzkclist[i]["officeName"].ToString();
                        }
                        string toOfficeName = "";
                        if (xzkclist[i]["toOfficeName"] != null && xzkclist[i]["toOfficeName"].ToString() != "")
                        {
                            toOfficeName = xzkclist[i]["toOfficeName"].ToString();
                        }
                        string fahuoPeople = "";
                        if (xzkclist[i]["fahuoPeople"] != null && xzkclist[i]["fahuoPeople"].ToString() != "")
                        {
                            fahuoPeople = xzkclist[i]["fahuoPeople"].ToString();
                        }
                        string fahuoTel = "";
                        if (xzkclist[i]["fahuoTel"] != null && xzkclist[i]["fahuoTel"].ToString() != "")
                        {
                            fahuoTel = xzkclist[i]["fahuoTel"].ToString();
                        }
                        string shouhuoPeople = "";
                        if (xzkclist[i]["shouhuoPeople"] != null && xzkclist[i]["shouhuoPeople"].ToString() != "")
                        {
                            shouhuoPeople = xzkclist[i]["shouhuoPeople"].ToString();
                        }
                        string shouhuoTel = "";
                        if (xzkclist[i]["shouhuoTel"] != null && xzkclist[i]["shouhuoTel"].ToString() != "")
                        {
                            shouhuoTel = xzkclist[i]["shouhuoTel"].ToString();
                        }
                        var payType = "";
                        if (xzkclist[i]["payType"] != null && xzkclist[i]["payType"].ToString() != "")
                        {

                            if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 11)
                            {
                                payType = "现金";
                            }
                            else if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 1)
                            {
                                payType = "欠付";
                            }
                            else if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 2)
                            {
                                payType = "到付";
                            }
                            else if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 3)
                            {
                                payType = "回单付";
                            }
                            else if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 4)
                            {
                                payType = "现付+欠付";
                            }
                            else if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 5)
                            {
                                payType = "现付+到付";
                            }
                            else if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 6)
                            {
                                payType = "到付+欠付";
                            }
                            else if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 7)
                            {
                                payType = "现付+回单付";
                            }
                            else if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 8)
                            {
                                payType = "欠付+回单付";
                            }
                            else if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 9)
                            {
                                payType = "到付+回单付";
                            }
                            else if (Convert.ToInt32(xzkclist[i]["payType"].ToString()) == 10)
                            {
                                payType = "现付+到付+欠付";
                            }
                        }
                        string moneyDaishou = "";
                        if (xzkclist[i]["moneyDaishou"] != null && xzkclist[i]["moneyDaishou"].ToString() != "")
                        {
                            moneyDaishou = xzkclist[i]["moneyDaishou"].ToString();
                            dshj = dshj + Convert.ToDouble(xzkclist[i]["moneyDaishou"].ToString());
                        }
                        string huidanType = "";
                        if (xzkclist[i]["huidanType"] != null & xzkclist[i]["huidanType"].ToString() != "")
                        {
                            if (Convert.ToInt32(xzkclist[i]["huidanType"].ToString()) == 0)
                            {
                                huidanType = "回单";
                            }
                            else
                            {
                                huidanType = "收条";
                            }
                        }
                        string cntHuidan = "";
                        if (xzkclist[i]["cntHuidan"] != null && xzkclist[i]["cntHuidan"].ToString() != "")
                        {
                            cntHuidan = xzkclist[i]["cntHuidan"].ToString();
                        }
                        string memo = "";
                        if (xzkclist[i]["memo"] != null && xzkclist[i]["memo"].ToString() != "")
                        {
                            memo = xzkclist[i]["memo"].ToString();
                        }
                        #endregion
                        cells[i + 2, 0].PutValue(yundan_chaifen_number);
                        cells[i + 2, 0].SetStyle(style4);
                        cells[i + 2, 1].PutValue(isDaChe);
                        cells[i + 2, 1].SetStyle(style4);
                        cells[i + 2, 2].PutValue(songhuoType);
                        cells[i + 2, 2].SetStyle(style4);
                        cells[i + 2, 3].PutValue(toOfficeName);
                        cells[i + 2, 3].SetStyle(style4);
                        cells[i + 2, 4].PutValue(shouhuoAddress);
                        cells[i + 2, 4].SetStyle(style4);
                        cells[i + 2, 5].PutValue(yundanDate);
                        cells[i + 2, 5].SetStyle(style4);
                        cells[i + 2, 6].PutValue(officeName);
                        cells[i + 2, 6].SetStyle(style4);
                        cells[i + 2, 7].PutValue(toOfficeName);
                        cells[i + 2, 7].SetStyle(style4);
                        cells[i + 2, 8].PutValue(fahuoPeople);
                        cells[i + 2, 8].SetStyle(style4);
                        cells[i + 2, 9].PutValue(fahuoTel);
                        cells[i + 2, 9].SetStyle(style4);
                        cells[i + 2, 10].PutValue(shouhuoPeople);
                        cells[i + 2, 10].SetStyle(style4);
                        cells[i + 2, 11].PutValue(shouhuoTel);
                        cells[i + 2, 11].SetStyle(style4);
                        cells[i + 2, 12].PutValue(payType);
                        cells[i + 2, 12].SetStyle(style4);
                        cells[i + 2, 13].PutValue(moneyDaishou);
                        cells[i + 2, 13].SetStyle(style4);
                        cells[i + 2, 14].PutValue(huidanType);
                        cells[i + 2, 14].SetStyle(style4);
                        cells[i + 2, 15].PutValue(cntHuidan);
                        cells[i + 2, 15].SetStyle(style4);
                        cells[i + 2, 16].PutValue(memo);
                        cells[i + 2, 16].SetStyle(style4);
                    }
                }
                cells[xzkclist.ToArray().Length + 2, 0].PutValue("合计");
                cells[xzkclist.ToArray().Length + 2, 13].PutValue(dshj);


                for (int i = 0; i < 17; i++)
                {
                    cells[xzkclist.ToArray().Length + 2, i].SetStyle(style4);
                }


                MemoryStream ms = workbook.SaveToStream();
                byte[] bt = ms.ToArray();
                return bt;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }

    [CSMethod("PrintZCD")]
    public object PrintZCD(string zcdid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select * from zhuangchedan_zhuangchedan where zhuangchedan_id=" + dbc.ToSqlValue(zcdid);
            DataTable dt = dbc.ExecuteDataTable(sql);

            string html = SmartFramework4v2.Web.Common.SmartTemplate.RenderTemplate(HttpContext.Current.Server.MapPath("~/JS/ZCDGL/zhuangcherdan.cshtml"), new { dt = dt });

            return new { html = html };
        }
    }

    public DataTable PrintZcdBase(string zcdid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sql = @"select b.carNum,b.people,b.tel,a.* from zhuangchedan_zhuangchedan a
left join jichu_driver b on a.driverId=b.driverId
where zhuangchedan_id=" + dbc.ToSqlValue(zcdid);
                DataTable dt = dbc.ExecuteDataTable(sql);

                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    public DataTable PrintZcdLine(string zcdid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sql = @"select b.*,
case b.huidanType
when 0 then '回单'
when 1 then '收条'
else '' end as huidanTypeName,
case b.songhuoType
when 0 then '自提'
when 1 then '送货'
else '' end as songhuoTypeName,
case a.isDache
when 0 then '否'
when 1 then '是'
else '' end as isDacheName
from yundan_chaifen a
left join yundan_yundan b on a.yundan_id=b.yundan_id
where a.status=0 and a.zhuangchedan_id=" + dbc.ToSqlValue(zcdid) + " order by b.yundanDate asc";
                DataTable lineDt = dbc.ExecuteDataTable(sql);
                return lineDt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetAddredd")]
    public object GetAddredd()
    {
        int port = HttpContext.Current.Request.Url.Port;

        string url = HttpContext.Current.Request.Url.Host;
        return "http://" + url + ":" + port;
    }

    public DataTable PrintZhuangcheQindan(string[] jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                List<string> cfidArr = new List<string>();
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    cfidArr.Add(jsr.ToArray()[i].ToString());
                }

                string sql = @"select b.*,
case b.huidanType
when 0 then '回单'
when 1 then '收条'
else '' end as huidanTypeName,
case b.songhuoType
when 0 then '自提'
when 1 then '送货'
else '' end as songhuoTypeName,
case a.isDache
when 0 then '否'
when 1 then '是'
else '' end as isDacheName
from yundan_chaifen a
left join yundan_yundan b on a.yundan_id=b.yundan_id
where a.status=0 and a.yundan_chaifen_id in('" + string.Join("','", cfidArr) + "') order by b.yundanDate asc";
                DataTable lineDt = dbc.ExecuteDataTable(sql);
                return lineDt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("DownLoadYundan", 2)]
    public byte[] DownLoadYundan(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                List<string> idList = new List<string>();
                var idArray = jsr.ToArray();
                foreach (var id in idArray)
                {
                    idList.Add(id.ToString());
                }
                string sql = @"select a.isDache,b.*,c.zhuangchedanNum,d.officeName,e.officeName toOfficeName from yundan_chaifen a
left join yundan_yundan b on a.yundan_id=b.yundan_id
left join zhuangchedan_zhuangchedan c on a.zhuangchedan_id=c.zhuangchedan_id
left join jichu_office d on b.officeId=d.officeId
left join jichu_office e on b.toOfficeId=e.officeId
where a.status=0 and a.yundan_id in ('" + string.Join("','", idList) + "') and a.is_leaf=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID);
                DataTable dt = dbc.ExecuteDataTable(sql);

                Aspose.Cells.Workbook workbook = new Aspose.Cells.Workbook(); //工作簿
                Aspose.Cells.Worksheet sheet = workbook.Worksheets[0]; //工作表

                Aspose.Cells.Cells cells = sheet.Cells;//单元格
                #region 设置样式
                //样式1
                Aspose.Cells.Style style1 = workbook.Styles[workbook.Styles.Add()];//新增样式    
                style1.HorizontalAlignment = TextAlignmentType.Center;//文字居中
                style1.Font.Name = "宋体";//文字字体
                style1.Font.Size = 16;//文字大小
                style1.IsTextWrapped = true;//单元格内容自动换行
                style1.Font.IsBold = true;//粗体
                style1.Borders[Aspose.Cells.BorderType.LeftBorder].LineStyle = CellBorderType.Thin;
                style1.Borders[Aspose.Cells.BorderType.RightBorder].LineStyle = CellBorderType.Thin;
                style1.Borders[Aspose.Cells.BorderType.TopBorder].LineStyle = CellBorderType.Thin;
                style1.Borders[Aspose.Cells.BorderType.BottomBorder].LineStyle = CellBorderType.Thin;

                //样式2
                Aspose.Cells.Style style2 = workbook.Styles[workbook.Styles.Add()];//新增样式    
                style2.HorizontalAlignment = TextAlignmentType.Left;//文字居左
                style2.Font.Name = "宋体";//文字字体
                style2.Font.Size = 10;//文字大小
                style2.IsTextWrapped = true;//单元格内容自动换行
                style2.Font.IsBold = true;//粗体
                style2.Borders[Aspose.Cells.BorderType.LeftBorder].LineStyle = CellBorderType.Thin;
                style2.Borders[Aspose.Cells.BorderType.RightBorder].LineStyle = CellBorderType.Thin;
                style2.Borders[Aspose.Cells.BorderType.TopBorder].LineStyle = CellBorderType.Thin;
                style2.Borders[Aspose.Cells.BorderType.BottomBorder].LineStyle = CellBorderType.Thin;

                //样式3
                Aspose.Cells.Style style3 = workbook.Styles[workbook.Styles.Add()];//新增样式    
                style3.HorizontalAlignment = TextAlignmentType.Left;//文字居左
                style3.Font.Name = "宋体";//文字字体
                style3.Font.Size = 10;//文字大小
                style3.IsTextWrapped = true;//单元格内容自动换行
                style3.Font.IsBold = false;//粗体
                style3.Borders[Aspose.Cells.BorderType.LeftBorder].LineStyle = CellBorderType.Thin;
                style3.Borders[Aspose.Cells.BorderType.RightBorder].LineStyle = CellBorderType.Thin;
                style3.Borders[Aspose.Cells.BorderType.TopBorder].LineStyle = CellBorderType.Thin;
                style3.Borders[Aspose.Cells.BorderType.BottomBorder].LineStyle = CellBorderType.Thin;
                #endregion

                //cells.Merge(0, 0, 1, maxcolnum);
                CellPutValue(cells, "导出运单", 0, 0, 1, 30, style1);
                cells.SetRowHeight(0, 25.5);
                CellPutValue(cells, "运单号", 1, 0, 1, 1, style2);
                CellPutValue(cells, "货品", 1, 1, 1, 1, style2);
                CellPutValue(cells, "包装", 1, 2, 1, 1, style2);
                CellPutValue(cells, "件数", 1, 3, 1, 1, style2);
                CellPutValue(cells, "重量", 1, 4, 1, 1, style2);
                CellPutValue(cells, "体积", 1, 5, 1, 1, style2);
                CellPutValue(cells, "大车送", 1, 6, 1, 1, style2);
                CellPutValue(cells, "送货方式", 1, 7, 1, 1, style2);
                CellPutValue(cells, "到达站", 1, 8, 1, 1, style2);
                CellPutValue(cells, "收货地址", 1, 9, 1, 1, style2);
                CellPutValue(cells, "制单日期", 1, 10, 1, 1, style2);
                CellPutValue(cells, "起始站", 1, 11, 1, 1, style2);
                CellPutValue(cells, "收货网点", 1, 12, 1, 1, style2);
                CellPutValue(cells, "发货人", 1, 13, 1, 1, style2);
                CellPutValue(cells, "发货人电话", 1, 14, 1, 1, style2);
                CellPutValue(cells, "收货人", 1, 15, 1, 1, style2);
                CellPutValue(cells, "收货电话", 1, 16, 1, 1, style2);
                CellPutValue(cells, "结算方式", 1, 17, 1, 1, style2);
                CellPutValue(cells, "代收", 1, 18, 1, 1, style2);
                CellPutValue(cells, "回单/收条", 1, 19, 1, 1, style2);
                CellPutValue(cells, "回单张数", 1, 20, 1, 1, style2);
                CellPutValue(cells, "备注", 1, 21, 1, 1, style2);


                var temp2 = 2;  //数据从第三行开始填充
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    var yundanDate = dt.Rows[i]["yundanDate"] == DBNull.Value ? "" : Convert.ToDateTime(dt.Rows[i]["yundanDate"]).ToString("yyyy-MM-dd");
                    var yundanNum = dt.Rows[i]["yundanNum"] == DBNull.Value ? "" : dt.Rows[i]["yundanNum"].ToString();
                    var zhuangcheanNum = dt.Rows[i]["zhuangchedanNum"] == DBNull.Value ? "" : dt.Rows[i]["zhuangchedanNum"].ToString();
                    var officeName = dt.Rows[i]["officeName"] == DBNull.Value ? "" : dt.Rows[i]["officeName"].ToString();
                    var toOfficeName = dt.Rows[i]["toOfficeName"] == DBNull.Value ? "" : dt.Rows[i]["toOfficeName"].ToString();
                    var toAddress = dt.Rows[i]["toAddress"] == DBNull.Value ? "" : dt.Rows[i]["toAddress"].ToString();
                    var goodsName = dt.Rows[i]["goodsName"] == DBNull.Value ? "" : dt.Rows[i]["goodsName"].ToString();
                    var pack = dt.Rows[i]["pack"] == DBNull.Value ? "" : dt.Rows[i]["pack"].ToString();
                    var goodsAmount = dt.Rows[i]["goodsAmount"] == DBNull.Value ? "" : dt.Rows[i]["goodsAmount"].ToString();
                    var goodsWeight = dt.Rows[i]["goodsWeight"] == DBNull.Value ? "" : dt.Rows[i]["goodsWeight"].ToString();
                    var goodsVolume = dt.Rows[i]["goodsVolume"] == DBNull.Value ? "" : dt.Rows[i]["goodsVolume"].ToString();
                    var fahuoPeople = dt.Rows[i]["fahuoPeople"] == DBNull.Value ? "" : dt.Rows[i]["fahuoPeople"].ToString();
                    var fahuoTel = dt.Rows[i]["fahuoTel"] == DBNull.Value ? "" : dt.Rows[i]["fahuoTel"].ToString();
                    var shouhuoPeople = dt.Rows[i]["shouhuoPeople"] == DBNull.Value ? "" : dt.Rows[i]["shouhuoPeople"].ToString();
                    var shouhuoTel = dt.Rows[i]["shouhuoTel"] == DBNull.Value ? "" : dt.Rows[i]["shouhuoTel"].ToString();
                    var shouhuoAddress = dt.Rows[i]["shouhuoAddress"] == DBNull.Value ? "" : dt.Rows[i]["shouhuoAddress"].ToString();
                    var songhuoType = "";//
                    if (!string.IsNullOrEmpty(dt.Rows[i]["songhuoType"].ToString()))
                    {
                        if (dt.Rows[i]["songhuoType"].ToString() == "0")
                        {
                            songhuoType = "自提";
                        }
                        else if (dt.Rows[i]["songhuoType"].ToString() == "1")
                        {
                            songhuoType = "送货";
                        }
                    }
                    var moneyYunfei = dt.Rows[i]["moneyYunfei"] == DBNull.Value ? "0.00" : Convert.ToDecimal(dt.Rows[i]["moneyYunfei"]).ToString("N2");
                    var payType = "";//
                    if (!string.IsNullOrEmpty(dt.Rows[i]["payType"].ToString()))
                    {
                        switch (dt.Rows[i]["payType"].ToString())
                        {
                            case "1":
                                payType = "欠付";
                                break;
                            case "2":
                                payType = "到付";
                                break;
                            case "3":
                                payType = "回单付";
                                break;
                            case "4":
                                payType = "现付+欠付";
                                break;
                            case "5":
                                payType = "现付+到付";
                                break;
                            case "6":
                                payType = "到付+欠付";
                                break;
                            case "7":
                                payType = "现付+回单付";
                                break;
                            case "8":
                                payType = "欠付+回单付";
                                break;
                            case "9":
                                payType = "到付+回单付";
                                break;
                            case "10":
                                payType = "现付+到付+欠付";
                                break;
                            case "11":
                                payType = "现金";
                                break;
                        }
                    }
                    var moneyXianfu = dt.Rows[i]["moneyXianfu"] == DBNull.Value ? "0.00" : Convert.ToDecimal(dt.Rows[i]["moneyXianfu"]).ToString("N2");
                    var moneyDaofu = dt.Rows[i]["moneyDaofu"] == DBNull.Value ? "0.00" : Convert.ToDecimal(dt.Rows[i]["moneyDaofu"]).ToString("N2");
                    var moneyQianfu = dt.Rows[i]["moneyQianfu"] == DBNull.Value ? "0.00" : Convert.ToDecimal(dt.Rows[i]["moneyQianfu"]).ToString("N2");
                    var moneyHuidanfu = dt.Rows[i]["moneyHuidanfu"] == DBNull.Value ? "0.00" : Convert.ToDecimal(dt.Rows[i]["moneyHuidanfu"]).ToString("N2");
                    var isHuikouXF = dt.Rows[i]["isHuikouXF"] == DBNull.Value ? "" : dt.Rows[i]["isHuikouXF"].ToString();//
                    if (!string.IsNullOrEmpty(dt.Rows[i]["isHuikouXF"].ToString()))
                    {
                        if (dt.Rows[i]["isHuikouXF"].ToString() == "1")
                        {
                            isHuikouXF = dt.Rows[i]["moneyHuikouXianFan"] == DBNull.Value ? "0.00" : Convert.ToDecimal(dt.Rows[i]["moneyHuikouXianFan"]).ToString("N2");
                        }
                        else
                        {
                            isHuikouXF = dt.Rows[i]["moneyHuikouQianFan"] == DBNull.Value ? "0.00" : Convert.ToDecimal(dt.Rows[i]["moneyHuikouQianFan"]).ToString("N2");
                        }
                    }
                    var zhidanRen = dt.Rows[i]["zhidanRen"] == DBNull.Value ? "" : dt.Rows[i]["zhidanRen"].ToString();
                    var moneyDaishou = dt.Rows[i]["moneyDaishou"] == DBNull.Value ? "0.00" : Convert.ToDecimal(dt.Rows[i]["moneyDaishou"]).ToString("N2");
                    var moneyDaishouShouxu = dt.Rows[i]["moneyDaishouShouxu"] == DBNull.Value ? "0.00" : Convert.ToDecimal(dt.Rows[i]["moneyDaishouShouxu"]).ToString("N2");
                    var huidanType = "";//
                    if (!string.IsNullOrEmpty(dt.Rows[i]["huidanType"].ToString()))
                    {
                        if (dt.Rows[i]["huidanType"].ToString() == "0")
                        {
                            huidanType = "回单";
                        }
                        else
                        {
                            huidanType = "收条";
                        }
                    }
                    var cntHuidan = dt.Rows[i]["cntHuidan"] == DBNull.Value ? "" : dt.Rows[i]["cntHuidan"].ToString();
                    var memo = dt.Rows[i]["memo"] == DBNull.Value ? "" : dt.Rows[i]["memo"].ToString();
                    var isDache = "";//
                    if (!string.IsNullOrEmpty(dt.Rows[i]["isDache"].ToString()))
                    {
                        if (dt.Rows[i]["isDache"].ToString() == "0")
                        {
                            huidanType = "否";
                        }
                        else
                        {
                            huidanType = "是";
                        }
                    }
                    CellPutValue(cells, yundanNum, i + temp2, 0, 1, 1, style3);
                    CellPutValue(cells, goodsName, i + temp2, 1, 1, 1, style3);
                    CellPutValue(cells, pack, i + temp2, 2, 1, 1, style3);
                    CellPutValue(cells, goodsAmount, i + temp2, 3, 1, 1, style3);
                    CellPutValue(cells, goodsWeight, i + temp2, 4, 1, 1, style3);
                    CellPutValue(cells, goodsVolume, i + temp2, 5, 1, 1, style3);
                    CellPutValue(cells, isDache, i + temp2, 6, 1, 1, style3);
                    CellPutValue(cells, songhuoType, i + temp2, 7, 1, 1, style3);
                    CellPutValue(cells, toAddress, i + temp2, 8, 1, 1, style3);
                    CellPutValue(cells, shouhuoAddress, i + temp2, 9, 1, 1, style3);
                    CellPutValue(cells, yundanDate, i + temp2, 10, 1, 1, style3);
                    CellPutValue(cells, officeName, i + temp2, 11, 1, 1, style3);
                    CellPutValue(cells, toOfficeName, i + temp2, 12, 1, 1, style3);
                    CellPutValue(cells, fahuoPeople, i + temp2, 13, 1, 1, style3);
                    CellPutValue(cells, fahuoTel, i + temp2, 14, 1, 1, style3);
                    CellPutValue(cells, shouhuoPeople, i + temp2, 15, 1, 1, style3);
                    CellPutValue(cells, shouhuoTel, i + temp2, 16, 1, 1, style3);
                    CellPutValue(cells, payType, i + temp2, 17, 1, 1, style3);
                    CellPutValue(cells, moneyDaishou, i + temp2, 18, 1, 1, style3);
                    CellPutValue(cells, huidanType, i + temp2, 19, 1, 1, style3);
                    CellPutValue(cells, cntHuidan, i + temp2, 20, 1, 1, style3);
                    CellPutValue(cells, memo, i + temp2, 21, 1, 1, style3);
                }
                System.IO.MemoryStream ms = workbook.SaveToStream();
                byte[] bt = ms.ToArray();
                return bt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    #region aspose Cell设置单元格格式 合并
    /// <summary>
    /// aspose Cell设置单元格格式 合并
    /// </summary>
    /// <param name="cells"></param>
    /// <param name="text">单元格内容</param>
    /// <param name="row">行下标</param>
    /// <param name="cell">列下标</param>
    /// <param name="merRow">要合并的行数</param>
    /// <param name="merCell">要合并的列数</param>
    /// <param name="style"></param>
    public void CellPutValue(Cells cells, string text, int row, int cell, int merRow, int merCell, Style style)
    {
        cells[row, cell].PutValue(text);
        cells[row, cell].SetStyle(style);
        cells.Merge(row, cell, merRow, merCell);
        if (merRow > 1)
        {
            for (int i = 1; i < merRow; i++)
            {
                cells[row + i, cell].SetStyle(style);
            }
        }
        if (merCell > 1)
        {
            for (int i = 1; i < merCell; i++)
            {
                cells[row, cell + i].SetStyle(style);
            }
        }
    }

    public void CellPutValue2(Cells cells, string text, int row, int cell, int merRow, int merCell, Style style, int width)
    {
        cells[row, cell].PutValue(text);
        cells[row, cell].SetStyle(style);
        cells.SetColumnWidth(cell, width);
        cells.Merge(row, cell, merRow, merCell);
        if (merRow > 1)
        {
            for (int i = 1; i < merRow; i++)
            {
                cells[row + i, cell].SetStyle(style);
            }
        }
        if (merCell > 1)
        {
            for (int i = 1; i < merCell; i++)
            {
                cells[row, cell + i].SetStyle(style);
            }
        }
    }
    #endregion
}
