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
///XLMag 的摘要说明
/// </summary>
[CSClass("XLMag")]
public class XLMag
{
    public XLMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }

    /// <summary>
    /// 获取线路列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetXLList")]
    public object GetXLList(int pagnum, int pagesize, string keyword)
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
                    where += " and (" + dbc.C_Like("b.officeName", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("c.officeName", keyword.Trim(), LikeStyle.LeftAndRightLike) + ")";
                }

                string str = @"select a.*,b.officeName as fromOfficeName,c.officeName as toOfficeName from jichu_xianlu a left join jichu_office b on a.fromOfficeId=b.officeId
                              left join jichu_office c on a.toOfficeId=c.officeId
                              where a.status=0 " + where + " and a.companyId='" + SystemUser.CurrentUser.CompanyID + "' order by a.addtime desc";
                //开始取分页数据   
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                dtPage.Columns.Add("XGQT");

                str = "select a.*,b.UserName from jichu_xianlu2user a left join tb_b_user b on a.userId=b.UserID order by b.UserName";
                DataTable xldt = dbc.ExecuteDataTable(str);

                if (dtPage.Rows.Count > 0)
                {
                    for (int i = 0; i < dtPage.Rows.Count; i++)
                    {
                        DataRow[] drs = xldt.Select("traderId='" + dtPage.Rows[i]["traderId"] + "'");
                        if (drs.Length > 0)
                        {
                            string[] arr = drs.Select(x => x["UserName"].ToString()).ToArray();
                            dtPage.Rows[i]["XGQT"] = string.Join(",", arr);
                        }
                    }
                }

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    /// <summary>
    /// 根据ID获取线路
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetXLById")]
    public object GetXLById(string traderId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_xianlu where traderId=@traderId";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@traderId", traderId);
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
    /// 新增编辑线路
    /// </summary>
    /// <param name="jsr"></param>
    /// <returns></returns>
    [CSMethod("SaveXL")]
    public object SaveXL(JSReader jsr)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        string companyId = user.CompanyID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string fromOfficeId = jsr["fromOfficeId"];
                if (string.IsNullOrEmpty(fromOfficeId))
                {
                    throw new Exception("起始办事处不能为空！");
                }

                string toOfficeId = jsr["toOfficeId"];
                if (string.IsNullOrEmpty(toOfficeId))
                {
                    throw new Exception("到达办事处不能为空！");
                }

                if (jsr["traderId"].ToString() == "")
                {
                    //新增
                    string traderId = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("jichu_xianlu");
                    DataRow dr = dt.NewRow();
                    dr["traderId"] = new Guid(traderId);
                    dr["fromOfficeId"] = fromOfficeId;
                    dr["toOfficeId"] = toOfficeId;
                    dr["companyId"] = companyId;
                    dr["status"]=0;
                    dr["addtime"] = DateTime.Now;
                    dr["adduser"] = userid;
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"]= userid;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string traderId = jsr["traderId"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("jichu_xianlu");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["traderId"] = new Guid(traderId);
                    dr["fromOfficeId"] = fromOfficeId;
                    dr["toOfficeId"] = toOfficeId;
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
    /// 删除线路
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("DeleteXL")]
    public object DeleteYwy(string traderId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("jichu_xianlu");
                DataTableTracker dtt = new DataTableTracker(dt);
                DataRow dr = dt.NewRow();
                dr["traderId"] = new Guid(traderId);
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

    [CSMethod("GetXL2YH")]
    public object GetXL2YH(string xlid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string str = "select UserID,UserName from tb_b_user	where companyId='" + SystemUser.CurrentUser.CompanyID + "' order by  UserName";
                DataTable userdt = dbc.ExecuteDataTable(str);

                str = "select distinct userId from jichu_xianlu2user where traderId='" + xlid + "'";
                DataTable yxdt = dbc.ExecuteDataTable(str);

                return new { userdt = userdt, yxdt = yxdt };

            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("SaveXL2YH")]
    public object SaveXL2YH(JSReader js,string xlid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string str = "delete from jichu_xianlu2user where traderId=" + dbc.ToSqlValue(xlid);
                dbc.ExecuteNonQuery(str);

                DataTable dt = dbc.GetEmptyDataTable("jichu_xianlu2user");
                for (int i = 0; i < js.ToArray().Length; i++)
                {
                        DataRow dr = dt.NewRow();
                        dr["id"] = Guid.NewGuid();
                        dr["traderId"] = xlid;
                        dr["userId"] = js[i]["UserID"].ToString();
                        dt.Rows.Add(dr);
                }

                dbc.InsertTable(dt);
                dbc.CommitTransaction();
                return 1;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }
}
