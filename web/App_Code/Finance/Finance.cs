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

/// <summary>
/// Finance 的摘要说明
/// </summary>
[CSClass("Finance")]
public class Finance
{
    public Finance()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    #region 获取货物分流运单列表
    /// <summary>
    /// 获取货物分流运单列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="bsc">办事处id</param>
    /// <param name="start_time">运单开始时间</param>
    /// <param name="end_time">运单结束时间</param>
    /// <param name="zcd">装车单号</param>
    /// <param name="ydh">运单号</param>
    /// <param name="isfl">是否分流</param>
    /// <returns></returns>
    [CSMethod("GetYunDanList")]
    public object GetYunDanList(int pagnum, int pagesize, string bsc, string start_time, string end_time, string zcd, string ydh, string isfl)
    {
        using (var db = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string where = "";
                if (!string.IsNullOrEmpty(bsc))
                {
                    where += " and c.toOfficeId = @toOfficeId";
                }
                if (!string.IsNullOrEmpty(start_time) && !string.IsNullOrEmpty(end_time))
                {
                    where += " and b.yundanDate >= @yundanDate and b.yundanDate < @yundanDate1";
                }
                if (!string.IsNullOrEmpty(zcd))
                {
                    where += " and c.zhuangchedanNum like @zhuangchedanNum";
                }
                if (!string.IsNullOrEmpty(ydh))
                {
                    where += " and b.yundanNum like @yundanNum";
                }
                if (!string.IsNullOrEmpty(isfl))
                {
                    if (isfl == "0")
                        where += " and e.fl is nul";
                    else
                        where += " and e.fl is not null";
                }

                string CompanyID = SystemUser.CurrentUser.CompanyID;

                string sql = @"select 
                                a.yundan_chaifen_id,
                                c.zhuangchedan_id,
                                b.yundan_id,
                                b.yundanNum,
                                c.zhuangchedanNum,
                                d.people,
                                b.toAddress,
                                b.shouhuoPeople,
                                b.shouhuoTel,
                                b.songhuoType,
                                b.moneyYunfei,
                                b.moneyHuikouXianFan,
                                b.moneyHuikouQianFan,
                                b.memo,
                                e.fl,
                                f.YDJSHF,
                                g.YDJZZF,
                                h.YHXSHF,
                                i.YHXZZF
                                from yundan_chaifen a 
                                left join yundan_yundan b on a.yundan_id = b.yundan_id
                                left join zhuangchedan_zhuangchedan c on a.zhuangchedan_id = c.zhuangchedan_id
                                left join jichu_driver d on c.driverId = d.driverId
                                left join (select count(*) fl,yundan_chaifen_id from yundan_duanbo_fenliu where companyId = @CompanyID and status = 0 group by yundan_chaifen_id) e on a.yundan_chaifen_id = e.yundan_chaifen_id
                                left join (select sum(money) YDJSHF,yundan_chaifen_id from yundan_duanbo_fenliu where companyId = @CompanyID and driverId is not null and status = 0 group by yundan_chaifen_id) f on a.yundan_chaifen_id = f.yundan_chaifen_id
                                left join (select sum(money) YDJZZF,yundan_chaifen_id from yundan_duanbo_fenliu where companyId = @CompanyID and zhongzhuanId is not null and status = 0 group by yundan_chaifen_id) g on a.yundan_chaifen_id = g.yundan_chaifen_id
                                left join (select sum(money) YHXSHF,yundan_chaifen_id from caiwu_expense where companyId = @CompanyID and kind = 6 and status = 0 group by yundan_chaifen_id) h on a.yundan_chaifen_id = h.yundan_chaifen_id
                                left join (select sum(money) YHXZZF,yundan_chaifen_id from caiwu_expense where companyId = @CompanyID and kind = 7 and status = 0 group by yundan_chaifen_id) i on a.yundan_chaifen_id = i.yundan_chaifen_id
                                where a.status = 0 and a.is_leaf = 0 and a.companyId = @CompanyID and c.status = 0";
                SqlCommand cmd = db.CreateCommand(sql);
                cmd.Parameters.Add("@CompanyID", CompanyID);
                if (!string.IsNullOrEmpty(bsc))
                    cmd.Parameters.Add("@toOfficeId", bsc);
                if (!string.IsNullOrEmpty(start_time) && !string.IsNullOrEmpty(end_time))
                {
                    cmd.Parameters.Add("@yundanDate", Convert.ToDateTime(start_time));
                    cmd.Parameters.Add("@yundanDate1", Convert.ToDateTime(end_time));
                }
                if (!string.IsNullOrEmpty(zcd))
                    cmd.Parameters.Add("@zhuangchedanNum", "%" + zcd + "%");
                if (!string.IsNullOrEmpty(ydh))
                    cmd.Parameters.Add("@yundanNum", "%" + ydh + "%");
                DataTable dt = db.GetPagedDataTable(cmd, pagesize, ref cp, out ac);

                dt.Columns.Add("moneyHuiKou");

                for (var i = 0; i < dt.Rows.Count; i++)
                    dt.Rows[i]["moneyHuiKou"] = Convert.ToDecimal(dt.Rows[i]["moneyHuikouXianFan"].ToString()) + Convert.ToDecimal(dt.Rows[i]["moneyHuikouQianFan"].ToString());

                return new { dt = dt, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion

    #region 办事处列表
    /// <summary>
    /// 办事处列表
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetOfficeList")]
    public DataTable GetOfficeList()
    {
        using (var db = new DBConnection())
        {
            try
            {
                string CompanyId = SystemUser.CurrentUser.CompanyID;
                string sql = "select officeId id,officeName mc from jichu_office where status = 0 and companyId = @CompanyId order by addtime";
                SqlCommand cmd = db.CreateCommand(sql);
                cmd.Parameters.Add("@CompanyId", CompanyId);
                DataTable dt = db.ExecuteDataTable(cmd);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion

    #region 获取中转公司列表
    /// <summary>
    /// 获取中转公司列表
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetCompanyList")]
    public DataTable GetCompanyList()
    {
        using (var db = new DBConnection())
        {
            string CompanyID = SystemUser.CurrentUser.CompanyID;
            string sql = "select zhongzhuanId id,compName mc from jichu_zhongzhuan where status = 0 and companyId = @CompanyID order by addtime";
            SqlCommand cmd = db.CreateCommand(sql);
            cmd.Parameters.Add("@CompanyID", CompanyID);
            DataTable dt = db.ExecuteDataTable(cmd);
            return dt;
        }
    }
    #endregion

    #region 获取司机列表
    /// <summary>
    /// 获取司机列表
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetDriverList")]
    public DataTable GetDriverList()
    {
        using (var db = new DBConnection())
        {
            string CompanyID = SystemUser.CurrentUser.CompanyID;
            string sql = "select driverId id,people mc from jichu_driver where status = 0 and companyId = @CompanyID order by addtime";
            SqlCommand cmd = db.CreateCommand(sql);
            cmd.Parameters.Add("@CompanyID", CompanyID);
            DataTable dt = db.ExecuteDataTable(cmd);
            return dt;
        }
    }
    #endregion

    #region 新增应收记录
    /// <summary>
    /// 新增应收记录
    /// </summary>
    /// <param name="kind">运单   1：预付，2：欠付，3：到付，4：代收货款 点上收取，5：代收货款手续费收入 总部应收，
    ///                    装车单 6：主货到付，7：货款押金，8：司机押金(独立账目之外)</param>
    ///                    注：回单收也是欠付的一种
    [CSMethod("AddIncome")]
    public void AddIncome(DBConnection dbc, int kind, JSReader jsr, string ydid, string cfdid, string zcdid)
    {
        try
        {
            if (kind == 1 || kind == 2 || kind == 3 || kind == 4 || kind == 5)
            {
                #region
                var user = SystemUser.CurrentUser;
                DataTable dt = dbc.GetEmptyDataTable("caiwu_income");
                DataRow dr = dt.NewRow();
                dr["id"] = Guid.NewGuid().ToString();
                dr["isLock"] = 0;
                dr["kind"] = kind;
                dr["officeId"] = user.CsOfficeId;
                //dr["incomeCode"] = jsr[""].ToString();
                //dr["incomeDate"] = jsr[""].ToString();
                //if (!string.IsNullOrEmpty(jsr["itemId"].ToString()))
                //{
                //    dr["itemId"] = jsr["itemId"].ToString();
                //}
                if (!string.IsNullOrEmpty(ydid))
                {
                    dr["yundanId"] = ydid;
                }
                if (!string.IsNullOrEmpty(jsr["fahuoPeople"].ToString()))
                {
                    dr["clientId"] = jsr["fahuoPeople"].ToString();
                }
                //if (!string.IsNullOrEmpty(jsr["zhuangchedanId"].ToString()))
                //{
                //    dr["zhuangchedanId"] = jsr["zhuangchedanId"].ToString();
                //}
                //if (!string.IsNullOrEmpty(jsr["driverId"].ToString()))
                //{
                //    dr["driverId"] = jsr["driverId"].ToString();
                //}
                //if (!string.IsNullOrEmpty(jsr["zhongzhuanId"].ToString()))
                //{
                //    dr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                //}
                //if (!string.IsNullOrEmpty(jsr["money"].ToString()))
                //{
                //    dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                //}
                //dr["bank"] = jsr["bank"].ToString();
                if (!string.IsNullOrEmpty(jsr["memo"].ToString()))
                {
                    dr["memo"] = jsr["memo"].ToString();
                }
                dr["adduser"] = user.UserID;
                dr["addtime"] = DateTime.Now;
                dr["companyId"] = user.CompanyID;
                if (!string.IsNullOrEmpty(cfdid))
                {
                    dr["yundan_chaifen_id"] = cfdid;
                }
                dr["status"] = 0;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);
                #endregion
            }
            else if (kind == 6 || kind == 7)
            {
                #region
                var user = SystemUser.CurrentUser;
                DataTable dt = dbc.GetEmptyDataTable("caiwu_income");
                DataRow dr = dt.NewRow();
                dr["id"] = Guid.NewGuid().ToString();
                dr["isLock"] = 0;
                dr["kind"] = kind;
                dr["officeId"] = user.CsOfficeId;
                if (!string.IsNullOrEmpty(zcdid))
                {
                    dr["zhuangchedanId"] = zcdid;
                }
                if (!string.IsNullOrEmpty(jsr["driverId"].ToString()))
                {
                    dr["driverId"] = jsr["driverId"].ToString();
                }
                if (!string.IsNullOrEmpty(jsr["memo"].ToString()))
                {
                    dr["memo"] = jsr["memo"].ToString();
                }
                dr["adduser"] = user.UserID;
                dr["addtime"] = DateTime.Now;
                dr["companyId"] = user.CompanyID;
                dr["status"] = 0;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);
                #endregion
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    #endregion

    #region 新增应付记录
    /// <summary>
    /// 新增应付记录
    /// </summary>
    /// <param name="kind">运单-费用设置 1：短驳，2：中转，3：送货，
    ///                    运单         4：回扣，5：代收货款支付 总部支出（已扣掉手续费），
    ///                    装车单       6：主货到付，7：司机押金退还，8：司机预付费，9：司机欠付费，10：司机到付费，11：司机押金(独立账目之外)
    [CSMethod("AddExpense")]
    public void AddExpense(DBConnection dbc, int kind, JSReader jsr, string ydid, string cfdid, string zcdid)
    {
        try
        {
            if (kind == 1)
            {
                #region
                var user = SystemUser.CurrentUser;
                DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                DataRow dr = dt.NewRow();
                dr["id"] = Guid.NewGuid().ToString();
                dr["isLock"] = 0;
                dr["kind"] = kind;
                dr["officeId"] = user.CsOfficeId;
                //dr["expenseCode"] =
                //dr["expenseDate"] = 
                //dr["expenseWay"] =    //现金、支票、电汇
                //if (!string.IsNullOrEmpty(jsr["itemId"].ToString()))
                //{
                //    dr["itemId"] = jsr["itemId"].ToString();
                //}
                if (!string.IsNullOrEmpty(ydid))
                {
                    dr["yundanId"] = ydid;
                }
                //if (!string.IsNullOrEmpty(jsr["clientId"].ToString()))
                //{
                //    dr["clientId"] = jsr["clientId"].ToString();
                //}
                //if (!string.IsNullOrEmpty(jsr["zhuangchedanId"].ToString()))
                //{
                //    dr["zhuangchedanId"] = jsr["zhuangchedanId"].ToString();
                //}
                if (!string.IsNullOrEmpty(jsr["driverId"].ToString()))
                {
                    dr["driverId"] = jsr["driverId"].ToString();
                }
                //if (!string.IsNullOrEmpty(jsr["zhongzhuanId"].ToString()))
                //{
                //    dr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                //}
                //dr["bank"] =
                //if (!string.IsNullOrEmpty(jsr["money"].ToString()))
                //{
                //    dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                //}
                if (!string.IsNullOrEmpty(jsr["memo"].ToString()))
                {
                    dr["memo"] = jsr["memo"].ToString();
                }
                dr["adduser"] = user.UserID;
                dr["addtime"] = DateTime.Now;
                dr["companyId"] = user.CompanyID;
                if (!string.IsNullOrEmpty(cfdid))
                {
                    dr["yundan_chaifen_id"] = cfdid;
                }
                dr["status"] = 0;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);
                #endregion
            }
            else if (kind == 2)
            {
                #region
                var user = SystemUser.CurrentUser;
                DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                DataRow dr = dt.NewRow();
                dr["id"] = Guid.NewGuid().ToString();
                dr["isLock"] = 0;
                dr["kind"] = kind;
                dr["officeId"] = user.CsOfficeId;
                //dr["expenseCode"] =
                //dr["expenseDate"] = 
                //dr["expenseWay"] =    //现金、支票、电汇
                //if (!string.IsNullOrEmpty(jsr["itemId"].ToString()))
                //{
                //    dr["itemId"] = jsr["itemId"].ToString();
                //}
                if (!string.IsNullOrEmpty(ydid))
                {
                    dr["yundanId"] = ydid;
                }
                //if (!string.IsNullOrEmpty(jsr["clientId"].ToString()))
                //{
                //    dr["clientId"] = jsr["clientId"].ToString();
                //}
                //if (!string.IsNullOrEmpty(zcdid))
                //{
                //    dr["zhuangchedanId"] = zcdid;
                //}
                //if (!string.IsNullOrEmpty(jsr["driverId"].ToString()))
                //{
                //    dr["driverId"] = jsr["driverId"].ToString();
                //}
                if (!string.IsNullOrEmpty(jsr["zhongzhuanId"].ToString()))
                {
                    dr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                }
                //dr["bank"] =
                //if (!string.IsNullOrEmpty(jsr["money"].ToString()))
                //{
                //    dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                //}
                if (!string.IsNullOrEmpty(jsr["memo"].ToString()))
                {
                    dr["memo"] = jsr["memo"].ToString();
                }
                dr["adduser"] = user.UserID;
                dr["addtime"] = DateTime.Now;
                dr["companyId"] = user.CompanyID;
                if (!string.IsNullOrEmpty(cfdid))
                {
                    dr["yundan_chaifen_id"] = cfdid;
                }
                dr["status"] = 0;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);
                #endregion
            }
            else if (kind == 3)
            {
                #region
                var user = SystemUser.CurrentUser;
                DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                DataRow dr = dt.NewRow();
                dr["id"] = Guid.NewGuid().ToString();
                dr["isLock"] = 0;
                dr["kind"] = kind;
                dr["officeId"] = user.CsOfficeId;
                //dr["expenseCode"] =
                //dr["expenseDate"] = 
                //dr["expenseWay"] =    //现金、支票、电汇
                //if (!string.IsNullOrEmpty(jsr["itemId"].ToString()))
                //{
                //    dr["itemId"] = jsr["itemId"].ToString();
                //}
                if (!string.IsNullOrEmpty(ydid))
                {
                    dr["yundanId"] = ydid;
                }
                //if (!string.IsNullOrEmpty(jsr["clientId"].ToString()))
                //{
                //    dr["clientId"] = jsr["clientId"].ToString();
                //}
                //if (!string.IsNullOrEmpty(zcdid))
                //{
                //    dr["zhuangchedanId"] = zcdid;
                //}
                if (!string.IsNullOrEmpty(jsr["driverId"].ToString()))
                {
                    dr["driverId"] = jsr["driverId"].ToString();
                }
                //if (!string.IsNullOrEmpty(jsr["zhongzhuanId"].ToString()))
                //{
                //    dr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                //}
                //dr["bank"] =
                //if (!string.IsNullOrEmpty(jsr["money"].ToString()))
                //{
                //    dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                //}
                if (!string.IsNullOrEmpty(jsr["memo"].ToString()))
                {
                    dr["memo"] = jsr["memo"].ToString();
                }
                dr["adduser"] = user.UserID;
                dr["addtime"] = DateTime.Now;
                dr["companyId"] = user.CompanyID;
                if (!string.IsNullOrEmpty(cfdid))
                {
                    dr["yundan_chaifen_id"] = cfdid;
                }
                dr["status"] = 0;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);
                #endregion
            }
            else if (kind == 4 || kind == 5)
            {
                #region
                var user = SystemUser.CurrentUser;
                DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                DataRow dr = dt.NewRow();
                dr["id"] = Guid.NewGuid().ToString();
                dr["isLock"] = 0;
                dr["kind"] = kind;
                dr["officeId"] = user.CsOfficeId;
                //dr["expenseCode"] =
                //dr["expenseDate"] = 
                //dr["expenseWay"] =    //现金、支票、电汇
                //if (!string.IsNullOrEmpty(jsr["itemId"].ToString()))
                //{
                //    dr["itemId"] = jsr["itemId"].ToString();
                //}
                if (!string.IsNullOrEmpty(ydid))
                {
                    dr["yundanId"] = ydid;
                }
                if (!string.IsNullOrEmpty(jsr["fahuoPeople"].ToString()))
                {
                    dr["clientId"] = jsr["fahuoPeople"].ToString();
                }
                //if (!string.IsNullOrEmpty(jsr["zhuangchedanId"].ToString()))
                //{
                //    dr["zhuangchedanId"] = jsr["zhuangchedanId"].ToString();
                //}
                //if (!string.IsNullOrEmpty(jsr["driverId"].ToString()))
                //{
                //    dr["driverId"] = jsr["driverId"].ToString();
                //}
                //if (!string.IsNullOrEmpty(jsr["zhongzhuanId"].ToString()))
                //{
                //    dr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                //}
                //dr["bank"] =
                //if (!string.IsNullOrEmpty(jsr["money"].ToString()))
                //{
                //    dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                //}
                //if (!string.IsNullOrEmpty(jsr["memo"].ToString()))
                //{
                //    dr["memo"] = jsr["memo"].ToString();
                //}
                dr["adduser"] = user.UserID;
                dr["addtime"] = DateTime.Now;
                dr["companyId"] = user.CompanyID;
                if (!string.IsNullOrEmpty(cfdid))
                {
                    dr["yundan_chaifen_id"] = cfdid;
                }
                dr["status"] = 0;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);
                #endregion
            }
            else if (kind == 6 || kind == 7 || kind == 8 || kind == 9 || kind == 10)
            {
                #region
                var user = SystemUser.CurrentUser;
                DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                DataRow dr = dt.NewRow();
                dr["id"] = Guid.NewGuid().ToString();
                dr["isLock"] = 0;
                dr["kind"] = kind;
                dr["officeId"] = user.CsOfficeId;
                //dr["expenseCode"] =
                //dr["expenseDate"] = 
                //dr["expenseWay"] =    //现金、支票、电汇
                //if (!string.IsNullOrEmpty(jsr["itemId"].ToString()))
                //{
                //    dr["itemId"] = jsr["itemId"].ToString();
                //}
                //if (!string.IsNullOrEmpty(jsr["yundanId"].ToString()))
                //{
                //    dr["yundanId"] = jsr["yundanId"].ToString();
                //}
                //if (!string.IsNullOrEmpty(jsr["clientId"].ToString()))
                //{
                //    dr["clientId"] = jsr["clientId"].ToString();
                //}
                if (!string.IsNullOrEmpty(zcdid))
                {
                    dr["zhuangchedanId"] = zcdid;
                }
                if (!string.IsNullOrEmpty(jsr["driverId"].ToString()))
                {
                    dr["driverId"] = jsr["driverId"].ToString();
                }
                //if (!string.IsNullOrEmpty(jsr["zhongzhuanId"].ToString()))
                //{
                //    dr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                //}
                //dr["bank"] =
                //if (!string.IsNullOrEmpty(jsr["money"].ToString()))
                //{
                //    dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                //}
                if (!string.IsNullOrEmpty(jsr["memo"].ToString()))
                {
                    dr["memo"] = jsr["memo"].ToString();
                }
                dr["adduser"] = user.UserID;
                dr["addtime"] = DateTime.Now;
                dr["companyId"] = user.CompanyID;
                //if (!string.IsNullOrEmpty(jsr["yundan_chaifen_id"].ToString()))
                //{
                //    dr["yundan_chaifen_id"] = jsr["yundan_chaifen_id"].ToString();
                //}
                dr["status"] = 0;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);
                #endregion
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    #endregion

    #region 应收核销
    #region 预付运费核销
    /// <summary>
    /// 预付运费核销
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="bscid"></param>
    /// <param name="kssj"></param>
    /// <param name="jssj"></param>
    /// <param name="fhr"></param>
    /// <param name="ydbh"></param>
    /// <returns></returns>
    [CSMethod("GetYfyfHxListByPage")]
    public object GetYfyfHxListByPage(int pagnum, int pagesize, string hxzt, string bscid, string kssj, string jssj, string fhr, string ydbh)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                int cp = pagnum;
                int ac = 0;

                #region 拼接查询条件
                List<string> list_where = new List<string>();
                if (!string.IsNullOrEmpty(hxzt))
                {
                    list_where.Add("b.isOverYufuHexiao=" + dbc.ToSqlValue(hxzt));
                }
                if (!string.IsNullOrEmpty(bscid))
                {
                    list_where.Add("a.officeId=" + dbc.ToSqlValue(bscid));
                }
                if (!string.IsNullOrEmpty(kssj))
                {
                    list_where.Add("b.yundanDate>=" + dbc.ToSqlValue(Convert.ToDateTime(kssj)));
                }
                if (!string.IsNullOrEmpty(jssj))
                {
                    list_where.Add("b.yundanDate<" + dbc.ToSqlValue(Convert.ToDateTime(jssj).AddDays(1)));
                }
                if (!string.IsNullOrEmpty(fhr))
                {
                    list_where.Add("b.fahuoPeople like '%" + fhr + "%'");
                }
                if (!string.IsNullOrEmpty(ydbh))
                {
                    list_where.Add("b.yundanNum like '%" + ydbh + "%'");
                }
                #endregion

                string sql = @"select 
a.id,
a.yundanId yundan_id,
b.yundanNum,
c.zhuangchedanNum,
isNULL(b.moneyXianfu,0) moneyXianfu,
isNULL(a.money,0) yhxmoney,
(isNULL(b.moneyXianfu,0)-isNULL(a.money,0)) whxmoney,
a.incomeDate,
a.officeId,
f.officeName,
b.fahuoPeople,
b.fahuoTel,
b.shouhuoPeople,
b.shouhuoTel,
b.shouhuoAddress,
b.ddofficeName,
b.songhuoType,
b.payType,
b.moneyYunfei,
b.zhidanRen UserName,
b.memo
from caiwu_income a
left join (
	select h.*,i.officeName ddofficeName from yundan_yundan h
	left join jichu_office i on h.toOfficeId=i.officeId
)b on a.yundanId=b.yundan_id
left join (
	select d.*,e.zhuangchedanNum from yundan_chaifen d
	left join dbo.zhuangchedan_zhuangchedan e on d.zhuangchedan_id=e.zhuangchedan_id
	where d.status=0 and d.is_leaf=0
)c on a.yundan_chaifen_id=c.yundan_chaifen_id
left join jichu_office f on a.officeId=f.officeId
where a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and a.status=0 and a.kind=1 and a.isLock=0 ";

                if (list_where.Count > 0)
                {
                    sql += " and " + string.Join(" and ", list_where);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt_return.Columns.Add("isbj", typeof(bool));
                dt_return.Columns.Add("isxz", typeof(Int32));
                foreach (DataRow dr in dt_return.Rows)
                {
                    dr["isbj"] = false;
                    dr["isxz"] = 0;
                }
                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /// <summary>
    /// 预付运费核销保存
    /// </summary>
    /// <param name="xzlist"></param>
    /// <param name="hxrq"></param>
    /// <returns></returns>
    [CSMethod("SaveYFYFHx")]
    public object SaveYFYFHx(JSReader xzlist, string hxrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable cwdt = dbc.GetEmptyDataTable("caiwu_income");
                DataTableTracker cwdtt = new DataTableTracker(cwdt);

                List<string> yhxYundanIdArr = new List<string>();
                for (int i = 0; i < xzlist.ToArray().Length; i++)
                {
                    decimal hxje = string.IsNullOrEmpty(xzlist[i]["hxje"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["hxje"].ToString());
                    decimal yhxje = string.IsNullOrEmpty(xzlist[i]["yhxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["yhxmoney"].ToString());
                    decimal whxje = string.IsNullOrEmpty(xzlist[i]["whxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["whxmoney"].ToString());
                    DataRow cwdr = cwdt.NewRow();
                    cwdr["id"] = xzlist[i]["id"].ToString();
                    if (hxje == whxje)
                    {
                        //更新运单表状态
                        yhxYundanIdArr.Add(xzlist[i]["yundan_id"].ToString());

                        //锁表列
                        cwdr["isLock"] = 1;

                        //财物日记
                        SortedList<string, string> sdl = new SortedList<string, string>();
                        sdl.Add("kind", "1");
                        sdl.Add("officeId", xzlist[i]["officeId"].ToString());
                        sdl.Add("incomeId", xzlist[i]["id"].ToString());
                        sdl.Add("yundanId", xzlist[i]["yundan_id"].ToString());
                        sdl.Add("dateFasheng", hxrq);
                        //sdl.Add("memo", xzlist[i]["memo"].ToString());
                        InsertRJ(sdl, yhxje + hxje, 1);
                    }
                    cwdr["incomeDate"] = Convert.ToDateTime(hxrq);
                    cwdr["money"] = yhxje + hxje;
                    cwdt.Rows.Add(cwdr);

                    saveLog(xzlist[i]["id"].ToString(), Convert.ToDateTime(hxrq), hxje, "预付核销");
                }
                dbc.UpdateTable(cwdt, cwdtt);

                string sql = @"update yundan_yundan set isOverYufuHexiao=1 where yundan_id in('" + string.Join("','", yhxYundanIdArr) + "')";
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
    #endregion

    #region 欠付运费核销
    /// <summary>
    /// 获取所有客户欠付核算信息
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="bscid"></param>
    /// <param name="kssj"></param>
    /// <param name="jssj"></param>
    /// <param name="client"></param>
    /// <returns></returns>
    [CSMethod("GetClientQfByPage")]
    public object GetClientQfByPage(int pagnum, int pagesize, string bscid, string kssj, string jssj, string client)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                var user = SystemUser.CurrentUser;
                string companyId = user.CompanyID;

                int cp = pagnum;
                int ac = 0;

                #region 拼接查询条件
                List<string> list_where = new List<string>();
                if (!string.IsNullOrEmpty(bscid))
                {
                    list_where.Add("a.officeId=" + dbc.ToSqlValue(bscid));
                }
                if (!string.IsNullOrEmpty(kssj))
                {
                    list_where.Add("e.qsDate>=" + dbc.ToSqlValue(Convert.ToDateTime(kssj)));
                }
                if (!string.IsNullOrEmpty(jssj))
                {
                    list_where.Add("e.qsDate<" + dbc.ToSqlValue(Convert.ToDateTime(jssj).AddDays(1)));
                }
                if (!string.IsNullOrEmpty(client))
                {
                    list_where.Add("a.people like '%" + client + "%'");
                }
                #endregion

                string sql = @"select 
                                a.clientId,
                                a.people,
                                a.tel,
                                isNULL(b.sumMoney,0)sumMoney,
                                isNULL(c.yhxMoney,0)yhxMoney,
                                (isNULL(b.sumMoney,0)-isNULL(c.yhxMoney,0)) whxMoney,
                                (isNULL(b.sumMoney,0)-isNULL(c.yhxMoney,0)-isNULL(d.maxlimit,0)) SortByMoney,
                                DATEDIFF(day,e.qsDate,GETDATE())SortByDays,
                                case
                                when (d.minlimit IS NULL or d.maxlimit IS null) then '未授权'
                                else CONVERT(varchar(10),d.minlimit)+'~'+CONVERT(varchar(10),d.maxlimit)
                                end as limit,
                                case 
                                when d.period IS NULL then '-'
                                else CONVERT(varchar(10),d.period)+'天'
                                end as period,
                                d.UserXM sq_people
                                from jichu_client a
                                left join (
	                                select clientId,(SUM(moneyQianfu)+SUM(moneyHuidanfu)) sumMoney from yundan_yundan where status=0 and companyId=" + dbc.ToSqlValue(companyId) + @"
	                                group by clientId
                                )b on a.clientId=b.clientId
                                left join(
	                                select clientId,SUM(money) yhxMoney from caiwu_income where kind=2 and status=0 and companyId=" + dbc.ToSqlValue(companyId) + @"
	                                group by clientId
                                )c on a.clientId=c.clientId
                                left join (
	                                select t1.*,t2.UserXM from jichu_credit t1
	                                left join tb_b_user t2 on t1.updateuser=t2.UserID
                                    where t1.status=0 and t1.companyId=" + dbc.ToSqlValue(companyId) + @"
                                )d on a.gradeId=d.creditId
                                left join (
	                                select t1.clientId,(
		                                select top 1 yundanDate from yundan_yundan t2 where t1.clientId=t2.clientId
		                                and (t2.payType=1 or t2.payType=3 or t2.payType=4 or t2.payType=6 or t2.payType=7 or t2.payType=8 or t2.payType=9 or t2.payType=10) and t2.isOverQianfuHexiao=0
		                                order by t2.yundanDate asc
	                                )qsDate from jichu_client t1
                                )e on e.clientId=a.clientId
                                where a.status=0 and sumMoney>0 ";

                if (list_where.Count > 0)
                {
                    sql += " and " + string.Join(" and ", list_where);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /// <summary>
    /// 获取客户往来欠费运单信息
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="clientId"></param>
    /// <returns></returns>
    [CSMethod("GetQfHx2ClientListByPage")]
    public object GetQfHx2ClientListByPage(int pagnum, int pagesize, string clientId, int zt)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                int cp = pagnum;
                int ac = 0;


                string sql = @"select 
a.id,
a.yundanId yundan_id,
b.yundanNum,
c.zhuangchedanNum,
(isNULL(b.moneyQianfu,0)+isNULL(b.moneyHuidanfu,0)) as moneyQianfu,
isNULL(a.money,0) yhxmoney,
(isNULL(b.moneyQianfu,0)+isNULL(b.moneyHuidanfu,0)-isNULL(a.money,0)) whxmoney,
a.incomeDate,
a.officeId,
f.officeName,
b.fahuoPeople,
b.fahuoTel,
b.shouhuoPeople,
b.shouhuoTel,
b.shouhuoAddress,
b.ddofficeName,
b.songhuoType,
b.payType,
b.moneyYunfei,
b.zhidanRen UserName,
b.huidanType,
b.isSign,
b.memo
from caiwu_income a
left join (
	select h.*,i.officeName ddofficeName from yundan_yundan h
	left join jichu_office i on h.toOfficeId=i.officeId
)b on a.yundanId=b.yundan_id
left join (
	select d.*,e.zhuangchedanNum from yundan_chaifen d
	left join dbo.zhuangchedan_zhuangchedan e on d.zhuangchedan_id=e.zhuangchedan_id
	where d.status=0 and d.is_leaf=0
)c on a.yundan_chaifen_id=c.yundan_chaifen_id
left join jichu_office f on a.officeId=f.officeId
where a.isLock=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and a.status=0 and a.kind=2 and b.isOverQianfuHexiao=" + zt;
                if (!string.IsNullOrEmpty(clientId))
                {
                    sql += " and a.clientId=" + dbc.ToSqlValue(clientId);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt_return.Columns.Add("isbj", typeof(bool));
                dt_return.Columns.Add("isxz", typeof(Int32));
                foreach (DataRow dr in dt_return.Rows)
                {
                    dr["isbj"] = false;
                    dr["isxz"] = 0;
                }
                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /// <summary>
    /// 客户往来欠费运单核销
    /// </summary>
    /// <param name="xzlist"></param>
    /// <param name="hxrq"></param>
    /// <returns></returns>
    [CSMethod("SaveQFYFHx")]
    public object SaveQFYFHx(JSReader xzlist, string hxrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable cwdt = dbc.GetEmptyDataTable("caiwu_income");
                DataTableTracker cwdtt = new DataTableTracker(cwdt);

                List<string> yhxYundanIdArr = new List<string>();
                for (int i = 0; i < xzlist.ToArray().Length; i++)
                {
                    decimal hxje = string.IsNullOrEmpty(xzlist[i]["hxje"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["hxje"].ToString());
                    decimal yhxje = string.IsNullOrEmpty(xzlist[i]["yhxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["yhxmoney"].ToString());
                    decimal whxje = string.IsNullOrEmpty(xzlist[i]["whxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["whxmoney"].ToString());

                    DataRow cwdr = cwdt.NewRow();
                    cwdr["id"] = xzlist[i]["id"].ToString();
                    if (hxje == whxje)
                    {
                        //更新运单表状态
                        yhxYundanIdArr.Add(xzlist[i]["yundan_id"].ToString());

                        //锁表列
                        cwdr["isLock"] = 1;

                        //财物日记
                        SortedList<string, string> sdl = new SortedList<string, string>();
                        sdl.Add("kind", "2");
                        sdl.Add("officeId", xzlist[i]["officeId"].ToString());
                        sdl.Add("incomeId", xzlist[i]["id"].ToString());
                        sdl.Add("yundanId", xzlist[i]["yundan_id"].ToString());
                        sdl.Add("dateFasheng", hxrq);
                        //sdl.Add("memo", xzlist[i]["memo"].ToString());
                        InsertRJ(sdl, yhxje + hxje, 1);
                    }
                    cwdr["id"] = xzlist[i]["id"].ToString();
                    cwdr["incomeDate"] = Convert.ToDateTime(hxrq);
                    cwdr["money"] = yhxje + hxje;
                    cwdt.Rows.Add(cwdr);

                    saveLog(xzlist[i]["id"].ToString(), Convert.ToDateTime(hxrq), hxje, "(客户)欠费核销");
                }
                dbc.UpdateTable(cwdt, cwdtt);

                string sql = @"update yundan_yundan set isOverQianfuHexiao=1 where yundan_id in('" + string.Join("','", yhxYundanIdArr) + "')";
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
    #endregion

    #region 到付运费核销
    /// <summary>
    /// 到付运费核销
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="hxzt"></param>
    /// <param name="bscid"></param>
    /// <param name="kssj"></param>
    /// <param name="jssj"></param>
    /// <param name="fhr"></param>
    /// <param name="ydbh"></param>
    /// <returns></returns>
    [CSMethod("GetDfyfHxListByPage")]
    public object GetDfyfHxListByPage(int pagnum, int pagesize, string hxzt, string bscid, string kssj, string jssj, string fhr, string ydbh)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                int cp = pagnum;
                int ac = 0;

                #region 拼接查询条件
                List<string> list_where = new List<string>();
                if (!string.IsNullOrEmpty(hxzt))
                {
                    list_where.Add("b.isOverYufuHexiao=" + dbc.ToSqlValue(hxzt));
                }
                if (!string.IsNullOrEmpty(bscid))
                {
                    list_where.Add("b.toOfficeId=" + dbc.ToSqlValue(bscid));
                }
                if (!string.IsNullOrEmpty(kssj))
                {
                    list_where.Add("b.yundanDate>=" + dbc.ToSqlValue(Convert.ToDateTime(kssj)));
                }
                if (!string.IsNullOrEmpty(jssj))
                {
                    list_where.Add("b.yundanDate<" + dbc.ToSqlValue(Convert.ToDateTime(jssj).AddDays(1)));
                }
                if (!string.IsNullOrEmpty(fhr))
                {
                    list_where.Add("b.fahuoPeople like '%" + fhr + "%'");
                }
                if (!string.IsNullOrEmpty(ydbh))
                {
                    list_where.Add("b.yundanNum like '%" + ydbh + "%'");
                }
                #endregion

                string sql = @"select 
a.id,
a.yundanId yundan_id,
b.yundanNum,
c.zhuangchedanNum,
isNULL(b.moneyDaofu,0) moneyDaofu,
isNULL(a.money,0) yhxmoney,
(isNULL(b.moneyDaofu,0)-isNULL(a.money,0)) whxmoney,
a.incomeDate,
a.officeId,
f.officeName,
b.fahuoPeople,
b.fahuoTel,
b.shouhuoPeople,
b.shouhuoTel,
b.shouhuoAddress,
b.ddofficeName,
b.songhuoType,
b.payType,
b.moneyYunfei,
b.zhidanRen UserName,
b.memo
from caiwu_income a
left join (
	select h.*,i.officeName ddofficeName from yundan_yundan h
	left join jichu_office i on h.toOfficeId=i.officeId
)b on a.yundanId=b.yundan_id
left join (
	select d.*,e.zhuangchedanNum from yundan_chaifen d
	left join dbo.zhuangchedan_zhuangchedan e on d.zhuangchedan_id=e.zhuangchedan_id
	where d.status=0 and d.is_leaf=0
)c on a.yundan_chaifen_id=c.yundan_chaifen_id
left join jichu_office f on a.officeId=f.officeId
where a.isLock=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and a.status=0 and a.kind=3 ";

                if (list_where.Count > 0)
                {
                    sql += " and " + string.Join(" and ", list_where);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt_return.Columns.Add("isbj", typeof(bool));
                dt_return.Columns.Add("isxz", typeof(Int32));
                foreach (DataRow dr in dt_return.Rows)
                {
                    dr["isbj"] = false;
                    dr["isxz"] = 0;
                }
                return new { dt = dt_return, cp = cp, ac = ac };
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /// <summary>
    /// 到付运费核销保存
    /// </summary>
    /// <param name="xzlist"></param>
    /// <param name="hxrq"></param>
    /// <returns></returns>
    [CSMethod("SaveDFYFHx")]
    public object SaveDFYFHx(JSReader xzlist, string hxrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable cwdt = dbc.GetEmptyDataTable("caiwu_income");
                DataTableTracker cwdtt = new DataTableTracker(cwdt);

                List<string> yhxYundanIdArr = new List<string>();
                for (int i = 0; i < xzlist.ToArray().Length; i++)
                {
                    decimal hxje = string.IsNullOrEmpty(xzlist[i]["hxje"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["hxje"].ToString());
                    decimal yhxje = string.IsNullOrEmpty(xzlist[i]["yhxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["yhxmoney"].ToString());
                    decimal whxje = string.IsNullOrEmpty(xzlist[i]["whxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["whxmoney"].ToString());

                    DataRow cwdr = cwdt.NewRow();
                    cwdr["id"] = xzlist[i]["id"].ToString();
                    if (hxje == whxje)
                    {
                        //更新运单表状态
                        yhxYundanIdArr.Add(xzlist[i]["yundan_id"].ToString());

                        //锁表列
                        cwdr["isLock"] = 1;

                        //财物日记
                        SortedList<string, string> sdl = new SortedList<string, string>();
                        sdl.Add("kind", "3");
                        sdl.Add("officeId", xzlist[i]["officeId"].ToString());
                        sdl.Add("incomeId", xzlist[i]["id"].ToString());
                        sdl.Add("yundanId", xzlist[i]["yundan_id"].ToString());
                        sdl.Add("dateFasheng", hxrq);
                        //sdl.Add("memo", xzlist[i]["memo"].ToString());
                        InsertRJ(sdl, yhxje + hxje, 1);
                    }
                    cwdr["incomeDate"] = Convert.ToDateTime(hxrq);
                    cwdr["money"] = hxje + yhxje;
                    cwdt.Rows.Add(cwdr);

                    saveLog(xzlist[i]["id"].ToString(), Convert.ToDateTime(hxrq), hxje, "到付核销");
                }
                dbc.UpdateTable(cwdt, cwdtt);

                string sql = @"update yundan_yundan set isOveDaofuHexiao=1 where yundan_id in('" + string.Join("','", yhxYundanIdArr) + "')";
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
    #endregion

    #region 代收货款核销(老板说，没有鸡腿不用做)

    #endregion

    /// <summary>
    /// 清除应收核销1：预付，2：欠付，3：到付，4：代收货款 点上收取，
    /// </summary>
    /// <param name="kind"></param>
    /// <param name="incomeId"></param>
    /// <param name="yundanId"></param>
    [CSMethod("DeleteIncomeHxLog")]
    public void DeleteIncomeHxLog(string kind, string incomeId, string yundanId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();
                string zdName = "";
                switch (kind)
                {
                    case "1":
                        zdName = "isOverYufuHexiao=0";
                        break;
                    case "2":
                        zdName = "isOverQianfuHexiao=0";
                        break;
                    case "3":
                        zdName = "isOveDaofuHexiao=0";
                        break;
                    case "4":
                        zdName = "isOverDaishouInHexiao=0";
                        break;
                }

                string sql = @"update yundan_yundan set " + zdName + " where yundan_id=" + dbc.ToSqlValue(yundanId);
                dbc.ExecuteNonQuery(sql);

                sql = "update caiwu_income set money=0 where id=" + dbc.ToSqlValue(incomeId);
                dbc.ExecuteNonQuery(sql);

                sql = @"delete from caiwu_hx_log where income_id=" + dbc.ToSqlValue(incomeId);
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

    #region 应付核销

    #region 短驳核销 1：短驳，
    [CSMethod("GetDriverDBByPage")]
    public object GetDriverDBByPage(int pagnum, int pagesize, string bscid, string kssj, string jssj, string driver)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                var user = SystemUser.CurrentUser;
                string companyId = user.CompanyID;

                int cp = pagnum;
                int ac = 0;

                #region 拼接查询条件
                List<string> list_where = new List<string>();
                if (!string.IsNullOrEmpty(bscid))
                {
                    list_where.Add("a.officeId=" + dbc.ToSqlValue(bscid));
                }
                if (!string.IsNullOrEmpty(driver))
                {
                    list_where.Add("a.people like '%" + driver + "%'");
                }

                string sqlW = "";
                if (!string.IsNullOrEmpty(kssj))
                {
                    sqlW += "t1.actionDate>=" + dbc.ToSqlValue(Convert.ToDateTime(kssj));
                }
                if (!string.IsNullOrEmpty(jssj))
                {
                    sqlW += "t1.actionDate<" + dbc.ToSqlValue(Convert.ToDateTime(jssj).AddDays(1));
                }
                #endregion

                string sql = @"select a.driverId,a.people,a.tel,a.carNum,isNULL(b.money,0) AllMoney,isNULL(c.HeXiaoMoney,0)HeXiaoMoney,
(isNULL(b.money,0)-isNULL(c.HeXiaoMoney,0)) WeiHeXiaoMoney from jichu_driver a
                                left join (
	                                select t1.driverId,SUM(t1.money)money from yundan_duanbo_fenliu t1
	                                where t1.status=0 and t1.kind=1 " + sqlW + @"
	                                group by t1.driverId
                                )b on a.driverId=b.driverId
                                left join (
	                                select t2.driverId,SUM(t2.money)HeXiaoMoney from caiwu_expense t2
	                                where t2.status=0 and t2.kind=1
	                                group by t2.driverId
                                )c on a.driverId=c.driverId
                                where a.companyId=" + dbc.ToSqlValue(companyId) + " and a.status=0";

                if (list_where.Count > 0)
                {
                    sql += " and " + string.Join(" and ", list_where);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("SaveDBHx")]
    public object SaveDBHx(JSReader xzlist, string hxrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable cwdt = dbc.GetEmptyDataTable("caiwu_expense");
                DataTableTracker cwdtt = new DataTableTracker(cwdt);

                List<string> yhxYundanIdArr = new List<string>();
                for (int i = 0; i < xzlist.ToArray().Length; i++)
                {
                    decimal hxje = string.IsNullOrEmpty(xzlist[i]["hxje"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["hxje"].ToString());
                    decimal yhxje = string.IsNullOrEmpty(xzlist[i]["yhxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["yhxmoney"].ToString());
                    decimal whxje = string.IsNullOrEmpty(xzlist[i]["whxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["whxmoney"].ToString());

                    DataRow cwdr = cwdt.NewRow();
                    cwdr["id"] = xzlist[i]["id"].ToString();
                    if (hxje == whxje)
                    {
                        //更新运单表状态
                        yhxYundanIdArr.Add(xzlist[i]["yundan_id"].ToString());

                        //锁表列
                        cwdr["isLock"] = 1;

                        //财物日记
                        SortedList<string, string> sdl = new SortedList<string, string>();
                        sdl.Add("kind", "5");
                        sdl.Add("officeId", xzlist[i]["officeId"].ToString());
                        sdl.Add("expenseId", xzlist[i]["id"].ToString());
                        sdl.Add("yundanId", xzlist[i]["yundan_id"].ToString());
                        sdl.Add("dateFasheng", hxrq);
                        //sdl.Add("memo", xzlist[i]["memo"].ToString());
                        InsertRJ(sdl, yhxje + hxje, 2);
                    }
                    cwdr["expenseDate"] = Convert.ToDateTime(hxrq);
                    cwdr["money"] = yhxje + hxje;
                    cwdt.Rows.Add(cwdr);

                    saveLog(xzlist[i]["id"].ToString(), Convert.ToDateTime(hxrq), hxje, "短驳核销");
                }
                dbc.UpdateTable(cwdt, cwdtt);

                string sql = @"update yundan_yundan set isOverDuanboHexiao=1 where yundan_id in('" + string.Join("','", yhxYundanIdArr) + "')";
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

    [CSMethod("GetDBListByPage")]
    public object GetDBListByPage(int pagnum, int pagesize, string driverId, int zt)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                int cp = pagnum;
                int ac = 0;


                string sql = @"select 
                                a.id,
                                a.yundanId yundan_id,
                                b.yundanNum,
                                c.zhuangchedanNum,
                                isNULL(d.money,0) money,
                                isNULL(a.money,0) yhxmoney,
                                (isNULL(d.money,0)-isNULL(a.money,0)) whxmoney,
                                0 as hxje,
                                a.expenseDate,
                                a.officeId,
                                e.officeName,
                                b.fahuoPeople,
                                b.fahuoTel,
                                b.shouhuoPeople,
                                b.shouhuoTel,
                                b.shouhuoAddress,
                                b.ddofficeName,
                                b.songhuoType,
                                b.payType,
                                b.moneyYunfei,
                                b.zhidanRen UserName,
                                b.memo
                                from dbo.caiwu_expense a
                                left join (
                                    select h.*,i.officeName ddofficeName from yundan_yundan h
                                    left join jichu_office i on h.toOfficeId=i.officeId
                                )b on a.yundanId=b.yundan_id
                                left join (
	                                select d.*,e.zhuangchedanNum from yundan_chaifen d
	                                left join dbo.zhuangchedan_zhuangchedan e on d.zhuangchedan_id=e.zhuangchedan_id
	                                where d.status=0 and d.is_leaf=0
                                )c on a.yundanId=c.yundan_id
                                left join(
	                                select yundanId,driverId,SUM(money)money from yundan_duanbo_fenliu
	                                where kind=1 and status=0
	                                group by yundanId,driverId
                                )d on a.yundanId=d.yundanId and a.driverId=d.driverId
                                left join jichu_office e on a.officeId=e.officeId
                                where a.isLock=0 and a.kind=1 and a.status=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and b.isOverDuanboHexiao=" + zt;
                if (!string.IsNullOrEmpty(driverId))
                {
                    sql += " and a.driverId=" + dbc.ToSqlValue(driverId);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt_return.Columns.Add("isbj", typeof(bool));
                dt_return.Columns.Add("isxz", typeof(Int32));
                foreach (DataRow dr in dt_return.Rows)
                {
                    dr["isbj"] = false;
                    dr["isxz"] = 0;
                }
                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    #endregion

    #region 中转公司中转核销 2：中转，
    [CSMethod("GetCompanyHxByPage")]
    public object GetCompanyHxByPage(int pagnum, int pagesize, string bscid, string kssj, string jssj, string companyName)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                var user = SystemUser.CurrentUser;
                string companyId = user.CompanyID;

                int cp = pagnum;
                int ac = 0;

                #region 拼接查询条件
                List<string> list_where = new List<string>();
                if (!string.IsNullOrEmpty(bscid))
                {
                    list_where.Add("a.officeId=" + dbc.ToSqlValue(bscid));
                }
                if (!string.IsNullOrEmpty(companyName))
                {
                    list_where.Add("a.compName like '%" + companyName + "%'");
                }

                string sqlW = "";
                if (!string.IsNullOrEmpty(kssj))
                {
                    sqlW += "t1.actionDate>=" + dbc.ToSqlValue(Convert.ToDateTime(kssj));
                }
                if (!string.IsNullOrEmpty(jssj))
                {
                    sqlW += "t1.actionDate<" + dbc.ToSqlValue(Convert.ToDateTime(jssj).AddDays(1));
                }
                #endregion

                string sql = @"select a.zhongzhuanId,a.compName,a.people,a.tel,isNULL(b.money,0) AllMoney,isNULL(c.HeXiaoMoney,0)HeXiaoMoney,
(isNULL(b.money,0)-isNULL(c.HeXiaoMoney,0)) WeiHeXiaoMoney from jichu_zhongzhuan a
                                left join (
	                                select t1.zhongzhuanId,SUM(t1.money)money from yundan_duanbo_fenliu t1
	                                where t1.status=0 and t1.kind=2 " + sqlW + @"
	                                group by t1.zhongzhuanId
                                )b on a.zhongzhuanId=b.zhongzhuanId
                                left join (
	                                select t2.zhongzhuanId,SUM(t2.money)HeXiaoMoney from caiwu_expense t2
	                                where t2.status=0 and t2.kind=2
	                                group by t2.zhongzhuanId
                                )c on a.zhongzhuanId=c.zhongzhuanId
                                where a.companyId=" + dbc.ToSqlValue(companyId) + " and a.status=0";

                if (list_where.Count > 0)
                {
                    sql += " and " + string.Join(" and ", list_where);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("SaveZZHx")]
    public object SaveZZHx(JSReader xzlist, string hxrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable cwdt = dbc.GetEmptyDataTable("caiwu_expense");
                DataTableTracker cwdtt = new DataTableTracker(cwdt);

                List<string> yhxYundanIdArr = new List<string>();
                for (int i = 0; i < xzlist.ToArray().Length; i++)
                {
                    decimal hxje = string.IsNullOrEmpty(xzlist[i]["hxje"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["hxje"].ToString());
                    decimal yhxje = string.IsNullOrEmpty(xzlist[i]["yhxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["yhxmoney"].ToString());
                    decimal whxje = string.IsNullOrEmpty(xzlist[i]["whxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["whxmoney"].ToString());

                    DataRow cwdr = cwdt.NewRow();
                    cwdr["id"] = xzlist[i]["id"].ToString();
                    if (hxje == whxje)
                    {
                        //更新运单表状态
                        yhxYundanIdArr.Add(xzlist[i]["yundan_id"].ToString());

                        //锁表列
                        cwdr["isLock"] = 1;

                        //财物日记
                        SortedList<string, string> sdl = new SortedList<string, string>();
                        sdl.Add("kind", "7");
                        sdl.Add("officeId", xzlist[i]["officeId"].ToString());
                        sdl.Add("expenseId", xzlist[i]["id"].ToString());
                        sdl.Add("yundanId", xzlist[i]["yundan_id"].ToString());
                        sdl.Add("dateFasheng", hxrq);
                        //sdl.Add("memo", xzlist[i]["memo"].ToString());
                        InsertRJ(sdl, yhxje + hxje, 2);
                    }
                    cwdr["expenseDate"] = Convert.ToDateTime(hxrq);
                    cwdr["money"] = yhxje + hxje;
                    cwdt.Rows.Add(cwdr);

                    saveLog(xzlist[i]["id"].ToString(), Convert.ToDateTime(hxrq), hxje, "中转核销");
                }
                dbc.UpdateTable(cwdt, cwdtt);

                string sql = @"update yundan_yundan set isOverZhongzhuanHexiao=1 where yundan_id in('" + string.Join("','", yhxYundanIdArr) + "')";
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

    [CSMethod("GetZZListByPage")]
    public object GetZZListByPage(int pagnum, int pagesize, string zhongzhuanId, int zt)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                int cp = pagnum;
                int ac = 0;


                string sql = @"select 
                                a.id,
                                a.yundanId yundan_id,
                                b.yundanNum,
                                c.zhuangchedanNum,
                                isNULL(d.money,0) money,
                                isNULL(a.money,0) yhxmoney,
                                (isNULL(d.money,0)-isNULL(a.money,0)) whxmoney,
                                0 as hxje,
                                a.expenseDate,
                                a.officeId,
                                e.officeName,
                                b.fahuoPeople,
                                b.fahuoTel,
                                b.shouhuoPeople,
                                b.shouhuoTel,
                                b.shouhuoAddress,
                                b.ddofficeName,
                                b.songhuoType,
                                b.payType,
                                b.moneyYunfei,
                                b.zhidanRen UserName,
                                b.memo
                                from dbo.caiwu_expense a
                                left join (
                                    select h.*,i.officeName ddofficeName from yundan_yundan h
                                    left join jichu_office i on h.toOfficeId=i.officeId
                                )b on a.yundanId=b.yundan_id
                                left join (
	                                select d.*,e.zhuangchedanNum from yundan_chaifen d
	                                left join dbo.zhuangchedan_zhuangchedan e on d.zhuangchedan_id=e.zhuangchedan_id
	                                where d.status=0 and d.is_leaf=0
                                )c on a.yundanId=c.yundan_id
                                left join(
	                                select yundanId,zhongzhuanId,SUM(money)money from yundan_duanbo_fenliu
	                                where kind=2 and status=0
	                                group by yundanId,zhongzhuanId
                                )d on a.yundanId=d.yundanId and a.zhongzhuanId=d.zhongzhuanId
                                left join jichu_office e on a.officeId=e.officeId
                                where a.isLock=0 and a.kind=2 and a.status=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and b.isOverZhongzhuanHexiao=" + zt;
                if (!string.IsNullOrEmpty(zhongzhuanId))
                {
                    sql += " and a.zhongzhuanId=" + dbc.ToSqlValue(zhongzhuanId);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt_return.Columns.Add("isbj", typeof(bool));
                dt_return.Columns.Add("isxz", typeof(Int32));
                foreach (DataRow dr in dt_return.Rows)
                {
                    dr["isbj"] = false;
                    dr["isxz"] = 0;
                }
                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    #endregion

    #region 办事处送货核销 3：送货，
    [CSMethod("GetBscShByPage")]
    public object GetBscShByPage(int pagnum, int pagesize, string bscid, string kssj, string jssj, string driver)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                var user = SystemUser.CurrentUser;
                string companyId = user.CompanyID;

                int cp = pagnum;
                int ac = 0;

                #region 拼接查询条件
                List<string> list_where = new List<string>();
                if (!string.IsNullOrEmpty(bscid))
                {
                    list_where.Add("a.officeId=" + dbc.ToSqlValue(bscid));
                }
                if (!string.IsNullOrEmpty(driver))
                {
                    list_where.Add("a.people like '%" + driver + "%'");
                }

                string sqlW = "";
                if (!string.IsNullOrEmpty(kssj))
                {
                    sqlW += "t1.actionDate>=" + dbc.ToSqlValue(Convert.ToDateTime(kssj));
                }
                if (!string.IsNullOrEmpty(jssj))
                {
                    sqlW += "t1.actionDate<" + dbc.ToSqlValue(Convert.ToDateTime(jssj).AddDays(1));
                }
                #endregion

                string sql = @"select a.driverId,a.people,a.tel,a.carNum,isNULL(b.money,0) AllMoney,isNULL(c.HeXiaoMoney,0)HeXiaoMoney,
(isNULL(b.money,0)-isNULL(c.HeXiaoMoney,0)) WeiHeXiaoMoney from jichu_driver a
                                left join (
	                                select t1.driverId,SUM(t1.money)money from yundan_duanbo_fenliu t1
	                                where t1.status=0 and t1.kind=3 " + sqlW + @"
	                                group by t1.driverId
                                )b on a.driverId=b.driverId
                                left join (
	                                select t2.driverId,SUM(t2.money)HeXiaoMoney from caiwu_expense t2
	                                where t2.status=0 and t2.kind=3
	                                group by t2.driverId
                                )c on a.driverId=c.driverId
                                where a.companyId=" + dbc.ToSqlValue(companyId) + " and a.status=0";

                if (list_where.Count > 0)
                {
                    sql += " and " + string.Join(" and ", list_where);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("SaveSHHx")]
    public object SaveSHHx(JSReader xzlist, string hxrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable cwdt = dbc.GetEmptyDataTable("caiwu_expense");
                DataTableTracker cwdtt = new DataTableTracker(cwdt);

                List<string> yhxYundanIdArr = new List<string>();
                for (int i = 0; i < xzlist.ToArray().Length; i++)
                {
                    decimal hxje = string.IsNullOrEmpty(xzlist[i]["hxje"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["hxje"].ToString());
                    decimal yhxje = string.IsNullOrEmpty(xzlist[i]["yhxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["yhxmoney"].ToString());
                    decimal whxje = string.IsNullOrEmpty(xzlist[i]["whxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["whxmoney"].ToString());

                    DataRow cwdr = cwdt.NewRow();
                    cwdr["id"] = xzlist[i]["id"].ToString();
                    if (hxje == whxje)
                    {
                        //更新运单表状态
                        yhxYundanIdArr.Add(xzlist[i]["yundan_id"].ToString());

                        //锁表列
                        cwdr["isLock"] = 1;

                        //财物日记
                        SortedList<string, string> sdl = new SortedList<string, string>();
                        sdl.Add("kind", "6");
                        sdl.Add("officeId", xzlist[i]["officeId"].ToString());
                        sdl.Add("expenseId", xzlist[i]["id"].ToString());
                        sdl.Add("yundanId", xzlist[i]["yundan_id"].ToString());
                        sdl.Add("dateFasheng", hxrq);
                        //sdl.Add("memo", xzlist[i]["memo"].ToString());
                        InsertRJ(sdl, yhxje + hxje, 2);
                    }
                    cwdr["expenseDate"] = Convert.ToDateTime(hxrq);
                    cwdr["money"] = yhxje + hxje;
                    cwdt.Rows.Add(cwdr);

                    saveLog(xzlist[i]["id"].ToString(), Convert.ToDateTime(hxrq), hxje, "送货核销");
                }
                dbc.UpdateTable(cwdt, cwdtt);

                string sql = @"update yundan_yundan set isOverSonghuoHexiao=1 where yundan_id in('" + string.Join("','", yhxYundanIdArr) + "')";
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

    [CSMethod("GetSHListByPage")]
    public object GetSHListByPage(int pagnum, int pagesize, string driverId, int zt)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                int cp = pagnum;
                int ac = 0;


                string sql = @"select 
                                a.id,
                                a.yundanId yundan_id,
                                b.yundanNum,
                                c.zhuangchedanNum,
                                isNULL(d.money,0) money,
                                isNULL(a.money,0) yhxmoney,
                                (isNULL(d.money,0)-isNULL(a.money,0)) whxmoney,
                                0 as hxje,
                                a.expenseDate,
                                a.officeId,
                                e.officeName,
                                b.fahuoPeople,
                                b.fahuoTel,
                                b.shouhuoPeople,
                                b.shouhuoTel,
                                b.shouhuoAddress,
                                b.ddofficeName,
                                b.songhuoType,
                                b.payType,
                                b.moneyYunfei,
                                b.zhidanRen UserName,
                                b.memo
                                from dbo.caiwu_expense a
                                left join (
                                    select h.*,i.officeName ddofficeName from yundan_yundan h
                                    left join jichu_office i on h.toOfficeId=i.officeId
                                )b on a.yundanId=b.yundan_id
                                left join (
	                                select d.*,e.zhuangchedanNum from yundan_chaifen d
	                                left join dbo.zhuangchedan_zhuangchedan e on d.zhuangchedan_id=e.zhuangchedan_id
	                                where d.status=0 and d.is_leaf=0
                                )c on a.yundanId=c.yundan_id
                                left join(
	                                select yundanId,driverId,SUM(money)money from yundan_duanbo_fenliu
	                                where kind=3 and status=0
	                                group by yundanId,driverId
                                )d on a.yundanId=d.yundanId and a.driverId=d.driverId
                                left join jichu_office e on a.officeId=e.officeId
                                where a.isLock=0 and a.kind=3 and a.status=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and b.isOverSonghuoHexiao=" + zt;
                if (!string.IsNullOrEmpty(driverId))
                {
                    sql += " and a.driverId=" + dbc.ToSqlValue(driverId);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt_return.Columns.Add("isbj", typeof(bool));
                dt_return.Columns.Add("isxz", typeof(Int32));
                foreach (DataRow dr in dt_return.Rows)
                {
                    dr["isbj"] = false;
                    dr["isxz"] = 0;
                }
                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    #endregion

    #region 回扣核销 4：回扣，
    [CSMethod("GetHkHxListByPage")]
    public object GetHkHxListByPage(int pagnum, int pagesize, string hxzt, string bscid, string kssj, string jssj, string fhr, string ydbh)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                int cp = pagnum;
                int ac = 0;

                #region 拼接查询条件
                List<string> list_where = new List<string>();
                if (!string.IsNullOrEmpty(hxzt))
                {
                    list_where.Add("b.isOverHuikouHexiao=" + dbc.ToSqlValue(hxzt));
                }
                if (!string.IsNullOrEmpty(bscid))
                {
                    list_where.Add("a.officeId=" + dbc.ToSqlValue(bscid));
                }
                if (!string.IsNullOrEmpty(kssj))
                {
                    list_where.Add("b.yundanDate>=" + dbc.ToSqlValue(Convert.ToDateTime(kssj)));
                }
                if (!string.IsNullOrEmpty(jssj))
                {
                    list_where.Add("b.yundanDate<" + dbc.ToSqlValue(Convert.ToDateTime(jssj).AddDays(1)));
                }
                if (!string.IsNullOrEmpty(fhr))
                {
                    list_where.Add("b.fahuoPeople like '%" + fhr + "%'");
                }
                if (!string.IsNullOrEmpty(ydbh))
                {
                    list_where.Add("b.yundanNum like '%" + ydbh + "%'");
                }
                #endregion

                string sql = @"select 
                                a.id,
                                a.yundanId yundan_id,
                                b.yundanNum,
                                c.zhuangchedanNum,
                                (isNULL(b.moneyHuikouXianFan,0)+isNULL(b.moneyHuikouQianFan,0)) moneyHuikou,
                                isNULL(a.money,0) yhxmoney,
                                (isNULL(b.moneyHuikouXianFan,0)+isNULL(b.moneyHuikouQianFan,0)-isNULL(a.money,0)) whxmoney,
                                a.expenseDate,
                                a.officeId,
                                f.officeName,
                                b.fahuoPeople,
                                b.fahuoTel,
                                b.shouhuoPeople,
                                b.shouhuoTel,
                                b.shouhuoAddress,
                                b.ddofficeName,
                                b.songhuoType,
                                b.payType,
                                b.moneyYunfei,
                                b.zhidanRen UserName,
                                b.memo
                                from caiwu_expense a
                                left join (
	                                select h.*,i.officeName ddofficeName from yundan_yundan h
	                                left join jichu_office i on h.toOfficeId=i.officeId
                                )b on a.yundanId=b.yundan_id
                                left join (
	                                select d.*,e.zhuangchedanNum from yundan_chaifen d
	                                left join dbo.zhuangchedan_zhuangchedan e on d.zhuangchedan_id=e.zhuangchedan_id
	                                where d.status=0 and d.is_leaf=0
                                )c on a.yundan_chaifen_id=c.yundan_chaifen_id
                                left join jichu_office f on a.officeId=f.officeId
                                where a.isLock=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and a.status=0 and a.kind=4 ";

                if (list_where.Count > 0)
                {
                    sql += " and " + string.Join(" and ", list_where);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt_return.Columns.Add("isbj", typeof(bool));
                dt_return.Columns.Add("isxz", typeof(Int32));
                foreach (DataRow dr in dt_return.Rows)
                {
                    dr["isbj"] = false;
                    dr["isxz"] = 0;
                }
                return new { dt = dt_return, cp = cp, ac = ac };
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("SaveHKHx")]
    public object SaveHKHx(JSReader xzlist, string hxrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable cwdt = dbc.GetEmptyDataTable("caiwu_expense");
                DataTableTracker cwdtt = new DataTableTracker(cwdt);

                List<string> yhxYundanIdArr = new List<string>();
                for (int i = 0; i < xzlist.ToArray().Length; i++)
                {
                    decimal hxje = string.IsNullOrEmpty(xzlist[i]["hxje"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["hxje"].ToString());
                    decimal yhxje = string.IsNullOrEmpty(xzlist[i]["yhxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["yhxmoney"].ToString());
                    decimal whxje = string.IsNullOrEmpty(xzlist[i]["whxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["whxmoney"].ToString());

                    DataRow cwdr = cwdt.NewRow();
                    cwdr["id"] = xzlist[i]["id"].ToString();
                    if (hxje == whxje)
                    {
                        //更新运单表状态
                        yhxYundanIdArr.Add(xzlist[i]["yundan_id"].ToString());

                        //锁表列
                        cwdr["isLock"] = 1;

                        //财物日记
                        SortedList<string, string> sdl = new SortedList<string, string>();
                        sdl.Add("kind", "4");
                        sdl.Add("officeId", xzlist[i]["officeId"].ToString());
                        sdl.Add("expenseId", xzlist[i]["id"].ToString());
                        sdl.Add("yundanId", xzlist[i]["yundan_id"].ToString());
                        sdl.Add("dateFasheng", hxrq);
                        //sdl.Add("memo", xzlist[i]["memo"].ToString());
                        InsertRJ(sdl, yhxje + hxje, 2);
                    }
                    cwdr["expenseDate"] = Convert.ToDateTime(hxrq);
                    cwdr["money"] = hxje + yhxje;
                    cwdt.Rows.Add(cwdr);

                    saveLog(xzlist[i]["id"].ToString(), Convert.ToDateTime(hxrq), hxje, "回扣核销");
                }
                dbc.UpdateTable(cwdt, cwdtt);

                string sql = @"update yundan_yundan set isOverHuikouHexiao=1 where yundan_id in('" + string.Join("','", yhxYundanIdArr) + "')";
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
    #endregion

    #region 司机预付核销 8：司机预付费，
    [CSMethod("GetYfHxOutListByPage")]
    public object GetYfHxOutListByPage(int pagnum, int pagesize, string hxzt, string bscid, string kssj, string jssj, string drivarName, string zcdNum)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                int cp = pagnum;
                int ac = 0;

                #region 拼接查询条件
                List<string> list_where = new List<string>();
                if (!string.IsNullOrEmpty(hxzt))
                {
                    list_where.Add("b.isOverYufuHexiao=" + dbc.ToSqlValue(hxzt));
                }
                if (!string.IsNullOrEmpty(bscid))
                {
                    list_where.Add("b.officeId=" + dbc.ToSqlValue(bscid));
                }
                if (!string.IsNullOrEmpty(kssj))//根据装车签单日期查询
                {
                    list_where.Add("b.qiandanDate>=" + dbc.ToSqlValue(Convert.ToDateTime(kssj)));
                }
                if (!string.IsNullOrEmpty(jssj))
                {
                    list_where.Add("b.qiandanDate<" + dbc.ToSqlValue(Convert.ToDateTime(jssj).AddDays(1)));
                }
                if (!string.IsNullOrEmpty(drivarName))
                {
                    list_where.Add("b.people like '%" + drivarName + "%'");
                }
                if (!string.IsNullOrEmpty(zcdNum))
                {
                    list_where.Add("b.zhuangchedanNum like '%" + zcdNum + "%'");
                }
                #endregion

                string sql = @"select 
                                a.id,
                                a.zhuangchedanId,
                                b.zhuangchedanNum,
                                isNULL(b.moneyYufu,0) money,
                                isNULL(a.money,0) yhxmoney,
                                (isNULL(b.moneyYufu,0)-isNULL(a.money,0)) whxmoney,
                                0 hxje,
                                a.expenseDate,
                                a.officeId,
                                b.officeName,
                                b.ddofficeName,
                                b.toAdsPeople,
                                b.toAdsTel,
                                b.people
                                from caiwu_expense a
                                left join (
                                    select t1.*,t2.officeName,t3.officeName ddofficeName,t4.people from zhuangchedan_zhuangchedan t1
                                    left join jichu_office t2 on t1.officeId=t2.officeId
                                    left join jichu_office t3 on t1.toOfficeId=t3.officeId
                                    left join jichu_driver t4 on t1.driverId=t4.driverId
                                )b on a.zhuangchedanId=b.zhuangchedan_id
                                where a.isLock=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and a.status=0 and a.kind=8 ";

                if (list_where.Count > 0)
                {
                    sql += " and " + string.Join(" and ", list_where);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt_return.Columns.Add("isbj", typeof(bool));
                dt_return.Columns.Add("isxz", typeof(Int32));
                foreach (DataRow dr in dt_return.Rows)
                {
                    dr["isbj"] = false;
                    dr["isxz"] = 0;
                }
                return new { dt = dt_return, cp = cp, ac = ac };
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("SaveYufuOutHx")]
    public object SaveYufuOutHx(JSReader xzlist, string hxrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable cwdt = dbc.GetEmptyDataTable("caiwu_expense");
                DataTableTracker cwdtt = new DataTableTracker(cwdt);

                List<string> yhxZcdIdArr = new List<string>();
                for (int i = 0; i < xzlist.ToArray().Length; i++)
                {
                    decimal hxje = string.IsNullOrEmpty(xzlist[i]["hxje"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["hxje"].ToString());
                    decimal yhxje = string.IsNullOrEmpty(xzlist[i]["yhxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["yhxmoney"].ToString());
                    decimal whxje = string.IsNullOrEmpty(xzlist[i]["whxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["whxmoney"].ToString());

                    DataRow cwdr = cwdt.NewRow();
                    cwdr["id"] = xzlist[i]["id"].ToString();
                    if (hxje == whxje)
                    {
                        //更新装车单表状态
                        yhxZcdIdArr.Add(xzlist[i]["zhuangchedanId"].ToString());

                        //锁表列
                        cwdr["isLock"] = 1;

                        //财物日记
                        SortedList<string, string> sdl = new SortedList<string, string>();
                        sdl.Add("kind", "21");
                        sdl.Add("officeId", xzlist[i]["officeId"].ToString());
                        sdl.Add("expenseId", xzlist[i]["id"].ToString());
                        sdl.Add("zhuangchedanId", xzlist[i]["zhuangchedanId"].ToString());
                        sdl.Add("dateFasheng", hxrq);
                        //sdl.Add("memo", xzlist[i]["memo"].ToString());
                        InsertRJ(sdl, yhxje + hxje, 2);
                    }
                    cwdr["expenseDate"] = Convert.ToDateTime(hxrq);
                    cwdr["money"] = hxje + yhxje;
                    cwdt.Rows.Add(cwdr);

                    saveLog(xzlist[i]["id"].ToString(), Convert.ToDateTime(hxrq), hxje, "司机预付核销(支)");
                }
                dbc.UpdateTable(cwdt, cwdtt);

                string sql = @"update zhuangchedan_zhuangchedan set isOverYufuHexiao=1 where zhuangchedan_id in('" + string.Join("','", yhxZcdIdArr) + "')";
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
    #endregion

    #region 司机欠付核销 9：司机欠付费，
    [CSMethod("GetQfHxOutByPage")]
    public object GetQfHxOutByPage(int pagnum, int pagesize, string bscid, string kssj, string jssj, string driver)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                var user = SystemUser.CurrentUser;
                string companyId = user.CompanyID;

                int cp = pagnum;
                int ac = 0;

                #region 拼接查询条件
                List<string> list_where = new List<string>();
                if (!string.IsNullOrEmpty(bscid))
                {
                    list_where.Add("a.officeId=" + dbc.ToSqlValue(bscid));
                }
                if (!string.IsNullOrEmpty(driver))
                {
                    list_where.Add("a.people like '%" + driver + "%'");
                }

                string sqlW = "";
                if (!string.IsNullOrEmpty(kssj))
                {
                    sqlW += "qiandanDate>=" + dbc.ToSqlValue(Convert.ToDateTime(kssj));
                }
                if (!string.IsNullOrEmpty(jssj))
                {
                    sqlW += "qiandanDate<" + dbc.ToSqlValue(Convert.ToDateTime(jssj).AddDays(1));
                }
                #endregion

                string sql = @"select 
                                a.driverId,
                                a.people,
                                a.tel,
                                a.carNum,
                                isNULL(b.money,0) AllMoney,
                                isNULL(c.HeXiaoMoney,0)HeXiaoMoney,
                                (isNULL(b.money,0)-isNULL(c.HeXiaoMoney,0)) WeiHeXiaoMoney 
                                from jichu_driver a
                                left join (
                                    select driverId,SUM(moneyQianfu)money from zhuangchedan_zhuangchedan
                                    where status=0  " + sqlW + @"
                                    group by driverId
                                )b on a.driverId=b.driverId
                                left join (
	                                select driverId,SUM(money)HeXiaoMoney from caiwu_expense
	                                where status=0 and kind=9
	                                group by driverId
                                )c on a.driverId=c.driverId
                                where a.companyId=" + dbc.ToSqlValue(companyId) + " and a.status=0";

                if (list_where.Count > 0)
                {
                    sql += " and " + string.Join(" and ", list_where);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("SaveQfHxOut")]
    public object SaveQfHxOut(JSReader xzlist, string hxrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable cwdt = dbc.GetEmptyDataTable("caiwu_expense");
                DataTableTracker cwdtt = new DataTableTracker(cwdt);

                List<string> yhxZcdIdArr = new List<string>();
                for (int i = 0; i < xzlist.ToArray().Length; i++)
                {
                    decimal hxje = string.IsNullOrEmpty(xzlist[i]["hxje"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["hxje"].ToString());
                    decimal yhxje = string.IsNullOrEmpty(xzlist[i]["yhxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["yhxmoney"].ToString());
                    decimal whxje = string.IsNullOrEmpty(xzlist[i]["whxmoney"].ToString()) ? 0 : Convert.ToDecimal(xzlist[i]["whxmoney"].ToString());

                    DataRow cwdr = cwdt.NewRow();
                    cwdr["id"] = xzlist[i]["id"].ToString();
                    if (hxje == whxje)
                    {
                        //更新装车单表状态
                        yhxZcdIdArr.Add(xzlist[i]["zhuangchedanId"].ToString());

                        //锁表列
                        cwdr["isLock"] = 1;

                        //财物日记
                        SortedList<string, string> sdl = new SortedList<string, string>();
                        sdl.Add("kind", "22");
                        sdl.Add("officeId", xzlist[i]["officeId"].ToString());
                        sdl.Add("expenseId", xzlist[i]["id"].ToString());
                        sdl.Add("zhuangchedanId", xzlist[i]["zhuangchedanId"].ToString());
                        sdl.Add("dateFasheng", hxrq);
                        //sdl.Add("memo", xzlist[i]["memo"].ToString());
                        InsertRJ(sdl, yhxje + hxje, 2);
                    }
                    cwdr["expenseDate"] = Convert.ToDateTime(hxrq);
                    cwdr["money"] = yhxje + hxje;
                    cwdt.Rows.Add(cwdr);

                    saveLog(xzlist[i]["id"].ToString(), Convert.ToDateTime(hxrq), hxje, "司机欠付核销(支)");
                }
                dbc.UpdateTable(cwdt, cwdtt);

                string sql = @"update zhuangchedan_zhuangchedan set isOverQianfuHexiao=1 where zhuangchedan_id in('" + string.Join("','", yhxZcdIdArr) + "')";
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

    [CSMethod("GetQfHxOutListByPage")]
    public object GetQfHxOutListByPage(int pagnum, int pagesize, string driverId, int zt)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                int cp = pagnum;
                int ac = 0;


                string sql = @"select
                                a.id,
                                a.zhuangchedanId,
                                b.zhuangchedanNum,
                                isNULL(b.moneyQianfu,0) money,
                                isNULL(a.money,0) yhxmoney,
                                (isNULL(b.moneyQianfu,0)-isNULL(a.money,0)) whxmoney,
                                0 hxje,
                                a.expenseDate,
                                a.officeId,
                                b.officeName,
                                b.ddofficeName,
                                b.people,
                                b.toAdsPeople,
                                b.toAdsTel
                                from caiwu_expense a
                                left join (
	                                select a.*,b.officeName,c.officeName ddofficeName,d.people from zhuangchedan_zhuangchedan a
	                                left join jichu_office b on a.officeId=b.officeId
	                                left join jichu_office c on a.toOfficeId=c.officeId
	                                left join jichu_driver d on a.driverId=d.driverId
                                )b on a.zhuangchedanId=b.zhuangchedan_id
                                where a.isLock=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and a.status=0 and a.kind=9 and b.isOverQianfuHexiao=" + zt;
                if (!string.IsNullOrEmpty(driverId))
                {
                    sql += " and a.driverId=" + dbc.ToSqlValue(driverId);
                }
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt_return.Columns.Add("isbj", typeof(bool));
                dt_return.Columns.Add("isxz", typeof(Int32));
                foreach (DataRow dr in dt_return.Rows)
                {
                    dr["isbj"] = false;
                    dr["isxz"] = 0;
                }
                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    #endregion

    /// <summary>
    /// 清除核销
    /// </summary>
    /// <param name="kind"></param>
    /// <param name="incomeId">财务ID</param>
    /// <param name="id">运单ID or 装车单ID</param>
    [CSMethod("DeleteExpenseHxLog")]
    public void DeleteExpenseHxLog(string kind, string incomeId, string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();
                string zdName = "";
                switch (kind)
                {
                    case "1":
                        zdName = "isOverDuanboHexiao=0";
                        break;
                    case "2":
                        zdName = "isOverZhongzhuanHexiao=0";
                        break;
                    case "3":
                        zdName = "isOverSonghuoHexiao=0";
                        break;
                    case "4":
                        zdName = "isOverHuikouHexiao=0";
                        break;
                    case "8":
                        zdName = "isOverYufuHexiao=0";
                        break;
                    case "9":
                        zdName = "isOverQianfuHexiao=0";
                        break;
                }

                string sql = "";
                if (Convert.ToInt32(kind) > 4)
                {
                    sql = @"update zhuangchedan_zhuangchedan set " + zdName + " where zhuangchedan_id=" + dbc.ToSqlValue(id);
                }
                else
                {
                    sql = @"update yundan_yundan set " + zdName + " where yundan_id=" + dbc.ToSqlValue(id);
                }
                dbc.ExecuteNonQuery(sql);

                sql = "update caiwu_expense set money=0 where id=" + dbc.ToSqlValue(incomeId);
                dbc.ExecuteNonQuery(sql);

                sql = @"delete from caiwu_hx_log where income_id=" + dbc.ToSqlValue(incomeId);
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

    #region 获取货品
    [CSMethod("GetHPList")]
    public DataTable GetHPList(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select * from dbo.yundan_goods where yundan_chaifen_id in(select yundan_chaifen_id from yundan_chaifen where status=0 and is_leaf=0 and yundan_id=" + dbc.ToSqlValue(ydid) + ")";
            DataTable dt = dbc.ExecuteDataTable(sql);
            return dt;
        }
    }

    [CSMethod("GetHPList2")]
    public DataTable GetHPList2(string zcdid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select * from dbo.yundan_goods where yundan_chaifen_id in(select yundan_chaifen_id from yundan_chaifen where status=0 and is_leaf=0 and zhuangchedan_id=" + dbc.ToSqlValue(zcdid) + ")";
            DataTable dt = dbc.ExecuteDataTable(sql);
            return dt;
        }
    }
    #endregion

    #region 日志记录
    public void saveLog(string id, DateTime ti, decimal money, string memo)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                DataTable logdt = dbc.GetEmptyDataTable("caiwu_hx_log");
                DataRow dr = logdt.NewRow();
                dr["id"] = Guid.NewGuid().ToString();
                dr["income_id"] = id;
                dr["incomeDate"] = ti;
                dr["money"] = money;
                dr["memo"] = memo;
                dr["addtime"] = DateTime.Now;
                dr["adduser"] = SystemUser.CurrentUser.UserID;
                logdt.Rows.Add(dr);
                dbc.InsertTable(logdt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetHxLog")]
    public DataTable GetHxLog(string incomeid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select a.*,b.UserXM from dbo.caiwu_hx_log a 
left join dbo.tb_b_user b on a.adduser=b.UserID
where income_id=" + dbc.ToSqlValue(incomeid);
            DataTable dt = dbc.ExecuteDataTable(sql);
            return dt;
        }
    }

    /// <summary>
    /// 获取现付核销日志
    /// </summary>
    /// <param name="yundanId"></param>
    /// <returns></returns>
    [CSMethod("GetHxLogByYundanId")]
    public DataTable GetHxLogByYundanId(string yundanId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select a.*,b.UserXM from dbo.caiwu_hx_log a 
left join dbo.tb_b_user b on a.adduser=b.UserID
where income_id in(select id from caiwu_income where status=0 and yundanId=" + dbc.ToSqlValue(yundanId) + " and kind=1  and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + ")";
            DataTable dt = dbc.ExecuteDataTable(sql);
            return dt;
        }
    }
    #endregion

    #region 司机押金
    [CSMethod("GetYjListByPage")]
    public object GetYjListByPage(int pagnum, int pagesize, string bscid, string driveName)
    {
        using (DBConnection dbc = new DBConnection())
        {
            int cp = pagnum;
            int ac = 0;

            #region 拼接查询条件
            List<string> list_where = new List<string>();
            if (!string.IsNullOrEmpty(bscid))
            {
                list_where.Add("a.officeId=" + dbc.ToSqlValue(bscid));
            }
            if (!string.IsNullOrEmpty(driveName))
            {
                list_where.Add("a.people=" + dbc.ToSqlValue(driveName));
            }
            #endregion

            string sql = @"select b.officeName,a.*,isNULL(c.sumyj,0) sumyj,isNULL(d.sumthyj,0) sumthyj,(isNULL(c.sumyj,0)-isNULL(d.sumthyj,0)) dthyj from jichu_driver a
                            left join jichu_office b on a.officeId=b.officeId
                            left join (
	                            select driverId,SUM(money)sumyj from caiwu_income
	                            where kind=8 and status=0
	                            group by driverId
                            ) c on a.driverId=c.driverId 
                            left join (
	                            select driverId,SUM(money)sumthyj from caiwu_expense
	                            where kind=11 and status=0
	                            group by driverId
                            ) d on a.driverId=d.driverId 
                            where a.status=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " order by b.xh,a.kind";

            if (list_where.Count > 0)
            {
                sql += " and " + string.Join(" and ", list_where);
            }
            DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

            return new { dt = dt_return, cp = cp, ac = ac };
        }
    }

    [CSMethod("SaveYjIncome")]
    public void SaveYjIncome(DateTime ti, string driverid, decimal money, string memo)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                var user = SystemUser.CurrentUser;
                DataTable dt = dbc.GetEmptyDataTable("caiwu_income");
                DataRow dr = dt.NewRow();
                dr["id"] = Guid.NewGuid().ToString();
                dr["isLock"] = 0;
                dr["kind"] = 8;
                dr["incomeDate"] = ti;
                dr["driverId"] = driverid;
                dr["money"] = money;
                if (!string.IsNullOrEmpty(memo))
                {
                    dr["memo"] = memo;
                }
                else
                {
                    dr["memo"] = "收取押金";
                }
                dr["adduser"] = user.UserID;
                dr["addtime"] = DateTime.Now;
                dr["companyId"] = user.CompanyID;
                dr["status"] = 0;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetYjIncomeByDriverId")]
    public DataTable GetYjIncomeByDriverId(string driverid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select * from caiwu_income where status=0 and kind=8 and driverId=" + dbc.ToSqlValue(driverid);
            DataTable dt = dbc.ExecuteDataTable(sql);
            return dt;
        }
    }

    [CSMethod("SaveYjExpense")]
    public void SaveYjExpense(DateTime ti, string driverid, decimal money, string memo)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                var user = SystemUser.CurrentUser;
                DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                DataRow dr = dt.NewRow();
                dr["id"] = Guid.NewGuid().ToString();
                dr["isLock"] = 0;
                dr["kind"] = 11;
                dr["expenseDate"] = ti;
                dr["driverId"] = driverid;
                dr["money"] = money;
                if (!string.IsNullOrEmpty(memo))
                {
                    dr["memo"] = memo;
                }
                else
                {
                    dr["memo"] = "退还押金";
                }
                dr["adduser"] = user.UserID;
                dr["addtime"] = DateTime.Now;
                dr["companyId"] = user.CompanyID;
                dr["status"] = 0;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetYjExpenseByDriverId")]
    public DataTable GetYjExpenseByDriverId(string driverid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select * from caiwu_expense where status=0 and kind=11 and driverId=" + dbc.ToSqlValue(driverid);
            DataTable dt = dbc.ExecuteDataTable(sql);
            return dt;
        }
    }
    #endregion

    #region 财务日记账
    [CSMethod("GetReportRijiList")]
    public DataTable GetReportRijiList(string start_time, string end_time, string cx_bsc, string cx_item, string cx_memo)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string where = "";
                if (!string.IsNullOrEmpty(start_time) && !string.IsNullOrEmpty(end_time))
                {
                    where += " and a.dateFasheng >= " + dbc.ToSqlValue(Convert.ToDateTime(start_time)) + " and a.dateFasheng < " + dbc.ToSqlValue(Convert.ToDateTime(end_time).AddDays(1));
                }
                if (!string.IsNullOrEmpty(cx_bsc))
                {
                    where += " and a.officeId = " + dbc.ToSqlValue(cx_bsc);
                }

                if (!string.IsNullOrEmpty(cx_item))
                {
                    where += " and a.kind=" + dbc.ToSqlValue(cx_item);
                }
                if (!string.IsNullOrEmpty(cx_memo))
                {
                    where += " and a.memo like '%" + cx_memo + "%'";
                }

                string sql = @"select a.*,b.officeName,c.yundanNum,d.people clientName,e.people driverName,'' itemName,0 moneyIncome,0 moneyExpense,f.UserXM userName from caiwu_report_riji a
                                left join jichu_office b on a.officeId=b.officeId
                                left join yundan_yundan c on a.yundanId=c.yundan_id
                                left join jichu_client d on a.clientId=d.clientId
                                left join jichu_driver e on a.driverId=e.driverId
                                left join dbo.tb_b_user f on a.adduser=f.UserID
                                where a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + where + @"
                                order by dateFasheng asc";
                DataTable dt = dbc.ExecuteDataTable(sql);

                sql = "select * from caiwu_income_item where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID);
                DataTable initemDt = dbc.ExecuteDataTable(sql);

                sql = "select * from caiwu_expense_item where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID);
                DataTable outitemDt = dbc.ExecuteDataTable(sql);

                sql = "select * from caiwu_income where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID);
                DataTable inDt = dbc.ExecuteDataTable(sql);

                sql = "select * from caiwu_expense where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID);
                DataTable outDt = dbc.ExecuteDataTable(sql);

                foreach (DataRow dr in dt.Rows)
                {
                    if (dr["incomeId"] != DBNull.Value)
                    {
                        DataRow[] drs = inDt.Select("id=" + dbc.ToSqlValue(dr["incomeId"]));
                        if (drs.Length > 0)
                        {
                            dr["moneyIncome"] = Convert.ToDecimal(drs[0]["money"]);
                        }
                        if (dr["incomeItemId"] != DBNull.Value)
                        {
                            DataRow[] item_drs = initemDt.Select("id=" + dbc.ToSqlValue(dr["incomeItemId"].ToString()));
                            if (item_drs.Length > 0)
                            {
                                dr["itemName"] = item_drs[0]["itemName"].ToString();
                            }
                        }
                    }
                    else if (dr["expenseId"] != DBNull.Value)
                    {
                        DataRow[] drs = outDt.Select("id=" + dbc.ToSqlValue(dr["expenseId"]));
                        if (drs.Length > 0)
                        {
                            dr["moneyExpense"] = Convert.ToDecimal(drs[0]["money"]) * -1;
                        }
                        if (dr["expenseItemId"] != DBNull.Value)
                        {
                            DataRow[] item_drs = outitemDt.Select("id=" + dbc.ToSqlValue(dr["expenseItemId"].ToString()));
                            if (item_drs.Length > 0)
                            {
                                dr["itemName"] = item_drs[0]["itemName"].ToString();
                            }
                        }
                    }
                }
                //第一行期初数据
                string qcje = "0.00";
                if (dt.Rows.Count > 0)
                {
                    qcje = Convert.ToDecimal(dt.Rows[0]["moneyFasheng"]).ToString("N2");
                }
                DataRow QcRow = dt.NewRow();
                //QcRow["dateFasheng"] = "期初";
                QcRow["moneyFasheng"] = qcje;
                dt.Rows.InsertAt(QcRow, 0);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }

    /// <summary>
    ///--{ 'itemId': '1', 'itemName': '运费现付' },
    ///--{ 'itemId': '2', 'itemName': '运费欠付' },
    ///--{ 'itemId': '3', 'itemName': '运费到付' },
    ///--{ 'itemId': '4', 'itemName': '回扣' },
    ///--{ 'itemId': '5', 'itemName': '短驳费' },
    ///--{ 'itemId': '6', 'itemName': '送货费' },
    ///--{ 'itemId': '7', 'itemName': '中转费' },
    ///{ 'itemId': '8', 'itemName': '代收货款(点上收)' },
    ///{ 'itemId': '9', 'itemName': '代收货款(总部支)' },
    ///{ 'itemId': '10', 'itemName': '代收货款手续费' },
    ///--{ 'itemId': '21', 'itemName': '司机运费现付' },
    ///--{ 'itemId': '22', 'itemName': '司机运费欠付' },
    ///{ 'itemId': '23', 'itemName': '司机运费到付' },
    ///{ 'itemId': '24', 'itemName': '主货到付(收)' },
    ///{ 'itemId': '25', 'itemName': '主货到付(支)' },
    ///{ 'itemId': '28', 'itemName': '司机押金(收)' },
    ///{ 'itemId': '29', 'itemName': '司机押金(支)' },
    ///--{ 'itemId': '100', 'itemName': '费用收入' },
    ///--{ 'itemId': '200', 'itemName': '费用支出' }
    /// </summary>
    /// <param name="sdl"></param>
    /// <param name="hxje"></param>
    /// <param name="bs">1:+，2：-</param>
    public void InsertRJ(SortedList<string, string> sdl, decimal hxje, int bs)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                //基础数据
                string sql = @"select * from yundan_yundan where status=0";
                DataTable ydDt = dbc.ExecuteDataTable(sql);

                sql = "select * from yundan_duanbo_fenliu where status=0";
                DataTable flDt = dbc.ExecuteDataTable(sql);

                sql = "select* from dbo.zhuangchedan_zhuangchedan where status=0";
                DataTable zcdDt = dbc.ExecuteDataTable(sql);

                decimal lastQCJE = 0m;//最后一期期初金额
                sql = "select id,moneyFasheng from caiwu_report_riji order by dateFasheng desc";
                DataTable dt = dbc.ExecuteDataTable(sql);
                if (dt.Rows.Count > 0)
                {
                    lastQCJE = Convert.ToDecimal(dt.Rows[0]["moneyFasheng"]);
                }

                //各个收支科目的备注
                SortedList<string, string> memoArr = new SortedList<string, string>();
                memoArr.Add("1", "预付核销");
                memoArr.Add("2", "欠付核销");
                memoArr.Add("3", "到付核销");
                memoArr.Add("4", "回扣核销");
                memoArr.Add("5", "短驳核销");
                memoArr.Add("6", "送货核销");
                memoArr.Add("7", "中转费核销");
                memoArr.Add("21", "(司机)预付核销");
                memoArr.Add("22", "(司机)欠付核销");
                memoArr.Add("23", "(司机)到付核销");


                DataTable rjdt = dbc.GetEmptyDataTable("caiwu_report_riji");
                DataRow rjdr = rjdt.NewRow();
                rjdr["id"] = Guid.NewGuid().ToString();
                foreach (KeyValuePair<string, string> item in sdl)
                {
                    rjdr[item.Key] = sdl[item.Key];
                    if (item.Key == "kind")
                    {
                        rjdr["memo"] = memoArr[item.Value];//备注
                        if (Convert.ToInt32(item.Value) >= 1 || Convert.ToInt32(item.Value) < 5)
                        {
                            //运单有关
                            string ydid = sdl["yundanId"];
                            DataRow[] drs = ydDt.Select("yundan_id=" + dbc.ToSqlValue(ydid));
                            if (drs.Length > 0)
                            {
                                //客户
                                rjdr["clientId"] = drs[0]["clientId"].ToString();
                            }
                        }
                        else if (Convert.ToInt32(item.Value) == 5)
                        {
                            //司机有关
                            string ydid = sdl["yundanId"];
                            DataRow[] drs = flDt.Select("kind=1 and yundanId=" + dbc.ToSqlValue(ydid));
                            if (drs.Length > 0)
                            {
                                //司机
                                rjdr["driverId"] = drs[0]["driverId"].ToString();
                            }
                        }
                        else if (Convert.ToInt32(item.Value) == 6)
                        {
                            //司机有关
                            string ydid = sdl["yundanId"];
                            DataRow[] drs = flDt.Select("kind=3 and yundanId=" + dbc.ToSqlValue(ydid));
                            if (drs.Length > 0)
                            {
                                //司机
                                rjdr["driverId"] = drs[0]["driverId"].ToString();
                                //装车单
                                rjdr["zhuangchedanId"] = drs[0]["zhuangchedanId"].ToString();
                            }
                        }
                        else if (Convert.ToInt32(item.Value) == 7)
                        {
                            //中转公司有关
                            string ydid = sdl["yundanId"];
                            DataRow[] drs = flDt.Select("kind=2 and yundanId=" + dbc.ToSqlValue(ydid));
                            if (drs.Length > 0)
                            {
                                //中转公司
                                rjdr["zhongzhuanId"] = drs[0]["zhongzhuanId"].ToString();
                                //装车单
                                rjdr["zhuangchedanId"] = drs[0]["zhuangchedanId"].ToString();
                            }
                        }
                        else if (Convert.ToInt32(item.Value) == 21 || Convert.ToInt32(item.Value) == 22)
                        {
                            //装车单有关
                            string zcdid = sdl["zhuangchedanId"];
                            DataRow[] drs = zcdDt.Select("zhuangchedan_id=" + dbc.ToSqlValue(zcdid));
                            if (drs.Length > 0)
                            {
                                //司机
                                rjdr["driverId"] = drs[0]["driverId"].ToString();
                            }
                        }
                    }
                }
                if (bs == 1)
                {
                    rjdr["moneyFasheng"] = lastQCJE + hxje;
                }
                else if (bs == 2)
                {
                    rjdr["moneyFasheng"] = lastQCJE - hxje;
                }
                rjdr["adduser"] = SystemUser.CurrentUser.UserID;
                rjdr["addtime"] = DateTime.Now;
                rjdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                rjdt.Rows.Add(rjdr);
                dbc.InsertTable(rjdt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion
}