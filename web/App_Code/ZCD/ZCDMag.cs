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
    [CSMethod("GetZCDList")]
    public object GetZCDList(int pagnum, int pagesize, string zcdh,string sj,string pz)
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
                                  where a.status=0 " + where + @"  and a.companyId='"+SystemUser.CurrentUser.CompanyID+@"'
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
                string str = @" select distinct c.officeId,c.officeName from jichu_xianlu2user a 
                                  left join jichu_xianlu b on a.traderId=b.traderId
                                  left join jichu_office c on b.fromOfficeId=c.officeId
                                  where a.userId='" + SystemUser.CurrentUser.UserID + "' and b.companyId='" + SystemUser.CurrentUser.CompanyID + @"'
                                  and b.status=0  and c.status=0";
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
                string str = @" select distinct c.officeId,c.officeName from jichu_xianlu2user a 
                                  left join jichu_xianlu b on a.traderId=b.traderId
                                  left join jichu_office c on b.toOfficeId=c.officeId
                                  where a.userId='" + SystemUser.CurrentUser.UserID + "' and b.companyId='" + SystemUser.CurrentUser.CompanyID + @"'
                                  and b.status=0  and c.status=0";
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
                string str = "  select driverId,people,tel,carNum from jichu_driver where  status=0 and companyId='" + SystemUser.CurrentUser.CompanyID + @"' order by people";
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


    /// <summary>
    /// 库存运单List
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetKCYDList")]
    public object GetKCYDList(int pagnum, int pagesize, string fromOfficeId,string toOfficeId,string kssj,string jssj,string keyword)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string where = "";
                if (!string.IsNullOrEmpty(fromOfficeId.Trim()))
                {
                    where += " and " + dbc.C_EQ("b.officeId", fromOfficeId);
                }
                if (!string.IsNullOrEmpty(toOfficeId.Trim()))
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
                    where += " and "+dbc.C_Like("b.fahuoPeople",keyword,LikeStyle.LeftAndRightLike); 
                }
                string str = @" select a.*,b.*,c.officeName,d.officeName as toOfficeName,e.zhuangchedanNum from yundan_chaifen a left join yundan_yundan b
                                on a.yundan_id=b.yundan_id
                                left join jichu_office c on b.officeId=c.officeId
                                left join jichu_office d on b.toOfficeId=d.officeId
                                left join zhuangchedan_zhuangchedan e on a.zhuangchedan_id=e.zhuangchedan_id
                                 where a.is_leaf=1 and a.zhuangchedan_id is null  and b.status=0 " + where + "and  a.companyId='" + SystemUser.CurrentUser.CompanyID + @"' order by e.zhuangchedanNum asc";
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


    [CSMethod("GetHPList")]
    public object GetHPList(int pagnum, int pagesize, string cfid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string str = @"select * from yundan_goods where status=0 and yundan_chaifen_id='"+cfid+"' order by addtime desc";
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


    [CSMethod("SaveZCD")]
    public object SaveZCD(string zcdid, JSReader jsr, JSReader[] xzkclist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (string.IsNullOrEmpty(zcdid))
                {
                    zcdid = Guid.NewGuid().ToString();

                    //装车单表
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

                    if (jsr["moneyTotal"] != null && jsr["moneyTotal"].ToString() != "")
                    {
                        zcdr["moneyTotal"] = Convert.ToDecimal(jsr["moneyTotal"].ToString());
                    }
                    else { zcdr["moneyTotal"] = 0; }
                    if (jsr["moneyYunfeiYifu"] != null && jsr["moneyYunfeiYifu"].ToString() != "")
                    {
                        zcdr["moneyYunfeiYifu"] = Convert.ToDecimal(jsr["moneyYunfeiYifu"].ToString());
                    }
                    else { zcdr["moneyYunfeiYifu"] = 0; }
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
                    zcdr["isOverYufuHexiao"] = 0;
                    zcdr["isOverQianfuHexiao"] = 0;
                    zcdr["isOverDaofuHexiao"] = 0;
                    zcdr["isOverYajinHexiao"] = 0;
                    zcdr["isOverZhuhuoDaofuHexiao"] = 0;
                    zcdr["isYajinKouliu"] = 0;
                    zcdr["isArrive"] = 0;
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


                    //拆分表
                    DataTable cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataTableTracker cfdtt = new DataTableTracker(cfdt);
                    if (xzkclist.Length > 0)
                    {
                        for (int i = 0; i < xzkclist.Length; i++)
                        {
                            DataRow cfdr = cfdt.NewRow();
                            cfdr["yundan_chaifen_id"] = xzkclist[i]["yundan_chaifen_id"].ToString();
                            cfdr["zhuangchedan_id"] = zcdid;
                            cfdr["isPeiSong"] = 1;
                            cfdt.Rows.Add(cfdr);
                        }
                    }
                    dbc.UpdateTable(cfdt, cfdtt);
                }
                else
                { //编辑

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
                    dbc.UpdateTable(zcdt, zcdtt);

                    DataTable cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataTableTracker cfdtt = new DataTableTracker(cfdt);
                    if (xzkclist.Length > 0)
                    {
                        for (int i = 0; i < xzkclist.Length; i++)
                        {
                            DataRow cfdr = cfdt.NewRow();
                            cfdr["yundan_chaifen_id"] = xzkclist[i]["yundan_chaifen_id"].ToString(); ;
                            cfdr["zhuangchedan_id"] = zcdid;
                            cfdr["isPeiSong"] = 1;
                            cfdt.Rows.Add(cfdr);
                        }
                    }
                    dbc.UpdateTable(cfdt, cfdtt);
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

    [CSMethod("GetYPSYD")]
    public object GetYPSYD(int pagnum, int pagesize, string zcdid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string str = @"select a.*,b.*,c.officeName,d.officeName as toOfficeName,e.zhuangchedanNum from yundan_chaifen a left join yundan_yundan b
                                on a.yundan_id=b.yundan_id
                                left join jichu_office c on b.officeId=c.officeId
                                left join jichu_office d on b.officeId=d.officeId
                                left join zhuangchedan_zhuangchedan e on a.zhuangchedan_id=e.zhuangchedan_id
                                where a.zhuangchedan_id='" + zcdid + "'  and b.status=0  and a.companyId='"+SystemUser.CurrentUser.CompanyID+"' order by e.zhuangchedanNum asc";
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

    [CSMethod("SaveDCS")]
    public object SaveDCS(string isdcs, JSReader[] xzkclist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (!string.IsNullOrEmpty(isdcs))
                {
                    DataTable cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataTableTracker cfdtt = new DataTableTracker(cfdt);
                    if (xzkclist.Length > 0)
                    {
                        for (int i = 0; i < xzkclist.Length; i++)
                        {
                            DataRow cfdr = cfdt.NewRow();
                            cfdr["yundan_chaifen_id"] = xzkclist[i]["yundan_chaifen_id"].ToString();
                            cfdr["isDache"] = Convert.ToInt32(isdcs);
                            cfdt.Rows.Add(cfdr);
                        }
                    }
                    dbc.UpdateTable(cfdt, cfdtt);
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

    [CSMethod("SaveZHDF")]
    public object SaveZHDF(string isZhuhuodaofu, JSReader[] xzkclist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (!string.IsNullOrEmpty(isZhuhuodaofu))
                {
                    DataTable cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataTableTracker cfdtt = new DataTableTracker(cfdt);
                    if (xzkclist.Length > 0)
                    {
                        for (int i = 0; i < xzkclist.Length; i++)
                        {
                            DataRow cfdr = cfdt.NewRow();
                            cfdr["yundan_chaifen_id"] = xzkclist[i]["yundan_chaifen_id"].ToString();
                            cfdr["isZhuhuodaofu"] = Convert.ToInt32(isZhuhuodaofu);
                            cfdt.Rows.Add(cfdr);
                        }
                    }
                    dbc.UpdateTable(cfdt, cfdtt);
                }
                else
                {
                    throw new Exception("请选择是否为主货到付！");
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

    [CSMethod("SaveSHWD")]
    public object SaveSHWD(string shwd, JSReader[] xzkclist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (!string.IsNullOrEmpty(shwd))
                {
                    if (xzkclist.Length > 0)
                    {
                        for (int i = 0; i < xzkclist.Length; i++)
                        {
                            string str = "select yundan_id from yundan_chaifen where yundan_chaifen_id='" + xzkclist[i]["yundan_chaifen_id"].ToString() + "'";
                            DataTable yddt = dbc.ExecuteDataTable(str);

                            if (yddt.Rows.Count > 0)
                            {
                                DataTable cfdt = dbc.GetEmptyDataTable("yundan_yundan");
                                DataTableTracker cfdtt = new DataTableTracker(cfdt);
                                DataRow cfdr = cfdt.NewRow();
                                cfdr["yundan_id"] = yddt.Rows[0]["yundan_id"];
                                cfdr["toOfficeId"] =shwd;
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

    [CSMethod("AddZCD")]
    public object AddZCD(string zcdid, JSReader[] xzkclist)
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
                    if (xzkclist.Length > 0)
                    {
                        for (int i = 0; i < xzkclist.Length; i++)
                        {
                            DataRow cfdr = cfdt.NewRow();
                            cfdr["yundan_chaifen_id"] = xzkclist[i]["yundan_chaifen_id"].ToString(); ;
                            cfdr["zhuangchedan_id"] = zcdid;
                            cfdr["isPeiSong"] = 1;
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

    [CSMethod("IsArrive")]
    public object IsArrive(string zcdid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (!string.IsNullOrEmpty(zcdid))
                {
                    DataTable dt = dbc.GetEmptyDataTable("zhuangchedan_zhuangchedan");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["zhuangchedan_id"] = zcdid;
                    dr["isArrive"] = 1;
                    dt.Rows.Add(dr);
                    dbc.UpdateTable(dt, dtt);
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

    #region 拆分运单

    [CSMethod("GetYDNum")]
    public object GetYDNum(string cfid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string oldyundanNum = "";
                string newyundanNum = "";
                
                string str = @"select a.*,b.yundanNum from yundan_chaifen a left join yundan_yundan b on a.yundan_id=b.yundan_id
                                where a.yundan_chaifen_id=" + dbc.ToSqlValue(cfid);
                DataTable cfdt = dbc.ExecuteDataTable(str);

                oldyundanNum = cfdt.Rows[0]["yundan_chaifen_number"].ToString();

                string sql = "select * from yundan_chaifen where status=0 and  yundan_id='" + cfdt.Rows[0]["yundan_id"].ToString() + "' and yundan_chaifen_number='" + cfdt.Rows[0]["yundanNum"].ToString() + "'";
                DataTable dt1 = dbc.ExecuteDataTable(sql);
                
                //未拆
                if (Convert.ToInt32(dt1.Rows[0]["chaifen_statue"].ToString()) == 0)
                {
                    newyundanNum = cfdt.Rows[0]["yundanNum"].ToString() + "_2";
                }
                else
                {
                    //已拆
                    str = "select yundan_chaifen_number from yundan_chaifen where status=0 and  yundan_id='" + cfdt.Rows[0]["yundan_id"].ToString() + "' order by yundan_chaifen_number desc";
                    DataTable cfdt2 = dbc.ExecuteDataTable(str);

                    if (cfdt2.Rows.Count > 0)
                    {
                        string[] ary = cfdt2.Rows[0][0].ToString().Split('_');
                        int temp = Convert.ToInt32(ary[ary.Length - 1]);
                        newyundanNum = cfdt.Rows[0]["yundanNum"].ToString() + "_" + (temp + 1);
                    }
                    }
              
                return new { oldyundanNum = oldyundanNum, newyundanNum = newyundanNum };
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
                string str = @"select * from yundan_goods where status=0 and yundan_chaifen_id="+dbc.ToSqlValue(cfid)+" order by addtime desc";
                DataTable dt = dbc.ExecuteDataTable(str);

                return dt;
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
                    sy_cfdr["companyId"] =SystemUser.CurrentUser.CompanyID;
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
    public byte[] GetKCYDToFile(int k,JSReader[] xzkclist)
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

                if (xzkclist.Length > 0)
                {
                    for (int i = 0; i < xzkclist.Length; i++)
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
                            yundanDate =Convert.ToDateTime(xzkclist[i]["yundanDate"].ToString()).ToString("yyyy-MM-dd");
                        }
                        string officeName = "";
                        if (xzkclist[i]["officeName"] != null && xzkclist[i]["officeName"].ToString() != "")
                        {
                            officeName =xzkclist[i]["officeName"].ToString();
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
                cells[xzkclist.Length + 2, 0].PutValue("合计");
                cells[xzkclist.Length + 2, 13].PutValue(dshj);
                

                for (int i = 0; i < 17; i++)
                {
                    cells[xzkclist.Length + 2, i].SetStyle(style4);
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
}
