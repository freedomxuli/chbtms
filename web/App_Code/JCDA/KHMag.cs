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
///KHMag 的摘要说明
/// </summary>
[CSClass("KHMag")]
public class KHMag
{
    public KHMag()
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
    [CSMethod("GetKHList")]
    public object GetKHList(int pagnum, int pagesize, string keyword)
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
                    where += " and (" + dbc.C_Like("a.people", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("a.peopleCode", keyword.Trim(), LikeStyle.LeftAndRightLike) + ")";
                }
                string str = @" select a.*,case when b.yhyds is null then 0 else b.yhyds end as yhyds,c.officeName from jichu_client a left join
                              (select count(yundan_id) as yhyds,clientId from yundan_yundan where  status=0 group by clientId) b 
                              on a.clientId=b.clientId 
                               left join jichu_office c on a.officeId=c.officeId
                                where a.status=0 " + where + " and a.companyId='"+SystemUser.CurrentUser.CompanyID+"' order by addtime desc";
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
    [CSMethod("GetKHById")]
    public object GetKHById(string clientId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_client  where clientId=@clientId";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@clientId", clientId);
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
    [CSMethod("SaveKH")]
    public object SaveKH(JSReader jsr)
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
                    throw new Exception("客户名称不能为空！");
                }

                if (jsr["clientId"].ToString() == "")
                {
                    //新增
                    string clientId = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("jichu_client");
                    DataRow dr = dt.NewRow();
                    dr["clientId"] = new Guid(clientId);
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["peopleCode"] = jsr["peopleCode"];
                    dr["people"] = people;
                    dr["tel"] = jsr["tel"];
                    dr["address"] = jsr["address"];
                    dr["compName"] = jsr["compName"];
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
                    string clientId = jsr["clientId"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("jichu_client");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["clientId"] = new Guid(clientId);
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["peopleCode"] = jsr["peopleCode"];
                    dr["people"] = people;
                    dr["tel"] = jsr["tel"];
                    dr["address"] = jsr["address"];
                    dr["compName"] = jsr["compName"];
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

    [CSMethod("DeleteKH")]
    public object DeleteYwy(string clientId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string str = "select * from yundan_yundan where status=0 and clientId=" + dbc.ToSqlValue(clientId);
                DataTable yddt = dbc.ExecuteDataTable(str);

                if (yddt.Rows.Count > 0)
                {
                    throw new Exception("该客户有运单存在，不能删除！");
                }
                else
                {
                    DataTable dt = dbc.GetEmptyDataTable("jichu_client");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["clientId"] = new Guid(clientId);
                    dr["status"] = 1;
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"] = SystemUser.CurrentUser.UserID;
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

    [CSMethod("CombinKHList")]
    public DataTable CombinKHList(JSReader jsrIds)
    {
        using (DBConnection dbc = new DBConnection())
        {
            List<string> idList = new List<string>();
            var idArray = jsrIds.ToArray();
            foreach (var id in idArray)
            {
                idList.Add(id.ToString());
            }
            var idStr = "'" + string.Join("','", idList.ToArray()) + "'";
            var sqlStr = @"select a.*,case when b.yhyds is null then 0 else b.yhyds end as yhyds,c.officeName from jichu_client a left join
                              (select count(yundan_id) as yhyds,clientId from yundan_yundan where  status=0 group by clientId) b 
                              on a.clientId=b.clientId 
                               left join jichu_office c on a.officeId=c.officeId
                                where a.status=0   and " + dbc.C_In("a.clientId", idList.ToArray());
            return dbc.ExecuteDataTable(sqlStr);
        }
    }

    [CSMethod("CombinKH")]
    public bool CombinKH(string mainid, JSReader jsrIds)
    {
        using (DBConnection dbc = new DBConnection())
        {
            List<string> idList = new List<string>();
            var idArray = jsrIds.ToArray();
            foreach (var id in idArray)
            {
                if (id.ToString() != mainid)
                {
                    idList.Add(id.ToString());
                }
            }
            var ids = "'" + string.Join("','", idList.ToArray()) + "'";
            //数据库语句
            List<string> sqllist = new List<string>();
           
            //删除商品价格表
            sqllist.Add("update jichu_client set status=1,updatetime='"+DateTime.Now+"',updateuser='"+SystemUser.CurrentUser.UserID
                + "' where " + dbc.C_In("clientId", idList.ToArray()));

            List<string> listTabUp = new List<string>();
            List<string> listTabdel = new List<string>();

            //需要更改商品ID的表
            listTabUp.Add("yundan_yundan");
            foreach (string tabname in listTabUp)
            {
                sqllist.Add("update " + tabname + " set clientId=" + dbc.ToSqlValue(mainid) + " where " + dbc.C_In("clientId", idList.ToArray()));
            }

            //需要删除该ID数据的表

            dbc.BeginTransaction();
            try
            {
                foreach (string sqlhb in sqllist)
                {
                    dbc.ExecuteNonQuery(sqlhb);
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
}
