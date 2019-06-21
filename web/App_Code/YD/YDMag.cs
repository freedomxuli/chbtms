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

/// <summary>
///JsMag 的摘要说明
/// </summary>
[CSClass("YDMag")]
public class YDMag
{
    /// <summary>
    /// 运单号规则   当前用户从属办事处officeCodeYYMMDD-编号(暂定三位)
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetYundanNum")]
    public string GetYundanNum()
    {
        using (DBConnection dbc = new DBConnection())
        {
            SystemUser user = SystemUser.CurrentUser;
            //获取当天办事处最新编号
            string sql = "select * from yundan_yundan where status=0 and yundanDate=" + dbc.ToSqlValue(DateTime.Now.ToString("yyyy-MM-dd")) + " and officeId=" + dbc.ToSqlValue(user.CsOfficeId) + " and companyId=" + dbc.ToSqlValue(user.CompanyID) + " order by addtime desc";
            DataTable dt = dbc.ExecuteDataTable(sql);
            if (dt.Rows.Count > 0)
            {
                string lastYundanNum = dt.Rows[0]["yundanNum"].ToString();
                string[] arr = lastYundanNum.Split('-');
                if (arr.Length == 2)
                {
                    string num = arr[1];
                    int count = Convert.ToInt32(num) + 1;
                    num = count.ToString("D3");
                    return arr[0] + "-" + num;
                }
                else
                {
                    throw new Exception("请检查上一单运单号。");
                }
            }
            return user.CsOfficeCode + DateTime.Now.ToString("yyMMdd") + "-" + "001";
        }
    }

