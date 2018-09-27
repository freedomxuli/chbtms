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
///HpMag 的摘要说明
/// </summary>
[CSClass("HpMag")]
public class HpMag
{
    public HpMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }

    /// <summary>
    /// 获取货品列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetHpList")]
    public object GetHpList(int pagnum, int pagesize, string keyword)
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
                    where += " and (" + dbc.C_Like("hpName", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("hpCode", keyword.Trim(), LikeStyle.LeftAndRightLike)+")";
                }
                string str = "  select * from jichu_huoping where status=0 "+where+" order by addtime desc";
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
    /// 根据ID获取货品
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetHpById")]
    public object GetHpById(string hpId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_huoping where hpId=@hpId";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@hpId", hpId);
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
    /// 新增编辑货品
    /// </summary>
    /// <param name="jsr"></param>
    /// <returns></returns>
    [CSMethod("SaveHp")]
    public object SaveHp(JSReader jsr)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string hpName = jsr["hpName"];
                if (string.IsNullOrEmpty(hpName))
                {
                    throw new Exception("货品名不能为空！");
                }

                if (jsr["hpId"].ToString() == "")
                {
                    //新增
                    string hpId = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("jichu_huoping");
                    DataRow dr = dt.NewRow();
                    dr["hpId"] = new Guid(hpId);
                    dr["hpName"] = hpName;
                    dr["hpCode"] = jsr["hpCode"];
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
                    string hpId = jsr["hpId"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("jichu_huoping");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["hpId"] = new Guid(hpId);
                    dr["hpName"] = hpName;
                    dr["hpCode"] = jsr["hpCode"];
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
    /// 删除货品
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("DeleteHp")]
    public object DeleteHp(string hpId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("jichu_huoping");
                DataTableTracker dtt = new DataTableTracker(dt);
                DataRow dr = dt.NewRow();
                dr["hpId"] = new Guid(hpId);
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
