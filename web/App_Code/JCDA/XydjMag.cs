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
///XydjMag 的摘要说明
/// </summary>
[CSClass("XydjMag")]
public class XydjMag
{
    public XydjMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }

    /// <summary>
    /// 获取信用等级列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetXydjList")]
    public object GetXydjList(int pagnum, int pagesize, string keyword)
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
                    where += " and " + dbc.C_Like("grade", keyword.Trim(), LikeStyle.LeftAndRightLike);
                }
                string str = "select * from jichu_credit where status=0 " + where + " order by grade";
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
    /// 根据ID获取信用等级
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetXydjById")]
    public object GetXydjById(string creditId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_credit where creditId=@creditId";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@creditId", creditId);
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
    /// 新增编辑信用等级
    /// </summary>
    /// <param name="jsr"></param>
    /// <returns></returns>
    [CSMethod("SaveXydj")]
    public object SaveXydj(JSReader jsr)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string grade = jsr["grade"];
                if (string.IsNullOrEmpty(grade))
                {
                    throw new Exception("信用等级代码不能为空！");
                }

                string minlimit = jsr["minlimit"];
                if (string.IsNullOrEmpty(minlimit))
                {
                    throw new Exception("最小额度不能为空！");
                }

                string maxlimit = jsr["maxlimit"];
                if (string.IsNullOrEmpty(maxlimit))
                {
                    throw new Exception("最大额度不能为空！");
                }

                string period = jsr["period"];
                if (string.IsNullOrEmpty(period))
                {
                    throw new Exception("信用周期不能为空！");
                }


                if (jsr["creditId"].ToString() == "")
                {
                    //新增
                    string creditId = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("jichu_credit");
                    DataRow dr = dt.NewRow();
                    dr["creditId"] = new Guid(creditId);
                    dr["grade"] = Convert.ToInt32(grade);
                    dr["minlimit"] = Convert.ToInt32(minlimit);
                    dr["maxlimit"] = Convert.ToInt32(maxlimit);
                    dr["period"] = Convert.ToInt32(period);
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
                    string creditId = jsr["creditId"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("jichu_credit");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["creditId"] = new Guid(creditId);
                    dr["grade"] = Convert.ToInt32(grade);
                    dr["minlimit"] = Convert.ToInt32(minlimit);
                    dr["maxlimit"] = Convert.ToInt32(maxlimit);
                    dr["period"] = Convert.ToInt32(period);
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
    /// 删除信用等级
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("DeleteXydj")]
    public object DeleteXydj(string creditId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("jichu_credit");
                DataTableTracker dtt = new DataTableTracker(dt);
                DataRow dr = dt.NewRow();
                dr["creditId"] = new Guid(creditId);
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
