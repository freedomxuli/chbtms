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
///ZZMag 的摘要说明
/// </summary>
[CSClass("ZZMag")]
public class ZZMag
{
    public ZZMag()
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
    [CSMethod("GetZZList")]
    public object GetZZList(int pagnum, int pagesize, string keyword)
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
                    where += " and (" + dbc.C_Like("a.compName", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("a.compCode", keyword.Trim(), LikeStyle.LeftAndRightLike) + ")";
                }
                string str = @"select a.*,b.officeName from jichu_zhongzhuan a left join jichu_office b on a.officeId=b.officeId
                          where a.status=0 " + where + " and a.companyId='"+SystemUser.CurrentUser.CompanyID+"' order by a.addtime desc";
                //开始取分页数据   
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac ,csbsc = SystemUser.CurrentUser.CsOfficeId};
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
    [CSMethod("GetZZById")]
    public object GetZZById(string zhongzhuanId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_zhongzhuan where zhongzhuanId=@zhongzhuanId";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@zhongzhuanId", zhongzhuanId);
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
    [CSMethod("SaveZZ")]
    public object SaveZZ(JSReader jsr)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string compName = jsr["compName"];
                if (string.IsNullOrEmpty(compName))
                {
                    throw new Exception("公司名称不能为空！");
                }

                if (jsr["zhongzhuanId"].ToString() == "")
                {
                    //新增
                    string zhongzhuanId = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("jichu_zhongzhuan");
                    DataRow dr = dt.NewRow();
                    dr["zhongzhuanId"] = new Guid(zhongzhuanId);
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["compCode"] = jsr["compCode"];
                    dr["compName"] = compName;
                    dr["people"] = jsr["people"];
                    dr["tel"] = jsr["tel"];
                    dr["addr"] = jsr["addr"];
                    dr["status"]=0;
                    dr["addtime"] = DateTime.Now;
                    dr["adduser"] = userid;
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"]= userid;
                    dr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string zhongzhuanId = jsr["zhongzhuanId"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("jichu_zhongzhuan");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["zhongzhuanId"] = new Guid(zhongzhuanId);
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["compCode"] = jsr["compCode"];
                    dr["compName"] = compName;
                    dr["people"] = jsr["people"];
                    dr["tel"] = jsr["tel"];
                    dr["addr"] = jsr["addr"];
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
    [CSMethod("DeleteZZ")]
    public object DeleteYwy(string zhongzhuanId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("jichu_zhongzhuan");
                DataTableTracker dtt = new DataTableTracker(dt);
                DataRow dr = dt.NewRow();
                dr["zhongzhuanId"] = new Guid(zhongzhuanId);
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
