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
                                where a.status = 0 and a.is_leaf = 1 and a.companyId = @CompanyID and c.status = 0";
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
}