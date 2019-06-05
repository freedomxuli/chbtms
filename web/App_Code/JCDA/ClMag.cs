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
///ClMag 的摘要说明
/// </summary>
[CSClass("ClMag")]
public class ClMag
{
    public ClMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }

    /// <summary>
    /// 获取车辆列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetClList")]
    public object GetClList(int pagnum, int pagesize, string kind, string keyword)
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
                    where += " and " + dbc.C_Like("a.people", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("a.peopleCode", keyword.Trim(), LikeStyle.LeftAndRightLike);
                }

                if (!string.IsNullOrEmpty(kind))
                {
                    where += " and " + dbc.C_EQ("a.kind", Convert.ToInt32(kind));
                }
                string str = @"select a.*,b.officeName from jichu_driver a left join jichu_office b on a.officeId=b.officeId
                          where a.status=0 " + where + " and a.companyId='" + SystemUser.CurrentUser.CompanyID + "' order by addtime desc";
                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac, csbsc = SystemUser.CurrentUser.CsOfficeId };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    /// <summary>
    /// 根据ID获取车辆
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetClById")]
    public object GetClById(string driverId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_driver where driverId=@driverId";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@driverId", driverId);
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
    /// 新增编辑车辆
    /// </summary>
    /// <param name="jsr"></param>
    /// <returns></returns>
    [CSMethod("SaveCl")]
    public object SaveCl(JSReader jsr, string kind)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string people = jsr["people"];
                if (string.IsNullOrEmpty(people))
                {
                    throw new Exception("车辆名不能为空！");
                }

                string carNum = jsr["carNum"];
                if (string.IsNullOrEmpty(carNum))
                {
                    throw new Exception("车牌号不能为空！");
                }

                if (jsr["driverId"].ToString() == "")
                {
                    //新增
                    string driverId = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("jichu_driver");
                    DataRow dr = dt.NewRow();
                    dr["driverId"] = new Guid(driverId);
                    dr["officeId"] = jsr["officeId"].ToString();
                    if (!string.IsNullOrEmpty(kind))
                    {
                        dr["kind"] = Convert.ToInt32(kind);
                    }
                    dr["people"] = people;
                    dr["peopleCode"] = jsr["peopleCode"];
                    dr["shenfenzheng"] = jsr["shenfenzheng"];
                    dr["address"] = jsr["address"];
                    dr["tel"] = jsr["tel"];
                    dr["carNum"] = carNum;
                    dr["status"] = 0;
                    dr["addtime"] = DateTime.Now;
                    dr["adduser"] = userid;
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"] = userid;
                    dr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string driverId = jsr["driverId"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("jichu_driver");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["driverId"] = new Guid(driverId);
                    dr["officeId"] = jsr["officeId"].ToString();
                    if (!string.IsNullOrEmpty(kind))
                    {
                        dr["kind"] = Convert.ToInt32(kind);
                    }
                    dr["people"] = people;
                    dr["peopleCode"] = jsr["peopleCode"];
                    dr["shenfenzheng"] = jsr["shenfenzheng"];
                    dr["address"] = jsr["address"];
                    dr["tel"] = jsr["tel"];
                    dr["carNum"] = carNum;
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"] = userid;
                    dt.Rows.Add(dr);
                    dbc.UpdateTable(dt, dtt);
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
    /// 删除车辆
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("DeleteCl")]
    public object DeleteCl(string driverId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("jichu_driver");
                DataTableTracker dtt = new DataTableTracker(dt);
                DataRow dr = dt.NewRow();
                dr["driverId"] = new Guid(driverId);
                dr["status"] = 1;
                dr["updatetime"] = DateTime.Now;
                dr["updateuser"] = SystemUser.CurrentUser.UserID;
                dt.Rows.Add(dr);
                dbc.UpdateTable(dt, dtt);
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
}
