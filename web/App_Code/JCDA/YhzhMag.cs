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
///YhzhMag 的摘要说明
/// </summary>
[CSClass("YhzhMag")]
public class YhzhMag
{
    public YhzhMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }

    /// <summary>
    /// 获取银行账户列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetBankList")]
    public object GetBankList(int pagnum, int pagesize, string keyword)
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
                    where += " and " + dbc.C_Like("itemName", keyword.Trim(), LikeStyle.LeftAndRightLike);
                }
                string str = "  select * from caiwu_bank where status=0 " + where + " and companyId='"+SystemUser.CurrentUser.CompanyID+"' order by addtime desc";
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
    /// 根据ID获取银行账户
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetBankById")]
    public object GetBankById(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from caiwu_bank where id=@id";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@id", id);
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
    /// 新增编辑银行账户
    /// </summary>
    /// <param name="jsr"></param>
    /// <returns></returns>
    [CSMethod("SaveBank")]
    public object SaveBank(JSReader jsr)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string itemName = jsr["itemName"];
                if (string.IsNullOrEmpty(itemName))
                {
                    throw new Exception("银行账户名不能为空！");
                }

                if (jsr["id"].ToString() == "")
                {
                    //新增
                    string id = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("caiwu_bank");
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    dr["itemName"] = itemName;
                    dr["status"]=0;
                    dr["addtime"] = DateTime.Now;
                    dr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string id = jsr["id"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("caiwu_bank");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    dr["itemName"] = itemName;
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
    /// 删除银行账户
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("DeleteBank")]
    public object DeleteBank(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("caiwu_bank");
                DataTableTracker dtt = new DataTableTracker(dt);
                DataRow dr = dt.NewRow();
                dr["id"] = new Guid(id);
                dr["status"] = 1;
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
