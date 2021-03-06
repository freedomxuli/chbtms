﻿using System;
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
using System.Collections;

/// <summary>
///YwyMag 的摘要说明
/// </summary>
[CSClass("YwyMag")]
public class YwyMag
{
    public YwyMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }

    /// <summary>
    /// 获取业务员列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetYwyList")]
    public object GetYwyList(int pagnum, int pagesize, string keyword)
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
                    where += " and (" + dbc.C_Like("a.employCode", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("a.employName", keyword.Trim(), LikeStyle.LeftAndRightLike) + ")";
                }
                string str = @"select a.*,b.officeName from jichu_employ a left join jichu_office b on a.officeId=b.officeId
                          where a.status=0 " + where + " and a.companyId='" + SystemUser.CurrentUser.CompanyID + "' order by addtime desc";
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
    /// 根据ID获取业务员
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetYwyById")]
    public object GetYwyById(string employId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_employ where employId=@employId";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add(new SqlParameter("@employId", employId));
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
    /// 新增编辑业务员
    /// </summary>
    /// <param name="jsr"></param>
    /// <returns></returns>
    [CSMethod("SaveYwy")]
    public object SaveYwy(JSReader jsr)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string employName = jsr["employName"];
                if (string.IsNullOrEmpty(employName))
                {
                    throw new Exception("姓名不能为空！");
                }

                if (jsr["employId"].ToString() == "")
                {
                    //新增
                    string employId = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("jichu_employ");
                    DataRow dr = dt.NewRow();
                    dr["employId"] = new Guid(employId);
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["employCode"] = jsr["employCode"];
                    dr["employName"] = employName;
                    dr["tel"] = jsr["tel"];
                    dr["isFire"] = Convert.ToInt32(jsr["isFire"].ToString());
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
                    string employId = jsr["employId"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("jichu_employ");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["employId"] = new Guid(employId);
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["employCode"] = jsr["employCode"];
                    dr["employName"] = employName;
                    dr["tel"] = jsr["tel"];
                    dr["isFire"] = Convert.ToInt32(jsr["isFire"].ToString());
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
    /// 删除业务员
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("DeleteYwy")]
    public object DeleteYwy(string employId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("jichu_employ");
                DataTableTracker dtt = new DataTableTracker(dt);
                DataRow dr = dt.NewRow();
                dr["employId"] = new Guid(employId);
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

    [CSMethod("GetEmployByOffice")]
    public DataTable GetEmployByOffice(string userid, JSReader offidArr, int zt)
    {
        using (var dbc = new DBConnection())
        {
            try
            {
                string companyID = SystemUser.CurrentUser.CompanyID;
                string whereSql = "";
                string whereSql2 = "";
                if (!string.IsNullOrEmpty(userid))
                {
                    whereSql += " and b.userId=" + dbc.ToSqlValue(userid);
                }
                if (offidArr.ToArray().Length > 0)
                {
                    List<string> ids = new List<string>();
                    for (int i = 0; i < offidArr.ToArray().Length; i++)
                    {
                        ids.Add(offidArr.ToArray()[i]);
                    }
                    whereSql2 += " and a.officeId in('" + string.Join("','", ids) + "')";
                }
                else
                {
                    if (zt == 0)
                    {
                        //初始化显示全部
                    }
                    else
                    {
                        //无选择，删除全部加载
                        whereSql2 += " and 1=2";
                    }
                }
                string sql = @"select a.employId,a.employName,a.officeId,
                case
                when b.traderId is null then 0
                else 1
                END as glzt
                from dbo.jichu_employ a
                left
                join tb_b_user_trader b on a.employId = b.traderId  and b.companyId = " + dbc.ToSqlValue(companyID) + whereSql + @"
                 where a.status = 0 and a.companyId = " + dbc.ToSqlValue(companyID) + whereSql2 + @"
                order by a.employCode,a.addtime desc";
                DataTable dt_employ = dbc.ExecuteDataTable(sql);
                return dt_employ;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
