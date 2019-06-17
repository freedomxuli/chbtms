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
///JsMag 的摘要说明
/// </summary>
[CSClass("BscMag")]
public class BscMag
{
    public BscMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }

    /// <summary>
    /// 获取办事处列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetBscList")]
    public object GetBscList(int pagnum, int pagesize, string keyword)
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
                    where += " and (" + dbc.C_Like("officeCode", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("officeName", keyword.Trim(), LikeStyle.LeftAndRightLike) + ")";
                }
                string str = "select * from jichu_office where status=0 " + where + " and companyId='" + SystemUser.CurrentUser.CompanyID + "' order by xh";
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
    /// 根据ID获取办事处
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetBscById")]
    public object GetBscById(string officeid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_office where officeId=@officeId";
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
    /// 新增编辑办事处
    /// </summary>
    /// <param name="jsr"></param>
    /// <returns></returns>
    [CSMethod("SaveBsc")]
    public object SaveBsc(JSReader jsr)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string officeCode = jsr["officeCode"];
                if (string.IsNullOrEmpty(officeCode))
                {
                    throw new Exception("办事处代码不能为空！");
                }

                string officeName = jsr["officeName"];
                if (string.IsNullOrEmpty(officeName))
                {
                    throw new Exception("办事处名称不能为空！");
                }

                string officeGroup = jsr["officeGroup"];
                if (string.IsNullOrEmpty(officeGroup))
                {
                    throw new Exception("办事处分组不能为空！");
                }

                string officeHead = jsr["officeHead"];
                if (string.IsNullOrEmpty(officeName))
                {
                    throw new Exception("单据前缀不能为空！");
                }

                //int jszt = jsr["officeGroup"].ToInteger();

                if (jsr["officeId"].ToString() == "")
                {
                    //新增
                    string officeid = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("jichu_office");
                    DataRow dr = dt.NewRow();
                    dr["officeId"] = new Guid(officeid);
                    dr["officeCode"] = officeCode;
                    dr["officeName"] = officeName;
                    dr["officeGroup"] = Convert.ToInt32(officeGroup);
                    dr["officeTel"] = jsr["officeTel"];
                    dr["officePeople"] = jsr["officePeople"];
                    dr["officeAddress"] = jsr["officeAddress"];
                    if (officeHead.Length > 2)
                    {
                        dr["officeHead"] = officeHead.Substring(0, 2);
                    }
                    else
                    {
                        dr["officeHead"] = officeHead;
                    }
                    dr["officeMemo"] = jsr["officeMemo"];
                    dr["status"] = 0;
                    dr["addtime"] = DateTime.Now;
                    dr["adduser"] = userid;
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"] = userid;
                    dr["companyId"] = SystemUser.CurrentUser.CompanyID;

                    dr["xh"] = Convert.ToInt32(jsr["xh"].ToString());
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string officeid = jsr["officeId"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("jichu_office");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["officeId"] = new Guid(officeid);
                    dr["officeCode"] = officeCode;
                    dr["officeName"] = officeName;
                    dr["officeGroup"] = Convert.ToInt32(officeGroup);
                    dr["officeTel"] = jsr["officeTel"];
                    dr["officePeople"] = jsr["officePeople"];
                    dr["officeAddress"] = jsr["officeAddress"];
                    if (officeHead.Length > 2)
                    {
                        dr["officeHead"] = officeHead.Substring(0, 2);
                    }
                    else
                    {
                        dr["officeHead"] = officeHead;
                    }
                    dr["officeMemo"] = jsr["officeMemo"];
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"] = userid;

                    dr["xh"] = Convert.ToInt32(jsr["xh"].ToString());
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
    /// 删除办事处
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("DeleteBsc")]
    public object DeleteBsc(string officeid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("jichu_office");
                DataTableTracker dtt = new DataTableTracker(dt);
                DataRow dr = dt.NewRow();
                dr["officeId"] = new Guid(officeid);
                dr["status"] = 1;
                dr["updatetime"] = DateTime.Now;
                dr["updateuser"] = SystemUser.CurrentUser.UserID;
                dt.Rows.Add(dr);
                dbc.UpdateTable(dt, dtt);

                //办事处对应的路线也有所变化
                string sql = @"update jichu_xianlu set status=1 
                                where companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " fromOfficeId=" + dbc.ToSqlValue(officeid) + " or toOfficeId=" + dbc.ToSqlValue(officeid);
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

    #region 查询条件用
    /// <summary>
    /// 1.获取当前用户所在公司的所有办事处
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetBsc")]
    public object GetBsc()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select officeId as VALUE,officeName as TEXT from jichu_office 
                                where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " order by xh";
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
    /// 1.获取当前用户所在公司的所有办事处
    /// </summary>
    /// <returns></returns>
    [CSMethod("GetBsc2")]
    public object GetBsc2()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select officeId,officeName from jichu_office 
                    where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " order by officeCode,addtime desc";
                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("GetOtherBsc")]
    public object GetOtherBsc()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select officeId,officeName from jichu_office 
                    where status=0 and companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and officeId not in(" + dbc.ToSqlValue(SystemUser.CurrentUser.CsOfficeId) + ") order by xh";
                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
    #endregion




    [CSMethod("GetUserBsc")]
    public object GetUserBsc(string userid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string companyID = SystemUser.CurrentUser.CompanyID;
                string str = @"select 
                                b.userId,
                                a.officeId,
                                a.officeName,
                                case
                                when b.officeId is null then 0
                                else 1
                                end as glzt from jichu_office a
                                left join tb_b_user_office b on a.officeId=b.officeId and b.userId=" + dbc.ToSqlValue(userid) + " and b.companyId=" + dbc.ToSqlValue(companyID) + @"
                                where a.status=0 and a.companyId=" + dbc.ToSqlValue(companyID) + @" 
                                order by a.officeCode,a.addtime desc";
                DataTable dt = dbc.ExecuteDataTable(str);

                str = @"select a.employId,a.employName,a.officeId,
                case
                when b.traderId is null then 0
                else 1
                END as glzt 
                from dbo.jichu_employ a
                left join tb_b_user_trader b on a.employId=b.traderId and b.userId=" + dbc.ToSqlValue(userid) + " and b.companyId=" + dbc.ToSqlValue(companyID) + @"
 where a.status=0 and a.companyId=" + dbc.ToSqlValue(companyID) + @" 
order by a.employCode,a.addtime desc";
                DataTable ywyGlDt = dbc.ExecuteDataTable(str);

                return new { officeGlDt = dt, ywyGlDt = ywyGlDt };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