    #region 运单
    [CSMethod("GetYDList")]
    public object GetYDList(int pagnum, int pagesize, string keyword)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string where = "";
                if (!string.IsNullOrEmpty(keyword.Trim()))
                {
                    where += " and (" + dbc.C_Like("a.fahuoPeople", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("b.officeName", keyword.Trim(), LikeStyle.LeftAndRightLike) + ")";
                }
                string str = @" select a.*,b.officeName  from yundan_yundan a 
                            left join jichu_office b on a.officeId=b.officeId where a.status=0 " + where
                           + " and yundan_id in (select distinct yundan_id from yundan_chaifen where status=0 and companyId='" + SystemUser.CurrentUser.CompanyID + "')  order by a.addtime desc";
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

    [CSMethod("GetYDList2")]
    public object GetYDList2(int pagnum, int pagesize, JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string where = "";
                List<string> wList = new List<string>();

                string cx_yflx = jsr["cx_yflx"].ToString();
                if (!string.IsNullOrEmpty(cx_yflx))
                {
                    wList.Add("");
                }

                string cx_ddz = jsr["cx_ddz"].ToString();
                if (!string.IsNullOrEmpty(cx_ddz))
                {
                    wList.Add("");
                }

                string cx_beg = jsr["cx_beg"].ToString();
                if (!string.IsNullOrEmpty(cx_beg))
                {
                    wList.Add("");
                }

                string cx_endjsr = jsr["cx_end"].ToString();
                if (!string.IsNullOrEmpty(cx_endjsr))
                {
                    wList.Add("");
                }

                string cx_ydh = jsr["cx_ydh"].ToString();
                if (!string.IsNullOrEmpty(cx_ydh))
                {
                    wList.Add("");
                }

                string cx_zcdh = jsr["cx_zcdh"].ToString();
                if (!string.IsNullOrEmpty(cx_zcdh))
                {
                    wList.Add("");
                }

                string cx_fhr = jsr["cx_fhr"].ToString();
                if (!string.IsNullOrEmpty(cx_fhr))
                {
                    wList.Add("");
                }

                string cx_shr = jsr["cx_shr"].ToString();
                if (!string.IsNullOrEmpty(cx_shr))
                {
                    wList.Add("");
                }

                string cx_shrtel = jsr["cx_shrtel"].ToString();
                if (!string.IsNullOrEmpty(cx_shrtel))
                {
                    wList.Add("");
                }

                string cx_yf = jsr["cx_yf"].ToString();
                if (!string.IsNullOrEmpty(cx_yf))
                {
                    wList.Add("");
                }


                //if (!string.IsNullOrEmpty(keyword.Trim()))
                //{
                //    where += " and (" + dbc.C_Like("a.fahuoPeople", keyword.Trim(), LikeStyle.LeftAndRightLike)
                //          + " or " + dbc.C_Like("b.officeName", keyword.Trim(), LikeStyle.LeftAndRightLike) + ")";
                //}
                string str = @" select a.*,b.officeName  from yundan_yundan a 
                            left join jichu_office b on a.officeId=b.officeId where a.status=0 " + where
                           + " and yundan_id in (select distinct yundan_id from yundan_chaifen where status=0 and companyId='" + SystemUser.CurrentUser.CompanyID + "')  order by a.addtime desc";
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

    [CSMethod("GetYDByID")]
    public object GetYDByID(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select * from yundan_yundan where yundan_id=@yundan_id";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.AddWithValue("@yundan_id", ydid);
                DataTable yddt = dbc.ExecuteDataTable(cmd);
                yddt.Columns.Add("moneyHuikou");
                foreach (DataRow dr in yddt.Rows)
                {
                    if (Convert.ToInt32(dr["isHuikouXF"].ToString()) == 0)
                    {
                        dr["moneyHuikou"] = dr["moneyHuikouQianFan"];
                    }
                    else if (Convert.ToInt32(dr["isHuikouXF"].ToString()) == 1)
                    {
                        dr["moneyHuikou"] = dr["moneyHuikouXianFan"];
                    }
                }

                DataTable hpdt = new DataTable();
                if (yddt.Rows.Count > 0)
                {
                    cmd.Parameters.Clear();
                    str = @"select * from yundan_goods where yundan_chaifen_id in 
                    (select yundan_chaifen_id from yundan_chaifen where status=0 and yundan_id=@yundan_id and is_leaf=0) and status=0 order by addtime desc";
                    cmd = new SqlCommand(str);
                    cmd.Parameters.AddWithValue("@yundan_id", ydid);
                    hpdt = dbc.ExecuteDataTable(cmd);
                }

                str = "select * from yundan_chaifen where is_leaf=0 and status=0 and yundan_id=" + dbc.ToSqlValue(ydid);
                DataTable cfDt = dbc.ExecuteDataTable(str);
                string chaifen_statue = cfDt.Rows[0]["chaifen_statue"].ToString();
                string chaifen_id = cfDt.Rows[0]["yundan_chaifen_id"].ToString();
                return new { yddt = yddt, hpdt = hpdt, cftype = chaifen_statue, zcfid = chaifen_id };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="ydid"></param>
    /// <param name="spid"></param>
    /// <param name="type">1,件数；2，重量；3，体积</param>
    /// <returns></returns>
    [CSMethod("GetHpNum")]
    public object GetHpNum(string ydid, string spid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select * from(
                                select (select COUNT(*) from dbo.yundan_goods b where a.yundan_chaifen_id=b.yundan_chaifen_id and b.SP_ID=" + dbc.ToSqlValue(spid) + @")num from dbo.yundan_chaifen a
                                where yundan_id=" + dbc.ToSqlValue(ydid) + @"
                            )t
                            where  num=1";
            int num = Convert.ToInt32(dbc.ExecuteScalar(sql));
            if (num > 0)
            {
                sql = @"select sum(yundan_goodsAmount) amount,sum(yundan_goodsWeight) weight,sum(yundan_goodsVolume) volume from dbo.yundan_goods 
where SP_ID=" + dbc.ToSqlValue(spid) + " and yundan_chaifen_id in(select yundan_chaifen_id from dbo.yundan_chaifen where is_leaf=1 and yundan_id=" + dbc.ToSqlValue(ydid) + ")";
                DataTable dt = dbc.ExecuteDataTable(sql);
                if (dt.Rows.Count > 0)
                {
                    return new { amount = Convert.ToInt32(dt.Rows[0]["amount"]), weight = Convert.ToDecimal(dt.Rows[0]["weight"]), volume = Convert.ToDecimal(dt.Rows[0]["volume"]) };
                }
            }
            return null;
        }
    }

    [CSMethod("GetGuid")]
    public string GetGuid()
    {
        return Guid.NewGuid().ToString();
    }

    [CSMethod("GetYDQSZ")]
    public DataTable GetYDQSZ()
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

    /// <summary>
    /// 制单人所属办事处
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetYDZDZ")]
    public DataTable GetYDZDZ()
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

    /// <summary>
    /// 制单人
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetZDR")]
    public string GetZDR()
    {
        return SystemUser.CurrentUser.UserName;
    }

    /// <summary>
    /// 获取业务员
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetYWYByQSZ")]
    public DataTable GetYWYByQSZ(string officeid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "  select employId,employName from jichu_employ where officeId=@officeId and status=0 and isFire=1 order by employName";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.AddWithValue("@officeId", officeid);
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
    /// 获取客户信息
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetKH")]
    public DataTable GetKH()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "  select clientId,people,tel,address from jichu_client where  status=0 and companyId='" + SystemUser.CurrentUser.CompanyID + "' order by people";
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
    /// 客户查询
    /// </summary>
    /// <param name="khmc"></param>
    /// <param name="khtel"></param>
    /// <param name="address"></param>
    /// <returns></returns>
    [CSMethod("GetKHCX")]
    public DataTable GetKHCX(string khmc, string khtel, string address)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string where = "";
                if (!string.IsNullOrEmpty(khmc))
                {
                    where += " and " + dbc.C_Like("people", khmc, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(khtel))
                {
                    where += " and " + dbc.C_Like("tel", khtel, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(address))
                {
                    where += " and " + dbc.C_Like("address", address, LikeStyle.LeftAndRightLike);
                }

                string str = "  select clientId,people,tel,address from jichu_client where  status=0 and companyId='" + SystemUser.CurrentUser.CompanyID + "' order by people";
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
    /// 新建客户
    /// </summary>
    /// <param name="khxm"></param>
    /// <param name="khtel"></param>
    /// <param name="khaddress"></param>
    /// <param name="officeId"></param>
    /// <returns></returns>
    [CSMethod("CreateKH")]
    public string CreateKH(string khxm, string khtel, string khaddress, string officeId)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                //新增
                string clientId = Guid.NewGuid().ToString();

                DataTable dt = dbc.GetEmptyDataTable("jichu_client");
                DataRow dr = dt.NewRow();
                dr["clientId"] = new Guid(clientId);
                dr["officeId"] = officeId;
                //dr["peopleCode"] = jsr["peopleCode"];
                dr["people"] = khxm;
                dr["tel"] = khtel;
                dr["address"] = khaddress;
                //dr["compName"] = jsr["compName"];
                dr["status"] = 0;
                dr["addtime"] = DateTime.Now;
                dr["adduser"] = userid;
                dr["updatetime"] = DateTime.Now;
                dr["updateuser"] = userid;
                dr["companyId"] = SystemUser.CurrentUser.CompanyID;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);

                dbc.CommitTransaction();
                return clientId;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    /// <summary>
    /// 保存运单
    /// </summary>
    /// <param name="ydid"></param>
    /// <param name="jsr"></param>
    /// <param name="hplist"></param>
    /// <param name="fahuoRen"></param>
    /// <returns></returns>
    [CSMethod("SaveYD")]
    public object SaveYD(string ydid, JSReader jsr, JSReader[] hplist, string fahuoPeopleName)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (string.IsNullOrEmpty(ydid))
                {
                    ydid = Guid.NewGuid().ToString();

                    //运单号验证
                    string ydbm = jsr["yundanNum"].ToString();
                    string checkSql = "select * from yundan_yundan where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and yundanNum=" + dbc.ToSqlValue(ydbm);
                    DataTable checkDt = dbc.ExecuteDataTable(checkSql);
                    if (checkDt.Rows.Count > 0)
                    {
                        string newBm = GetYundanNum();
                        return new { bo = false, yzType = 1, newBm = newBm };
                    }

                    #region 运单表
                    //货品 临时将货品明细第一条保存到运单表，数量计总数量
                    string hpmc = "";
                    string pack = "";
                    int hpAmount = 0;
                    double hpWeight = 0;
                    double hpVolime = 0;
                    for (int i = 0; i < hplist.Length; i++)
                    {
                        hpmc = hplist[0]["yundan_goodsName"].ToString();
                        pack = hplist[0]["yundan_goodsPack"].ToString();
                        if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsAmount"].ToString()))
                        {
                            hpAmount += Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                        }
                        if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsWeight"]))
                        {
                            hpWeight += Convert.ToDouble(hplist[i]["yundan_goodsWeight"].ToString());
                        }
                        if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsVolume"].ToString()))
                        {
                            hpVolime += Convert.ToDouble(hplist[i]["yundan_goodsVolume"].ToString());
                        }
                    }
                    //运单表
                    DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");

                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = ydid;
                    yddr["officeId"] = jsr["officeId"].ToString();
                    yddr["toOfficeId"] = jsr["toOfficeId"].ToString();
                    yddr["yundanNum"] = jsr["yundanNum"].ToString();
                    yddr["yundanDate"] = Convert.ToDateTime(jsr["yundanDate"].ToString());
                    yddr["realNum"] = jsr["realNum"].ToString();
                    yddr["memo"] = jsr["memo"].ToString();
                    yddr["fenhuoSite"] = jsr["fenhuoSite"].ToString();
                    yddr["traderName"] = jsr["traderName"].ToString();
                    yddr["zhidanRen"] = jsr["zhidanRen"].ToString();

                    yddr["goodsName"] = hpmc;
                    yddr["goodsAmount"] = hpAmount;
                    yddr["goodsWeight"] = hpWeight;
                    yddr["pack"] = pack;
                    yddr["goodsVolume"] = hpVolime;

                    yddr["toAddress"] = jsr["toAddress"].ToString();
                    yddr["shouhuoPeople"] = jsr["shouhuoPeople"].ToString();
                    yddr["shouhuoTel"] = jsr["shouhuoTel"].ToString();
                    yddr["shouhuoAddress"] = jsr["shouhuoAddress"].ToString();
                    yddr["songhuoType"] = Convert.ToInt32(jsr["songhuoType"].ToString());
                    yddr["payType"] = Convert.ToInt32(jsr["payType"].ToString());
                    if (!string.IsNullOrEmpty(jsr["moneyYunfei"].ToString()))
                    {
                        yddr["moneyYunfei"] = Convert.ToDecimal(jsr["moneyYunfei"].ToString());
                    }
                    else
                    {
                        yddr["moneyYunfei"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyXianfu"].ToString()))
                    {
                        yddr["moneyXianfu"] = Convert.ToDecimal(jsr["moneyXianfu"].ToString());
                    }
                    else
                    {
                        yddr["moneyXianfu"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyDaofu"].ToString()))
                    {
                        yddr["moneyDaofu"] = Convert.ToDecimal(jsr["moneyDaofu"].ToString());
                    }
                    else
                    {
                        yddr["moneyDaofu"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyQianfu"].ToString()))
                    {
                        yddr["moneyQianfu"] = Convert.ToDecimal(jsr["moneyQianfu"].ToString());
                    }
                    else
                    {
                        yddr["moneyQianfu"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyHuidanfu"].ToString()))
                    {
                        yddr["moneyHuidanfu"] = Convert.ToDecimal(jsr["moneyHuidanfu"].ToString());
                    }
                    else
                    {
                        yddr["moneyHuidanfu"] = 0.00m;
                    }
                    //回扣现付
                    yddr["isHuikouXF"] = Convert.ToInt32(jsr["isHuikouXF"].ToString());
                    if (!string.IsNullOrEmpty(jsr["moneyHuikou"].ToString()))
                    {
                        if (Convert.ToInt32(jsr["isHuikouXF"].ToString()) == 1)
                        {
                            yddr["moneyHuikouXianFan"] = Convert.ToDecimal(jsr["moneyHuikou"].ToString());
                            yddr["moneyHuikouQianFan"] = 0.00m;
                        }
                        else
                        {
                            yddr["moneyHuikouXianFan"] = 0.00m;
                            yddr["moneyHuikouQianFan"] = Convert.ToDecimal(jsr["moneyHuikou"].ToString());
                        }
                    }
                    else
                    {
                        yddr["moneyHuikouXianFan"] = 0.00m;
                        yddr["moneyHuikouQianFan"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyDaishou"].ToString()))
                    {
                        yddr["moneyDaishou"] = Convert.ToDecimal(jsr["moneyDaishou"].ToString());
                    }
                    else
                    {
                        yddr["moneyDaishou"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyDaishouShouxu"].ToString()))
                    {
                        yddr["moneyDaishouShouxu"] = Convert.ToDecimal(jsr["moneyDaishouShouxu"].ToString());
                    }
                    else
                    {
                        yddr["moneyDaishouShouxu"] = 0.00m;
                    }
                    yddr["huidanType"] = jsr["huidanType"].ToString();
                    if (!string.IsNullOrEmpty(jsr["cntHuidan"].ToString()))
                    {
                        yddr["cntHuidan"] = Convert.ToInt32(jsr["cntHuidan"].ToString());
                    }
                    else
                    {
                        yddr["cntHuidan"] = 0;
                    }
                    yddr["isOverYufuHexiao"] = 0;
                    yddr["isOverQianfuHexiao"] = 0;
                    yddr["isOveDaofuHexiao"] = 0;
                    yddr["isOverHuikouHexiao"] = 0;
                    yddr["isOverDuanboHexiao"] = 0;
                    yddr["isOverSonghuoHexiao"] = 0;
                    yddr["isOverZhongzhuanHexiao"] = 0;
                    yddr["isOverDaishouInHexiao"] = 0;
                    yddr["isOverDaishouOutHexiao"] = 0;
                    yddr["isSign"] = 0;

                    yddr["addtime"] = DateTime.Now;
                    yddr["status"] = 0;
                    yddr["adduser"] = SystemUser.CurrentUser.UserID;
                    yddr["clientId"] = jsr["fahuoPeople"].ToString();
                    yddr["fahuoPeople"] = fahuoPeopleName;
                    yddr["fahuoTel"] = jsr["fahuoTel"].ToString();
                    yddr["faAddress"] = jsr["faAddress"].ToString();
                    yddr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    yddt.Rows.Add(yddr);
                    dbc.InsertTable(yddt);
                    #endregion

                    #region 对应一条拆分表主记录
                    //拆分表
                    string yundan_chaifen_id = Guid.NewGuid().ToString();
                    DataTable cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataRow cfdr = cfdt.NewRow();
                    cfdr["yundan_chaifen_id"] = yundan_chaifen_id;
                    cfdr["yundan_id"] = ydid;
                    //cfdr["zhuangchedan_id"]
                    cfdr["chaifen_statue"] = 0;
                    cfdr["yundan_chaifen_number"] = jsr["yundanNum"].ToString();
                    cfdr["is_leaf"] = 0;   //是否叶子（0：否；1：是；）
                    cfdr["status"] = 0;
                    cfdr["addtime"] = DateTime.Now;
                    cfdr["adduser"] = SystemUser.CurrentUser.UserID;
                    cfdr["isDache"] = 0;
                    cfdr["isZhuhuodaofu"] = 0;
                    cfdr["isPeiSong"] = 0;
                    cfdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    cfdt.Rows.Add(cfdr);
                    dbc.InsertTable(cfdt);
                    #endregion

                    #region 货品表
                    //货品表
                    if (hplist.Length > 0)
                    {
                        DataTable hpdt = dbc.GetEmptyDataTable("yundan_goods");
                        for (int i = 0; i < hplist.Length; i++)
                        {
                            DataRow hpdr = hpdt.NewRow();
                            hpdr["yundan_goods_id"] = hplist[i]["yundan_goods_id"].ToString();
                            hpdr["yundan_chaifen_id"] = yundan_chaifen_id;
                            hpdr["yundan_goodsName"] = hplist[i]["yundan_goodsName"].ToString();
                            hpdr["yundan_goodsPack"] = hplist[i]["yundan_goodsPack"].ToString();
                            if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsAmount"].ToString()))
                            {
                                hpdr["yundan_goodsAmount"] = Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                            }
                            else
                            {
                                hpdr["yundan_goodsAmount"] = 0;
                            }
                            if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsWeight"]))
                            {
                                hpdr["yundan_goodsWeight"] = Convert.ToDouble(hplist[i]["yundan_goodsWeight"].ToString());
                            }
                            else
                            {
                                hpdr["yundan_goodsWeight"] = 0;
                            }
                            if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsVolume"].ToString()))
                            {
                                hpdr["yundan_goodsVolume"] = Convert.ToDouble(hplist[i]["yundan_goodsVolume"].ToString());
                            }
                            else
                            {
                                hpdr["yundan_goodsVolume"] = 0;
                            }
                            hpdr["status"] = 0;
                            hpdr["addtime"] = DateTime.Now;
                            hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                            hpdr["SP_ID"] = Guid.NewGuid().ToString();

                            hpdt.Rows.Add(hpdr);
                        }
                        dbc.InsertTable(hpdt);
                    }
                    #endregion

                    #region 财务表
                    //应收 
                    int paytype = Convert.ToInt32(jsr["payType"].ToString());
                    if (paytype == 11)
                    {
                        //现金
                        new Finance().AddIncome(dbc, 1, jsr, ydid, yundan_chaifen_id, "");
                    }
                    else if (paytype == 1 || paytype == 3 || paytype == 8)
                    {
                        //欠付or回单付or欠付+回单付
                        new Finance().AddIncome(dbc, 2, jsr, ydid, yundan_chaifen_id, "");
                    }
                    else if (paytype == 2)
                    {
                        //到付
                        new Finance().AddIncome(dbc, 3, jsr, ydid, yundan_chaifen_id, "");
                    }
                    else if (paytype == 4 || paytype == 7)
                    {
                        //现付 + 欠付 or 现付+回单付
                        new Finance().AddIncome(dbc, 1, jsr, ydid, yundan_chaifen_id, "");
                        new Finance().AddIncome(dbc, 2, jsr, ydid, yundan_chaifen_id, "");
                    }
                    else if (paytype == 5)
                    {
                        //现付 + 到付
                        new Finance().AddIncome(dbc, 1, jsr, ydid, yundan_chaifen_id, "");
                        new Finance().AddIncome(dbc, 3, jsr, ydid, yundan_chaifen_id, "");
                    }
                    else if (paytype == 6 || paytype == 9)
                    {
                        //到付+欠付 or 到付+回单付
                        new Finance().AddIncome(dbc, 2, jsr, ydid, yundan_chaifen_id, "");
                        new Finance().AddIncome(dbc, 3, jsr, ydid, yundan_chaifen_id, "");
                    }
                    else if (paytype == 10)
                    {
                        //现付+到付+欠付
                        new Finance().AddIncome(dbc, 1, jsr, ydid, yundan_chaifen_id, "");
                        new Finance().AddIncome(dbc, 2, jsr, ydid, yundan_chaifen_id, "");
                        new Finance().AddIncome(dbc, 3, jsr, ydid, yundan_chaifen_id, "");
                    }

                    if (!string.IsNullOrEmpty(jsr["moneyDaishou"].ToString()))
                    {
                        if (Convert.ToDecimal(jsr["moneyDaishou"].ToString()) != 0)
                        {
                            new Finance().AddIncome(dbc, 4, jsr, ydid, yundan_chaifen_id, "");
                        }
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyDaishouShouxu"].ToString()))
                    {
                        if (Convert.ToDecimal(jsr["moneyDaishouShouxu"].ToString()) != 0)
                        {
                            new Finance().AddIncome(dbc, 5, jsr, ydid, yundan_chaifen_id, "");
                        }
                    }

                    //应付
                    if (!string.IsNullOrEmpty(jsr["moneyHuikou"].ToString()))
                    {
                        if (Convert.ToDecimal(jsr["moneyHuikou"].ToString()) != 0)
                        {
                            new Finance().AddExpense(dbc, 4, jsr, ydid, yundan_chaifen_id, "");//回扣
                        }
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyDaishouShouxu"].ToString()))
                    {
                        if (Convert.ToDecimal(jsr["moneyDaishouShouxu"].ToString()) != 0)
                        {
                            new Finance().AddExpense(dbc, 5, jsr, ydid, yundan_chaifen_id, "");
                        }
                    }
                    #endregion
                }
                else
                {
                    //锁表验证
                    string checkSql = "select * from caiwu_income where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and isLock=1 and yundanId=" + dbc.ToSqlValue(ydid);
                    DataTable checkInDt = dbc.ExecuteDataTable(checkSql);
                    checkSql = "select * from caiwu_expense where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and isLock=1 and yundanId=" + dbc.ToSqlValue(ydid);
                    DataTable checkOutDt = dbc.ExecuteDataTable(checkSql);
                    if (checkInDt.Rows.Count > 0 || checkOutDt.Rows.Count > 0)
                    {
                        return new { bo = false, yzType = 2, msg = "当前运单已进入财物日记账被锁定，不允许编辑保存。" };
                    }

                    #region 运单表
                    //货品 临时将货品明细第一条保存到运单表，数量计总数量
                    string hpmc = "";
                    string pack = "";
                    int hpAmount = 0;
                    double hpWeight = 0;
                    double hpVolime = 0;
                    for (int i = 0; i < hplist.Length; i++)
                    {
                        hpmc = hplist[0]["yundan_goodsName"].ToString();
                        pack = hplist[0]["yundan_goodsPack"].ToString();
                        if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsAmount"].ToString()))
                        {
                            hpAmount += Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                        }
                        if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsWeight"]))
                        {
                            hpWeight += Convert.ToDouble(hplist[i]["yundan_goodsWeight"].ToString());
                        }
                        if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsVolume"].ToString()))
                        {
                            hpVolime += Convert.ToDouble(hplist[i]["yundan_goodsVolume"].ToString());
                        }
                    }
                    //运单表
                    DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                    DataTableTracker yddtt = new DataTableTracker(yddt);
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = ydid;
                    yddr["officeId"] = jsr["officeId"].ToString();
                    yddr["toOfficeId"] = jsr["toOfficeId"].ToString();
                    yddr["yundanNum"] = jsr["yundanNum"].ToString();
                    yddr["yundanDate"] = Convert.ToDateTime(jsr["yundanDate"].ToString());
                    yddr["realNum"] = jsr["realNum"].ToString();
                    yddr["memo"] = jsr["memo"].ToString();
                    yddr["fenhuoSite"] = jsr["fenhuoSite"].ToString();
                    yddr["traderName"] = jsr["traderName"].ToString();
                    yddr["zhidanRen"] = jsr["zhidanRen"].ToString();

                    yddr["goodsName"] = hpmc;
                    yddr["goodsAmount"] = hpAmount;
                    yddr["goodsWeight"] = hpWeight;
                    yddr["pack"] = pack;
                    yddr["goodsVolume"] = hpVolime;

                    yddr["toAddress"] = jsr["toAddress"].ToString();
                    yddr["shouhuoPeople"] = jsr["shouhuoPeople"].ToString();
                    yddr["shouhuoTel"] = jsr["shouhuoTel"].ToString();
                    yddr["shouhuoAddress"] = jsr["shouhuoAddress"].ToString();
                    yddr["songhuoType"] = Convert.ToInt32(jsr["songhuoType"].ToString());
                    yddr["payType"] = Convert.ToInt32(jsr["payType"].ToString());
                    if (!string.IsNullOrEmpty(jsr["moneyYunfei"].ToString()))
                    {
                        yddr["moneyYunfei"] = Convert.ToDecimal(jsr["moneyYunfei"].ToString());
                    }
                    else
                    {
                        yddr["moneyYunfei"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyXianfu"].ToString()))
                    {
                        yddr["moneyXianfu"] = Convert.ToDecimal(jsr["moneyXianfu"].ToString());
                    }
                    else
                    {
                        yddr["moneyXianfu"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyDaofu"].ToString()))
                    {
                        yddr["moneyDaofu"] = Convert.ToDecimal(jsr["moneyDaofu"].ToString());
                    }
                    else
                    {
                        yddr["moneyDaofu"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyQianfu"].ToString()))
                    {
                        yddr["moneyQianfu"] = Convert.ToDecimal(jsr["moneyQianfu"].ToString());
                    }
                    else
                    {
                        yddr["moneyQianfu"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyHuidanfu"].ToString()))
                    {
                        yddr["moneyHuidanfu"] = Convert.ToDecimal(jsr["moneyHuidanfu"].ToString());
                    }
                    else
                    {
                        yddr["moneyHuidanfu"] = 0.00m;
                    }
                    //回扣现付
                    yddr["isHuikouXF"] = Convert.ToInt32(jsr["isHuikouXF"].ToString());
                    if (!string.IsNullOrEmpty(jsr["moneyHuikou"].ToString()))
                    {
                        if (Convert.ToInt32(jsr["isHuikouXF"].ToString()) == 1)
                        {
                            yddr["moneyHuikouXianFan"] = Convert.ToDecimal(jsr["moneyHuikou"].ToString());
                            yddr["moneyHuikouQianFan"] = 0.00m;
                        }
                        else
                        {
                            yddr["moneyHuikouXianFan"] = 0.00m;
                            yddr["moneyHuikouQianFan"] = Convert.ToDecimal(jsr["moneyHuikou"].ToString());
                        }
                    }
                    else
                    {
                        yddr["moneyHuikouXianFan"] = 0.00m;
                        yddr["moneyHuikouQianFan"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyDaishou"].ToString()))
                    {
                        yddr["moneyDaishou"] = Convert.ToDecimal(jsr["moneyDaishou"].ToString());
                    }
                    else
                    {
                        yddr["moneyDaishou"] = 0.00m;
                    }
                    if (!string.IsNullOrEmpty(jsr["moneyDaishouShouxu"].ToString()))
                    {
                        yddr["moneyDaishouShouxu"] = Convert.ToDecimal(jsr["moneyDaishouShouxu"].ToString());
                    }
                    else
                    {
                        yddr["moneyDaishouShouxu"] = 0.00m;
                    }
                    yddr["huidanType"] = jsr["huidanType"].ToString();
                    if (!string.IsNullOrEmpty(jsr["cntHuidan"].ToString()))
                    {
                        yddr["cntHuidan"] = Convert.ToInt32(jsr["cntHuidan"].ToString());
                    }
                    else
                    {
                        yddr["cntHuidan"] = 0;
                    }
                    yddr["clientId"] = jsr["fahuoPeople"].ToString();
                    yddr["fahuoPeople"] = fahuoPeopleName;
                    yddr["fahuoTel"] = jsr["fahuoTel"].ToString();
                    yddr["faAddress"] = jsr["faAddress"].ToString();
                    yddr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    yddt.Rows.Add(yddr);
                    dbc.UpdateTable(yddt, yddtt);
                    #endregion

                    string str = "select * from yundan_chaifen where status=0 and is_leaf=0 and yundan_id=@yundan_id order by chaifen_statue asc";
                    SqlCommand cmd = new SqlCommand(str);
                    cmd.Parameters.AddWithValue("@yundan_id", ydid);
                    DataTable cfdt = dbc.ExecuteDataTable(cmd);

                    string yundan_chaifen_id = Guid.NewGuid().ToString();//根ID
                    if (cfdt.Rows.Count > 0)
                    {
                        yundan_chaifen_id = cfdt.Rows[0]["yundan_chaifen_id"].ToString();
                    }

                    //货品表
                    if (hplist.Length > 0)
                    {
                        string sql = @"select distinct SP_ID from dbo.yundan_goods where yundan_chaifen_id=" + dbc.ToSqlValue(yundan_chaifen_id);
                        DataTable oldspDt = dbc.ExecuteDataTable(sql);

                        List<string> spidArr = new List<string>();//未删除的商品
                        List<string> delSpidArr = new List<string>();//已不存在商品
                        DataTable hpdt = dbc.GetEmptyDataTable("yundan_goods");
                        for (int i = 0; i < hplist.Length; i++)
                        {
                            DataRow hpdr = hpdt.NewRow();
                            hpdr["yundan_goods_id"] = hplist[i]["yundan_goods_id"].ToString();
                            if (!string.IsNullOrEmpty(hplist[i]["yundan_chaifen_id"].ToString()))
                            {
                                hpdr["yundan_chaifen_id"] = hplist[i]["yundan_chaifen_id"].ToString();
                            }
                            else
                            {
                                hpdr["yundan_chaifen_id"] = yundan_chaifen_id;
                            }
                            if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsName"].ToString()))
                            {
                                hpdr["yundan_goodsName"] = hplist[i]["yundan_goodsName"].ToString();
                            }
                            if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsPack"].ToString()))
                            {
                                hpdr["yundan_goodsPack"] = hplist[i]["yundan_goodsPack"].ToString();
                            }
                            if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsAmount"].ToString()))
                            {
                                hpdr["yundan_goodsAmount"] = Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                            }
                            else
                            {
                                hpdr["yundan_goodsAmount"] = 0;
                            }
                            if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsWeight"].ToString()))
                            {
                                hpdr["yundan_goodsWeight"] = Convert.ToDouble(hplist[i]["yundan_goodsWeight"].ToString());
                            }
                            else
                            {
                                hpdr["yundan_goodsWeight"] = 0.00;
                            }
                            if (!string.IsNullOrEmpty(hplist[i]["yundan_goodsVolume"].ToString()))
                            {
                                hpdr["yundan_goodsVolume"] = Convert.ToDouble(hplist[i]["yundan_goodsVolume"].ToString());
                            }
                            else
                            {
                                hpdr["yundan_goodsVolume"] = 0.00;
                            }
                            hpdr["status"] = 0;

                            if (hplist[i]["addtime"] != null && hplist[i]["addtime"].ToString() != "")
                            {
                                hpdr["addtime"] = Convert.ToDateTime(hplist[i]["addtime"].ToString());
                            }
                            else
                            {
                                hpdr["addtime"] = DateTime.Now;
                            }

                            if (hplist[i]["adduser"] != null && hplist[i]["adduser"].ToString() != "")
                            {
                                hpdr["adduser"] = hplist[i]["adduser"].ToString();
                            }
                            else
                            {
                                hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                            }

                            if (hplist[i]["SP_ID"] != null && hplist[i]["SP_ID"].ToString() != "")
                            {
                                hpdr["SP_ID"] = hplist[i]["SP_ID"].ToString();
                                spidArr.Add(hplist[i]["SP_ID"].ToString());
                            }
                            else
                            {
                                hpdr["SP_ID"] = Guid.NewGuid().ToString();
                            }
                            hpdt.Rows.Add(hpdr);
                        }
                        dbc.InsertOrUpdateTable(hpdt);

                        #region 删除已不存在的旧货
                        DataRow[] drs = oldspDt.Select("SP_ID not in('" + string.Join(",", spidArr) + "')");
                        for (int i = 0; i < drs.Length; i++)
                        {
                            delSpidArr.Add(drs[i]["SP_ID"].ToString());
                        }
                        //1.将货物表中已不存在的删除（逻辑删）；
                        sql = @"update dbo.yundan_goods set status=1 where SP_ID in('" + string.Join(",", delSpidArr) + "')";
                        dbc.ExecuteNonQuery(sql);

                        //2.如果拆分单中无货品则删除拆分单（逻辑删）;
                        sql = @"update yundan_chaifen set status=1 
                                where yundan_chaifen_id in(
                                    select yundan_chaifen_id from (
		                                select yundan_chaifen_id,(select COUNT(*) from dbo.yundan_goods b where b.status=0 and a.yundan_chaifen_id=b.yundan_chaifen_id)num from yundan_chaifen a
		                                where a.is_leaf=1 and a.yundan_id=" + dbc.ToSqlValue(ydid) + @"
                                    )t
                                    where t.num=0
                                )";
                        dbc.ExecuteNonQuery(sql);
                        #endregion
                    }
                }

                dbc.CommitTransaction();
                return new { bo = true };
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("DeleteYD")]
    public void DeleteYD(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();
                string sql = "";
                //查看运单是否被装车
                sql = "select *from yundan_chaifen where status=0 and yundan_id=" + dbc.ToSqlValue(id) + " and zhuangchedan_id is not null";
                DataTable cfDt = dbc.ExecuteDataTable(sql);
                if (cfDt.Rows.Count > 0)
                {
                    throw new Exception("该运单已被装车，无法删除。");
                }
                //查看运单是否被锁
                sql = @"select * from caiwu_income where isLock=1 and yundanId=" + dbc.ToSqlValue(id);
                DataTable inDt = dbc.ExecuteDataTable(sql);
                if (inDt.Rows.Count > 0)
                {
                    throw new Exception("该运单已被锁定，无法删除。");
                }
                sql = @"select * from caiwu_expense where isLock=1 and yundanId=" + dbc.ToSqlValue(id);
                DataTable outDt = dbc.ExecuteDataTable(sql);
                if (outDt.Rows.Count > 0)
                {
                    throw new Exception("该运单已被锁定，无法删除。");
                }
                //删除应付应收账目
                sql = "update caiwu_income set status=1 where yundanId=" + dbc.ToSqlValue(id);
                dbc.ExecuteNonQuery(sql);
                sql = "update caiwu_expense set status=1 where yundanId=" + dbc.ToSqlValue(id);
                dbc.ExecuteNonQuery(sql);
                //删除货品单
                sql = "update yundan_goods set status=1 where yundan_chaifen_id in(select yundan_chaifen_id from yundan_chaifen where status=0 and yundan_id=" + dbc.ToSqlValue(id) + ")";
                dbc.ExecuteNonQuery(sql);
                //删除所有拆分单
                sql = "update yundan_chaifen set status=1 where yundan_id=" + dbc.ToSqlValue(id);
                dbc.ExecuteNonQuery(sql);
                //删除运单
                sql = "update yundan_yundan set status=1 where yundan_id=" + dbc.ToSqlValue(id);
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
    #endregion

    #region 1：短驳，2：中转，3：送货 共通方法
    /// <summary>
    /// 获取当前用户所属办事处司机数据集
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetDriver")]
    public DataTable GetDriver()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select driverId,people,tel,carNum from jichu_driver 
where status=0 and officeId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CsOfficeId) + " and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + "  order by people";
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
    /// 获取当前用户所属办事处中转公司数据集
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetZhongZhuan")]
    public DataTable GetZhongZhuan()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select zhongzhuanId,compName,people,tel from jichu_zhongzhuan 
where status=0 and companyId='" + SystemUser.CurrentUser.CompanyID + "' order by people";
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
    /// 检验运单支出是否被锁定
    /// </summary>
    /// <param name="ydid"></param>
    /// <param name="kind">1:短驳，2中转，3：送货</param>
    /// <returns></returns>
    [CSMethod("Ex_IsLockByYd")]
    public bool Ex_IsLockByYd(string ydid, string kind)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select * from caiwu_expense 
where companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and status=0 and isLock=1 and yundanId=" + dbc.ToSqlValue(ydid) + " and kind=" + dbc.ToSqlValue(kind);
            DataTable dt = dbc.ExecuteDataTable(sql);
            if (dt.Rows.Count > 0)
            {
                return true;
            }
            return false;
        }
    }

    /// <summary>
    /// 删除短驳分流及财务应付
    /// </summary>
    /// <param name="id"></param>
    /// <param name="cwid"></param>
    /// <returns></returns>
    [CSMethod("DeleteDBFById")]
    public object DeleteDBFById(string id, string cwid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string sql = @"update dbo.yundan_duanbo_fenliu set status=1 where id=" + dbc.ToSqlValue(id);
                dbc.ExecuteNonQuery(sql);

                sql = "update caiwu_expense set status=1 where id=" + dbc.ToSqlValue(cwid);
                dbc.ExecuteNonQuery(sql);

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
    /// 分流费设置前验证-运单是否已装车，并获取装车单ID、拆分单ID
    /// </summary>
    /// <param name="ydid"></param>
    /// <returns></returns>
    [CSMethod("IsYdZc")]
    public object IsYdZc(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string zhuangchedan_id = "";
                string yundan_chaifen_id = "";
                string str = "select * from yundan_chaifen where status=0 and is_leaf=0 and yundan_id=" + dbc.ToSqlValue(ydid);
                DataTable dt = dbc.ExecuteDataTable(str);
                if (dt.Rows.Count > 0)
                {
                    zhuangchedan_id = dt.Rows[0]["zhuangchedan_id"].ToString();
                    yundan_chaifen_id = dt.Rows[0]["yundan_chaifen_id"].ToString();
                }
                return new { zhuangchedan_id = zhuangchedan_id, yundan_chaifen_id = yundan_chaifen_id };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion

    #region 短驳费
    /// <summary>
    /// 获取运单短驳费明细
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="ydid"></param>
    /// <returns></returns>
    [CSMethod("GetDBFList")]
    public object GetDBFList(int pagnum, int pagesize, string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string str = @"select a.*,b.people,b.tel,b.carNum,c.id cwid from yundan_duanbo_fenliu a 
   left join jichu_driver b on a.driverId=b.driverId
   left join caiwu_expense c on a.kind=c.kind and a.yundanId=c.yundanId and a.driverId=c.driverId and a.companyId=c.companyId and c.status=0
   where a.status=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and a.kind=1 and a.yundanId=" + dbc.ToSqlValue(ydid) + @" 
   order by a.updatetime desc";

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
    /// 根据ID获取运单短驳(送货)费
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [CSMethod("GetDBFById")]
    public object GetDBFById(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @" select a.*,b.people,b.tel,b.carNum from dbo.yundan_duanbo_fenliu a 
                                left join jichu_driver b on a.driverId=b.driverId
                                   where a.id=" + dbc.ToSqlValue(id);
                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    /// <summary>
    /// 保存运单短驳费
    /// </summary>
    /// <param name="jsr"></param>
    /// <param name="ydid"></param>
    /// <param name="cfdid">根拆分单ID</param>
    /// <returns></returns>
    [CSMethod("SaveDBF")]
    public object SaveDBF(JSReader jsr, string ydid, string cfdid)
    {
        var user = SystemUser.CurrentUser;
        DateTime ti = DateTime.Now;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string dbflid = jsr["id"].ToString();
                //查看短驳司机是否已有记录
                string driverid = jsr["driverId"].ToString();
                string sql = @"select * from dbo.yundan_duanbo_fenliu 
where status=0 and companyId=" + dbc.ToSqlValue(user.CompanyID) + " and yundanId=" + dbc.ToSqlValue(ydid) + " and kind=1 and driverId=" + dbc.ToSqlValue(driverid);
                DataTable yzDt = dbc.ExecuteDataTable(sql);
                if (yzDt.Rows.Count > 0)
                {
                    dbflid = yzDt.Rows[0]["id"].ToString();
                }

                if (dbflid == "")
                {
                    #region 新增短驳数据
                    DataTable dbDt = dbc.GetEmptyDataTable("yundan_duanbo_fenliu");
                    DataRow dbDr = dbDt.NewRow();
                    dbDr["id"] = Guid.NewGuid().ToString();
                    if (jsr["actionDate"] != null && jsr["actionDate"].ToString() != "")
                    {
                        dbDr["actionDate"] = Convert.ToDateTime(jsr["actionDate"].ToString());
                    }
                    dbDr["kind"] = 1;
                    dbDr["officeId"] = jsr["officeId"].ToString();
                    dbDr["yundanId"] = ydid;
                    //dr["zhongzhuanId"] =
                    dbDr["driverId"] = jsr["driverId"].ToString();
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        dbDr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    dbDr["memo"] = jsr["memo"].ToString();
                    dbDr["addtime"] = ti;
                    dbDr["yundan_chaifen_id"] = cfdid;
                    //dr["zhuangchedanId"] =
                    dbDr["companyId"] = user.CompanyID;
                    dbDr["status"] = 0;
                    dbDr["adduser"] = user.UserID;
                    dbDr["updatetime"] = ti;
                    dbDr["updateuser"] = user.UserID;
                    dbDt.Rows.Add(dbDr);
                    dbc.InsertTable(dbDt);
                    #endregion

                    //新增财务-短驳数据
                    new Finance().AddExpense(dbc, 1, jsr, ydid, cfdid, "");
                }
                else
                {
                    #region 短驳修改
                    DataTable dbDt = dbc.GetEmptyDataTable("yundan_duanbo_fenliu");
                    DataTableTracker dbDtt = new DataTableTracker(dbDt);
                    DataRow dbDr = dbDt.NewRow();
                    dbDr["id"] = dbflid;
                    if (jsr["actionDate"] != null && jsr["actionDate"].ToString() != "")
                    {
                        dbDr["actionDate"] = Convert.ToDateTime(jsr["actionDate"].ToString());
                    }
                    dbDr["driverId"] = jsr["driverId"].ToString();
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        dbDr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    dbDr["memo"] = jsr["memo"].ToString();
                    dbDr["updatetime"] = ti;
                    dbDr["updateuser"] = user.UserID;
                    dbDt.Rows.Add(dbDr);
                    dbc.UpdateTable(dbDt, dbDtt);
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

    #region 中转费
    /// <summary>
    /// 获取运单中转明细
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="ydid"></param>
    /// <returns></returns>
    [CSMethod("GetZZFList")]
    public object GetZZFList(int pagnum, int pagesize, string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string sql = @"select a.*,b.compName,b.people,b.tel,c.id cwid from yundan_duanbo_fenliu a
left join jichu_zhongzhuan b on a.zhongzhuanId=b.zhongzhuanId
left join caiwu_expense c on a.kind=c.kind and a.yundanId=c.yundanId and a.zhongzhuanId=c.zhongzhuanId and a.companyId=c.companyId and c.status=0
where a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and a.kind=2 and a.yundanId=" + dbc.ToSqlValue(ydid) + @"  
order by a.updatetime desc";

                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    /// <summary>
    /// 根据ID获取运单中转费
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [CSMethod("GetZZFById")]
    public object GetZZFById(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @" select a.*,b.people,b.tel from dbo.yundan_duanbo_fenliu a 
                                left join dbo.jichu_zhongzhuan b on a.zhongzhuanId=b.zhongzhuanId
                                   where a.id=" + dbc.ToSqlValue(id);

                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    /// <summary>
    /// 保存运单中转费
    /// </summary>
    /// <param name="jsr"></param>
    /// <param name="ydid"></param>
    /// <param name="officeId"></param>
    /// <param name="clientId"></param>
    /// <param name="zhuangchedanId"></param>
    /// <param name="chaifenId"></param>
    /// <returns></returns>
    [CSMethod("SaveZZF")]
    public object SaveZZF(JSReader jsr, string ydid, string cfdid, string zcdid)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        DateTime ti = DateTime.Now;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (jsr["id"].ToString() == "")
                {
                    #region 新增中转明细
                    DataTable zzDt = dbc.GetEmptyDataTable("yundan_duanbo_fenliu");
                    DataRow zzDr = zzDt.NewRow();
                    zzDr["id"] = Guid.NewGuid().ToString();
                    if (jsr["actionDate"] != null && jsr["actionDate"].ToString() != "")
                    {
                        zzDr["actionDate"] = Convert.ToDateTime(jsr["actionDate"].ToString());
                    }
                    else
                    {
                        zzDr["actionDate"] = ti;
                    }
                    zzDr["kind"] = 2;
                    zzDr["officeId"] = jsr["officeId"].ToString();
                    zzDr["yundanId"] = ydid;
                    zzDr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                    //zzDr["driverId"] =
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        zzDr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    zzDr["memo"] = jsr["memo"].ToString();
                    zzDr["addtime"] = ti;
                    zzDr["yundan_chaifen_id"] = cfdid;
                    zzDr["zhuangchedanId"] = zcdid;
                    zzDr["companyId"] = user.CompanyID;
                    zzDr["status"] = 0;
                    zzDr["adduser"] = user.UserID;
                    zzDr["updatetime"] = ti;
                    zzDr["updateuser"] = user.UserID;
                    zzDt.Rows.Add(zzDr);
                    dbc.InsertTable(zzDt);
                    #endregion

                    //新增财务中转明细
                    new Finance().AddExpense(dbc, 2, jsr, ydid, cfdid, zcdid);
                }
                else
                {
                    #region 中转修改
                    string id = jsr["id"].ToString();//中转ID
                    DataTable dbDt = dbc.GetEmptyDataTable("yundan_duanbo_fenliu");
                    DataTableTracker dbDtt = new DataTableTracker(dbDt);
                    DataRow dbDr = dbDt.NewRow();
                    dbDr["id"] = id;
                    if (jsr["actionDate"] != null && jsr["actionDate"].ToString() != "")
                    {
                        dbDr["actionDate"] = Convert.ToDateTime(jsr["actionDate"].ToString());
                    }
                    dbDr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        dbDr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    dbDr["memo"] = jsr["memo"].ToString();
                    dbDr["updatetime"] = ti;
                    dbDr["updateuser"] = user.UserID;
                    dbDt.Rows.Add(dbDr);
                    dbc.UpdateTable(dbDt, dbDtt);
                    #endregion

                    string sql = "delete from caiwu_expense where kind=2 and zhongzhuanId=" + dbc.ToSqlValue(jsr["zhongzhuanId"].ToString()) + " and yundanId=" + dbc.ToSqlValue(ydid);
                    dbc.ExecuteNonQuery(sql);
                    //新增财务中转明细
                    new Finance().AddExpense(dbc, 2, jsr, ydid, cfdid, zcdid);
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

    #region  送货费
    /// <summary>
    /// 获取运单送货费明细
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="ydid"></param>
    /// <returns></returns>
    [CSMethod("GetSHFList")]
    public object GetSHFList(int pagnum, int pagesize, string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string str = @"select a.*,b.people,b.tel,b.carNum,c.id cwid from yundan_duanbo_fenliu a 
   left join jichu_driver b on a.driverId=b.driverId
   left join caiwu_expense c on a.kind=c.kind and a.yundanId=c.yundanId and a.driverId=c.driverId and a.companyId=c.companyId and c.status=0
   where a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and a.kind=3 and a.yundanId=" + dbc.ToSqlValue(ydid) + @" 
   order by a.updatetime desc";

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
    /// 保存运单送货费
    /// </summary>
    /// <param name="jsr"></param>
    /// <param name="ydid"></param>
    /// <param name="officeId"></param>
    /// <param name="clientId"></param>
    /// <param name="zhuangchedanId"></param>
    /// <param name="chaifenId"></param>
    /// <returns></returns>
    [CSMethod("SaveSHF")]
    public object SaveSHF(JSReader jsr, string ydid, string cfdid, string zcdid)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        DateTime ti = DateTime.Now;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (jsr["id"].ToString() == "")
                {
                    #region 新增送货明细
                    DataTable zzDt = dbc.GetEmptyDataTable("yundan_duanbo_fenliu");
                    DataRow zzDr = zzDt.NewRow();
                    zzDr["id"] = Guid.NewGuid().ToString();
                    if (jsr["actionDate"] != null && jsr["actionDate"].ToString() != "")
                    {
                        zzDr["actionDate"] = Convert.ToDateTime(jsr["actionDate"].ToString());
                    }
                    else
                    {
                        zzDr["actionDate"] = ti;
                    }
                    zzDr["kind"] = 3;
                    zzDr["officeId"] = jsr["officeId"].ToString();
                    zzDr["yundanId"] = ydid;
                    //zzDr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                    zzDr["driverId"] = jsr["driverId"].ToString();
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        zzDr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    zzDr["memo"] = jsr["memo"].ToString();
                    zzDr["addtime"] = ti;
                    zzDr["yundan_chaifen_id"] = cfdid;
                    zzDr["zhuangchedanId"] = zcdid;
                    zzDr["companyId"] = user.CompanyID;
                    zzDr["status"] = 0;
                    zzDr["adduser"] = user.UserID;
                    zzDr["updatetime"] = ti;
                    zzDr["updateuser"] = user.UserID;
                    zzDt.Rows.Add(zzDr);
                    dbc.InsertTable(zzDt);
                    #endregion

                    //新增财务送货明细
                    new Finance().AddExpense(dbc, 3, jsr, ydid, cfdid, zcdid);
                }
                else
                {
                    #region 送货修改
                    string id = jsr["id"].ToString();//中转ID
                    DataTable dbDt = dbc.GetEmptyDataTable("yundan_duanbo_fenliu");
                    DataTableTracker dbDtt = new DataTableTracker(dbDt);
                    DataRow dbDr = dbDt.NewRow();
                    dbDr["id"] = id;
                    if (jsr["actionDate"] != null && jsr["actionDate"].ToString() != "")
                    {
                        dbDr["actionDate"] = Convert.ToDateTime(jsr["actionDate"].ToString());
                    }
                    dbDr["driverId"] = jsr["driverId"].ToString();
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        dbDr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    dbDr["memo"] = jsr["memo"].ToString();
                    dbDr["updatetime"] = ti;
                    dbDr["updateuser"] = user.UserID;
                    dbDt.Rows.Add(dbDr);
                    dbc.UpdateTable(dbDt, dbDtt);
                    #endregion

                    string sql = "delete from caiwu_expense where kind=3 and driverId=" + dbc.ToSqlValue(jsr["driverId"].ToString()) + " and yundanId=" + dbc.ToSqlValue(ydid);
                    dbc.ExecuteNonQuery(sql);

                    //新增财务送货明细
                    new Finance().AddExpense(dbc, 3, jsr, ydid, cfdid, zcdid);
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

    #region  拆分运单
    [CSMethod("GetYDNum")]
    public object GetYDNum(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string oldyundanNum = "";
                string newyundanNum = "";
                string str = " select yundanNum from yundan_yundan where yundan_id=" + dbc.ToSqlValue(ydid);
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

                return new { oldyundanNum = oldyundanNum, newyundanNum = newyundanNum };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }


    [CSMethod("GetHPByYD2")]
    public DataTable GetHPByYD2(string ydid, string ydnum)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sql = @"select t.SP_ID,t.yundan_goodsName,t.yundan_goodsPack,(t.yundan_goodsAmount-ISNULL(t1.yundan_goodsAmount,0))yundan_goodsAmount,(t.yundan_goodsWeight-ISNULL(t1.yundan_goodsWeight,0))yundan_goodsWeight,(t.yundan_goodsVolume-ISNULL(t1.yundan_goodsVolume,0))yundan_goodsVolume from(
                    select SP_ID,yundan_goodsName,yundan_goodsPack,yundan_goodsAmount,yundan_goodsWeight,yundan_goodsVolume from yundan_goods
                    where status=0 and yundan_chaifen_id in(select yundan_chaifen_id from dbo.yundan_chaifen where status=0 and yundan_id=" + dbc.ToSqlValue(ydid) + @" and is_leaf=0)
                )t
                left join(
                    select SP_ID,yundan_goodsName,yundan_goodsPack,sum(yundan_goodsAmount) yundan_goodsAmount,sum(yundan_goodsWeight)yundan_goodsWeight,sum(yundan_goodsVolume) yundan_goodsVolume from dbo.yundan_goods
                    where status=0 and yundan_chaifen_id in(select yundan_chaifen_id from dbo.yundan_chaifen where status=0 and yundan_id=" + dbc.ToSqlValue(ydid) + @" and is_leaf=1)
                    group by yundan_goodsName,yundan_goodsPack,SP_ID
                )t1 on t.SP_ID=t1.SP_ID";
                //string sql = @"select SP_ID,yundan_goodsName,yundan_goodsPack,yundan_goodsAmount,yundan_goodsWeight,yundan_goodsVolume from yundan_goods
                //   where status=0 and yundan_chaifen_id in(select yundan_chaifen_id from dbo.yundan_chaifen where status=0 and yundan_id=" + dbc.ToSqlValue(ydid) + @" and is_leaf=0)";
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
    public object SaveCF2(string ydid, string oldyundanNum, string newyundanNum, JSReader[] hplist)
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

                //更新根拆分状态
                string sql = "update dbo.yundan_chaifen set chaifen_statue=1 where yundan_id=" + dbc.ToSqlValue(ydid) + " and is_leaf=0";
                dbc.ExecuteNonQuery(sql);

                //            //更新根拆分单商品
                //            if (hplist.Length > 0)
                //            {
                //                sql = @"select * from yundan_goods
                //where status=0 and yundan_chaifen_id in(select yundan_chaifen_id from dbo.yundan_chaifen where status=0 and is_leaf=0 and yundan_id=" + dbc.ToSqlValue(ydid) + ")";
                //                DataTable dt = dbc.ExecuteDataTable(sql);

                //                DataTable goodsdt = dbc.GetEmptyDataTable("yundan_goods");
                //                DataTableTracker goodsdtt = new DataTableTracker(goodsdt);
                //                foreach (DataRow dr in dt.Rows)
                //                {
                //                    string spid = dr["SP_ID"].ToString();
                //                    int amount = dr["yundan_goodsAmount"] != DBNull.Value ? Convert.ToInt32(dr["yundan_goodsAmount"].ToString()) : 0;
                //                    decimal weight = dr["yundan_goodsWeight"] != DBNull.Value ? Convert.ToDecimal(dr["yundan_goodsWeight"].ToString()) : 0m;
                //                    decimal volume = dr["yundan_goodsVolume"] != DBNull.Value ? Convert.ToDecimal(dr["yundan_goodsVolume"].ToString()) : 0m;


                //                    DataRow newDr = goodsdt.NewRow();
                //                    newDr["yundan_goods_id"] = dr["yundan_goods_id"];
                //                    newDr["yundan_chaifen_id"] = dr["yundan_chaifen_id"];
                //                    newDr["yundan_goodsName"] = dr["yundan_goodsName"];
                //                    newDr["yundan_goodsPack"] = dr["yundan_goodsPack"];
                //                    for (int i = 0; i < hplist.Length; i++)
                //                    {
                //                        if (hplist[i]["SP_ID"] == spid)
                //                        {
                //                            if (hplist[i]["yundan_goodsAmount"] != null && hplist[i]["yundan_goodsAmount"].ToString() != "")
                //                            {
                //                                newDr["yundan_goodsAmount"] = amount - Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                //                            }
                //                            if (hplist[i]["yundan_goodsWeight"] != null && hplist[i]["yundan_goodsWeight"].ToString() != "")
                //                            {
                //                                newDr["yundan_goodsWeight"] = weight - Convert.ToDecimal(hplist[i]["yundan_goodsWeight"].ToString());
                //                            }
                //                            if (hplist[i]["yundan_goodsVolume"] != null && hplist[i]["yundan_goodsVolume"].ToString() != "")
                //                            {
                //                                newDr["yundan_goodsVolume"] = volume - Convert.ToDecimal(hplist[i]["yundan_goodsVolume"].ToString());
                //                            }
                //                        }
                //                    }
                //                    newDr["status"] = dr["status"];
                //                    newDr["addtime"] = dr["addtime"];
                //                    newDr["adduser"] = dr["adduser"];
                //                    newDr["SP_ID"] = spid;
                //                    goodsdt.Rows.Add(newDr);
                //                }
                //                dbc.UpdateTable(goodsdt, goodsdtt);


                //            }
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
    public object SaveCF(string ydid, string oldyundanNum, string newyundanNum, JSReader[] hplist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();

                string str = "select * from yundan_chaifen where status=0 and  yundan_id=" + dbc.ToSqlValue(ydid) + " and yundan_chaifen_number='" + oldyundanNum + "'";
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
                    DataTable kcdt = GetHPByYD(ydid, oldyundanNum + "_1");

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

                    string sql = "select yundan_chaifen_id from yundan_chaifen where status=0 and yundan_id=@yundan_id and yundan_chaifen_number=@yundan_chaifen_number";
                    SqlCommand cmd = new SqlCommand(sql);
                    cmd.Parameters.Add("@yundan_id", ydid);
                    cmd.Parameters.Add("@yundan_chaifen_number", oldyundanNum + "_1");
                    DataTable dt1 = dbc.ExecuteDataTable(cmd);

                    string sy_yundan_chaifen_id = dt1.Rows[0]["yundan_chaifen_id"].ToString();

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

    #region 回单设置
    [CSMethod("SaveHD")]
    public object SaveHD(string ydid, JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                DataTableTracker yddtt = new DataTableTracker(yddt);
                DataRow yddr = yddt.NewRow();
                yddr["yundan_id"] = ydid;
                if (jsr["isSign"] != null && jsr["isSign"].ToString() != "")
                {
                    yddr["isSign"] = Convert.ToInt32(jsr["isSign"].ToString());
                }
                if (jsr["bschuidanDate"] != null && jsr["bschuidanDate"].ToString() != "")
                {
                    yddr["bschuidanDate"] = Convert.ToDateTime(jsr["bschuidanDate"].ToString());
                }
                if (jsr["huidanDate"] != null && jsr["huidanDate"].ToString() != "")
                {
                    yddr["huidanDate"] = Convert.ToDateTime(jsr["huidanDate"].ToString());
                }
                if (jsr["huidanBack"] != null && jsr["huidanBack"].ToString() != "")
                {
                    yddr["huidanBack"] = Convert.ToDateTime(jsr["huidanBack"].ToString());
                }
                yddt.Rows.Add(yddr);
                dbc.UpdateTable(yddt, yddtt);
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

    [CSMethod("GetHDByID")]
    public object GetHDByID(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from yundan_yundan where yundan_id=@yundan_id";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.AddWithValue("@yundan_id", ydid);
                DataTable hddt = dbc.ExecuteDataTable(cmd);

                return hddt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion

    #region  回单批量登记
    /// <summary>
    /// 获取回单列表（包括所有拆分出来的表）
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="fromOfficeId"></param>
    /// <param name="toOfficeId"></param>
    /// <param name="kssj"></param>
    /// <param name="jssj"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetHDList")]
    public object GetHDList(int pagnum, int pagesize, string sjtype, string fromOfficeId, string toOfficeId, string huidanType, string sjtype2, string kssj, string jssj,
        string ydh, string zcdh, string hpm, string fhr, string shr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string where = "";
                //['未寄出', "0"],
                //['未拿到', "1"],
                //['已拿到', "2"],
                //['已送出', "3"]
                #region 查询条件
                if (!string.IsNullOrEmpty(sjtype))
                {
                    if (Convert.ToInt32(sjtype) == 0)
                    {
                        where += " and a.bschuidanDate is null ";//and a.huidanDate is null and a.huidanBack is null  bschuidanDate
                    }
                    else if (Convert.ToInt32(sjtype) == 1)
                    {
                        where += " and a.huidanDate is null";
                    }
                    else if (Convert.ToInt32(sjtype) == 2)
                    {
                        where += " and a.huidanDate is not null ";
                    }
                    else if (Convert.ToInt32(sjtype) == 3)
                    {
                        where += " and a.huidanBack is not null ";
                    }
                }

                if (!string.IsNullOrEmpty(fromOfficeId))
                {
                    where += " and " + dbc.C_EQ("a.officeId", fromOfficeId);
                }
                if (!string.IsNullOrEmpty(toOfficeId))
                {
                    where += " and " + dbc.C_EQ("a.toOfficeId", toOfficeId);
                }
                if (!string.IsNullOrEmpty(huidanType))
                {
                    where += " and " + dbc.C_EQ("a.huidanType", huidanType);
                }
                if (!string.IsNullOrEmpty(sjtype2))
                {
                    if (!string.IsNullOrEmpty(kssj))
                    {
                        where += " and a." + sjtype2.Trim() + ">='" + Convert.ToDateTime(kssj) + "'";
                    }
                    if (!string.IsNullOrEmpty(jssj))
                    {
                        where += " and a." + sjtype2.Trim() + "<'" + Convert.ToDateTime(jssj).AddDays(1) + "'";
                    }
                }
                if (!string.IsNullOrEmpty(ydh))
                {
                    where += " and " + dbc.C_Like("a.yundanNum", ydh, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(zcdh))
                {
                    where += " and " + dbc.C_Like("b.zhuangchedanNum", zcdh, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(fhr))
                {
                    where += " and " + dbc.C_Like("a.fahuoPeople", fhr, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(shr))
                {
                    where += " and " + dbc.C_Like("a.shouhuoPeople", shr, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(hpm))
                {
                    where += " and " + dbc.C_Like("a.goodsName", hpm, LikeStyle.LeftAndRightLike);
                }
                #endregion

                string str = @"select a.*,b.zhuangchedanNum,c.officeName,d.officeName as toOfficeName,0 as ti1_zt,0 as ti2_zt,0 as ti3_zt from yundan_yundan a
left join (
    select t1.*,t2.zhuangchedanNum from yundan_chaifen t1
    left join zhuangchedan_zhuangchedan t2 on t1.zhuangchedan_id=t2.zhuangchedan_id
)b on a.yundan_id=b.yundan_id and b.is_leaf=0
left join jichu_office c on a.officeId=c.officeId
left join jichu_office d on a.toOfficeId=d.officeId
where a.status=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + where + @"
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

    /// <summary>
    /// 
    /// </summary>
    /// <param name="jsr1">办事处回单</param>
    /// <param name="jsr2">回单收到</param>
    /// <param name="jsr3">回单送出</param>
    /// <returns></returns>
    [CSMethod("SaveYgxCz")]
    public object SaveYgxCz(JSReader jsr1, JSReader jsr2, JSReader jsr3)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                //办事处回单
                var idArray = jsr1.ToArray();
                foreach (var r in idArray)
                {
                    string sql = "update yundan_yundan set bschuidanDate=" + dbc.ToSqlValue(Convert.ToDateTime(r["bschuidanDate"].ToString())) + " where yundan_id=" + dbc.ToSqlValue(r["yundan_id"].ToString());
                    dbc.ExecuteNonQuery(sql);
                }

                //回单收到
                var idArray2 = jsr2.ToArray();
                foreach (var r in idArray2)
                {
                    string sql = "update yundan_yundan set huidanDate=" + dbc.ToSqlValue(Convert.ToDateTime(r["huidanDate"].ToString())) + " where yundan_id=" + dbc.ToSqlValue(r["yundan_id"].ToString());
                    dbc.ExecuteNonQuery(sql);
                }

                //回单送出
                var idArray3 = jsr3.ToArray();
                foreach (var r in idArray3)
                {
                    string sql = "update yundan_yundan set huidanBack=" + dbc.ToSqlValue(Convert.ToDateTime(r["huidanBack"].ToString())) + " where yundan_id=" + dbc.ToSqlValue(r["yundan_id"].ToString());
                    dbc.ExecuteNonQuery(sql);
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

    [CSMethod("SaveBSCHD")]
    public object SaveBSCHD(JSReader jsrIds, string bschdrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                List<string> idList = new List<string>();
                var idArray = jsrIds.ToArray();
                foreach (var id in idArray)
                {
                    idList.Add(id.ToString());

                    DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                    DataTableTracker yddtt = new DataTableTracker(yddt);
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = id.ToString();
                    if (!string.IsNullOrEmpty(bschdrq))
                    {
                        try
                        {
                            yddr["bschuidanDate"] = Convert.ToDateTime(bschdrq);
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                    yddt.Rows.Add(yddr);
                    dbc.UpdateTable(yddt, yddtt);
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

    [CSMethod("SaveBSCHD2")]
    public object SaveBSCHD2(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                var idArray = jsr.ToArray();
                DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                DataTableTracker yddtt = new DataTableTracker(yddt);
                foreach (var r in idArray)
                {
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = r["yundan_id"].ToString();
                    if (!string.IsNullOrEmpty(r["bschuidanDate"]))
                    {
                        try
                        {
                            yddr["bschuidanDate"] = Convert.ToDateTime(r["bschuidanDate"].ToString());
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                    yddt.Rows.Add(yddr);
                }
                dbc.UpdateTable(yddt, yddtt);

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

    [CSMethod("SaveHDSD")]
    public object SaveHDSD(JSReader jsrIds, string huidanDate)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                List<string> idList = new List<string>();
                var idArray = jsrIds.ToArray();
                foreach (var id in idArray)
                {
                    idList.Add(id.ToString());

                    DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                    DataTableTracker yddtt = new DataTableTracker(yddt);
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = id.ToString();
                    if (!string.IsNullOrEmpty(huidanDate))
                    {
                        try
                        {
                            yddr["huidanDate"] = Convert.ToDateTime(huidanDate);
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                    yddt.Rows.Add(yddr);
                    dbc.UpdateTable(yddt, yddtt);
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

    [CSMethod("SaveHDSD2")]
    public object SaveHDSD2(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                DataTableTracker yddtt = new DataTableTracker(yddt);
                var idArray = jsr.ToArray();
                foreach (var r in idArray)
                {
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = r["yundan_id"].ToString();
                    if (!string.IsNullOrEmpty(r["huidanDate"]))
                    {
                        try
                        {
                            yddr["huidanDate"] = Convert.ToDateTime(r["huidanDate"].ToString());
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                    yddt.Rows.Add(yddr);
                }
                dbc.UpdateTable(yddt, yddtt);

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

    [CSMethod("SaveHDSC")]
    public object SaveHDSC(JSReader jsrIds, string huidanBack)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                List<string> idList = new List<string>();
                var idArray = jsrIds.ToArray();
                foreach (var id in idArray)
                {
                    idList.Add(id.ToString());

                    DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                    DataTableTracker yddtt = new DataTableTracker(yddt);
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = id.ToString();
                    if (!string.IsNullOrEmpty(huidanBack))
                    {
                        try
                        {
                            yddr["huidanBack"] = Convert.ToDateTime(huidanBack);
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                    yddt.Rows.Add(yddr);
                    dbc.UpdateTable(yddt, yddtt);
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

    [CSMethod("SaveHDSC2")]
    public object SaveHDSC2(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                DataTableTracker yddtt = new DataTableTracker(yddt);
                var idArray = jsr.ToArray();
                foreach (var r in idArray)
                {
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = r["yundan_id"].ToString();
                    if (!string.IsNullOrEmpty(r["huidanBack"]))
                    {
                        try
                        {
                            yddr["huidanBack"] = Convert.ToDateTime(r["huidanBack"].ToString());
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                    yddt.Rows.Add(yddr);
                }
                dbc.UpdateTable(yddt, yddtt);

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

    #region 运单一览表

    #endregion


    #region
    /// <summary>
    /// 删除办事处时的验证
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("DelBscByOfficeIsExistCheck")]
    public DataTable DelBscByOfficeIsExistCheck(string officeid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sql = @"select * from yundan_yundan 
                            where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and (officeId=" + dbc.ToSqlValue(officeid) + " or toOfficeId=" + dbc.ToSqlValue(officeid) + ")";
                DataTable dt = dbc.ExecuteDataTable(sql);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion

    #region 打印运单
    [CSMethod("PrintYundanBQ")]
    public object PrintYundanBQ(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string companyName = SystemUser.CurrentUser.CompanyName;
            string zxName = new XLMag().GetCompanyZX(SystemUser.CurrentUser.UserID);
            string yundanNum = "";
            string toOfficeName = "";
            string goodsName = "";
            string shouhuoPeople = "";
            string pack = "";
            string goodsAmount = "";
            string toAddress = "";
            string companyTel = SystemUser.CurrentUser.CompanyTel;

            string sql = @"select a.*,b.officeName toOfficeName from yundan_yundan a
left join jichu_office b on a.toOfficeId=b.officeId
where a.yundan_id=" + dbc.ToSqlValue(ydid);
            DataTable ydDt = dbc.ExecuteDataTable(sql);
            if (ydDt.Rows.Count > 0)
            {
                yundanNum = ydDt.Rows[0]["yundanNum"].ToString();
                toOfficeName = ydDt.Rows[0]["toOfficeName"].ToString();
                goodsName = ydDt.Rows[0]["goodsName"].ToString();
                shouhuoPeople = ydDt.Rows[0]["shouhuoPeople"].ToString();
                pack = ydDt.Rows[0]["pack"].ToString();
                goodsAmount = ydDt.Rows[0]["goodsAmount"].ToString();
                toAddress = ydDt.Rows[0]["toAddress"].ToString();
            }
            return new
            {
                companyName = companyName,
                zxName = zxName,
                yundanNum = yundanNum,
                toOfficeName = toOfficeName,
                goodsName = goodsName,
                shouhuoPeople = shouhuoPeople,
                pack = pack,
                goodsAmount = goodsAmount,
                companyTel = companyTel,
                toAddress = toAddress
            };
        }
    }

    [CSMethod("PrintYundan")]
    public object PrintYundan(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string zxName = new XLMag().GetCompanyZX(SystemUser.CurrentUser.UserID);

            string sql = @"select a.*,b.officeName fromAddress,c.officeAddress toOfficeAd,d.people clientName,d.address clientAddress,d.tel clientTel from yundan_yundan a
left join jichu_office b on a.officeId=b.officeId
left join jichu_office c on a.toOfficeId=c.officeId
left join jichu_client d on a.clientId=d.clientId
where a.yundan_id=" + dbc.ToSqlValue(ydid);
            DataTable sjDt = dbc.ExecuteDataTable(sql);
            sjDt.Columns.Add("JE_DX");
            sjDt.Columns.Add("JE_DX2");
            sjDt.Columns.Add("YY");
            sjDt.Columns.Add("MM");
            sjDt.Columns.Add("DD");
            foreach (DataRow dr in sjDt.Rows)
            {
                string ydDate = Convert.ToDateTime(dr["yundanDate"]).ToString("yy-MM-dd");
                dr["YY"] = ydDate.Split('-')[0].PadLeft(2, '0');
                dr["MM"] = ydDate.Split('-')[1].PadLeft(2, '0');
                dr["DD"] = ydDate.Split('-')[2].PadLeft(2, '0');
                if (dr["moneyYunfei"] != DBNull.Value)
                {
                    dr["JE_DX"] = MoneyToUpper(dr["moneyYunfei"].ToString());
                    dr["JE_DX2"] = MoneyToUpper2(dr["moneyYunfei"].ToString()).PadLeft(5, '零');
                }
            }

            #region 打印设置数据
            string str = "select * from jichu_print where iswhole=0 and  kind=2 and companyid='" + SystemUser.CurrentUser.CompanyID + "'";
            DataTable ztdt = dbc.ExecuteDataTable(str);

            str = @"select top 37 * from jichu_print where iswhole=1 and  kind=2 and companyid='" + SystemUser.CurrentUser.CompanyID + "' order by px";
            DataTable printdt = dbc.ExecuteDataTable(str);

            str = @"select * from jichu_print where iswhole=1 and  kind=2 and companyid='" + SystemUser.CurrentUser.CompanyID + "' order by px desc";
            DataTable dt = dbc.ExecuteDataTable(str);
            var psfs = 1;
            DataRow[] drs1 = dt.Select("fieldMC like '%配送方式显示文字%'");
            if (drs1.Length > 0)
            {
                if (drs1[0]["leftBJ"] != null && drs1[0]["leftBJ"].ToString() != "")
                {
                    psfs = Convert.ToInt32(drs1[0]["leftBJ"].ToString());
                }
            }

            var jsfs = 0;
            DataRow[] drs2 = dt.Select("fieldMC like '%结算方式显示文字%'");
            if (drs2.Length > 0)
            {
                if (drs2[0]["leftBJ"] != null && drs2[0]["leftBJ"].ToString() != "")
                {
                    jsfs = Convert.ToInt32(drs2[0]["leftBJ"].ToString());
                }
            }

            var yfdx = 0;
            DataRow[] drs3 = dt.Select("fieldMC like '%运费大写显示文字%'");
            if (drs3.Length > 0)
            {
                if (drs3[0]["leftBJ"] != null && drs3[0]["leftBJ"].ToString() != "")
                {
                    yfdx = Convert.ToInt32(drs3[0]["leftBJ"].ToString());
                }
            }

            var rq = 0;
            DataRow[] drs4 = dt.Select("fieldMC like '%日期显示文字%'");
            if (drs4.Length > 0)
            {
                if (drs4[0]["leftBJ"] != null && drs4[0]["leftBJ"].ToString() != "")
                {
                    rq = Convert.ToInt32(drs4[0]["leftBJ"].ToString());
                }
            }
            #endregion
            return new { dt = sjDt, zxName = zxName, ztdt = ztdt, printdt = printdt, psfs = psfs, jsfs = jsfs, yfdx = yfdx, rq = rq };
        }
    }

    /// <summary>
    /// 金额转换成中文大写金额
    /// </summary>
    /// <param name="LowerMoney">eg:10.74</param>
    /// <returns></returns>
    public string MoneyToUpper(string LowerMoney)
    {
        string functionReturnValue = null;
        bool IsNegative = false; // 是否是负数
        if (LowerMoney.Trim().Substring(0, 1) == "-")
        {
            // 是负数则先转为正数
            LowerMoney = LowerMoney.Trim().Remove(0, 1);
            IsNegative = true;
        }
        string strLower = null;
        string strUpart = null;
        string strUpper = null;
        int iTemp = 0;
        // 保留两位小数 123.489→123.49　　123.4→123.4
        LowerMoney = Math.Round(double.Parse(LowerMoney), 2).ToString();
        if (LowerMoney.IndexOf(".") > 0)
        {
            if (LowerMoney.IndexOf(".") == LowerMoney.Length - 2)
            {
                LowerMoney = LowerMoney + "0";
            }
        }
        else
        {
            LowerMoney = LowerMoney + ".00";
        }
        strLower = LowerMoney;
        iTemp = 1;
        strUpper = "";
        while (iTemp <= strLower.Length)
        {
            switch (strLower.Substring(strLower.Length - iTemp, 1))
            {
                case ".":
                    strUpart = "圆";
                    break;
                case "0":
                    strUpart = "零";
                    break;
                case "1":
                    strUpart = "壹";
                    break;
                case "2":
                    strUpart = "贰";
                    break;
                case "3":
                    strUpart = "叁";
                    break;
                case "4":
                    strUpart = "肆";
                    break;
                case "5":
                    strUpart = "伍";
                    break;
                case "6":
                    strUpart = "陆";
                    break;
                case "7":
                    strUpart = "柒";
                    break;
                case "8":
                    strUpart = "捌";
                    break;
                case "9":
                    strUpart = "玖";
                    break;
            }

            switch (iTemp)
            {
                case 1:
                    strUpart = strUpart + "分";
                    break;
                case 2:
                    strUpart = strUpart + "角";
                    break;
                case 3:
                    strUpart = strUpart + "";
                    break;
                case 4:
                    strUpart = strUpart + "";
                    break;
                case 5:
                    strUpart = strUpart + "拾";
                    break;
                case 6:
                    strUpart = strUpart + "佰";
                    break;
                case 7:
                    strUpart = strUpart + "仟";
                    break;
                case 8:
                    strUpart = strUpart + "万";
                    break;
                case 9:
                    strUpart = strUpart + "拾";
                    break;
                case 10:
                    strUpart = strUpart + "佰";
                    break;
                case 11:
                    strUpart = strUpart + "仟";
                    break;
                case 12:
                    strUpart = strUpart + "亿";
                    break;
                case 13:
                    strUpart = strUpart + "拾";
                    break;
                case 14:
                    strUpart = strUpart + "佰";
                    break;
                case 15:
                    strUpart = strUpart + "仟";
                    break;
                case 16:
                    strUpart = strUpart + "万";
                    break;
                default:
                    strUpart = strUpart + "";
                    break;
            }

            strUpper = strUpart + strUpper;
            iTemp = iTemp + 1;
        }

        strUpper = strUpper.Replace("零拾", "零");
        strUpper = strUpper.Replace("零佰", "零");
        strUpper = strUpper.Replace("零仟", "零");
        strUpper = strUpper.Replace("零零零", "零");
        strUpper = strUpper.Replace("零零", "零");
        strUpper = strUpper.Replace("零角零分", "整");
        strUpper = strUpper.Replace("零分", "整");
        strUpper = strUpper.Replace("零角", "零");
        strUpper = strUpper.Replace("零亿零万零圆", "亿圆");
        strUpper = strUpper.Replace("亿零万零圆", "亿圆");
        strUpper = strUpper.Replace("零亿零万", "亿");
        strUpper = strUpper.Replace("零万零圆", "万圆");
        strUpper = strUpper.Replace("零亿", "亿");
        strUpper = strUpper.Replace("零万", "万");
        strUpper = strUpper.Replace("零圆", "圆");
        strUpper = strUpper.Replace("零零", "零");

        // 对壹圆以下的金额的处理
        if (strUpper.Substring(0, 1) == "圆")
        {
            strUpper = strUpper.Substring(1, strUpper.Length - 1);
        }
        if (strUpper.Substring(0, 1) == "零")
        {
            strUpper = strUpper.Substring(1, strUpper.Length - 1);
        }
        if (strUpper.Substring(0, 1) == "角")
        {
            strUpper = strUpper.Substring(1, strUpper.Length - 1);
        }
        if (strUpper.Substring(0, 1) == "分")
        {
            strUpper = strUpper.Substring(1, strUpper.Length - 1);
        }
        if (strUpper.Substring(0, 1) == "整")
        {
            strUpper = "零圆整";
        }
        functionReturnValue = strUpper;

        if (IsNegative == true)
        {
            return "负" + functionReturnValue;
        }
        else
        {
            return functionReturnValue;
        }
    }

    public string MoneyToUpper2(string LowerMoney)
    {
        string functionReturnValue = null;
        bool IsNegative = false; // 是否是负数
        if (LowerMoney.Trim().Substring(0, 1) == "-")
        {
            // 是负数则先转为正数
            LowerMoney = LowerMoney.Trim().Remove(0, 1);
            IsNegative = true;
        }
        string strLower = null;
        string strUpart = null;
        string strUpper = null;
        int iTemp = 0;
        // 保留两位小数 123.489→123.49　　123.4→123.4
        LowerMoney = Math.Round(double.Parse(LowerMoney), 2).ToString();
        if (LowerMoney.IndexOf(".") > 0)
        {
            if (LowerMoney.IndexOf(".") == LowerMoney.Length - 2)
            {
                LowerMoney = LowerMoney + "0";
            }
        }
        strLower = LowerMoney;
        iTemp = 1;
        strUpper = "";
        while (iTemp <= strLower.Length)
        {
            switch (strLower.Substring(strLower.Length - iTemp, 1))
            {
                case ".":
                    strUpart = "";
                    break;
                case "0":
                    strUpart = "零";
                    break;
                case "1":
                    strUpart = "壹";
                    break;
                case "2":
                    strUpart = "贰";
                    break;
                case "3":
                    strUpart = "叁";
                    break;
                case "4":
                    strUpart = "肆";
                    break;
                case "5":
                    strUpart = "伍";
                    break;
                case "6":
                    strUpart = "陆";
                    break;
                case "7":
                    strUpart = "柒";
                    break;
                case "8":
                    strUpart = "捌";
                    break;
                case "9":
                    strUpart = "玖";
                    break;
            }

            strUpper = strUpart + strUpper;
            iTemp = iTemp + 1;
        }

        //strUpper = strUpper.Replace("零拾", "零");
        //strUpper = strUpper.Replace("零佰", "零");
        //strUpper = strUpper.Replace("零仟", "零");
        //strUpper = strUpper.Replace("零零零", "零");
        //strUpper = strUpper.Replace("零零", "零");
        //strUpper = strUpper.Replace("零角零分", "整");
        //strUpper = strUpper.Replace("零分", "整");
        //strUpper = strUpper.Replace("零角", "零");
        //strUpper = strUpper.Replace("零亿零万零圆", "亿圆");
        //strUpper = strUpper.Replace("亿零万零圆", "亿圆");
        //strUpper = strUpper.Replace("零亿零万", "亿");
        //strUpper = strUpper.Replace("零万零圆", "万圆");
        //strUpper = strUpper.Replace("零亿", "亿");
        //strUpper = strUpper.Replace("零万", "万");
        //strUpper = strUpper.Replace("零圆", "圆");
        //strUpper = strUpper.Replace("零零", "零");

        // 对壹圆以下的金额的处理
        if (strUpper.Substring(0, 1) == "圆")
        {
            strUpper = strUpper.Substring(1, strUpper.Length - 1);
        }
        if (strUpper.Substring(0, 1) == "零")
        {
            strUpper = strUpper.Substring(1, strUpper.Length - 1);
        }
        if (strUpper.Substring(0, 1) == "角")
        {
            strUpper = strUpper.Substring(1, strUpper.Length - 1);
        }
        if (strUpper.Substring(0, 1) == "分")
        {
            strUpper = strUpper.Substring(1, strUpper.Length - 1);
        }
        if (strUpper.Substring(0, 1) == "整")
        {
            strUpper = "零圆整";
        }
        functionReturnValue = strUpper;

        if (IsNegative == true)
        {
            return "负" + functionReturnValue;
        }
        else
        {
            return functionReturnValue;
        }
    }

    [CSMethod("PrintYundanXF")]
    public object PrintYundanXF(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_print where iswhole=0 and  kind=0 and companyid='" + SystemUser.CurrentUser.CompanyID + "'";
                DataTable ztdt = dbc.ExecuteDataTable(str);

                str = @"select * from jichu_print where iswhole=1 and  kind=0 and companyid='" + SystemUser.CurrentUser.CompanyID + "' order by px";
                DataTable printdt = dbc.ExecuteDataTable(str);


                string sql = @"select a.*,b.officeAddress fromAddress,c.officeAddress toOfficeAd,d.people clientName,d.address clientAddress,d.tel clientTel from yundan_yundan a
left join jichu_office b on a.officeId=b.officeId
left join jichu_office c on a.toOfficeId=c.officeId
left join jichu_client d on a.clientId=d.clientId
where a.yundan_id=" + dbc.ToSqlValue(ydid);
                DataTable sjDt = dbc.ExecuteDataTable(sql);
                sjDt.Columns.Add("JE_DX");
                sjDt.Columns.Add("JE_DX2");
                sjDt.Columns.Add("YY");
                sjDt.Columns.Add("MM");
                sjDt.Columns.Add("DD");
                foreach (DataRow dr in sjDt.Rows)
                {
                    dr["YY"] = Convert.ToDateTime(dr["yundanDate"]).Year.ToString().PadLeft(2, '0');
                    dr["MM"] = Convert.ToDateTime(dr["yundanDate"]).Month.ToString().PadLeft(2, '0');
                    dr["DD"] = Convert.ToDateTime(dr["yundanDate"]).Day.ToString().PadLeft(2, '0');
                    if (dr["moneyYunfei"] != DBNull.Value)
                    {
                        dr["JE_DX"] = MoneyToUpper(dr["moneyYunfei"].ToString());
                        dr["JE_DX2"] = MoneyToUpper2(dr["moneyYunfei"].ToString());
                    }
                }
                return new { dt = sjDt, ztdt = ztdt, printdt = printdt };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion

    #region 回单批量登记导出excel
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
                string sql = @"select b.*,c.zhuangchedanNum,d.officeName,e.officeName toOfficeName from yundan_chaifen a
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
                CellPutValue(cells, "制单日期", 1, 0, 1, 1, style2);
                CellPutValue(cells, "运单号", 1, 1, 1, 1, style2);
                CellPutValue(cells, "装车单号", 1, 2, 1, 1, style2);
                CellPutValue(cells, "核销时间", 1, 3, 1, 1, style2);
                CellPutValue(cells, "办事处", 1, 4, 1, 1, style2);
                CellPutValue(cells, "收货网点", 1, 5, 1, 1, style2);
                CellPutValue(cells, "到达站", 1, 6, 1, 1, style2);
                CellPutValue(cells, "货品", 1, 7, 1, 1, style2);
                CellPutValue(cells, "包装", 1, 8, 1, 1, style2);
                CellPutValue(cells, "件数", 1, 9, 1, 1, style2);
                CellPutValue(cells, "重量", 1, 10, 1, 1, style2);
                CellPutValue(cells, "体积", 1, 11, 1, 1, style2);
                CellPutValue(cells, "发货人", 1, 12, 1, 1, style2);
                CellPutValue(cells, "发货电话", 1, 13, 1, 1, style2);
                CellPutValue(cells, "收货人", 1, 14, 1, 1, style2);
                CellPutValue(cells, "收货电话", 1, 15, 1, 1, style2);
                CellPutValue(cells, "收货地址", 1, 16, 1, 1, style2);
                CellPutValue(cells, "送货方式", 1, 17, 1, 1, style2);
                CellPutValue(cells, "运费", 1, 18, 1, 1, style2);
                CellPutValue(cells, "结算方式", 1, 19, 1, 1, style2);
                CellPutValue(cells, "现付", 1, 20, 1, 1, style2);
                CellPutValue(cells, "到付", 1, 21, 1, 1, style2);
                CellPutValue(cells, "欠付", 1, 22, 1, 1, style2);
                CellPutValue(cells, "回单付", 1, 23, 1, 1, style2);
                CellPutValue(cells, "回扣", 1, 24, 1, 1, style2);
                CellPutValue(cells, "制单人", 1, 25, 1, 1, style2);
                CellPutValue(cells, "代收", 1, 26, 1, 1, style2);
                CellPutValue(cells, "代收手续费", 1, 27, 1, 1, style2);
                CellPutValue(cells, "回单 / 收条", 1, 28, 1, 1, style2);
                CellPutValue(cells, "回单张数", 1, 29, 1, 1, style2);

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

                    CellPutValue(cells, yundanDate, i + temp2, 0, 1, 1, style3);
                    CellPutValue(cells, yundanNum, i + temp2, 1, 1, 1, style3);
                    CellPutValue(cells, zhuangcheanNum, i + temp2, 2, 1, 1, style3);
                    CellPutValue(cells, "", i + temp2, 3, 1, 1, style3);
                    CellPutValue(cells, officeName, i + temp2, 4, 1, 1, style3);
                    CellPutValue(cells, toOfficeName, i + temp2, 5, 1, 1, style3);
                    CellPutValue(cells, toAddress, i + temp2, 6, 1, 1, style3);
                    CellPutValue(cells, goodsName, i + temp2, 7, 1, 1, style3);
                    CellPutValue(cells, pack, i + temp2, 8, 1, 1, style3);
                    CellPutValue(cells, goodsAmount, i + temp2, 9, 1, 1, style3);
                    CellPutValue(cells, goodsWeight, i + temp2, 10, 1, 1, style3);
                    CellPutValue(cells, goodsVolume, i + temp2, 11, 1, 1, style3);
                    CellPutValue(cells, fahuoPeople, i + temp2, 12, 1, 1, style3);
                    CellPutValue(cells, fahuoTel, i + temp2, 13, 1, 1, style3);
                    CellPutValue(cells, shouhuoPeople, i + temp2, 14, 1, 1, style3);
                    CellPutValue(cells, shouhuoTel, i + temp2, 15, 1, 1, style3);
                    CellPutValue(cells, shouhuoAddress, i + temp2, 16, 1, 1, style3);
                    CellPutValue(cells, songhuoType, i + temp2, 17, 1, 1, style3);
                    CellPutValue(cells, moneyYunfei, i + temp2, 18, 1, 1, style3);
                    CellPutValue(cells, payType, i + temp2, 19, 1, 1, style3);
                    CellPutValue(cells, moneyXianfu, i + temp2, 20, 1, 1, style3);
                    CellPutValue(cells, moneyDaofu, i + temp2, 21, 1, 1, style3);
                    CellPutValue(cells, moneyQianfu, i + temp2, 22, 1, 1, style3);
                    CellPutValue(cells, moneyHuidanfu, i + temp2, 23, 1, 1, style3);
                    CellPutValue(cells, isHuikouXF, i + temp2, 24, 1, 1, style3);
                    CellPutValue(cells, zhidanRen, i + temp2, 25, 1, 1, style3);
                    CellPutValue(cells, moneyDaishou, i + temp2, 26, 1, 1, style3);
                    CellPutValue(cells, moneyDaishouShouxu, i + temp2, 27, 1, 1, style3);
                    CellPutValue(cells, huidanType, i + temp2, 28, 1, 1, style3);
                    CellPutValue(cells, cntHuidan, i + temp2, 29, 1, 1, style3);

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

    [CSMethod("DownLoadHuidan", 2)]
    public byte[] DownLoadHuidan(string sjtype, string fromOfficeId, string toOfficeId, string hdType, string sjtype2, string kssj, string jssj,
        string ydh, string zcdh, string hpm, string fhr, string shr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string where = "";
                #region 查询条件
                if (!string.IsNullOrEmpty(sjtype))
                {
                    if (Convert.ToInt32(sjtype) == 0)
                    {
                        where += " and a.bschuidanDate is null ";//and a.huidanDate is null and a.huidanBack is null  bschuidanDate
                    }
                    else if (Convert.ToInt32(sjtype) == 1)
                    {
                        where += " and a.huidanDate is null";
                    }
                    else if (Convert.ToInt32(sjtype) == 2)
                    {
                        where += " and a.huidanDate is not null ";
                    }
                    else if (Convert.ToInt32(sjtype) == 3)
                    {
                        where += " and a.huidanBack is not null ";
                    }
                }

                if (!string.IsNullOrEmpty(fromOfficeId))
                {
                    where += " and " + dbc.C_EQ("a.officeId", fromOfficeId);
                }
                if (!string.IsNullOrEmpty(toOfficeId))
                {
                    where += " and " + dbc.C_EQ("a.toOfficeId", toOfficeId);
                }
                if (!string.IsNullOrEmpty(hdType))
                {
                    where += " and " + dbc.C_EQ("a.huidanType", hdType);
                }
                if (!string.IsNullOrEmpty(sjtype2))
                {
                    if (!string.IsNullOrEmpty(kssj))
                    {
                        where += " and a." + sjtype2.Trim() + ">='" + Convert.ToDateTime(kssj) + "'";
                    }
                    if (!string.IsNullOrEmpty(jssj))
                    {
                        where += " and a." + sjtype2.Trim() + "<'" + Convert.ToDateTime(jssj).AddDays(1) + "'";
                    }
                }
                if (!string.IsNullOrEmpty(ydh))
                {
                    where += " and " + dbc.C_Like("a.yundanNum", ydh, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(zcdh))
                {
                    where += " and " + dbc.C_Like("b.zhuangchedanNum", zcdh, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(fhr))
                {
                    where += " and " + dbc.C_Like("a.fahuoPeople", fhr, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(shr))
                {
                    where += " and " + dbc.C_Like("a.shouhuoPeople", shr, LikeStyle.LeftAndRightLike);
                }
                #endregion

                string str = @"select a.*,b.zhuangchedanNum,c.officeName,d.officeName as toOfficeName,0 as ti1_zt,0 as ti2_zt,0 as ti3_zt from yundan_yundan a
left join (
    select t1.*,t2.zhuangchedanNum from yundan_chaifen t1
    left join zhuangchedan_zhuangchedan t2 on t1.zhuangchedan_id=t2.zhuangchedan_id
)b on a.yundan_id=b.yundan_id and b.is_leaf=0
left join jichu_office c on a.officeId=c.officeId
left join jichu_office d on a.toOfficeId=d.officeId
where a.status=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + where + @"
order by addtime desc";
                DataTable dt = dbc.ExecuteDataTable(str);

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

                CellPutValue(cells, "回单导出", 0, 0, 1, 30, style1);
                cells.SetRowHeight(0, 25.5);

                CellPutValue(cells, "运单号", 1, 0, 1, 1, style2);
                CellPutValue(cells, "装车单号", 1, 1, 1, 1, style2);
                CellPutValue(cells, "制单日期", 1, 2, 1, 1, style2);
                CellPutValue(cells, "办事处回单", 1, 3, 1, 1, style2);
                CellPutValue(cells, "回单收到", 1, 4, 1, 1, style2);
                CellPutValue(cells, "回单送出", 1, 5, 1, 1, style2);
                CellPutValue(cells, "短消息（回单到总部时）", 1, 6, 1, 1, style2);
                CellPutValue(cells, "到达站", 1, 7, 1, 1, style2);
                CellPutValue(cells, "发货人", 1, 8, 1, 1, style2);
                CellPutValue(cells, "发货电话", 1, 9, 1, 1, style2);
                CellPutValue(cells, "收货人", 1, 10, 1, 1, style2);
                CellPutValue(cells, "货品", 1, 11, 1, 1, style2);
                CellPutValue(cells, "件数", 1, 12, 1, 1, style2);
                CellPutValue(cells, "重量", 1, 13, 1, 1, style2);
                CellPutValue(cells, "体积", 1, 14, 1, 1, style2);
                CellPutValue(cells, "回单 / 收条", 1, 15, 1, 1, style2);
                CellPutValue(cells, "回单份数", 1, 16, 1, 1, style2);
                CellPutValue(cells, "送货方式", 1, 17, 1, 1, style2);
                CellPutValue(cells, "运费", 1, 18, 1, 1, style2);
                CellPutValue(cells, "结算方式", 1, 19, 1, 1, style2);
                CellPutValue(cells, "现付", 1, 20, 1, 1, style2);
                CellPutValue(cells, "到付", 1, 21, 1, 1, style2);
                CellPutValue(cells, "欠付", 1, 22, 1, 1, style2);
                CellPutValue(cells, "回单付", 1, 23, 1, 1, style2);
                CellPutValue(cells, "回扣", 1, 24, 1, 1, style2);
                CellPutValue(cells, "制单人", 1, 25, 1, 1, style2);
                CellPutValue(cells, "代收", 1, 26, 1, 1, style2);
                CellPutValue(cells, "代收手续费", 1, 27, 1, 1, style2);
                CellPutValue(cells, "备注", 1, 28, 1, 1, style2);

                var temp2 = 2;  //数据从第三行开始填充
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    var yundanNum = dt.Rows[i]["yundanNum"] == DBNull.Value ? "" : dt.Rows[i]["yundanNum"].ToString();
                    var zhuangcheanNum = dt.Rows[i]["zhuangchedanNum"] == DBNull.Value ? "" : dt.Rows[i]["zhuangchedanNum"].ToString();
                    var yundanDate = dt.Rows[i]["yundanDate"] == DBNull.Value ? "" : Convert.ToDateTime(dt.Rows[i]["yundanDate"]).ToString("yyyy-MM-dd");
                    var bschuidanDate = dt.Rows[i]["bschuidanDate"] == DBNull.Value ? "" : Convert.ToDateTime(dt.Rows[i]["bschuidanDate"]).ToString("yyyy-MM-dd");
                    var huidanDate = dt.Rows[i]["huidanDate"] == DBNull.Value ? "" : Convert.ToDateTime(dt.Rows[i]["huidanDate"]).ToString("yyyy-MM-dd");
                    var huidanBack = dt.Rows[i]["huidanBack"] == DBNull.Value ? "" : Convert.ToDateTime(dt.Rows[i]["huidanBack"]).ToString("yyyy-MM-dd");
                    var toAddress = dt.Rows[i]["toAddress"] == DBNull.Value ? "" : dt.Rows[i]["toAddress"].ToString();
                    var fahuoPeople = dt.Rows[i]["fahuoPeople"] == DBNull.Value ? "" : dt.Rows[i]["fahuoPeople"].ToString();
                    var fahuoTel = dt.Rows[i]["fahuoTel"] == DBNull.Value ? "" : dt.Rows[i]["fahuoTel"].ToString();
                    var shouhuoPeople = dt.Rows[i]["shouhuoPeople"] == DBNull.Value ? "" : dt.Rows[i]["shouhuoPeople"].ToString();
                    var goodsName = dt.Rows[i]["goodsName"] == DBNull.Value ? "" : dt.Rows[i]["goodsName"].ToString();
                    var goodsAmount = dt.Rows[i]["goodsAmount"] == DBNull.Value ? "" : dt.Rows[i]["goodsAmount"].ToString();
                    var goodsWeight = dt.Rows[i]["goodsWeight"] == DBNull.Value ? "" : dt.Rows[i]["goodsWeight"].ToString();
                    var goodsVolume = dt.Rows[i]["goodsVolume"] == DBNull.Value ? "" : dt.Rows[i]["goodsVolume"].ToString();
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
                    var isHuikouXF = "";//
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
                    var memo = dt.Rows[i]["memo"] == DBNull.Value ? "" : dt.Rows[i]["memo"].ToString();

                    //var officeName = dt.Rows[i]["officeName"] == DBNull.Value ? "" : dt.Rows[i]["officeName"].ToString();memo
                    //var toOfficeName = dt.Rows[i]["toOfficeName"] == DBNull.Value ? "" : dt.Rows[i]["toOfficeName"].ToString();
                    //var pack = dt.Rows[i]["pack"] == DBNull.Value ? "" : dt.Rows[i]["pack"].ToString();



                    //var shouhuoTel = dt.Rows[i]["shouhuoTel"] == DBNull.Value ? "" : dt.Rows[i]["shouhuoTel"].ToString();
                    //var shouhuoAddress = dt.Rows[i]["shouhuoAddress"] == DBNull.Value ? "" : dt.Rows[i]["shouhuoAddress"].ToString();








                    CellPutValue(cells, yundanNum, i + temp2, 0, 1, 1, style3);
                    CellPutValue(cells, zhuangcheanNum, i + temp2, 1, 1, 1, style3);
                    CellPutValue(cells, yundanDate, i + temp2, 2, 1, 1, style3);
                    CellPutValue(cells, bschuidanDate, i + temp2, 3, 1, 1, style3);
                    CellPutValue(cells, huidanDate, i + temp2, 4, 1, 1, style3);
                    CellPutValue(cells, huidanBack, i + temp2, 5, 1, 1, style3);
                    CellPutValue(cells, "", i + temp2, 6, 1, 1, style3);
                    CellPutValue(cells, toAddress, i + temp2, 7, 1, 1, style3);
                    CellPutValue(cells, fahuoPeople, i + temp2, 8, 1, 1, style3);
                    CellPutValue(cells, fahuoTel, i + temp2, 9, 1, 1, style3);
                    CellPutValue(cells, shouhuoPeople, i + temp2, 10, 1, 1, style3);
                    CellPutValue(cells, goodsName, i + temp2, 11, 1, 1, style3);
                    CellPutValue(cells, goodsAmount, i + temp2, 12, 1, 1, style3);
                    CellPutValue(cells, goodsWeight, i + temp2, 13, 1, 1, style3);
                    CellPutValue(cells, goodsVolume, i + temp2, 14, 1, 1, style3);
                    CellPutValue(cells, huidanType, i + temp2, 15, 1, 1, style3);
                    CellPutValue(cells, cntHuidan, i + temp2, 16, 1, 1, style3);
                    CellPutValue(cells, songhuoType, i + temp2, 17, 1, 1, style3);
                    CellPutValue(cells, moneyYunfei, i + temp2, 18, 1, 1, style3);
                    CellPutValue(cells, payType, i + temp2, 19, 1, 1, style3);
                    CellPutValue(cells, moneyXianfu, i + temp2, 20, 1, 1, style3);
                    CellPutValue(cells, moneyDaofu, i + temp2, 21, 1, 1, style3);
                    CellPutValue(cells, moneyQianfu, i + temp2, 22, 1, 1, style3);
                    CellPutValue(cells, moneyHuidanfu, i + temp2, 23, 1, 1, style3);
                    CellPutValue(cells, isHuikouXF, i + temp2, 24, 1, 1, style3);
                    CellPutValue(cells, zhidanRen, i + temp2, 25, 1, 1, style3);
                    CellPutValue(cells, moneyDaishou, i + temp2, 26, 1, 1, style3);
                    CellPutValue(cells, moneyDaishouShouxu, i + temp2, 27, 1, 1, style3);
                    CellPutValue(cells, memo, i + temp2, 28, 1, 1, style3);

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
    #endregion
}
