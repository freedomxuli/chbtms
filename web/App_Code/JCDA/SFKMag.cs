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
///SFKMag 的摘要说明
/// </summary>
[CSClass("SFKMag")]
public class SFKMag
{
    public SFKMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }
    #region 收款项目
    /// <summary>
    /// 获取收款项目列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetSKList")]
    public object GetSKList(int pagnum, int pagesize, string keyword)
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
                    where += " and " + dbc.C_Like("itemCode", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("itemName", keyword.Trim(), LikeStyle.LeftAndRightLike);
                }

                string str = @"select * from caiwu_income_item where status=0 "+where+" order by addtime desc";
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
    /// 新增编辑收款项目
    /// </summary>
    /// <param name="jsr"></param>
    /// <returns></returns>
    [CSMethod("SaveSkxm")]
    public object SaveSkxm(JSReader jsr)
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
                    throw new Exception("科目名不能为空！");
                }

                if (jsr["id"].ToString() == "")
                {
                    //新增
                    string id = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("caiwu_income_item");
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    dr["itemName"] = itemName;
                    dr["itemCode"] = jsr["itemCode"];
                    dr["type"] = 0;
                    dr["isIncome"] = Convert.ToInt32(jsr["isIncome"].ToString());
                    dr["memo"] = jsr["memo"];
                    dr["status"] = 0;
                    dr["addtime"] = DateTime.Now;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string id = jsr["id"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("caiwu_income_item");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    dr["itemName"] = itemName;
                    dr["itemCode"] = jsr["itemCode"];
                    dr["type"] =0 ;
                    dr["isIncome"] = Convert.ToInt32(jsr["isIncome"].ToString());
                    dr["memo"] = jsr["memo"];
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
    /// 根据ID获取收款项目
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetSkxmById")]
    public object GetSkxmById(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from caiwu_income_item where id=@id";
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
    /// 删除收款项目
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("DeleteSkxm")]
    public object DeleteSkxm(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("caiwu_income_item");
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

    #endregion

    #region  付款项目
    /// <summary>
    /// 获取付款项目列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetFKList")]
    public object GetFKList(int pagnum, int pagesize, string keyword)
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
                    where += " and " + dbc.C_Like("itemCode", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("itemName", keyword.Trim(), LikeStyle.LeftAndRightLike);
                }

                string str = @"select * from caiwu_expense_item where status=0 " + where + " order by addtime desc";
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
    /// 新增编辑付款项目
    /// </summary>
    /// <param name="jsr"></param>
    /// <returns></returns>
    [CSMethod("SaveFkxm")]
    public object SaveFkxm(JSReader jsr)
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
                    throw new Exception("科目名不能为空！");
                }

                if (jsr["id"].ToString() == "")
                {
                    //新增
                    string id = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("caiwu_expense_item");
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    dr["itemName"] = itemName;
                    dr["itemCode"] = jsr["itemCode"];
                    dr["isChengben"] = Convert.ToInt32(jsr["isChengben"].ToString());
                    dr["memo"] = jsr["memo"];
                    dr["status"] = 0;
                    dr["addtime"] = DateTime.Now;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string id = jsr["id"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("caiwu_expense_item");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    dr["itemName"] = itemName;
                    dr["itemCode"] = jsr["itemCode"];
                    dr["isChengben"] = Convert.ToInt32(jsr["isChengben"].ToString());
                    dr["memo"] = jsr["memo"];
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
    /// 根据ID获取付款项目
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetFkxmById")]
    public object GetFkxmById(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from caiwu_expense_item where id=@id";
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
    /// 删除付款项目
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("DeleteFkxm")]
    public object DeleteFkxm(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("caiwu_expense_item");
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

    #endregion
}
